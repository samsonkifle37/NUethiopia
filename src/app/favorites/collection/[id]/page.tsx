"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Heart, Trash2, Share2 } from "lucide-react";
import Link from "next/link";
import { useQuery, useMutation } from "@tanstack/react-query";
import { VerifiedImage } from "@/components/media/VerifiedImage";

interface Place {
  id: string;
  name: string;
  slug: string;
  type: string;
  city: string;
  shortDescription?: string;
  priceLevel?: string;
  image?: string;
  reviewCount: number;
  favoriteCount: number;
}

interface CollectionDetail {
  id: string;
  name: string;
  description?: string;
  emoji?: string;
  color?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  favorites: Array<{
    id: string;
    place: Place;
    addedAt: string;
  }>;
}

export default function CollectionPage() {
  const params = useParams();
  const collectionId = params.id as string;
  const [showShareModal, setShowShareModal] = useState(false);

  // Fetch collection with favorites
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["collection", collectionId],
    queryFn: async () => {
      const res = await fetch(`/api/user/collections/${collectionId}`);
      if (!res.ok) throw new Error("Failed to fetch collection");
      return res.json();
    },
    enabled: !!collectionId,
  });

  // Remove from collection
  const removeFromCollectionMutation = useMutation({
    mutationFn: async (placeId: string) => {
      const res = await fetch(
        `/api/user/collections/${collectionId}/favorites?placeId=${placeId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to remove from collection");
      return res.json();
    },
    onSuccess: () => {
      refetch();
    },
  });

  const collection: CollectionDetail | undefined = data?.collection;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-12 w-48 bg-gray-300 rounded mb-4"></div>
          <div className="h-6 w-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Collection not found
          </h1>
          <p className="text-gray-600 mb-6">
            This collection might have been deleted or you don't have access to it.
          </p>
          <Link
            href="/favorites"
            className="px-6 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Favorites
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/favorites"
            className="flex items-center gap-2 text-stone-900 hover:text-stone-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </Link>
          <div className="text-center flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {collection.emoji} {collection.name}
            </h1>
          </div>
          <button
            onClick={() => setShowShareModal(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Share2 className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Collection Info */}
        <div className="mb-8">
          {collection.description && (
            <p className="text-gray-600 mb-4">{collection.description}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>
              {collection.favorites.length}{" "}
              {collection.favorites.length === 1 ? "place" : "places"}
            </span>
            <span>•</span>
            <span>
              Created {new Date(collection.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Places Grid */}
        {collection.favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collection.favorites.map(({ id, place }) => (
              <div
                key={id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Image */}
                <Link
                  href={`/place/${place.slug}`}
                  className="block relative h-48 bg-gray-200 overflow-hidden"
                >
                  {place.image ? (
                    <VerifiedImage
                      src={place.image}
                      alt={place.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                </Link>

                {/* Content */}
                <div className="p-4">
                  {/* Type Badge */}
                  <div className="mb-2">
                    <span className="inline-block px-2 py-1 bg-stone-100 text-stone-700 text-xs font-medium rounded capitalize">
                      {place.type}
                    </span>
                  </div>

                  {/* Place Info */}
                  <Link href={`/place/${place.slug}`}>
                    <h3 className="text-lg font-bold text-gray-900 hover:text-stone-700 transition-colors mb-1">
                      {place.name}
                    </h3>
                  </Link>

                  {place.shortDescription && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {place.shortDescription}
                    </p>
                  )}

                  {/* Meta */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{place.city}</span>
                    {place.priceLevel && (
                      <span className="font-medium">{place.priceLevel}</span>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4 text-xs text-gray-600">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span>{place.favoriteCount} favorited</span>
                    <span>•</span>
                    <span>{place.reviewCount} reviews</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/place/${place.slug}`}
                      className="flex-1 px-3 py-2 bg-stone-100 text-stone-900 rounded hover:bg-stone-200 transition-colors text-center text-sm font-medium"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => removeFromCollectionMutation.mutate(place.id)}
                      className="px-3 py-2 text-red-600 border border-red-200 rounded hover:bg-red-50 transition-colors"
                      title="Remove from collection"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              No places yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start adding your favorite places to this collection
            </p>
            <Link
              href="/stays"
              className="px-6 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors inline-block"
            >
              Browse Places
            </Link>
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal
          collection={collection}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}

interface ShareModalProps {
  collection: CollectionDetail;
  onClose: () => void;
}

function ShareModal({ collection, onClose }: ShareModalProps) {
  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/favorites/collection/${collection.id}`
    : "";

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl z-50 w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Share Collection</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ✕
          </button>
        </div>

        <p className="text-gray-600 mb-4">
          Share this collection with others
        </p>

        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm font-mono"
          />
        </div>

        <button
          onClick={handleCopyLink}
          className="w-full px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors mb-3"
        >
          Copy Link
        </button>

        <button
          onClick={onClose}
          className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Close
        </button>
      </div>
    </>
  );
}
