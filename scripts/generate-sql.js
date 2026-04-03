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

const fs = require('fs');

let sql = '';
for (const table of tables) {
    sql += `ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY;\n`;
    sql += `DROP POLICY IF EXISTS "Public Read ${table}" ON "${table}";\n`;
    sql += `DROP POLICY IF EXISTS "Deny All Select ${table}" ON "${table}";\n`;
    sql += `DROP POLICY IF EXISTS "Deny All Insert ${table}" ON "${table}";\n`;
    sql += `DROP POLICY IF EXISTS "Deny All Update ${table}" ON "${table}";\n`;
    sql += `DROP POLICY IF EXISTS "Deny All Delete ${table}" ON "${table}";\n`;

    if (readOnlyTables.includes(table)) {
        sql += `CREATE POLICY "Public Read ${table}" ON "${table}" FOR SELECT TO PUBLIC USING (true);\n`;
    } else {
        sql += `CREATE POLICY "Deny All Select ${table}" ON "${table}" FOR SELECT TO PUBLIC USING (false);\n`;
    }

    sql += `CREATE POLICY "Deny All Insert ${table}" ON "${table}" FOR INSERT TO PUBLIC WITH CHECK (false);\n`;
    sql += `CREATE POLICY "Deny All Update ${table}" ON "${table}" FOR UPDATE TO PUBLIC USING (false);\n`;
    sql += `CREATE POLICY "Deny All Delete ${table}" ON "${table}" FOR DELETE TO PUBLIC USING (false);\n\n`;
}

fs.writeFileSync('apply-rls.sql', sql);
console.log('SQL generated!');
