import { prisma } from "../src/lib/prisma";

const tables = [
    "User", "VerificationToken", "PasswordResetToken", "BusinessProfile", "PaymentCustomer",
    "SubscriptionPlan", "Subscription", "PaymentTransaction", "EmailLog", "NotificationLog",
    "AdminActionLog", "StayListing", "StayListingImage", "ListingSubmissionHistory",
    "Place", "PlaceSource", "VerificationLog", "DuplicateCandidate", "PlaceImage",
    "PlaceImageError", "ImageAudit", "Review", "Favorite", "HostListing", "HostListingImage",
    "IngestionListing", "OwnerClaim", "PlaceVisit", "FavoriteCollection", "FavoriteInCollection",
    "Itinerary", "ItineraryDay", "ItineraryActivity", "ItineraryShare"
];

const readOnlyTables = [
    "Place", "PlaceImage", "SubscriptionPlan", "Review",
    "StayListing", "StayListingImage"
];

async function main() {
    console.log("Starting RLS enforcement...");

    for (const table of tables) {
        try {
            // Enable RLS
            await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY;`);
            
            // Drop existing policies if they exist (to avoid conflicts on repeat runs)
            try {
                await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Public Read ${table}" ON "${table}";`);
                await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Deny All Modify ${table}" ON "${table}";`);
            } catch (e) {
                // Ignore drop errors
            }

            // Create policies
            if (readOnlyTables.includes(table)) {
                await prisma.$executeRawUnsafe(`
                    CREATE POLICY "Public Read ${table}" 
                    ON "${table}" 
                    FOR SELECT 
                    TO PUBLIC
                    USING (true);
                `);
            } else {
                await prisma.$executeRawUnsafe(`
                    CREATE POLICY "Deny All Select ${table}" 
                    ON "${table}" 
                    FOR SELECT 
                    TO PUBLIC
                    USING (false);
                `);
            }

            // By default, deny public insert/update/delete for ALL tables via RLS 
            // Prisma backend calls bypass this using the superuser 'postgres' role.
            await prisma.$executeRawUnsafe(`
                CREATE POLICY "Deny All Insert ${table}" ON "${table}" FOR INSERT TO PUBLIC WITH CHECK (false);
            `);
            await prisma.$executeRawUnsafe(`
                CREATE POLICY "Deny All Update ${table}" ON "${table}" FOR UPDATE TO PUBLIC USING (false);
            `);
            await prisma.$executeRawUnsafe(`
                CREATE POLICY "Deny All Delete ${table}" ON "${table}" FOR DELETE TO PUBLIC USING (false);
            `);

            console.log(`✅ Secured table: ${table}`);
        } catch (error) {
            console.error(`❌ Failed to secure ${table}:`, error);
        }
    }

    console.log("RLS Enforcement Complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
