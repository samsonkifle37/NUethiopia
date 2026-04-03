/**
 * Nu Ethiopia Route Resolver
 * Centralized logic to ensure no clickable item leads to a 404
 */

export interface RouteTarget {
  id: string;
  slug?: string | null;
  placeId?: string | null;
  placeSlug?: string | null;
  category?: string | null;
}

export function resolveEventRoute(event: RouteTarget): string {
    // 1. If dedicated event slug exists, use /events/[slug]
    if (event.slug) {
        return `/events/${event.slug}`;
    }
    
    // 2. If it has a related place, route to place details
    if (event.placeSlug) {
        return `/place/${event.placeSlug}`;
    }
    
    // 3. Last fallback: lightweight event detail page by ID
    return `/events/${event.id}`;
}

export function resolvePlaceRoute(place: { slug: string; type?: string }): string {
    // Standard place detail route used in the app
    return `/place/${place.slug}`;
}
