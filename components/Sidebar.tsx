import React from "react";
import { db } from "../db/instant";
import FavoritesList from "./FavoritesList";
import Image from "next/image";
import {
  CubeIcon,
  HeartIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";

interface SidebarProps {
  activeTab: "ingredients" | "favorites";
  onTabChange: (tab: "ingredients" | "favorites") => void;
  onRecipeClick: (
    recipeText: string,
    favoriteId: string,
    image?: string,
    cuisine?: string
  ) => void;
  onDeleteFavorite: (favoriteId: string) => void;
  selectedFavoriteId?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

function Sidebar({
  activeTab,
  onTabChange,
  onRecipeClick,
  onDeleteFavorite,
  selectedFavoriteId,
  isCollapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const user = db.useUser();

  return (
    <div
      className={`${
        isCollapsed ? "w-16" : "w-64"
      } bg-gradient-to-b from-slate-50 to-white shadow-xl h-screen flex flex-col border-r border-slate-200 transition-all duration-300`}
    >
      <div className="py-8 px-6">
        <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-400">
          {isCollapsed ? (
            <div className="flex justify-center w-full">
              {onToggleCollapse && (
                <button
                  onClick={onToggleCollapse}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
                >
                  <Bars3Icon className="w-5 h-5 text-slate-600" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <div className="relative">
                  <Image
                    src="/logo.png"
                    alt="食旅星球"
                    width={40}
                    height={40}
                    className="mr-4 drop-shadow-sm"
                  />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  食旅星球
                </h1>
              </div>
              {onToggleCollapse && (
                <button
                  onClick={onToggleCollapse}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
                >
                  <Bars3Icon className="w-5 h-5 text-slate-600" />
                </button>
              )}
            </div>
          )}
        </div>
        {!isCollapsed && (
          <nav className="space-y-3">
            <button
              onClick={() => onTabChange("ingredients")}
              className={`group w-full flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === "ingredients"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
              }`}
            >
              <CubeIcon
                className={`w-5 h-5 mr-3 transition-colors ${
                  activeTab === "ingredients"
                    ? "text-white"
                    : "text-slate-500 group-hover:text-slate-700"
                }`}
              />
              <span>我的食材库</span>
            </button>
            <div className="relative">
              <button
                onClick={() => onTabChange("favorites")}
                className={`group w-full flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === "favorites"
                    ? "bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/25"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                }`}
              >
                <HeartIcon
                  className={`w-5 h-5 mr-3 transition-colors ${
                    activeTab === "favorites"
                      ? "text-white"
                      : "text-slate-500 group-hover:text-slate-700"
                  }`}
                />
                <span>我的收藏</span>
              </button>
              <div className="mt-3 ml-6 space-y-2 transition-all duration-300">
                <FavoritesList
                  userId={user?.id || ""}
                  onRecipeClick={(recipeText, favoriteId, image, cuisine) => {
                    onRecipeClick(recipeText, favoriteId, image, cuisine);
                  }}
                  onDeleteFavorite={onDeleteFavorite}
                  selectedFavoriteId={selectedFavoriteId}
                />
              </div>
            </div>
          </nav>
        )}
      </div>
      {!isCollapsed && (
        <div className="border-t border-slate-400 mt-auto bg-slate-50/50">
          <button
            onClick={() => db.auth.signOut()}
            className="group w-full flex items-center justify-center px-4 py-4 text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200 rounded-none"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3 group-hover:text-red-500" />
            <span className="font-medium">登出</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
