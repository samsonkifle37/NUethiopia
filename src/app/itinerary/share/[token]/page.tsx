"use client";

import { useParams } from "next/navigation";
import { MapPin, Calendar, Clock, User, Heart, MessageCircle } from "lucide-react";
import { useSharedItinerary } from "@/hooks/useItineraries";
import { VerifiedImage } from "@/components/media/VerifiedImage";
import Link from "next/link";

export default function SharedItineraryPage() {
  const params = useParams();
  const token = params.token as string;

  const { data, isLoading, error } = useSharedItinerary(token);
  const itinerary = data?.itinerary;
  const shareInfo = data?.shareInfo;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-12 w-64 bg-gray-300 rounded mb-4 mx-auto"></div>
          <div className="h-6 w-80 bg-gray-200 rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md bg-white rounded-lg p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Itinerary Not Found
          </h1>
          <p className="text-gray-600 mb-2">
            This itinerary might have been deleted or the share link has expired.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            If you believe this is an error, please ask the person who shared it to resend the link.
          </p>
          <Link
            href="/"
            className="px-6 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors inline-block"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!itinerary) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-3">{itinerary.title}</h1>
          <p className="text-stone-200 mb-4">{itinerary.description}</p>

          <div className="flex flex-wrap items-center gap-6 text-stone-100">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>{itinerary.city}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>
                {itinerary.durationDays} day
                {itinerary.durationDays > 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <span>{itinerary.days.length} days planned</span>
            </div>
          </div>
        </div>
      </div>

      {/* Shared By Section */}
      {shareInfo && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-stone-200 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-stone-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Shared by</p>
                  <p className="font-medium text-gray-900">
                    {shareInfo.sharedBy.name}
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p>Views: <span className="font-medium text-gray-900">{shareInfo.viewCount}</span></p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Days Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Itinerary</h2>

        <div className="space-y-6">
          {itinerary.days.map((day, index) => (
            <DayView key={day.id} day={day} dayNumber={index + 1} />
          ))}
        </div>
      </div>

      {/* Share Prompt */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-bold text-blue-900 mb-2">
            Interested in planning your own trip?
          </h3>
          <p className="text-blue-800 mb-4">
            Create your own itinerary on NU Ethiopia and share it with friends!
          </p>
          <Link
            href="/"
            className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors inline-block font-medium"
          >
            Start Planning
          </Link>
        </div>
      </div>
    </div>
  );
}

interface DayViewProps {
  day: any;
  dayNumber: number;
}

function DayView({ day, dayNumber }: DayViewProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Day Header */}
      <div className="bg-gradient-to-r from-stone-100 to-stone-50 p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900">
          Day {dayNumber}: {day.title}
        </h3>
        {day.description && (
          <p className="text-gray-600 mt-2">{day.description}</p>
        )}
      </div>

      {/* Activities */}
      <div className="p-6">
        {day.activities.length === 0 ? (
          <p className="text-gray-500 italic">No activities planned for this day</p>
        ) : (
          <div className="space-y-4">
            {day.activities.map((activity: any, index: number) => (
              <ActivityView
                key={activity.id}
                activity={activity}
                isFirst={index === 0}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface ActivityViewProps {
  activity: any;
  isFirst: boolean;
}

function ActivityView({ activity, isFirst }: ActivityViewProps) {
  return (
    <div className={`flex gap-4 pb-4 ${!isFirst ? "border-t pt-4" : ""}`}>
      {/* Timeline */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="w-8 h-8 bg-stone-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
          {activity.orderIndex}
        </div>
        {!isFirst && <div className="w-0.5 h-8 bg-stone-200 mt-2"></div>}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pb-4">
        {/* Activity Image */}
        {activity.place?.image && (
          <div className="mb-4 rounded-lg overflow-hidden h-48 bg-gray-200">
            <VerifiedImage
              src={activity.place.image}
              alt={activity.place.name}
              width={400}
              height={200}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Activity Info */}
        <div>
          <h4 className="text-lg font-bold text-gray-900">
            {activity.place?.name}
          </h4>
          <p className="text-sm text-gray-600 mt-1">{activity.place?.type}</p>

          {activity.place?.city && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
              <MapPin className="w-4 h-4" />
              {activity.place.city}
            </div>
          )}

          {/* Time Slot */}
          {activity.timeSlot && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
              <Clock className="w-4 h-4" />
              {activity.timeSlot}
            </div>
          )}

          {/* Description */}
          {activity.place?.shortDescription && (
            <p className="text-gray-700 mt-3">
              {activity.place.shortDescription}
            </p>
          )}

          {/* Notes */}
          {activity.notes && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-900">
                <span className="font-medium">Note:</span> {activity.notes}
              </p>
            </div>
          )}

          {/* Place Stats */}
          {activity.place && (
            <div className="flex flex-wrap gap-4 mt-4 text-sm">
              {activity.place.reviewCount > 0 && (
                <div className="flex items-center gap-1 text-gray-600">
                  <MessageCircle className="w-4 h-4" />
                  {activity.place.reviewCount} reviews
                </div>
              )}
              {activity.place.favoriteCount > 0 && (
                <div className="flex items-center gap-1 text-gray-600">
                  <Heart className="w-4 h-4" />
                  {activity.place.favoriteCount} favorites
                </div>
              )}
              {activity.place.priceLevel && (
                <div className="text-gray-600">
                  Price: {activity.place.priceLevel}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
