
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
} from "@heroicons/react/24/outline";

interface RecipeDisplayProps {
  recipe: string;
  image?: string;
  imageLoading?: boolean;
  onDeleteFavorite?: (favoriteId: string) => void;
  favoriteId?: string;
  onAddToFavorites?: () => void;
  cuisine?: string;
  onImageLoad?: () => void;
}

function RecipeDisplay({
  recipe,
  image,
  imageLoading = false,
  onDeleteFavorite,
  favoriteId,
  onAddToFavorites,
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
      <div className="relative h-64 md:h-80 overflow-hidden bg-slate-900">
        {/* Background Image */}
        {imageLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-slate-600 border-t-orange-500 rounded-full animate-spin" />
              <span className="text-slate-400 text-sm font-bold uppercase tracking-widest">正在为您描绘美味...</span>
            </div>
          </div>
        ) : image ? (
          <Image
            src={image}
            alt={parsedRecipe.title || "食谱图片"}
            fill
            className="object-cover object-center opacity-60 hover:opacity-70 transition-opacity duration-500 cursor-pointer"
            priority
            onLoad={onImageLoad}
            onClick={handleImageClick}
          />
        ) : (
          <div className="absolute inset-0 bg-slate-800" />
        )}

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 pointer-events-none">
          <div className="max-w-3xl animate-slide-in">
            <div className="inline-flex items-center px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full mb-4 uppercase tracking-widest">
              {cuisine || "精选美食"}
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight tracking-tight">
              {parsedRecipe.title || "美味食谱"}
            </h2>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-12">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Ingredients Column */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
                <ClipboardDocumentListIcon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">准备食材</h3>
            </div>
            <div className="bg-slate-50/50 rounded-3xl p-8 border border-slate-100">
              <div className="prose prose-slate max-w-none">
                <ReactMarkdown
                  components={{
                    ul: ({ children }) => <ul className="space-y-4 m-0 p-0 list-none">{children}</ul>,
                    li: ({ children }) => (
                      <li className="flex items-start gap-3 text-slate-700 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2.5 flex-shrink-0" />
                        <span>{children}</span>
                      </li>
                    ),
                  }}
                >
                  {parsedRecipe.ingredients}
                </ReactMarkdown>
              </div>
            </div>
          </div>

          {/* Instructions Column */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                <FireIcon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">烹饪步骤</h3>
            </div>
            <div className="space-y-6">
              {parsedRecipe.instructions
                .split("\n")
                .filter((line) => line.trim())
                .map((line, index) => {
                  const stepText = line.replace(/^\d+\.\s*/, "").trim();
                  return (
                    <div key={index} className="flex gap-6 group">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-xl bg-white border-2 border-slate-100 text-slate-400 font-black flex items-center justify-center group-hover:border-indigo-200 group-hover:text-indigo-500 transition-colors">
                          {index + 1}
                        </div>
                      </div>
                      <div className="pt-1.5 flex-1">
                        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed font-medium">
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => <span className="block">{children}</span>,
                              strong: ({ children }) => <strong className="font-bold text-slate-900">{children}</strong>,
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
          <div className="mt-12 bg-amber-50 rounded-3xl p-8 border border-amber-100">
            <div className="flex items-center gap-3 mb-4 text-amber-800">
              <ExclamationTriangleIcon className="w-6 h-6" />
              <h4 className="text-xl font-bold">厨师心得</h4>
            </div>
            <div className="text-amber-900/80 font-medium leading-relaxed">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-2">{children}</p>,
                  ul: ({ children }) => <ul className="space-y-2">{children}</ul>,
                  li: ({ children }) => (
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500">•</span>
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
              onClick={() => onDeleteFavorite(favoriteId)}
              className="inline-flex items-center px-10 py-4 bg-white text-rose-600 border-2 border-rose-50 font-bold rounded-2xl hover:bg-rose-50 hover:border-rose-100 transition-all duration-300"
            >
              <TrashIcon className="w-6 h-6 mr-3" />
              移除收藏
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
