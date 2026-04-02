"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Clock,
  MapPin,
  Share2,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import {
  useItinerary,
  useUpdateItinerary,
  useDeleteItinerary,
  useCreateDay,
  useDeleteDay,
  useAddActivity,
  useDeleteActivity,
  useUpdateActivity,
} from "@/hooks/useItineraries";
import { VerifiedImage } from "@/components/media/VerifiedImage";
import { ShareItineraryModal } from "@/components/ShareItineraryModal";

export default function ItineraryEditorPage() {
  const params = useParams();
  const router = useRouter();
  const itineraryId = params.id as string;

  const [showEditForm, setShowEditForm] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    isPublished: false,
  });
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());
  const [selectedDayForActivity, setSelectedDayForActivity] = useState<
    string | null
  >(null);
  const [activitySearch, setActivitySearch] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);

  // Queries
  const { data, isLoading, error, refetch } = useItinerary(itineraryId);
  const itinerary = data?.itinerary;

  // Mutations
  const updateItinerary = useUpdateItinerary(itineraryId);
  const deleteItinerary = useDeleteItinerary();
  const createDay = useCreateDay(itineraryId);
  const deleteDay = useDeleteDay(itineraryId);

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();

    updateItinerary.mutate(
      {
        title: editFormData.title || itinerary?.title,
        description: editFormData.description,
        isPublished: editFormData.isPublished,
      },
      {
        onSuccess: () => {
          setShowEditForm(false);
        },
        onError: (err) => {
          alert(`Failed to update: ${err.message}`);
        },
      }
    );
  };

  const handleDelete = () => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${itinerary?.title}"? This cannot be undone.`
      )
    ) {
      return;
    }

    deleteItinerary.mutate(itineraryId, {
      onSuccess: () => {
        router.push("/itineraries");
      },
      onError: (err) => {
        alert(`Failed to delete: ${err.message}`);
      },
    });
  };

  const toggleDayExpand = (dayId: string) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(dayId)) {
      newExpanded.delete(dayId);
    } else {
      newExpanded.add(dayId);
    }
    setExpandedDays(newExpanded);
  };

  const handleDeleteDay = (dayId: string, dayNumber: number) => {
    if (!window.confirm(`Delete Day ${dayNumber}? All activities will be removed.`)) {
      return;
    }

    deleteDay.mutate(dayId, {
      onError: (err) => {
        alert(`Failed to delete day: ${err.message}`);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-12 w-48 bg-gray-300 rounded mb-4 mx-auto"></div>
          <div className="h-6 w-64 bg-gray-200 rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Itinerary not found
          </h1>
          <p className="text-gray-600 mb-6">
            This itinerary might have been deleted or you don't have access.
          </p>
          <Link
            href="/itineraries"
            className="px-6 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Itineraries
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/itineraries"
            className="flex items-center gap-2 text-stone-900 hover:text-stone-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 flex-1 text-center">
            {itinerary.title}
          </h1>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowShareModal(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Share itinerary"
            >
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => {
                setEditFormData({
                  title: itinerary.title,
                  description: itinerary.description || "",
                  isPublished: itinerary.isPublished,
                });
                setShowEditForm(!showEditForm);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Edit itinerary"
            >
              <span className="text-sm font-medium">⚙️</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Edit Form */}
        {showEditForm && (
          <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Edit Itinerary
            </h2>
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={editFormData.isPublished}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      isPublished: e.target.checked,
                    })
                  }
                  className="w-4 h-4"
                />
                <label htmlFor="published" className="text-sm font-medium">
                  Publish this itinerary
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={updateItinerary.isPending}
                  className="px-6 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors disabled:opacity-50"
                >
                  {updateItinerary.isPending ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleteItinerary.isPending}
                  className="px-6 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 ml-auto"
                >
                  {deleteItinerary.isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Itinerary Info */}
        {!showEditForm && (
          <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-bold text-gray-900">
                    {itinerary.title}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      itinerary.isPublished
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {itinerary.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
                {itinerary.description && (
                  <p className="text-gray-600 mb-3">{itinerary.description}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {itinerary.city}
                  </div>
                  <div>•</div>
                  <div>
                    {itinerary.durationDays} day
                    {itinerary.durationDays > 1 ? "s" : ""}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Days Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">Days</h3>

          {itinerary.days.map((day) => (
            <DayCard
              key={day.id}
              day={day}
              isExpanded={expandedDays.has(day.id)}
              onToggleExpand={() => toggleDayExpand(day.id)}
              onDeleteDay={() => handleDeleteDay(day.id, day.dayNumber)}
              onDeleteActivity={(activityId) =>
                console.log("Delete activity:", activityId)
              }
              itineraryId={itineraryId}
            />
          ))}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <ShareItineraryModal
          itineraryId={itineraryId}
          itineraryTitle={itinerary.title}
          onCloseAction={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}

interface DayCardProps {
  day: any;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onDeleteDay: () => void;
  onDeleteActivity: (activityId: string) => void;
  itineraryId: string;
}

function DayCard({
  day,
  isExpanded,
  onToggleExpand,
  onDeleteDay,
  onDeleteActivity,
  itineraryId,
}: DayCardProps) {
  const [showActivityForm, setShowActivityForm] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Day Header */}
      <button
        onClick={onToggleExpand}
        className="w-full px-6 py-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
      >
        <div className="text-left">
          <h4 className="font-bold text-gray-900">
            Day {day.dayNumber}: {day.title}
          </h4>
          <p className="text-sm text-gray-600">
            {day.activities.length} activity{day.activities.length !== 1 ? "ies" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteDay();
            }}
            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete day"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <span className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}>
            ▼
          </span>
        </div>
      </button>

      {/* Day Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          {/* Activities List */}
          {day.activities.length > 0 && (
            <div className="mb-6">
              <h5 className="font-medium text-gray-900 mb-3">Activities</h5>
              <div className="space-y-3">
                {day.activities.map((activity: any) => (
                  <ActivityItem
                    key={activity.id}
                    activity={activity}
                    onDelete={() => onDeleteActivity(activity.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Add Activity Form */}
          {showActivityForm && (
            <AddActivityForm
              dayId={day.id}
              itineraryId={itineraryId}
              onCancel={() => setShowActivityForm(false)}
            />
          )}

          {/* Add Activity Button */}
          {!showActivityForm && (
            <button
              onClick={() => setShowActivityForm(true)}
              className="w-full px-4 py-2 border border-dashed border-gray-300 rounded-lg hover:bg-white transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <Plus className="w-4 h-4" />
              Add Activity
            </button>
          )}
        </div>
      )}
    </div>
  );
}

interface ActivityItemProps {
  activity: any;
  onDelete: () => void;
}

function ActivityItem({ activity, onDelete }: ActivityItemProps) {
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 flex items-start gap-4">
      {/* Activity Image */}
      {activity.place?.image && (
        <VerifiedImage
          src={activity.place.image}
          alt={activity.place.name}
          className="rounded w-20 h-20 object-cover flex-shrink-0"
        />
      )}

      {/* Activity Info */}
      <div className="flex-1 min-w-0">
        <h5 className="font-medium text-gray-900">{activity.place?.name}</h5>
        <p className="text-sm text-gray-600">{activity.place?.type}</p>
        {activity.timeSlot && (
          <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
            <Clock className="w-3 h-3" />
            {activity.timeSlot}
          </div>
        )}
        {activity.notes && (
          <p className="text-sm text-gray-600 mt-2 italic">"{activity.notes}"</p>
        )}
      </div>

      {/* Delete Button */}
      <button
        onClick={onDelete}
        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors flex-shrink-0"
        title="Remove activity"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

interface AddActivityFormProps {
  dayId: string;
  itineraryId: string;
  onCancel: () => void;
}

function AddActivityForm({
  dayId,
  itineraryId,
  onCancel,
}: AddActivityFormProps) {
  const [placeId, setPlaceId] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [notes, setNotes] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const addActivity = useAddActivity(itineraryId, dayId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!placeId) {
      alert("Please select a place");
      return;
    }

    addActivity.mutate(
      { placeId, timeSlot, notes },
      {
        onSuccess: () => {
          setPlaceId("");
          setTimeSlot("");
          setNotes("");
          setSearchQuery("");
          setSearchResults([]);
          onCancel();
        },
        onError: (err) => {
          alert(`Failed to add activity: ${err.message}`);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-4 mb-4 border border-stone-200">
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Place/Activity
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search places..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
          />
          {searchQuery && (
            <p className="text-xs text-gray-500 mt-1">
              Search functionality coming soon - for now, select from your saved places
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time (optional)
          </label>
          <input
            type="text"
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            placeholder="e.g., 10:00 AM - 12:00 PM"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes or tips..."
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={addActivity.isPending || !placeId}
            className="px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors disabled:opacity-50 text-sm font-medium"
          >
            {addActivity.isPending ? "Adding..." : "Add Activity"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}

