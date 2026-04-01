"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Calendar,
  MapPin,
  Trash2,
  Edit,
  Share2,
  Eye,
  Lock,
} from "lucide-react";
import Link from "next/link";
import {
  useItineraries,
  useCreateItinerary,
  useDeleteItinerary,
} from "@/hooks/useItineraries";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ItinerariesPage() {
  const router = useRouter();
  const { tr } = useLanguage();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    city: "",
    description: "",
    durationDays: 3,
  });

  // Queries and mutations
  const { data, isLoading, error } = useItineraries();
  const createItinerary = useCreateItinerary();
  const deleteItinerary = useDeleteItinerary();

  const itineraries = data?.itineraries || [];

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.city.trim()) {
      alert("Please fill in title and city");
      return;
    }

    createItinerary.mutate(
      {
        title: formData.title,
        city: formData.city,
        description: formData.description || undefined,
        durationDays: formData.durationDays,
      },
      {
        onSuccess: () => {
          setFormData({ title: "", city: "", description: "", durationDays: 3 });
          setShowCreateForm(false);
        },
        onError: (err) => {
          alert(`Failed to create itinerary: ${err.message}`);
        },
      }
    );
  };

  const handleDelete = async (id: string, title: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${title}"? This cannot be undone.`
      )
    ) {
      return;
    }

    deleteItinerary.mutate(id, {
      onError: (err) => {
        alert(`Failed to delete itinerary: ${err.message}`);
      },
    });
  };

  const handleEdit = (id: string) => {
    router.push(`/itineraries/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-2">My Itineraries</h1>
          <p className="text-stone-200">Create and manage your travel plans</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Create Button */}
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="mb-8 px-6 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors flex items-center gap-2 font-medium"
        >
          <Plus className="w-5 h-5" />
          Create New Itinerary
        </button>

        {/* Create Form */}
        {showCreateForm && (
          <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Create New Itinerary
            </h2>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Itinerary Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Ethiopian Cultural Tour"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  placeholder="e.g., Addis Ababa"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Optional description of your trip..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (Days)
                </label>
                <select
                  value={formData.durationDays}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      durationDays: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                >
                  {Array.from({ length: 14 }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={day}>
                      {day} day{day > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={createItinerary.isPending}
                  className="px-6 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors disabled:opacity-50"
                >
                  {createItinerary.isPending ? "Creating..." : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">
              <Calendar className="w-12 h-12 text-stone-400" />
            </div>
            <p className="mt-4 text-gray-600">Loading itineraries...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            <p className="font-medium">Failed to load itineraries</p>
            <p className="text-sm">{error.message}</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && itineraries.length === 0 && (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              No itineraries yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start by creating your first itinerary above
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Your First Itinerary
            </button>
          </div>
        )}

        {/* Itineraries Grid */}
        {!isLoading && !error && itineraries.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {itineraries.map((itinerary) => (
              <div
                key={itinerary.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-stone-100 to-stone-50 p-4 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {itinerary.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{itinerary.city}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4">
                  {/* Meta Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Duration</span>
                      <span className="font-medium">
                        {itinerary.durationDays} day
                        {itinerary.durationDays > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Activities</span>
                      <span className="font-medium">{itinerary.activityCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Status</span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          itinerary.isPublished
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {itinerary.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>

                  {/* Share Info */}
                  {itinerary.shareLink && (
                    <div className="mb-4 p-2 bg-blue-50 rounded flex items-center gap-2 text-xs text-blue-700">
                      {itinerary.shareLink.isPublic ? (
                        <>
                          <Eye className="w-3 h-3" />
                          <span>Shared publicly</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3" />
                          <span>Shared privately</span>
                        </>
                      )}
                    </div>
                  )}

                  {/* Created Date */}
                  <p className="text-xs text-gray-500 mb-4">
                    Created{" "}
                    {new Date(itinerary.createdAt).toLocaleDateString()}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(itinerary.id)}
                      className="flex-1 px-3 py-2 bg-stone-900 text-white text-sm font-medium rounded hover:bg-stone-800 transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(itinerary.id, itinerary.title)}
                      disabled={deleteItinerary.isPending}
                      className="px-3 py-2 text-red-600 border border-red-200 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
                      title="Delete itinerary"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
