export const metadata = {
    title: "Explore Addis — NU V2.5",
    description: "Curated list of real places, parks, markets, and experiences.",
};

import { Suspense } from "react";
import { ExploreClient } from "./ExploreClient";

export default function ExplorePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ExploreClient />
        </Suspense>
    );
}
