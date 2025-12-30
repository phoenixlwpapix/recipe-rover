"use client";

import React from "react";
import { ArrowRight, Utensils, Sparkles, Globe, Heart } from "lucide-react";
import Image from "next/image";
import Footer from "./Footer";


interface LandingPageProps {
    onGetStarted: () => void;
    onNavigateToInspiration: () => void;
}

export default function LandingPage({ onGetStarted, onNavigateToInspiration }: LandingPageProps) {
    return (
        <div className="min-h-screen bg-white overflow-hidden">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 md:h-20">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
                                <Utensils className="text-white w-6 h-6" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                                食旅星球 <span className="text-orange-600">Recipe Rover</span>
                            </span>
                        </div>
                        <div className="hidden md:flex items-center gap-8">
                            <button
                                onClick={onNavigateToInspiration}
                                className="text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors"
                            >
                                灵感广场
                            </button>
                            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors">功能特性</a>
                            <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors">运作方式</a>
                            <button
                                onClick={onGetStarted}
                                className="px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
                            >
                                立即开始
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-50 rounded-full blur-3xl opacity-60 translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-50 rounded-full blur-3xl opacity-60 -translate-x-1/2 translate-y-1/2"></div>
                </div>

                <div className="max-w-7xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-full text-sm font-bold mb-8 animate-fadeIn">
                        <Sparkles className="w-4 h-4" />
                        <span>AI 驱动的个性化烹饪助手</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-[1.1]">
                        让每一口食材，<br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-600">
                            都开启一段全球美味旋律
                        </span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 mb-10 leading-relaxed">
                        食旅星球利用先进的人工智能，根据你厨里现有的食材，定制全球各地的精选菜谱。不仅仅是烹饪，更是一场足不出户的味蕾环球旅行。
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={onGetStarted}
                            className="w-full sm:w-auto px-8 py-4 bg-orange-600 text-white font-bold rounded-2xl hover:bg-orange-700 transition-all hover:translate-y-[-2px] hover:shadow-2xl hover:shadow-orange-200 active:scale-95 flex items-center justify-center gap-2 group"
                        >
                            免费开始使用
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all active:scale-95">
                            了解更多
                        </button>
                    </div>



                    {/* Hero Image Area */}
                    <div className="mt-16 md:mt-24 relative max-w-5xl mx-auto perspective-1000">
                        <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200 border-[6px] border-white ring-1 ring-slate-200/50 transform transition-all duration-700 hover:scale-[1.02] hover:shadow-orange-200/50 bg-white">
                            <Image
                                src="/landing-hero.png"
                                alt="Recipe Rover App Interface"
                                width={1200}
                                height={800}
                                className="w-full h-auto object-cover bg-slate-50"
                                priority
                            />

                            {/* Subtle overlay gradient for depth */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 to-transparent pointer-events-none" />
                        </div>

                        {/* Floating Badge - Left */}
                        <div className="absolute -bottom-8 -left-4 md:bottom-12 md:-left-12 bg-white/90 backdrop-blur-xl p-4 md:p-5 rounded-3xl shadow-xl shadow-slate-200/50 border border-white/60 animate-bounce-slow hidden md:block">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 shadow-sm">
                                    <Sparkles className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-extrabold uppercase tracking-wider mb-0.5">AI Analysis</p>
                                    <p className="text-base font-bold text-slate-800">Perfect Match!</p>
                                </div>
                            </div>
                        </div>

                        {/* Floating Badge - Right */}
                        <div className="absolute top-12 -right-4 md:top-20 md:-right-8 bg-white/90 backdrop-blur-xl p-4 rounded-3xl shadow-xl shadow-slate-200/50 border border-white/60 animate-bounce-slow hidden md:block" style={{ animationDelay: '1s' }}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-600">
                                    <Heart className="w-5 h-5 fill-orange-600" />
                                </div>
                                <div className="pr-2">
                                    <p className="text-sm font-bold text-slate-800">Saved to Favorites</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">超越传统的菜谱推荐</h2>
                        <p className="text-slate-600 font-medium">我们重新定义了厨房里的 AI 体验</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Sparkles className="w-8 h-8 text-orange-600" />,
                                title: "智能食材匹配",
                                desc: "只需要在库里点选现有食材，AI 即可瞬间为您定制专属菜谱，减少食物浪费。"
                            },
                            {
                                icon: <Globe className="w-8 h-8 text-indigo-600" />,
                                title: "全球口味融合",
                                desc: "从意式披萨到日式拉面，从经典中餐到地中海风味，体验不一样的异域美食之旅。"
                            },
                            {
                                icon: <Heart className="w-8 h-8 text-rose-600" />,
                                title: "精选收藏系统",
                                desc: "将尝试过的美味一键收藏，打造你的私人米其林菜谱库，随时随地查看。"
                            }
                        ].map((feature, i) => (
                            <div key={i} className="p-8 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:translate-y-[-8px] transition-all duration-300">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-slate-100 italic">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-4">
                <div className="max-w-5xl mx-auto bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
                    {/* Background circles */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>

                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 relative z-10">准备好开启您的美食之旅了吗？</h2>
                    <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto relative z-10">
                        加入数千名正在使用食旅星球的家庭厨师，探索每天都有新惊喜的烹饪生活。
                    </p>
                    <button
                        onClick={onGetStarted}
                        className="px-10 py-5 bg-white text-slate-900 font-extrabold rounded-2xl hover:bg-orange-50 transition-all hover:scale-105 active:scale-95 shadow-xl relative z-10"
                    >
                        立即探索
                    </button>
                </div>
            </section>

            <Footer />

            <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(3rem); }
          50% { transform: translateY(0); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 6s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
}
