import { prisma } from "../src/lib/prisma";

async function main() {
    const email = "nuethiopia2026@gmail.com";
    try {
        console.log("--- DB STATUS CHECK ---");
        const allUsers = await prisma.user.findMany({
            select: { id: true, email: true, accountType: true, roles: true, isEmailVerified: true }
        });
        console.log("Current Users:", JSON.stringify(allUsers, null, 2));

        const targetUser = allUsers.find(u => u.email === email);
        if (!targetUser) {
            console.log(`\n❌ User ${email} does not exist in the database.`);
            console.log("Please sign up first at /auth or /profile.");
            return;
        }

        console.log(`\n✅ User ${email} found. Promoting to ADMIN...`);
        const updated = await prisma.user.update({
            where: { id: targetUser.id },
            data: {
                accountType: "admin",
                roles: Array.from(new Set([...targetUser.roles, "admin"])),
                isEmailVerified: true
            }
        });

        console.log("Successfully promoted!");
        console.log("Updated record:", JSON.stringify(updated, null, 2));

    } catch (e: any) {
        console.error("CRITICAL_ERR:", e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
