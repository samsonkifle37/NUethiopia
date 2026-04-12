export default function PlanLoading() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-[#C9973B]/20 border-t-[#C9973B] rounded-full animate-spin mx-auto" />
        <div>
          <p className="text-xs font-black text-[#C9973B] uppercase tracking-[0.3em]">Planning</p>
          <p className="text-sm text-gray-400 font-medium mt-1">Crafting your perfect itinerary...</p>
        </div>
      </div>
    </div>
  );
}
