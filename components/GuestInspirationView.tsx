"use client";

import React, { useState } from "react";
import { Utensils, Globe, ArrowLeft } from "lucide-react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import InspirationSquare from "./InspirationSquare";
import RecipeDisplay from "./RecipeDisplay";
import Footer from "./Footer";

interface GuestInspirationViewProps {
    onLogin: () => void;
    onBack: () => void;
}

export default function GuestInspirationView({ onLogin, onBack }: GuestInspirationViewProps) {
    const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [recipeImage, setRecipeImage] = useState<string | undefined>(undefined);
    const [recipeCuisine, setRecipeCuisine] = useState<string | undefined>(undefined);
    const [sharerEmail, setSharerEmail] = useState<string | undefined>(undefined);

    const handleRecipeClick = (
        recipeText: string,
        sharedId: string,
        image?: string,
        cuisine?: string,
        email?: string
    ) => {
        setSelectedRecipe(recipeText);
        setSelectedId(sharedId);
        setRecipeImage(image);
        setRecipeCuisine(cuisine);
        setSharerEmail(email);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Guest Navbar */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 md:h-20">
                        {/* Logo & Brand */}
                        <div
                            className="flex items-center cursor-pointer group"
                            onClick={onBack}
                        >
                            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200 group-hover:rotate-6 transition-all duration-300">
                                <Utensils className="text-white w-6 h-6" />
                            </div>
                            <h1 className="ml-3 text-xl font-black text-slate-900 tracking-tight hidden sm:block">
                                食旅星球 <span className="text-orange-600">Recipe Rover</span>
                            </h1>
                        </div>

                        {/* Center - Current Tab */}
                        <div className="flex items-center gap-2">
                            <div className="flex items-center px-4 py-2.5 rounded-2xl text-sm font-bold bg-slate-900 text-white shadow-lg shadow-slate-200">
                                <Globe className="w-4 h-4 mr-2 text-purple-400" />
                                <span className="hidden sm:inline">灵感广场</span>
                                <span className="sm:hidden">广场</span>
                            </div>
                        </div>

                        {/* Right - Login Button */}
                        <div className="flex items-center">
                            <button
                                onClick={onLogin}
                                className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl transition-all duration-300 shadow-lg shadow-slate-200"
                            >
                                <span className="text-sm font-bold">登录 / 注册</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
                <div className="space-y-6">
                    {selectedRecipe ? (
                        // Detail View
                        <div className="animate-slide-in">
                            <button
                                onClick={() => setSelectedRecipe(null)}
                                className="flex items-center text-slate-500 hover:text-slate-800 transition-colors mb-6 group font-medium"
                            >
                                <div className="p-2 rounded-full bg-white border border-slate-200 mr-3 group-hover:border-slate-400 transition-colors shadow-sm">
                                    <ArrowLeftIcon className="w-5 h-5" />
                                </div>
                                返回灵感广场
                            </button>
                            {sharerEmail && (
                                <div className="mb-4 inline-flex items-center gap-2 text-sm text-purple-600 bg-purple-50 px-4 py-2 rounded-full font-medium">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    来自 {sharerEmail.split('@')[0]} 的分享
                                </div>
                            )}
                            <RecipeDisplay
                                recipe={selectedRecipe}
                                image={recipeImage}
                                cuisine={recipeCuisine}
                            />

                            {/* CTA for guest users */}
                            <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-100 text-center">
                                <p className="text-slate-600 mb-4">想要收藏这份食谱或分享您自己的创意？</p>
                                <button
                                    onClick={onLogin}
                                    className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all"
                                >
                                    立即登录 / 注册
                                </button>
                            </div>
                        </div>
                    ) : (
                        // Grid View
                        <div className="animate-fadeIn">
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-slate-800 mb-2">灵感广场</h2>
                                <p className="text-slate-500">发现来自社区的美味灵感</p>
                            </div>
                            <InspirationSquare
                                onRecipeClick={handleRecipeClick}
                            />
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
