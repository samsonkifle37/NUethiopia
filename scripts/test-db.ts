import { PrismaClient } from "@prisma/client";

async function test() {
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: process.env.DATABASE_URL
            }
        }
    });

    try {
        console.log("Testing direct connection...");
        const users = await prisma.user.findMany({ 
            take: 1,
            select: { id: true, email: true } 
        });
        console.log("Success! Found users:", JSON.stringify(users));
    } catch (e: any) {
        console.error("Direct connection failed:", e.message);
    } finally {
        await prisma.$disconnect();
    }
}

test();
