
import React from 'react';
import Image from 'next/image';
import { db } from '../db/instant';
import { TrashIcon, ClockIcon } from '@heroicons/react/24/outline';

interface FavoritesGridProps {
    userId: string;
    onRecipeClick: (
        recipeText: string,
        favoriteId: string,
        image?: string,
        cuisine?: string
    ) => void;
    onDeleteFavorite: (favoriteId: string) => void;
}

export default function FavoritesGrid({
    userId,
    onRecipeClick,
    onDeleteFavorite,
}: FavoritesGridProps) {
    const { data, isLoading, error } = db.useQuery({
        favorites: {
            $: { where: { "user.id": userId } },
            recipe: {
                $file: {},
            },
        },
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-100 border-t-orange-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12 text-rose-500 bg-rose-50 rounded-3xl border border-rose-100">
                <p className="font-bold">加载失败: {error.message}</p>
            </div>
        );
    }

    const favorites = data?.favorites || [];

    if (favorites.length === 0) {
        return (
            <div className="text-center py-24 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="w-24 h-24 bg-slate-50 rounded-full mx-auto mb-8 flex items-center justify-center">
                    <HeartIconMini className="w-12 h-12 text-slate-200" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">灵感库空空如也</h3>
                <p className="text-slate-500 mb-8 max-w-xs mx-auto">您的收藏夹还在等待着第一份美味灵感。快去首页探索吧！</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {favorites.map((fav) => {
                const imageUrl = fav.recipe?.$file?.url;
                const title = fav.recipe?.title || '未命名食谱';
                const cuisine = fav.recipe?.cuisine;
                const date = fav.createdAt ? new Date(fav.createdAt).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' }) : '';

                return (
                    <div
                        key={fav.id}
                        onClick={() => {
                            const recipeText = `**标题：** ${fav.recipe?.title}\n**材料:**\n${Array.isArray(fav.recipe?.ingredients)
                                ? fav.recipe.ingredients.map((ing: string) => `- ${ing}`).join("\n")
                                : fav.recipe?.ingredients || ''
                                }\n**步骤:**\n${fav.recipe?.instructions || ''}${fav.recipe?.tips ? `\n**小贴士:**\n${fav.recipe.tips}` : ""
                                }`;

                            onRecipeClick(recipeText, fav.id, imageUrl, cuisine);
                        }}
                        className="group relative bg-white rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 overflow-hidden cursor-pointer border border-slate-100 flex flex-col h-full transform hover:-translate-y-2"
                    >
                        {/* Image Section */}
                        <div className="relative h-56 w-full bg-slate-100 overflow-hidden">
                            {imageUrl ? (
                                <Image
                                    src={imageUrl}
                                    alt={title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-300">
                                    <svg className="w-16 h-16 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-xs font-bold uppercase tracking-widest">No Image</span>
                                </div>
                            )}

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/20 transition-colors duration-500" />

                            {/* Cuisine Badge */}
                            {cuisine && (
                                <div className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                                    {cuisine}
                                </div>
                            )}
                        </div>

                        {/* Content Section */}
                        <div className="p-6 flex flex-col flex-1">
                            <h3 className="text-xl font-black text-slate-900 mb-3 line-clamp-1 group-hover:text-orange-600 transition-colors duration-300">
                                {title}
                            </h3>

                            {/* Ingredients Preview */}
                            <div className="text-sm text-slate-500 mb-6 line-clamp-2 flex-1 leading-relaxed font-medium">
                                {Array.isArray(fav.recipe?.ingredients)
                                    ? fav.recipe?.ingredients.slice(0, 5).join('、') + (fav.recipe?.ingredients.length > 5 ? '...' : '')
                                    : '点击查看详情'}
                            </div>

                            <div className="flex items-center justify-between mt-auto">
                                <div className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    <ClockIcon className="w-3.5 h-3.5 mr-1.5 text-orange-500" />
                                    {date || 'Recent'}
                                </div>
                            </div>
                        </div>

                        {/* Delete Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeleteFavorite(fav.id);
                            }}
                            className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10 border border-slate-100"
                            title="删除收藏"
                        >
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}

function HeartIconMini({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
    )
}
