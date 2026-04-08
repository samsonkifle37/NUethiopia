const fs = require('fs');
const path = require('path');

function parseDirectory(text) {
    const hotels = [];
    const tours = [];
    
    let currentCategory = '';
    let currentSection = ''; // 'HOTELS' or 'TOURS'
    
    const lines = text.split('\n');
    let currentItem = null;

    for (const line of lines) {
        if (line.includes('## HOTELS IN ADDIS ABABA')) {
            currentSection = 'HOTELS';
            continue;
        }
        if (line.includes('## TRAVEL AGENCIES & TOUR OPERATORS')) {
            currentSection = 'TOURS';
            continue;
        }

        if (line.startsWith('###')) {
            currentCategory = line.replace('###', '').trim();
            continue;
        }

        if (line.startsWith('**') && line.endsWith('**')) {
            if (currentItem) {
                if (currentSection === 'HOTELS') hotels.push(currentItem);
                else tours.push(currentItem);
            }
            currentItem = {
                name: line.replace(/\*\*/g, '').trim(),
                phones: [],
                emails: [],
                websites: [],
                address: '',
                category: currentCategory,
                type: currentSection === 'HOTELS' ? 'hotel' : 'tour'
            };
            continue;
        }

        if (currentItem) {
            if (line.includes('- Phone:')) {
                const p = line.replace('- Phone:', '').trim();
                if (p && p !== 'Available through website' && p !== 'Available through booking sites') {
                    currentItem.phones.push(p);
                }
            } else if (line.includes('- Email:')) {
                const e = line.replace('- Email:', '').trim();
                if (e && e !== 'Available through website' && e !== 'Available through booking sites') {
                    currentItem.emails.push(e);
                }
            } else if (line.includes('- Website:')) {
                const w = line.replace('- Website:', '').trim();
                if (w && w !== 'Available through website' && w !== 'Available through booking sites') {
                    currentItem.websites.push(w);
                }
            } else if (line.includes('- Address:')) {
                currentItem.address = line.replace('- Address:', '').trim();
            } else if (line.includes('- Specialty:')) {
                currentItem.description = line.replace('- Specialty:', '').trim();
            } else if (line.includes('- Category:')) {
                currentItem.subcategory = line.replace('- Category:', '').trim();
            }
        }
    }
    if (currentItem) {
        if (currentSection === 'HOTELS') hotels.push(currentItem);
        else tours.push(currentItem);
    }
    
    return { hotels, tours };
}

async function main() {
    const text = fs.readFileSync('scripts/source_directory.txt', 'utf8');
    const data = parseDirectory(text);
    fs.writeFileSync('scripts/source_data.json', JSON.stringify(data, null, 2));
    console.log(`Parsed ${data.hotels.length} hotels and ${data.tours.length} tour operators.`);
}

main();
