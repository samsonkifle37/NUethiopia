"use client";

import { useToast } from "@/components/Toast";

interface ShareOptions {
    title: string;
    text: string;
    url: string;
    files?: File[];
}

export function useNativeShare() {
    const { showToast } = useToast();

    const share = async (options: ShareOptions) => {
        // Construct the URL with NU branding params
        const shareUrl = new URL(options.url, window.location.origin).toString();

        if (typeof navigator !== "undefined" && navigator.share) {
            try {
                await navigator.share({
                    title: options.title,
                    text: options.text,
                    url: shareUrl,
                });
                return true;
            } catch (error: any) {
                if (error.name !== "AbortError") {
                    console.error("Error sharing:", error);
                    showToast("Could not open native share sheet.", "error");
                }
                return false;
            }
        } else {
            // Fallback: Copy to Clipboard
            try {
                await navigator.clipboard.writeText(`${options.title}\n${options.text}\n${shareUrl}`);
                showToast("Share details copied to clipboard.", "success");
                return true;
            } catch (error) {
                console.error("Clipboard error:", error);
                showToast("Please manually copy the URL.", "error");
                return false;
            }
        }
    };

    return { share };
}
