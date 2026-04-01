import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";

// Types
export interface Place {
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

export interface ItineraryActivity {
  id: string;
  itineraryDayId: string;
  placeId: string;
  place: Place;
  timeSlot?: string;
  notes?: string;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface ItineraryDay {
  id: string;
  itineraryId: string;
  dayNumber: number;
  title: string;
  description?: string;
  activities: ItineraryActivity[];
  createdAt: string;
  updatedAt: string;
}

export interface ShareLink {
  id: string;
  itineraryId: string;
  shareToken: string;
  isPublic: boolean;
  expiresAt?: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Itinerary {
  id: string;
  userId: string;
  title: string;
  description?: string;
  city: string;
  durationDays: number;
  startDate?: string;
  endDate?: string;
  isPublished: boolean;
  days: ItineraryDay[];
  shareLink?: ShareLink;
  createdAt: string;
  updatedAt: string;
}

export interface ItineraryListItem {
  id: string;
  title: string;
  description?: string;
  city: string;
  durationDays: number;
  isPublished: boolean;
  activityCount: number;
  shareLink?: {
    token: string;
    isPublic: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

// List itineraries
export function useItineraries(
  options?: UseQueryOptions<{ itineraries: ItineraryListItem[] }>
) {
  return useQuery({
    queryKey: ["itineraries"],
    queryFn: async () => {
      const res = await fetch("/api/user/itineraries");
      if (!res.ok) throw new Error("Failed to fetch itineraries");
      return res.json();
    },
    ...options,
  });
}

// Get single itinerary
export function useItinerary(
  id: string,
  options?: UseQueryOptions<{ itinerary: Itinerary }>
) {
  return useQuery({
    queryKey: ["itinerary", id],
    queryFn: async () => {
      const res = await fetch(`/api/user/itineraries/${id}`);
      if (!res.ok) throw new Error("Failed to fetch itinerary");
      return res.json();
    },
    enabled: !!id,
    ...options,
  });
}

// Create itinerary
export function useCreateItinerary(
  options?: UseMutationOptions<
    { itinerary: Itinerary },
    Error,
    {
      title: string;
      city: string;
      description?: string;
      durationDays?: number;
      startDate?: string;
      endDate?: string;
    }
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const res = await fetch("/api/user/itineraries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create itinerary");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["itineraries"] });
    },
    ...options,
  });
}

// Update itinerary
export function useUpdateItinerary(
  id: string,
  options?: UseMutationOptions<
    { itinerary: Itinerary },
    Error,
    Partial<{
      title: string;
      description: string | null;
      city: string;
      durationDays: number;
      startDate: string | null;
      endDate: string | null;
      isPublished: boolean;
    }>
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const res = await fetch(`/api/user/itineraries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update itinerary");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["itinerary", id] });
      queryClient.invalidateQueries({ queryKey: ["itineraries"] });
    },
    ...options,
  });
}

// Delete itinerary
export function useDeleteItinerary(
  options?: UseMutationOptions<{ message: string }, Error, string>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/user/itineraries/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete itinerary");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["itineraries"] });
    },
    ...options,
  });
}

// Get itinerary days
export function useItineraryDays(
  itineraryId: string,
  options?: UseQueryOptions<{ days: ItineraryDay[] }>
) {
  return useQuery({
    queryKey: ["itinerary-days", itineraryId],
    queryFn: async () => {
      const res = await fetch(`/api/user/itineraries/${itineraryId}/days`);
      if (!res.ok) throw new Error("Failed to fetch days");
      return res.json();
    },
    enabled: !!itineraryId,
    ...options,
  });
}

// Create day
export function useCreateDay(
  itineraryId: string,
  options?: UseMutationOptions<
    { day: ItineraryDay },
    Error,
    { dayNumber: number; title?: string; description?: string }
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const res = await fetch(`/api/user/itineraries/${itineraryId}/days`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create day");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["itinerary-days", itineraryId] });
      queryClient.invalidateQueries({ queryKey: ["itinerary", itineraryId] });
    },
    ...options,
  });
}

// Update day
export function useUpdateDay(
  itineraryId: string,
  dayId: string,
  options?: UseMutationOptions<
    { day: ItineraryDay },
    Error,
    Partial<{ title: string; description: string | null; dayNumber: number }>
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const res = await fetch(
        `/api/user/itineraries/${itineraryId}/days/${dayId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) throw new Error("Failed to update day");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["itinerary-days", itineraryId] });
      queryClient.invalidateQueries({ queryKey: ["itinerary", itineraryId] });
    },
    ...options,
  });
}

