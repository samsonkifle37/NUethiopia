"use client";

import { useState } from "react";
import { Heart, Plus, Trash2, Edit2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useQuery, useMutation } from "@tanstack/react-query";
import { VerifiedImage } from "@/components/media/VerifiedImage";

interface Collection {
  id: string;
  name: string;
  description?: string;
  emoji?: string;
  color?: string;
  isDefault: boolean;
  favoriteCount: number;
  createdAt: string;
}

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

type TabType = "collections" | "favorites";

export default function FavoritesPage() {
  const [activeTab, setActiveTab] = useState<TabType>("collections");
  const [editingCollectionId, setEditingCollectionId] = useState<string | null>(null);
  const [showNewCollection, setShowNewCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [newCollectionEmoji, setNewCollectionEmoji] = useState("⭐");

  // Fetch collections
  const { data: collectionsData, refetch: refetchCollections } = useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      const res = await fetch("/api/user/collections");
      if (!res.ok) throw new Error("Failed to fetch collections");
      return res.json();
    },
  });

  // Create collection
  const createCollectionMutation = useMutation({
    mutationFn: async (data: { name: string; emoji: string }) => {
      const res = await fetch("/api/user/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create collection");
      return res.json();
    },
    onSuccess: () => {
      setNewCollectionName("");
      setNewCollectionEmoji("⭐");
      setShowNewCollection(false);
      refetchCollections();
    },
  });

  // Delete collection
  const deleteCollectionMutation = useMutation({
    mutationFn: async (collectionId: string) => {
      const res = await fetch(`/api/user/collections/${collectionId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete collection");
      return res.json();
    },
    onSuccess: () => {
      refetchCollections();
    },
  });

  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      createCollectionMutation.mutate({
        name: newCollectionName,
        emoji: newCollectionEmoji,
      });
    }
  };

  const collections = collectionsData?.collections || [];
  const totalFavorites = collections.reduce((sum: number, c: Collection) => sum + c.favoriteCount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8 fill-red-500 stroke-red-500" />
            <h1 className="text-4xl font-bold">My Favorites</h1>
          </div>
          <p className="text-stone-300">
            Organize and manage your favorite places across {collections.length} collection{collections.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex gap-4 border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab("collections")}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === "collections"
                ? "text-stone-900"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Collections ({collections.length})
            {activeTab === "collections" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-stone-900" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === "favorites"
                ? "text-stone-900"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            All Favorites ({totalFavorites})
            {activeTab === "favorites" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-stone-900" />
            )}
          </button>
        </div>

        {/* Collections Tab */}
        {activeTab === "collections" && (
          <div>
            {/* New Collection Button */}
            {!showNewCollection ? (
              <button
                onClick={() => setShowNewCollection(true)}
                className="mb-8 px-6 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create New Collection
              </button>
            ) : (
              <div className="mb-8 p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Collection Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Coffee Tour, Weekend Getaway"
                      value={newCollectionName}
                      onChange={(e) => setNewCollectionName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Emoji
                    </label>
                    <input
                      type="text"
                      placeholder="Pick an emoji..."
                      value={newCollectionEmoji}
                      onChange={(e) => setNewCollectionEmoji(e.target.value.slice(0, 2))}
                      maxLength={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 text-2xl"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleCreateCollection}
                      disabled={!newCollectionName.trim()}
                      className="flex-1 px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => {
                        setShowNewCollection(false);
                        setNewCollectionName("");
                        setNewCollectionEmoji("⭐");
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Collections Grid */}
            {collections.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map((collection: Collection) => (
                  <Link
                    key={collection.id}
                    href={`/favorites/collection/${collection.id}`}
                  >
                    <div className="bg-white rounded-lg border border-gray-200 hover:border-stone-900 hover:shadow-lg transition-all cursor-pointer h-full">
                      {/* Card Header with Emoji */}
                      <div
                        className={`p-6 text-center ${
                          collection.color
                            ? `bg-[${collection.color}]/10`
                            : "bg-stone-50"
                        }`}
                      >
                        <div className="text-4xl mb-3">{collection.emoji || "⭐"}</div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {collection.name}
                        </h3>
                        {collection.description && (
                          <p className="text-sm text-gray-600 mt-2">
                            {collection.description}
                          </p>
                        )}
                      </div>

                      {/* Card Body */}
                      <div className="p-6 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm font-medium text-gray-700">
                            {collection.favoriteCount}{" "}
                            {collection.favoriteCount === 1 ? "place" : "places"}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(collection.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              deleteCollectionMutation.mutate(collection.id);
                            }}
                            className="flex-1 px-3 py-2 text-red-600 border border-red-200 rounded hover:bg-red-50 transition-colors flex items-center justify-center gap-2 text-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                          <div className="flex-1 px-3 py-2 bg-stone-900 text-white rounded hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 text-sm">
                            <ArrowRight className="w-4 h-4" />
                            View
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-600 mb-2">
                  No collections yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Create your first collection to start organizing your favorites
                </p>
                <button
                  onClick={() => setShowNewCollection(true)}
                  className="px-6 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create Collection
                </button>
              </div>
            )}
          </div>
        )}

        {/* Favorites Tab */}
        {activeTab === "favorites" && (
          <div>
            {totalFavorites > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {collections.map((collection: Collection) =>
                  collection.favoriteCount > 0 ? (
                    <div key={collection.id} className="col-span-full">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span>{collection.emoji || "⭐"}</span>
                        {collection.name}
                      </h3>
                      {/* Favorites will be loaded from collection detail page */}
                      <p className="text-gray-500 text-sm">
                        {collection.favoriteCount} places in this collection
                      </p>
                      <Link
                        href={`/favorites/collection/${collection.id}`}
                        className="text-stone-900 hover:underline font-medium inline-flex items-center gap-1 mt-2"
                      >
                        View all <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  ) : null
                )}
              </div>
            ) : (
              <div className="text-center py-16">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-600 mb-2">
                  No favorites yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Start adding places to your favorites to see them here
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
        )}
      </div>
    </div>
  );
}
