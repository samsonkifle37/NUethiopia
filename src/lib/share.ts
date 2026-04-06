/**
 * Nu Ethiopia Share Utility
 */

export interface ShareOptions {
  title: string;
  text?: string;
  url?: string;
  image?: string; // High-quality image URL for previews
}

export async function shareContent(options: ShareOptions): Promise<{ success: boolean; method: string }> {
  const shareData: any = {
    title: options.title,
    text: options.text || "",
    // Ensure we use the production URL if available
    url: options.url || (typeof window !== "undefined" ? window.location.href : ""),
  };

  // 1. Try Native Share (Mobile)
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      // If we have an image URL, we can attempt to fetch and share the blob if supported
      // For now, most mobile OS (Android/iOS) will pick up the URL's OG tags automatically
      // But we can add files support here in future if we want direct image share.
      await navigator.share(shareData);
      return { success: true, method: "native" };
    } catch (err) {
      // User cancelled or error, fall back
      console.log("Native share failed or cancelled", err);
    }
  }

  // 2. Try Clipboard (Fallback)
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
      return { success: true, method: "clipboard" };
    } catch (err) {
      console.error("Clipboard failed", err);
    }
  }

  return { success: false, method: "none" };
}

export function getCanonicalUrl(path: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
}
