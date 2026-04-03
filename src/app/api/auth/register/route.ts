import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendVerificationEmail, sendAdminNewUserAlert } from "@/lib/email";

const JWT_SECRET = process.env.JWT_SECRET || "addis_fallback_secret";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, password, phone, accountType, businessName } = body;

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Name, email, and password are required" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters" },
                { status: 400 }
            );
        }

        // Determine account rules
        const type = ["business", "host", "user"].includes(accountType) ? accountType : "user";
        const isBusiness = type === "business" || type === "host";

        // Check if user already exists
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json(
                { error: "An account with this email already exists" },
                { status: 409 }
            );
        }

        const passwordHash = await bcrypt.hash(password, 12);

        // Core transaction for safety
        const user = await prisma.$transaction(async (tx) => {
            // 1. Create Base User
            const newUser = await tx.user.create({
                data: { 
                  name, 
                  email, 
                  passwordHash,
                  phone: phone || null,
                  accountType: type,
                  roles: isBusiness ? ["traveller", "host"] : ["traveller"],
                  isEmailVerified: false
                },
            });

            // 2. Add Business Profile if applicable
            if (isBusiness) {
               await tx.businessProfile.create({
                 data: {
                   userId: newUser.id,
                   businessName: businessName || name, // Fallback to name if not provided
                 }
               });
            }

            // 3. Create Verification Token
            const token = crypto.randomBytes(32).toString("hex");
            // Valid for 24 hours
            const maxAge = new Date(Date.now() + 24 * 60 * 60 * 1000); 

            await tx.verificationToken.create({
              data: {
                token,
                userId: newUser.id,
                expiresAt: maxAge
              }
            });

            return { newUser, token };
        });

        // Background Events Pipeline (Do not block user creation if email fails)
        try {
            // Send to user
            await sendVerificationEmail(user.newUser.id, user.newUser.email, user.token);
            
            // Notification log internally
            await prisma.notificationLog.create({
              data: {
                type: "SIGNUP",
                userId: user.newUser.id,
                message: `New ${type} signed up: ${user.newUser.email}`
              }
            });

            // Send to admin nuethiopia2026@gmail.com
            await sendAdminNewUserAlert({
               name: user.newUser.name,
               email: user.newUser.email,
               accountType: type,
               isBusiness
            });

        } catch (emailErr) {
            console.error("Non-fatal email/logging pipeline error:", emailErr);
        }

        // Provide temporary authenticated session, limited to unverified status on clientside
        const authToken = jwt.sign(
            { userId: user.newUser.id, email: user.newUser.email, accountType: type },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        const response = NextResponse.json({
            message: "Registration successful. Please check your email to verify your account.",
            user: { 
               id: user.newUser.id, 
               name: user.newUser.name, 
               email: user.newUser.email, 
               accountType: type,
               isEmailVerified: false
            },
        });

        response.cookies.set("auth-token", authToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("Register error:", error);
        return NextResponse.json(
            { error: "Registration failed. " + String(error) },
            { status: 500 }
        );
    }
}
