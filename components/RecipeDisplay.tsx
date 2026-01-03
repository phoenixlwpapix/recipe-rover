
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { parseRecipe } from "../utils/recipeParser";
import ImageModal from "./ImageModal";
import {
  ClipboardDocumentListIcon,
  FireIcon,
  ExclamationTriangleIcon,
  TrashIcon,
  HeartIcon,
  ShareIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

interface RecipeDisplayProps {
  recipe: string;
  image?: string;
  imageLoading?: boolean;
  onDeleteFavorite?: (favoriteId: string, shareId?: string) => void;
  favoriteId?: string;
  recipeId?: string;
  onAddToFavorites?: () => void;
  onShareToSquare?: (recipeId: string) => void;
  onUnshare?: (shareId: string) => void;
  shareId?: string;
  isShared?: boolean;
  cuisine?: string;
  onImageLoad?: () => void;
}

function IngredientItem({ children }: { children: React.ReactNode }) {
  const [checked, setChecked] = useState(false);

  return (
    <li
      onClick={() => setChecked(!checked)}
      className={`flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 border cursor-pointer group ${checked
        ? "bg-slate-50 border-slate-100"
        : "bg-white border-transparent hover:border-orange-100 hover:shadow-lg hover:shadow-orange-100/50"
        }`}
    >
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${checked
        ? "border-slate-300 bg-slate-300"
        : "border-orange-200 group-hover:border-orange-500 bg-white"
        }`}>
        {checked && (
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        )}
      </div>
      <span className={`text-lg font-medium leading-relaxed transition-colors duration-300 ${checked ? "text-slate-400 line-through decoration-slate-300" : "text-slate-700 group-hover:text-slate-900"
        }`}>
        {children}
      </span>
    </li>
  );
}

function RecipeDisplay({
  recipe,
  image,
  imageLoading = false,
  onDeleteFavorite,
  favoriteId,
  recipeId,
  onAddToFavorites,
  onShareToSquare,
  onUnshare,
  shareId,
  isShared,
  cuisine,
  onImageLoad,
}: RecipeDisplayProps) {
  const parsedRecipe = parseRecipe(recipe);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageClick = () => {
    if (image) setIsModalOpen(true);
  };

  return (
    <div className="mt-6 bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-fadeIn">
      <div className="relative h-72 md:h-96 overflow-hidden bg-slate-900 group">
        {/* Background Image */}
        {imageLoading ? (
          <>
            <div className="absolute inset-0 bg-slate-800 animate-pulse" />
            <div className="absolute top-6 right-6 z-10 flex items-center gap-3 px-5 py-2.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10 shadow-2xl">
              <div className="w-5 h-5 border-2 border-white/30 border-t-orange-500 rounded-full animate-spin" />
              <span className="text-white/90 text-sm font-medium tracking-wide">正在为您描绘美味...</span>
            </div>
          </>
        ) : image ? (
          <>
            <Image
              src={image}
              alt={parsedRecipe.title || "食谱图片"}
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out cursor-pointer"
              priority
              onLoad={onImageLoad}
              onClick={handleImageClick}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-90 transition-opacity duration-300 pointer-events-none" />
          </>
        ) : (
          <div className="absolute inset-0 bg-slate-800" />
        )}

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 pointer-events-none">
          <div className="max-w-4xl w-full translate-y-0 opacity-100 transition-all duration-700 ease-out">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="inline-flex items-center px-4 py-1.5 bg-orange-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full uppercase tracking-widest shadow-lg shadow-orange-500/20 ring-1 ring-white/20">
                {cuisine || "精选美食"}
              </div>
            </div>
            <h2 className="text-4xl md:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tight drop-shadow-xl">
              {parsedRecipe.title || "美味食谱"}
            </h2>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-12">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Ingredients Column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="sticky top-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 shadow-sm ring-1 ring-orange-100">
                  <ClipboardDocumentListIcon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">准备食材</h3>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">Preparation</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                <div className="prose prose-slate max-w-none">
                  <ReactMarkdown
                    components={{
                      ul: ({ children }) => <ul className="space-y-3 m-0 p-0 list-none">{children}</ul>,
                      li: ({ children }) => <IngredientItem>{children}</IngredientItem>,
                    }}
                  >
                    {parsedRecipe.ingredients}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions Column */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm ring-1 ring-indigo-100">
                <FireIcon className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">烹饪步骤</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">Instructions</p>
              </div>
            </div>

            <div className="relative pl-4 space-y-10">
              {/* Vertical connecting line */}
              <div className="absolute left-[39px] top-8 bottom-8 w-0.5 bg-indigo-100" />

              {parsedRecipe.instructions
                .split("\n")
                .filter((line) => line.trim())
                .map((line, index) => {
                  const stepText = line.replace(/^\d+\.\s*/, "").trim();
                  return (
                    <div key={index} className="relative flex gap-8 group">
                      <div className="flex-shrink-0 z-10">
                        <div className="w-12 h-12 rounded-2xl bg-white border-2 border-slate-100 text-slate-400 font-black text-lg flex items-center justify-center shadow-sm group-hover:border-indigo-500 group-hover:text-indigo-600 group-hover:scale-110 group-hover:shadow-indigo-200/50 transition-all duration-300">
                          {index + 1}
                        </div>
                      </div>
                      <div className="pt-1 flex-1">
                        <div className="prose prose-slate max-w-none text-slate-600 leading-8 text-lg font-medium group-hover:text-slate-900 transition-colors duration-300">
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => <span className="block">{children}</span>,
                              strong: ({ children }) => <strong className="font-bold text-slate-900 bg-indigo-50/50 px-1 rounded mx-0.5">{children}</strong>,
                            }}
                          >
                            {stepText}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Tips Section */}
        {parsedRecipe.tips && (
          <div className="mt-16 relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 p-8 md:p-10">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <ExclamationTriangleIcon className="w-32 h-32 text-amber-500" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6 text-amber-900">
                <div className="p-2 bg-amber-100 rounded-xl">
                  <ExclamationTriangleIcon className="w-6 h-6 text-amber-600" />
                </div>
                <h4 className="text-xl font-bold">主厨秘籍 & 贴心提示</h4>
              </div>
              <div className="text-amber-900/80 font-medium leading-loose text-lg">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                    ul: ({ children }) => <ul className="space-y-3">{children}</ul>,
                    li: ({ children }) => (
                      <li className="flex items-start gap-3">
                        <span className="text-amber-500 text-xl leading-8">•</span>
                        <span>{children}</span>
                      </li>
                    ),
                  }}
                >
                  {parsedRecipe.tips}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-12 flex flex-wrap justify-center gap-6">
          {onAddToFavorites && !favoriteId && (
            <button
              onClick={onAddToFavorites}
              className="inline-flex items-center px-10 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 hover:scale-105 transition-all duration-300 shadow-xl shadow-slate-200"
            >
              <HeartIcon className="w-6 h-6 mr-3 text-rose-500 fill-rose-500" />
              收藏这份灵感
            </button>
          )}
          {onDeleteFavorite && favoriteId && (
            <button
              onClick={() => onDeleteFavorite(favoriteId, shareId)}
              className="inline-flex items-center px-10 py-4 bg-white text-rose-600 border-2 border-rose-50 font-bold rounded-2xl hover:bg-rose-50 hover:border-rose-100 transition-all duration-300"
            >
              <TrashIcon className="w-6 h-6 mr-3" />
              移除收藏
            </button>
          )}
          {onShareToSquare && recipeId && (
            <button
              onClick={() => onShareToSquare(recipeId)}
              className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-2xl hover:from-purple-700 hover:to-indigo-700 hover:scale-105 transition-all duration-300 shadow-xl shadow-purple-200"
            >
              <ShareIcon className="w-6 h-6 mr-3" />
              分享到广场
            </button>
          )}
          {onUnshare && shareId && isShared && (
            <button
              onClick={() => onUnshare(shareId)}
              className="inline-flex items-center px-10 py-4 bg-purple-100 text-purple-700 border-2 border-purple-200 font-bold rounded-2xl hover:bg-purple-200 hover:border-purple-300 transition-all duration-300"
            >
              <GlobeAltIcon className="w-6 h-6 mr-3" />
              取消分享
            </button>
          )}
          {isShared && !onUnshare && (
            <div className="inline-flex items-center px-6 py-3 bg-purple-50 text-purple-600 font-medium rounded-2xl border border-purple-100">
              <GlobeAltIcon className="w-5 h-5 mr-2" />
              已分享到广场
            </div>
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
