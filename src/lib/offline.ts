/**
 * NU Ethiopia Offline Storage Utility
 * Uses native IndexedDB to store Destination Packs, Itineraries, and Places.
 */

const DB_NAME = "nu_offline_db";
const DB_VERSION = 1;

export interface OfflinePack {
    id: string;
    name: string;
    description: string;
    size: string;
    downloadedAt: Date;
    data: any; // Contains Places, Guides, Map metadata
}

export class OfflineStorage {
    private static db: IDBDatabase | null = null;

    private static async getDB(): Promise<IDBDatabase> {
        if (this.db) return this.db;

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onupgradeneeded = (event: any) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains("packs")) {
                    db.createObjectStore("packs", { keyPath: "id" });
                }
                if (!db.objectStoreNames.contains("itineraries")) {
                    db.createObjectStore("itineraries", { keyPath: "id" });
                }
                if (!db.objectStoreNames.contains("places")) {
                    db.createObjectStore("places", { keyPath: "id" });
                }
            };

            request.onsuccess = () => {
                this.db = request.result;
                resolve(request.result);
            };

            request.onerror = () => reject(request.error);
        });
    }

    static async savePack(pack: OfflinePack): Promise<void> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction("packs", "readwrite");
            const store = transaction.objectStore("packs");
            store.put(pack);
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        });
    }

    static async getPack(id: string): Promise<OfflinePack | null> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction("packs", "readonly");
            const store = transaction.objectStore("packs");
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result || null);
            request.onerror = () => reject(request.error);
        });
    }

    static async listPacks(): Promise<OfflinePack[]> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction("packs", "readonly");
            const store = transaction.objectStore("packs");
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
        });
    }

    static async deletePack(id: string): Promise<void> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction("packs", "readwrite");
            const store = transaction.objectStore("packs");
            store.delete(id);
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        });
    }

    // Itinerary Helpers
    static async pinItinerary(itinerary: any): Promise<void> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction("itineraries", "readwrite");
            transaction.objectStore("itineraries").put(itinerary);
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        });
    }

    static async getPinnedItineraries(): Promise<any[]> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const request = db.transaction("itineraries", "readonly").objectStore("itineraries").getAll();
            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
        });
    }
}
