import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { parseRecipe } from "../utils/recipeParser";
import ImageModal from "./ImageModal";
import {
  BookOpenIcon,
  ClipboardDocumentListIcon,
  FireIcon,
  ExclamationTriangleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface RecipeDisplayProps {
  recipe: string;
  image?: string;
  onDeleteFavorite?: (favoriteId: string) => void;
  favoriteId?: string;
  onAddToFavorites?: () => void;
}

function RecipeDisplay({
  recipe,
  image,
  onDeleteFavorite,
  favoriteId,
  onAddToFavorites,
}: RecipeDisplayProps) {
  const parsedRecipe = parseRecipe(recipe);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageClick = () => {
    if (image) setIsModalOpen(true);
  };

  return (
    <div className="mt-4 md:bg-white/80 md:backdrop-blur-sm md:rounded-3xl md:shadow-2xl md:border md:border-white/20 md:overflow-hidden">
      <div className="relative h-48 md:h-56 overflow-hidden bg-slate-700">
        {/* 背景图片 - 完全铺满标题栏 */}
        {image ? (
          <Image
            src={image}
            alt={parsedRecipe.title || "食谱图片"}
            fill
            className="object-cover object-center"
            priority
          />
        ) : (
          // 可选：无图时的渐变兜底背景
          <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600" />
        )}

        {/* 左侧深色渐变遮罩，让文字始终清晰可见 */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-transparent" />

        {/* 可点击的图片覆盖层 */}
        {image && (
          <div
            className="absolute inset-0 z-20 cursor-pointer"
            onClick={handleImageClick}
            aria-label="查看大图"
          />
        )}

        {/* 内容层 */}
        <div className="relative z-10 flex items-center h-full px-6 md:px-8 max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 leading-tight drop-shadow-lg">
              {parsedRecipe.title || "食谱"}
            </h2>
            <div className="flex items-center text-slate-100 text-lg drop-shadow-md">
              <BookOpenIcon className="w-6 h-6 mr-2" />
              美味食谱
            </div>
          </div>
        </div>
      </div>

      <div className="p-2 md:p-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Ingredients 左栏 */}
          <div className="md:bg-gradient-to-br md:from-green-50 md:to-emerald-50 md:rounded-2xl md:p-6 md:border md:border-green-100 p-4 px-4">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-3">
                <ClipboardDocumentListIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">配料清单</h3>
            </div>
            <div className="text-slate-700 leading-relaxed">
              <ReactMarkdown
                components={{
                  p: ({ children }) => (
                    <p className="text-slate-700 mb-3 leading-relaxed">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="space-y-2">{children}</ul>
                  ),
                  li: ({ children }) => (
                    <li className="flex items-start text-slate-700">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>{children}</span>
                    </li>
                  ),
                }}
              >
                {parsedRecipe.ingredients}
              </ReactMarkdown>
            </div>
          </div>

          {/* Method 右栏 */}
          <div className="md:bg-gradient-to-br md:from-blue-50 md:to-indigo-50 md:rounded-2xl md:p-6 md:border md:border-blue-100 p-4 px-4">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-3">
                <FireIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">制作方法</h3>
            </div>
            <div className="text-slate-700 leading-relaxed">
              <ol className="space-y-3">
                {parsedRecipe.instructions
                  .split("\n")
                  .filter((line) => line.trim())
                  .map((line, index) => {
                    const stepText = line.replace(/^\d+\.\s*/, "").trim();
                    return (
                      <li
                        key={index}
                        className="flex items-start text-slate-700"
                      >
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-500 text-white text-sm font-bold rounded-full mr-3 flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => (
                              <span className="leading-relaxed">
                                {children}
                              </span>
                            ),
                            strong: ({ children }) => (
                              <strong className="font-bold">{children}</strong>
                            ),
                          }}
                        >
                          {stepText}
                        </ReactMarkdown>
                      </li>
                    );
                  })}
              </ol>
            </div>
          </div>
        </div>

        {/* Tips 栏 */}
        {parsedRecipe.tips && (
          <div className="md:bg-gradient-to-br md:from-amber-50 md:to-orange-50 md:rounded-2xl md:p-6 md:border md:border-amber-100 md:mt-8 mt-4 p-4 px-4">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mr-3">
                <ExclamationTriangleIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">小贴士</h3>
            </div>
            <div className="text-slate-700 leading-relaxed">
              <ReactMarkdown
                components={{
                  p: ({ children }) => (
                    <p className="text-slate-700 mb-3 leading-relaxed">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="space-y-2">{children}</ul>
                  ),
                  li: ({ children }) => (
                    <li className="flex items-start text-slate-700">
                      <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>{children}</span>
                    </li>
                  ),
                }}
              >
                {parsedRecipe.tips}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* 收藏和删除按钮 */}
        <div className="md:mt-8 my-4 flex justify-center gap-4">
          {onAddToFavorites && !favoriteId && (
            <button
              onClick={onAddToFavorites}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              收藏食谱
            </button>
          )}
          {onDeleteFavorite && favoriteId && (
            <button
              onClick={() => onDeleteFavorite(favoriteId)}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white font-semibold rounded-xl hover:from-red-600 hover:to-rose-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <TrashIcon className="w-5 h-5 mr-2" />
              删除收藏
            </button>
          )}
        </div>
      </div>

      <ImageModal
        isOpen={isModalOpen}
        imageSrc={image!}
        alt={parsedRecipe.title || "食谱图片"}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default RecipeDisplay;
