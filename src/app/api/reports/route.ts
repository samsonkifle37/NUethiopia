import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { sendEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        const { listingName, issueType, details, reporterEmail } = await request.json();

        if (!listingName || !issueType || !details) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Store in ReportGeneral (as it fits both places and general listings)
        const report = await prisma.reportGeneral.create({
            data: {
                userId: session?.user?.id || null, // Optional if signed out
                issueType: issueType,
                description: `Listing: ${listingName}\nDetails: ${details}\nReporter: ${reporterEmail || (session?.user?.email) || "Anonymous"}`,
                status: "PENDING"
            }
        });

        // Send admin notification
        await sendEmail({
            to: "nuethiopia2026@gmail.com",
            subject: `🚨 New Listing Report: ${listingName}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px;">
                    <h2>New Listing Report Received</h2>
                    <ul>
                        <li><strong>Listing Name:</strong> ${listingName}</li>
                        <li><strong>Issue Type:</strong> ${issueType}</li>
                        <li><strong>Reported By:</strong> ${reporterEmail || (session?.user?.email) || "Anonymous"}</li>
                        <li><strong>Timestamp:</strong> ${new Date().toISOString()}</li>
                    </ul>
                    <h3>Details:</h3>
                    <p>${details}</p>
                    <hr />
                    <p><em>Check the Admin dashboard to resolve this report.</em></p>
                </div>
            `
        });

        return NextResponse.json({ success: true, reportId: report.id });
    } catch (error) {
        console.error("Report submission error:", error);
        return NextResponse.json({ error: "Failed to submit report" }, { status: 500 });
    }
}
