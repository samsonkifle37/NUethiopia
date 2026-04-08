const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// --- Configuration ---
const SOURCE_DATA_PATH = 'scripts/source_data.json';
const CURRENT_DB_PATH = 'scripts/current_places.json';
const HOTEL_IMAGES_DIR = 'C:\\Users\\samso\\OneDrive\\Desktop\\imagerCrawler\\downloaded_hotel_images';
const TOUR_IMAGES_DIR = 'C:\\Users\\samso\\OneDrive\\Desktop\\imagerCrawler\\tour_operator_images';
const PUBLIC_UPLOAD_DIR = 'public/uploads/places';

// Ensure upload dir exists
if (!fs.existsSync(PUBLIC_UPLOAD_DIR)) {
    fs.mkdirSync(PUBLIC_UPLOAD_DIR, { recursive: true });
}

// --- Helper Functions ---
function normalize(str) {
    if (!str) return '';
    return str.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
}

function getSimilarity(s1, s2) {
    const n1 = normalize(s1);
    const n2 = normalize(s2);
    if (n1 === n2) return 1.0;
    if (n1.includes(n2) || n2.includes(n1)) return 0.8;
    return 0; // Simple matching for now
}

// --- Main logic ---
async function main() {
    const sourceData = JSON.parse(fs.readFileSync(SOURCE_DATA_PATH, 'utf8'));
    const currentDb = JSON.parse(fs.readFileSync(CURRENT_DB_PATH, 'utf8'));
    
    const dbPlaces = currentDb.places;
    const upgradePlan = {
        updates: [],
        creates: [],
        merges: [],
        images: []
    };
    
    const auditReport = {
        scanned: dbPlaces.length,
        updated: 0,
        addedHotels: 0,
        addedTours: 0,
        duplicateGroups: 0,
        merged: 0,
        imagesImported: 0,
        imagesRejected: 0,
        flagged: []
    };

    const sourceEntities = [...sourceData.hotels, ...sourceData.tours];
    const matchedItems = new Set();
    const processedDbIds = new Set();

    // 1. Deduplication within existing DB
    const dbGroups = {};
    dbPlaces.forEach(p => {
        const key = normalize(p.name);
        if (!dbGroups[key]) dbGroups[key] = [];
        dbGroups[key].push(p);
    });

    Object.keys(dbGroups).forEach(key => {
        if (dbGroups[key].length > 1) {
            auditReport.duplicateGroups++;
            const master = dbGroups[key].sort((a,b) => (b.reviewCount || 0) - (a.reviewCount || 0))[0];
            const duplicates = dbGroups[key].filter(p => p.id !== master.id);
            duplicates.forEach(dup => {
                upgradePlan.merges.push({ masterId: master.id, duplicateId: dup.id });
                auditReport.merged++;
            });
        }
    });

    // 2. Matching Source Data with DB
    sourceEntities.forEach(source => {
        let bestMatch = null;
        let bestScore = 0;

        dbPlaces.forEach(p => {
            const score = getSimilarity(source.name, p.name);
            if (score > bestScore) {
                bestScore = score;
                bestMatch = p;
            }
        });

        if (bestScore >= 0.8) {
            // High confidence Update
            upgradePlan.updates.push({
                id: bestMatch.id,
                name: source.name,
                phone: source.phones[0] || bestMatch.phone,
                email: source.emails[0] || bestMatch.email,
                websiteUrl: source.websites[0] || bestMatch.websiteUrl,
                subcategory: source.subcategory || bestMatch.subcategory,
                description: source.description || bestMatch.shortDescription,
                status: 'APPROVED'
            });
            auditReport.updated++;
            matchedItems.add(source.name);
        } else {
            // New Record
            upgradePlan.creates.push({
                ...source,
                status: 'APPROVED'
            });
            if (source.type === 'hotel') auditReport.addedHotels++;
            else auditReport.addedTours++;
        }
    });

    // 3. Image Ingestion
    function processImageFolder(dir, type) {
        if (!fs.existsSync(dir)) return;
        const subdirs = fs.readdirSync(dir);
        subdirs.forEach(subdir => {
            const fullSubdirPath = path.join(dir, subdir);
            if (!fs.statSync(fullSubdirPath).isDirectory()) return;

            // Match subdir name to entity
            let targetEntityId = null;
            const matchInPlan = upgradePlan.updates.find(u => getSimilarity(u.name, subdir) > 0.8) ||
                               upgradePlan.creates.find(c => getSimilarity(c.name, subdir) > 0.8);
            
            if (!matchInPlan) return;

            const files = fs.readdirSync(fullSubdirPath);
            files.forEach((file, index) => {
                const ext = path.extname(file).toLowerCase();
                if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) return;

                const newFileName = `${normalize(subdir)}_${index}${ext}`;
                const newPath = path.join(PUBLIC_UPLOAD_DIR, newFileName);
                
                try {
                    fs.copyFileSync(path.join(fullSubdirPath, file), newPath);
                    upgradePlan.images.push({
                        entityName: matchInPlan.name,
                        fileName: `/uploads/places/${newFileName}`,
                        priority: index === 0 ? 0 : index,
                        isHero: index === 0
                    });
                    auditReport.imagesImported++;
                } catch (e) {
                    auditReport.imagesRejected++;
                }
            });
        });
    }

    processImageFolder(HOTEL_IMAGES_DIR, 'hotel');
    processImageFolder(TOUR_IMAGES_DIR, 'tour');

    // Save final plan
    fs.writeFileSync('scripts/upgrade_plan.json', JSON.stringify(upgradePlan, null, 2));
    fs.writeFileSync('scripts/audit_report_data.json', JSON.stringify(auditReport, null, 2));

    console.log("Deduplication and Matching Complete.");
    console.log(JSON.stringify(auditReport, null, 2));
}

main();
