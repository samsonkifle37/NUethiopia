import { Suspense } from "react";
import { ProfileClient } from "./ProfileClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | NU Ethiopia",
  description: "Manage your Ethiopia travel preferences, itineraries, and account settings.",
};

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#C9973B]/20 border-t-[#C9973B] rounded-full animate-spin" />
    </div>}>
      <ProfileClient />
    </Suspense>
  );
}