// Delete day
export function useDeleteDay(
  itineraryId: string,
  options?: UseMutationOptions<{ message: string }, Error, string>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dayId: string) => {
      const res = await fetch(
        `/api/user/itineraries/${itineraryId}/days/${dayId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete day");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["itinerary-days", itineraryId] });
      queryClient.invalidateQueries({ queryKey: ["itinerary", itineraryId] });
    },
    ...options,
  });
}

// Get day activities
export function useDayActivities(
  itineraryId: string,
  dayId: string,
  options?: UseQueryOptions<{ activities: ItineraryActivity[] }>
) {
  return useQuery({
    queryKey: ["day-activities", itineraryId, dayId],
    queryFn: async () => {
      const res = await fetch(
        `/api/user/itineraries/${itineraryId}/days/${dayId}/activities`
      );
      if (!res.ok) throw new Error("Failed to fetch activities");
      return res.json();
    },
    enabled: !!itineraryId && !!dayId,
    ...options,
  });
}

// Add activity to day
export function useAddActivity(
  itineraryId: string,
  dayId: string,
  options?: UseMutationOptions<
    { activity: ItineraryActivity },
    Error,
    {
      placeId: string;
      timeSlot?: string;
      notes?: string;
      orderIndex?: number;
    }
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const res = await fetch(
        `/api/user/itineraries/${itineraryId}/days/${dayId}/activities`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) throw new Error("Failed to add activity");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["day-activities", itineraryId, dayId],
      });
      queryClient.invalidateQueries({ queryKey: ["itinerary", itineraryId] });
    },
    ...options,
  });
}

// Update activity
export function useUpdateActivity(
  itineraryId: string,
  dayId: string,
  activityId: string,
  options?: UseMutationOptions<
    { activity: ItineraryActivity },
    Error,
    Partial<{ timeSlot: string | null; notes: string | null }>
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const res = await fetch(
        `/api/user/itineraries/${itineraryId}/days/${dayId}/activities/${activityId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) throw new Error("Failed to update activity");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["day-activities", itineraryId, dayId],
      });
      queryClient.invalidateQueries({ queryKey: ["itinerary", itineraryId] });
    },
    ...options,
  });
}

// Delete activity
export function useDeleteActivity(
  itineraryId: string,
  dayId: string,
  options?: UseMutationOptions<{ message: string }, Error, string>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (activityId: string) => {
      const res = await fetch(
        `/api/user/itineraries/${itineraryId}/days/${dayId}/activities/${activityId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete activity");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["day-activities", itineraryId, dayId],
      });
      queryClient.invalidateQueries({ queryKey: ["itinerary", itineraryId] });
    },
    ...options,
  });
}

// Reorder activities
export function useReorderActivities(
  itineraryId: string,
  dayId: string,
  options?: UseMutationOptions<
    { activities: ItineraryActivity[] },
    Error,
    string[]
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (activityIds: string[]) => {
      const res = await fetch(
        `/api/user/itineraries/${itineraryId}/days/${dayId}/activities/reorder`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ activityIds }),
        }
      );
      if (!res.ok) throw new Error("Failed to reorder activities");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["day-activities", itineraryId, dayId],
      });
      queryClient.invalidateQueries({ queryKey: ["itinerary", itineraryId] });
    },
    ...options,
  });
}

// Create share link
export function useCreateShareLink(
  itineraryId: string,
  options?: UseMutationOptions<
    { shareLink: ShareLink },
    Error,
    { isPublic?: boolean; expiresAt?: string }
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const res = await fetch(
        `/api/user/itineraries/${itineraryId}/share`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) throw new Error("Failed to create share link");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["itinerary", itineraryId] });
      queryClient.invalidateQueries({ queryKey: ["share-link", itineraryId] });
    },
    ...options,
  });
}

// Get share link
export function useShareLink(
  itineraryId: string,
  options?: UseQueryOptions<{ shareLink: ShareLink | null }>
) {
  return useQuery({
    queryKey: ["share-link", itineraryId],
    queryFn: async () => {
      const res = await fetch(`/api/user/itineraries/${itineraryId}/share`);
      if (!res.ok) throw new Error("Failed to fetch share link");
      return res.json();
    },
    enabled: !!itineraryId,
    ...options,
  });
}

// Delete share link
export function useDeleteShareLink(
  itineraryId: string,
  options?: UseMutationOptions<{ message: string }, Error, void>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `/api/user/itineraries/${itineraryId}/share`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete share link");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["itinerary", itineraryId] });
      queryClient.invalidateQueries({ queryKey: ["share-link", itineraryId] });
    },
    ...options,
  });
}

// Get shared itinerary (public)
export function useSharedItinerary(
  token: string,
  options?: UseQueryOptions<{
    itinerary: Itinerary;
    shareInfo: {
      sharedBy: { id: string; name: string; email: string };
      sharedAt: string;
      viewCount: number;
    };
  }>
) {
  return useQuery({
    queryKey: ["shared-itinerary", token],
    queryFn: async () => {
      const res = await fetch(`/api/itineraries/share/${token}`);
      if (!res.ok) throw new Error("Failed to fetch shared itinerary");
      return res.json();
    },
    enabled: !!token,
    ...options,
  });
}
