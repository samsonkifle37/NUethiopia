export default function ToursLoading() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-24">
      <div className="space-y-6 pt-4 px-4 animate-pulse">
        <div className="flex justify-between items-center px-1">
          <div className="h-8 w-56 bg-gray-200 rounded-xl" />
          <div className="w-10 h-10 bg-gray-200 rounded-2xl" />
        </div>
        <div className="h-12 bg-gray-200 rounded-2xl" />
        <div className="flex gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-8 w-28 bg-gray-200 rounded-xl shrink-0" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-gray-100 h-72 rounded-[2rem]" />
          ))}
        </div>
      </div>
    </div>
  );
}
