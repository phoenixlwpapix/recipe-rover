import React from 'react';
import Image from 'next/image';
import { Sparkles, Heart, Utensils } from 'lucide-react';
import { db } from '../db/instant';

interface InstantUser {
    id: string;
    email?: string | null;
}

interface NavbarProps {
    activeTab: 'ingredients' | 'favorites';
    onTabChange: (tab: 'ingredients' | 'favorites') => void;
    onOpenSettings: () => void;
    user: InstantUser | null | undefined;
}

export default function Navbar({ activeTab, onTabChange, onOpenSettings, user }: NavbarProps) {
    // Fetch user data for avatar
    const { data } = db.useQuery({
        $users: {
            $: { where: { id: user?.id } },
            $file: {},
        },
    });

    const avatarUrl = data?.$users?.[0]?.$file?.url;
    const userInitial = user?.email?.[0]?.toUpperCase() || "U";

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 md:h-20">
                    {/* Logo & Brand */}
                    <div
                        className="flex items-center cursor-pointer group"
                        onClick={() => onTabChange('ingredients')}
                    >
                        <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200 group-hover:rotate-6 transition-all duration-300">
                            <Utensils className="text-white w-6 h-6" />
                        </div>
                        <h1 className="ml-3 text-xl font-black text-slate-900 tracking-tight hidden sm:block">
                            食旅星球 <span className="text-orange-600">Recipe Rover</span>
                        </h1>
                    </div>

                    {/* Center Navigation */}
                    <div className="flex items-center gap-1 sm:gap-4 flex-1 justify-center max-w-md">
                        <button
                            onClick={() => onTabChange('ingredients')}
                            className={`flex items-center px-4 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 ${activeTab === 'ingredients'
                                ? 'bg-slate-900 text-white shadow-lg shadow-slate-200'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <Sparkles className={`w-4 h-4 mr-2 ${activeTab === 'ingredients' ? 'text-orange-400' : 'text-slate-400'}`} />
                            <span className="hidden sm:inline">灵感生成</span>
                            <span className="sm:hidden">生成</span>
                        </button>
                        <button
                            onClick={() => onTabChange('favorites')}
                            className={`flex items-center px-4 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 ${activeTab === 'favorites'
                                ? 'bg-slate-900 text-white shadow-lg shadow-slate-200'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <Heart className={`w-4 h-4 mr-2 ${activeTab === 'favorites' ? 'text-rose-400' : 'text-slate-400'}`} />
                            <span className="hidden sm:inline">我的收藏</span>
                            <span className="sm:hidden">收藏</span>
                        </button>
                    </div>

                    {/* Right Action - User Settings */}
                    <div className="flex items-center">
                        <button
                            onClick={onOpenSettings}
                            className="flex items-center gap-2 p-1.5 pr-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-100 transition-all duration-300 group"
                            title="用户设置"
                        >
                            <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold overflow-hidden shadow-sm relative">
                                {avatarUrl ? (
                                    <Image src={avatarUrl} alt="Avatar" fill className="object-cover" sizes="32px" />
                                ) : (
                                    userInitial
                                )}
                            </div>
                            <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors hidden md:block">
                                设置
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
