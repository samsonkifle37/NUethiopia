"use client";

import { useState } from "react";
import { Copy, Check, Share2, Link as LinkIcon, QrCode } from "lucide-react";
import {
  useCreateShareLink,
  useShareLink,
  useDeleteShareLink,
} from "@/hooks/useItineraries";
import QRCode from "qrcode.react";

interface ShareItineraryModalProps {
  itineraryId: string;
  itineraryTitle: string;
  onClose: () => void;
}

export function ShareItineraryModal({
  itineraryId,
  itineraryTitle,
  onClose,
}: ShareItineraryModalProps) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [expiresIn, setExpiresIn] = useState<"7" | "30" | "none">("7");

  const { data: shareData } = useShareLink(itineraryId);
  const createShareLink = useCreateShareLink(itineraryId);
  const deleteShareLink = useDeleteShareLink(itineraryId);

  const shareLink = shareData?.shareLink;
  const shareUrl = shareLink
    ? `${process.env.NEXT_PUBLIC_SITE_URL || "https://nu-ethiopia.vercel.app"}/itinerary/share/${shareLink.shareToken}`
    : null;

  const handleCreateShare = () => {
    let expiresAt = null;
    if (expiresIn !== "none") {
      const date = new Date();
      date.setDate(date.getDate() + parseInt(expiresIn));
      expiresAt = date.toISOString();
    }

    createShareLink.mutate(
      { isPublic: true, expiresAt },
      {
        onError: (err) => {
          alert(`Failed to create share link: ${err.message}`);
        },
      }
    );
  };

  const handleCopyLink = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDeleteShare = () => {
    if (window.confirm("Are you sure you want to revoke this share link?")) {
      deleteShareLink.mutate(undefined, {
        onError: (err) => {
          alert(`Failed to delete share link: ${err.message}`);
        },
      });
    }
  };

  const handleShareToSocial = (platform: "twitter" | "facebook" | "whatsapp") => {
    const text = `Check out my ${itineraryTitle} itinerary on NU Ethiopia! 🇪🇹`;
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl || "")}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl || "")}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${shareUrl}`)}`,
    };

    if (shareUrl) {
      window.open(urls[platform], "_blank", "width=600,height=400");
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl z-50 w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Itinerary
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Not Shared Yet */}
        {!shareLink && (
          <div className="space-y-4">
            <p className="text-gray-600 text-sm">
              Create a shareable link so others can view your "{itineraryTitle}" itinerary.
            </p>

            {/* Expiration Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link Expires In
              </label>
              <div className="space-y-2">
                {[
                  { value: "7", label: "7 days" },
                  { value: "30", label: "30 days" },
                  { value: "none", label: "Never (permanent)" },
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value={option.value}
                      checked={expiresIn === option.value}
                      onChange={(e) => setExpiresIn(e.target.value as any)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Create Button */}
            <button
              onClick={handleCreateShare}
              disabled={createShareLink.isPending}
              className="w-full px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors disabled:opacity-50 font-medium"
            >
              {createShareLink.isPending ? "Creating..." : "Create Share Link"}
            </button>

            {createShareLink.error && (
              <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700">
                {(createShareLink.error as any).message}
              </div>
            )}
          </div>
        )}

        {/* Already Shared */}
        {shareLink && (
          <div className="space-y-4">
            {/* Share URL Display */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-xs font-medium text-blue-600 mb-2">Share Link</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs break-all text-blue-900 font-mono">
                  {shareUrl}
                </code>
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors flex items-center gap-1 flex-shrink-0"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span className="text-xs">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span className="text-xs">Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 py-3">
              <div className="bg-gray-50 rounded p-3">
                <p className="text-xs text-gray-600">Views</p>
                <p className="text-lg font-bold text-gray-900">
                  {shareLink.viewCount}
                </p>
              </div>
              <div className="bg-gray-50 rounded p-3">
                <p className="text-xs text-gray-600">Shared</p>
                <p className="text-sm text-gray-900">
                  {new Date(shareLink.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Expiration Info */}
            {shareLink.expiresAt && (
              <div className="bg-amber-50 border border-amber-200 rounded p-3 text-sm text-amber-700">
                <p className="font-medium">Expires on {new Date(shareLink.expiresAt).toLocaleDateString()}</p>
              </div>
            )}

            {/* QR Code Section */}
            <div className="border-t pt-4">
              <button
                onClick={() => setShowQR(!showQR)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
              >
                <QrCode className="w-4 h-4" />
                {showQR ? "Hide QR Code" : "Show QR Code"}
              </button>

              {showQR && (
                <div className="mt-4 flex justify-center p-4 bg-gray-50 rounded-lg">
                  <QRCode
                    value={shareUrl || ""}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>
              )}
            </div>

            {/* Social Sharing */}
            <div className="border-t pt-4">
              <p className="text-xs font-medium text-gray-700 mb-3">Share on Social</p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleShareToSocial("twitter")}
                  className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm font-medium"
                  title="Share on Twitter/X"
                >
                  𝕏
                </button>
                <button
                  onClick={() => handleShareToSocial("whatsapp")}
                  className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm font-medium"
                  title="Share on WhatsApp"
                >
                  💬
                </button>
                <button
                  onClick={() => handleShareToSocial("facebook")}
                  className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
                  title="Share on Facebook"
                >
                  f
                </button>
              </div>
            </div>

            {/* Delete Share Button */}
            <div className="border-t pt-4">
              <button
                onClick={handleDeleteShare}
                disabled={deleteShareLink.isPending}
                className="w-full px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 text-sm font-medium"
              >
                {deleteShareLink.isPending ? "Revoking..." : "Revoke Share Link"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
