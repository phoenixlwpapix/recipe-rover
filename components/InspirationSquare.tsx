import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { db } from '../db/instant';
import { ClockIcon, UserIcon, SparklesIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface InspirationSquareProps {
    userId?: string;
    onRecipeClick: (
        recipeText: string,
        sharedId: string,
        image?: string,
        cuisine?: string,
        sharerEmail?: string,
        isOwn?: boolean
    ) => void;
    onUnshare?: (shareId: string) => void;
}

const ITEMS_PER_PAGE = 12;

export default function InspirationSquare({ userId, onRecipeClick, onUnshare }: InspirationSquareProps) {
    const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    // 查询所有分享的食谱，按分享时间倒序
    const { data, isLoading, error } = db.useQuery({
        sharedRecipes: {
            recipe: {
                $file: {},
            },
            user: {},
        },
    });

    // 按分享时间排序
    const allSharedRecipes = (data?.sharedRecipes || []).sort(
        (a, b) => (b.sharedAt || 0) - (a.sharedAt || 0)
    );

    const displayedRecipes = allSharedRecipes.slice(0, displayCount);
    const hasMore = displayCount < allSharedRecipes.length;

    // 无限滚动处理
    const handleLoadMore = useCallback(() => {
        if (isLoadingMore || !hasMore) return;
        setIsLoadingMore(true);
        setTimeout(() => {
            setDisplayCount((prev) => Math.min(prev + ITEMS_PER_PAGE, allSharedRecipes.length));
            setIsLoadingMore(false);
        }, 300);
    }, [isLoadingMore, hasMore, allSharedRecipes.length]);

    // Intersection Observer 实现无限滚动
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
                    handleLoadMore();
                }
            },
            { threshold: 0.1 }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    }, [handleLoadMore, hasMore, isLoadingMore]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-100 border-t-purple-500"></div>
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

    if (allSharedRecipes.length === 0) {
        return (
            <div className="text-center py-24 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-full mx-auto mb-8 flex items-center justify-center">
                    <SparklesIcon className="w-12 h-12 text-purple-300" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">广场还是空的</h3>
                <p className="text-slate-500 mb-8 max-w-xs mx-auto">
                    还没有人分享食谱。去收藏夹分享你的第一份美味灵感吧！
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* 食谱网格 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {displayedRecipes.map((shared) => {
                    const recipe = shared.recipe;
                    const imageUrl = recipe?.$file?.url;
                    const title = recipe?.title || '未命名食谱';
                    const cuisine = recipe?.cuisine;
                    const sharerEmail = shared.user?.email;
                    const sharerId = shared.user?.id;
                    const isOwn = userId && sharerId === userId;
                    const sharedDate = shared.sharedAt
                        ? new Date(shared.sharedAt).toLocaleDateString('zh-CN', {
                            month: 'long',
                            day: 'numeric',
                        })
                        : '';

                    return (
                        <div
                            key={shared.id}
                            onClick={() => {
                                const recipeText = `**标题：** ${recipe?.title}\n**材料:**\n${Array.isArray(recipe?.ingredients)
                                    ? recipe.ingredients.map((ing: string) => `- ${ing}`).join('\n')
                                    : recipe?.ingredients || ''
                                    }\n**步骤:**\n${recipe?.instructions || ''}${recipe?.tips ? `\n**小贴士:**\n${recipe.tips}` : ''
                                    }`;
                                onRecipeClick(recipeText, shared.id, imageUrl, cuisine, sharerEmail, !!isOwn);
                            }}
                            className="group relative bg-white rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-purple-100/50 transition-all duration-500 overflow-hidden cursor-pointer border border-slate-100 flex flex-col h-full transform hover:-translate-y-2"
                        >
                            {/* Unshare button for own shares */}
                            {isOwn && onUnshare && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onUnshare(shared.id);
                                    }}
                                    className="absolute top-4 right-4 z-20 p-2.5 bg-white/90 backdrop-blur-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 border border-slate-100"
                                    title="取消分享"
                                >
                                    <XMarkIcon className="w-4 h-4" />
                                </button>
                            )}
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
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 text-slate-300">
                                        <svg
                                            className="w-16 h-16 mb-2 opacity-50"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1}
                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                        <span className="text-xs font-bold uppercase tracking-widest">No Image</span>
                                    </div>
                                )}

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/20 transition-colors duration-500" />

                                {/* Cuisine Badge */}
                                {cuisine && (
                                    <div className="absolute top-4 left-4 bg-purple-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                                        {cuisine}
                                    </div>
                                )}

                                {/* Own badge */}
                                {isOwn && (
                                    <div className="absolute bottom-4 left-4 bg-indigo-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                                        我的分享
                                    </div>
                                )}
                            </div>

                            {/* Content Section */}
                            <div className="p-6 flex flex-col flex-1">
                                <h3 className="text-xl font-black text-slate-900 mb-3 line-clamp-1 group-hover:text-purple-600 transition-colors duration-300">
                                    {title}
                                </h3>

                                {/* Description or Ingredients Preview */}
                                <div className="text-sm text-slate-500 mb-6 line-clamp-2 flex-1 leading-relaxed font-medium">
                                    {shared.description ||
                                        (Array.isArray(recipe?.ingredients)
                                            ? recipe?.ingredients.slice(0, 5).join('、') +
                                            (recipe?.ingredients.length > 5 ? '...' : '')
                                            : '点击查看详情')}
                                </div>

                                <div className="flex items-center justify-between mt-auto">
                                    {/* Sharer Info */}
                                    <div className="flex items-center text-xs font-medium text-slate-400">
                                        <UserIcon className="w-3.5 h-3.5 mr-1.5 text-purple-400" />
                                        <span className="truncate max-w-[100px]">
                                            {sharerEmail?.split('@')[0] || '匿名用户'}
                                        </span>
                                    </div>

                                    {/* Date */}
                                    <div className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        <ClockIcon className="w-3.5 h-3.5 mr-1.5 text-purple-500" />
                                        {sharedDate || 'Recent'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Load More Trigger */}
            {hasMore && (
                <div ref={loadMoreRef} className="flex justify-center py-8">
                    {isLoadingMore ? (
                        <div className="flex items-center gap-3 text-slate-500">
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-slate-200 border-t-purple-500"></div>
                            <span className="text-sm font-medium">加载更多...</span>
                        </div>
                    ) : (
                        <div className="text-sm text-slate-400 font-medium">向下滚动加载更多</div>
                    )}
                </div>
            )}

            {/* End of List */}
            {!hasMore && allSharedRecipes.length > ITEMS_PER_PAGE && (
                <div className="text-center py-8">
                    <div className="inline-flex items-center gap-2 text-sm text-slate-400 font-medium bg-slate-50 px-6 py-3 rounded-full">
                        <SparklesIcon className="w-4 h-4 text-purple-400" />
                        已展示全部 {allSharedRecipes.length} 个分享
                    </div>
                </div>
            )}
        </div>
    );
}
