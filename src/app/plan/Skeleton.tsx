"use client";

import React from "react";

export function PlanSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Summary card skeleton */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="h-3 w-20 bg-gray-100 rounded-full" />
            <div className="h-6 w-3/4 bg-gray-200 rounded-lg" />
            <div className="h-3 w-1/2 bg-gray-100 rounded-full" />
          </div>
          <div className="h-8 w-24 bg-gray-100 rounded-xl" />
        </div>
        <div className="grid grid-cols-3 gap-2 mt-6">
           {[1,2,3].map(i => <div key={i} className="h-14 bg-gray-50 rounded-xl" />)}
        </div>
      </div>

      {/* Arrival support skeleton */}
      <div className="bg-gray-100/50 rounded-3xl p-5 h-24" />

      {/* Day skeletons */}
      {[1, 2].map((day) => (
        <div key={day} className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-gray-200 rounded-2xl" />
             <div className="space-y-1">
               <div className="h-2 w-12 bg-gray-100 rounded-full" />
               <div className="h-4 w-32 bg-gray-200 rounded-lg" />
             </div>
          </div>
          <div className="space-y-3 pl-4 border-l-2 border-gray-100 ml-4">
            {[1, 2, 3].map(block => (
               <div key={block} className="bg-white border border-gray-50 rounded-2xl p-4 h-24" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
