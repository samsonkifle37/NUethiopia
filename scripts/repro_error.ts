import { getPlacesServer } from '../src/lib/data/places';
import 'dotenv/config';

async function main() {
    try {
        console.log("Calling getPlacesServer...");
        const result = await getPlacesServer({
            types: "hotel",
            limit: 5
        });
        console.log("Success! Found:", result.places.length, "places.");
    } catch (err: any) {
        console.error("Caught error in repro script:");
        console.error(err);
    }
}

main();
