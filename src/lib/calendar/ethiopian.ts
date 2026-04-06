/**
 * NU Ethiopia Calendar Utility
 * Converts between Gregorian (ISO) and Ethiopian Calendars
 */

export interface EthiopianDate {
    year: number;
    month: number;
    day: number;
    monthName: string;
}

const AM_MONTH_NAMES = [
    "መስከረም", "ጥቅምት", "ህዳር", "ታህሳስ", "ጥር", "የካቲት",
    "መጋቢት", "ሚያዝያ", "ግንቦት", "ሰኔ", "ሐምሌ", "ነሐሴ", "ጳጉሜ"
];

const EN_MONTH_NAMES = [
    "Meskerem", "Tikimt", "Hidar", "Tahsas", "Tir", "Yekatit",
    "Megabit", "Miyazya", "Ginbot", "Sene", "Hamle", "Nehase", "Pagume"
];

/**
 * Converts a Gregorian Date to Ethiopian Date
 */
export function toEthiopian(date: Date): EthiopianDate {
    const jdn = ggeToJDN(date.getFullYear(), date.getMonth() + 1, date.getDate());
    return jdnToEth(jdn);
}

/**
 * Converts Ethiopian Y/M/D to Gregorian Date
 */
export function fromEthiopian(year: number, month: number, day: number): Date {
    const jdn = ethToJDN(year, month, day);
    return jdnToGge(jdn);
}

// Utility functions using Julian Day Number (JDN) abstraction
function ggeToJDN(y: number, m: number, d: number): number {
    return (
        Math.floor((1461 * (y + 4800 + Math.floor((m - 14) / 12))) / 4) +
        Math.floor((367 * (m - 2 - 12 * Math.floor((m - 14) / 12))) / 12) -
        Math.floor((3 * Math.floor((y + 4900 + Math.floor((m - 14) / 12)) / 100)) / 4) +
        d - 32075
    );
}

function jdnToGge(j: number): Date {
    const l = j + 68569;
    const n = Math.floor((4 * l) / 146097);
    const m = l - Math.floor((146097 * n + 3) / 4);
    const i = Math.floor((4000 * (m + 1)) / 1461001);
    const k = m - Math.floor((1461 * i) / 4) + 31;
    const j2 = Math.floor((80 * k) / 2447);
    const d = k - Math.floor((2447 * j2) / 80);
    const l2 = Math.floor(j2 / 11);
    const m2 = j2 + 2 - 12 * l2;
    const y = 100 * (n - 49) + i + l2;
    return new Date(y, m2 - 1, d);
}

function ethToJDN(y: number, m: number, d: number): number {
    const ERA = 1723856;
    return ERA + (y - 1) * 365 + Math.floor(y / 4) + (m - 1) * 30 + d - 1;
}

function jdnToEth(j: number): EthiopianDate {
    const ERA = 1723856;
    const r = (j - ERA) % 1461;
    const n = (j - ERA) % 365;
    const year = 4 * Math.floor((j - ERA) / 1461) + Math.floor(r / 365) + (r === 1460 ? 0 : 1);
    
    // Handle Pagume edge case
    let month = Math.floor(n / 30) + 1;
    let day = (n % 30) + 1;
    
    if (r === 1460) {
        month = 13;
        day = 6;
    } else if (n === 365) {
        // This shouldn't happen with the logic above but we keep it safe
        month = 13;
        day = 5;
    }

    return {
        year,
        month,
        day,
        monthName: EN_MONTH_NAMES[month - 1]
    };
}

export function formatEthiopian(eth: EthiopianDate, lang: string = "en"): string {
    const names = lang === "am" || lang === "ti" ? AM_MONTH_NAMES : EN_MONTH_NAMES;
    return `${names[eth.month - 1]} ${eth.day}, ${eth.year}`;
}
