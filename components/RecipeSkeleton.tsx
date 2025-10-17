import React from "react";

function RecipeSkeleton() {
  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow animate-pulse">
      {/* 标题骨架 */}
      <div className="h-8 bg-gray-200 rounded mb-6 w-1/3"></div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Ingredients 左栏骨架 */}
        <div>
          <div className="h-6 bg-gray-200 rounded mb-4 w-1/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-3/5"></div>
          </div>
        </div>

        {/* Method 右栏骨架 */}
        <div>
          <div className="h-6 bg-gray-200 rounded mb-4 w-1/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>

      {/* Tips 栏骨架 */}
      <div className="mt-8">
        <div className="h-6 bg-gray-200 rounded mb-4 w-1/6"></div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>

      {/* 按钮骨架 */}
      <div className="mt-6 h-12 bg-gray-200 rounded-md w-32"></div>
    </div>
  );
}

export default RecipeSkeleton;
