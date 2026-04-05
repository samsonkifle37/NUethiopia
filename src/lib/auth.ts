import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET || "addis_fallback_secret";

export async function getSession() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth-token")?.value;

        if (!token) {
            return null;
        }

        const decoded = jwt.verify(token, JWT_SECRET) as {
            userId: string;
            email: string;
        };

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { 
                id: true, 
                name: true, 
                email: true, 
                bio: true, 
                accountType: true, 
                isEmailVerified: true 
            },
        });

        if (!user) {
            return null;
        }

        return { user };
    } catch (error) {
        console.error("Session verification error:", error);
        return null;
    }
}
