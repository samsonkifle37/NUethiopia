/**
 * Nu Ethiopia Share Utility
 */

export interface ShareOptions {
  title: string;
  text?: string;
  url?: string;
}

export async function shareContent(options: ShareOptions): Promise<{ success: boolean; method: string }> {
  const shareData = {
    title: options.title,
    text: options.text || "",
    // Ensure we use the production URL if available
    url: options.url || (typeof window !== "undefined" ? window.location.href : ""),
  };

  // 1. Try Native Share (Mobile)
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
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
      await navigator.clipboard.writeText(shareData.url);
      return { success: true, method: "clipboard" };
    } catch (err) {
      console.error("Clipboard failed", err);
    }
  }

  // 3. Last Fallback: Custom Intent (WhatsApp/Telegram/Email)
  // We'll return false here to trigger a custom UI modal if needed
  return { success: false, method: "none" };
}

export function getCanonicalUrl(path: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
}
