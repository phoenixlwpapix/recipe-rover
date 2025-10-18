import React, { useState } from "react";
import { db } from "../db/instant";
import FavoritesList from "./FavoritesList";
import Image from "next/image";

interface SidebarProps {
  activeTab: "ingredients" | "favorites";
  onTabChange: (tab: "ingredients" | "favorites") => void;
  onRecipeClick: (recipeText: string, favoriteId: string) => void;
  onDeleteFavorite: (favoriteId: string) => void;
  selectedFavoriteId?: string;
}

function Sidebar({
  activeTab,
  onTabChange,
  onRecipeClick,
  onDeleteFavorite,
  selectedFavoriteId,
}: SidebarProps) {
  const [favoritesExpanded, setFavoritesExpanded] = useState(false);
  const user = db.useUser();

  return (
    <div className="w-64 bg-white shadow-lg h-screen flex flex-col">
      <div className="py-6">
        <div className="flex items-center justify-center mb-8">
          <Image
            src="/logo.png"
            alt="食旅星球"
            width={32}
            height={32}
            className="mr-3"
          />
          <h1 className="text-2xl font-bold text-black">食旅星球</h1>
        </div>
        <nav className="space-y-2">
          <button
            onClick={() => onTabChange("ingredients")}
            className={`w-full text-left py-3 font-medium ${
              activeTab === "ingredients"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:bg-gray-100 px-4 rounded-md"
            }`}
          >
            <span className={activeTab === "ingredients" ? "pl-4" : ""}>
              我的食材库
            </span>
          </button>
          <div className="relative">
            <button
              onClick={() => {
                onTabChange("favorites");
                setFavoritesExpanded(!favoritesExpanded);
              }}
              className={`w-full text-left py-3 font-medium ${
                activeTab === "favorites"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100 px-4 rounded-md"
              }`}
            >
              <span className={activeTab === "favorites" ? "pl-4" : ""}>
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
              </span>
            </button>
            {activeTab === "favorites" && favoritesExpanded && (
              <div className="mt-2 ml-4 space-y-1 max-h-60 overflow-y-auto">
                <FavoritesList
                  userId={user?.id || ""}
                  onRecipeClick={(recipeText, favoriteId) => {
                    onRecipeClick(recipeText, favoriteId);
                  }}
                  onDeleteFavorite={onDeleteFavorite}
                  selectedFavoriteId={selectedFavoriteId}
                />
              </div>
            )}
          </div>
        </nav>
      </div>
      <div className="border-t mt-auto">
        <button
          onClick={() => db.auth.signOut()}
          className={`w-full bg-red-600 text-white py-2 hover:bg-red-700 ${
            false ? "" : "px-4 rounded-none"
          }`}
        >
          <span className={false ? "pl-4" : ""}>登出</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
