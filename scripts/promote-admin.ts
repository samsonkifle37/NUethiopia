import { prisma } from "../src/lib/prisma";

async function promoteAdmin() {
    const email = "nuethiopia2026@gmail.com";
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            console.error(`User with email ${email} not found. Please sign up first.`);
            process.exit(1);
        }

        const updatedUser = await prisma.user.update({
            where: { email },
            data: {
                accountType: "admin",
                roles: Array.from(new Set([...user.roles, "admin"])),
                isEmailVerified: true
            }
        });

        console.log(`Successfully promoted ${email} to ADMIN.`);
        console.log("Updated User Data:", JSON.stringify(updatedUser, null, 2));
    } catch (error: any) {
        console.error("Failed to promote user:", error.message);
    } finally {
        await prisma.$disconnect();
    }
}

promoteAdmin();
