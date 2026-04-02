"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";

interface FavoriteButtonProps {
  placeId: string;
  placeName: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  variant?: "icon" | "button";
}

interface Collection {
  id: string;
  name: string;
  emoji?: string;
  color?: string;
  favoriteCount: number;
}

export function FavoriteButton({
  placeId,
  placeName,
  size = "md",
  showLabel = false,
  variant = "icon",
}: FavoriteButtonProps) {
  const [showManager, setShowManager] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  // Fetch user's collections
  const { data: collectionsData, isLoading: collectionsLoading } = useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      const res = await fetch("/api/user/collections", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch collections");
      return res.json();
    },
  });

  // Check if place is in any collection
  useEffect(() => {
    if (collectionsData?.collections) {
      const favorited = collectionsData.collections.some(
        (collection: Collection) => collection.favoriteCount > 0
      );
      // This is a simple check - in reality we'd need to check each collection
      setIsFavorited(false); // TODO: Check actual favorite status
    }
  }, [collectionsData]);

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  if (variant === "icon") {
    return (
      <>
        <button
          onClick={() => setShowManager(true)}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors group"
          title={`Add ${placeName} to favorites`}
          aria-label="Add to favorites"
        >
          <Heart
            className={`${sizeClasses[size]} ${
              isFavorited
                ? "fill-red-500 stroke-red-500"
                : "stroke-white group-hover:stroke-red-300"
            } transition-colors`}
          />
        </button>

        {showManager && (
          <CollectionManager
            placeId={placeId}
            placeName={placeName}
            onClose={() => setShowManager(false)}
            collections={collectionsData?.collections || []}
          />
        )}
      </>
    );
  }

  return (
    <button
      onClick={() => setShowManager(true)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        isFavorited
          ? "bg-red-500 text-white hover:bg-red-600"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      }`}
    >
      <Heart
        className={`${sizeClasses[size]} ${
          isFavorited ? "fill-current" : ""
        }`}
      />
      {showLabel && <span>{isFavorited ? "Favorited" : "Add to Favorites"}</span>}
    </button>
  );
}

interface CollectionManagerProps {
  placeId: string;
  placeName: string;
  collections: Collection[];
  onClose: () => void;
}

function CollectionManager({
  placeId,
  placeName,
  collections,
  onClose,
}: CollectionManagerProps) {
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [showNewForm, setShowNewForm] = useState(false);

  // Create new collection
  const createCollectionMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch("/api/user/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("Failed to create collection");
      return res.json();
    },
    onSuccess: (data) => {
      setNewCollectionName("");
      setShowNewForm(false);
      // Add new collection to selected
      setSelectedCollections([...selectedCollections, data.collection.id]);
    },
  });

  // Add to collection
  const addToCollectionMutation = useMutation({
    mutationFn: async (collectionId: string) => {
      const res = await fetch(`/api/user/collections/${collectionId}/favorites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ placeId }),
      });
      if (!res.ok) throw new Error("Failed to add to collection");
      return res.json();
    },
  });

  // Remove from collection
  const removeFromCollectionMutation = useMutation({
    mutationFn: async (collectionId: string) => {
      const res = await fetch(
        `/api/user/collections/${collectionId}/favorites?placeId=${placeId}`,
        { method: "DELETE", credentials: "include" }
      );
      if (!res.ok) throw new Error("Failed to remove from collection");
      return res.json();
    },
  });

  const handleToggleCollection = (collectionId: string) => {
    if (selectedCollections.includes(collectionId)) {
      removeFromCollectionMutation.mutate(collectionId);
      setSelectedCollections(
        selectedCollections.filter((id) => id !== collectionId)
      );
    } else {
      addToCollectionMutation.mutate(collectionId);
      setSelectedCollections([...selectedCollections, collectionId]);
    }
  };

  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      createCollectionMutation.mutate(newCollectionName);
    }
  };

  return (
    <>
      {/* Modal Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl z-50 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Add to Collection</h2>
              <p className="text-sm text-gray-600 mt-1">{placeName}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Collections List */}
          {collections.length > 0 ? (
            <div className="space-y-2">
              {collections.map((collection) => (
                <label
                  key={collection.id}
                  className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedCollections.includes(collection.id)}
                    onChange={() => handleToggleCollection(collection.id)}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 cursor-pointer"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center gap-2">
                      {collection.emoji && <span>{collection.emoji}</span>}
                      <span className="font-medium text-gray-900">
                        {collection.name}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {collection.favoriteCount} {collection.favoriteCount === 1 ? "place" : "places"}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">
              No collections yet. Create one to get started!
            </p>
          )}

          {/* New Collection Form */}
          {showNewForm ? (
            <div className="pt-4 border-t space-y-3">
              <input
                type="text"
                placeholder="Collection name..."
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleCreateCollection}
                  disabled={!newCollectionName.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setShowNewForm(false);
                    setNewCollectionName("");
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowNewForm(true)}
              className="w-full px-4 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors"
            >
              + Create New Collection
            </button>
          )}
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t p-4 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}
