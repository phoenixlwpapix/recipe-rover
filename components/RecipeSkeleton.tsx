import React from "react";

function RecipeSkeleton() {
  return (
    <div className="w-full bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-pulse">
      {/* Header Image Skeleton */}
      <div className="h-64 bg-slate-100 w-full relative">
        <div className="absolute top-4 right-4 w-10 h-10 bg-slate-200/50 rounded-full"></div>
      </div>

      <div className="p-8 md:p-10 space-y-8">
        {/* Title & Meta Skeleton */}
        <div className="space-y-4">
          <div className="h-10 bg-slate-100 rounded-2xl w-3/4 md:w-1/2"></div>
          <div className="flex gap-4">
            <div className="h-6 bg-slate-50 rounded-full w-24"></div>
            <div className="h-6 bg-slate-50 rounded-full w-32"></div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-10">
          {/* Ingredients Left Col */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-orange-50"></div>
              <div className="h-6 bg-slate-100 rounded-xl w-24"></div>
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                  <div className={`h-4 bg-slate-50 rounded-lg w-${['3/4', '2/3', '1/2', '5/6', '4/5'][i % 5]}`}></div>
                </div>
              ))}
            </div>
          </div>

          {/* Steps Right Col */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-orange-50"></div>
              <div className="h-6 bg-slate-100 rounded-xl w-24"></div>
            </div>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex-shrink-0"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-50 rounded-lg w-full"></div>
                    <div className="h-4 bg-slate-50 rounded-lg w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-amber-50/50 rounded-2xl p-6 border border-amber-100/50 mt-8">
          <div className="h-5 bg-amber-100/50 rounded-lg w-20 mb-3"></div>
          <div className="h-4 bg-amber-50 rounded-lg w-full mb-2"></div>
          <div className="h-4 bg-amber-50 rounded-lg w-3/4"></div>
        </div>
      </div>
    </div>
  );
}

export default RecipeSkeleton;
