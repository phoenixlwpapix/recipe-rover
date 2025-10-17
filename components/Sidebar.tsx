import React, { useState } from "react";
import { db } from "../db/instant";
import FavoritesList from "./FavoritesList";

interface SidebarProps {
  activeTab: "ingredients" | "favorites";
  onTabChange: (tab: "ingredients" | "favorites") => void;
  onRecipeClick: (recipeText: string) => void;
  onDeleteFavorite: (favoriteId: string) => void;
}

function Sidebar({
  activeTab,
  onTabChange,
  onRecipeClick,
  onDeleteFavorite,
}: SidebarProps) {
  const [favoritesExpanded, setFavoritesExpanded] = useState(false);
  const user = db.useUser();

  return (
    <div className="w-64 bg-white shadow-lg h-screen flex flex-col">
      <div className="p-6">
        <div className="flex items-center mb-8">
          <img src="/logo.png" alt="食旅星球" className="w-8 h-8 mr-3" />
          <h1 className="text-2xl font-bold text-black">食旅星球</h1>
        </div>
        <nav className="space-y-2">
          <button
            onClick={() => onTabChange("ingredients")}
            className={`w-full text-left px-4 py-3 rounded-md font-medium ${
              activeTab === "ingredients"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            我的配料表
          </button>
          <div className="relative">
            <button
              onClick={() => {
                onTabChange("favorites");
                setFavoritesExpanded(!favoritesExpanded);
              }}
              className={`w-full text-left px-4 py-3 rounded-md font-medium ${
                activeTab === "favorites"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              我的收藏
              <svg
                className={`w-4 h-4 ml-2 inline transition-transform ${
                  favoritesExpanded ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {activeTab === "favorites" && favoritesExpanded && (
              <div className="mt-2 ml-4 space-y-1 max-h-60 overflow-y-auto">
                <FavoritesList
                  userId={user?.id || ""}
                  onRecipeClick={(recipeText) => {
                    onRecipeClick(recipeText);
                    setFavoritesExpanded(false);
                  }}
                  onDeleteFavorite={onDeleteFavorite}
                />
              </div>
            )}
          </div>
        </nav>
      </div>
      <div className="p-6 border-t mt-auto">
        <button
          onClick={() => db.auth.signOut()}
          className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          登出
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
