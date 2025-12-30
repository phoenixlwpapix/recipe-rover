"use client";

import React from "react";
import { Utensils, Github, Twitter, Instagram, Mail, Heart } from "lucide-react";

interface FooterProps {
    onNavigate?: (tab: 'ingredients' | 'favorites' | 'square') => void;
}

export default function Footer({ onNavigate }: FooterProps) {
    return (
        <footer className="bg-white border-t border-slate-100 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
                                <Utensils className="text-white w-6 h-6" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                                食旅星球 <span className="text-orange-600">Recipe Rover</span>
                            </span>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                            利用 AI 技术为您定制全球美食灵感。让每一口食材，都开启一段美妙的环球味蕾旅行。
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-orange-600 hover:bg-orange-50 transition-all">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-orange-600 hover:bg-orange-50 transition-all">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-orange-600 hover:bg-orange-50 transition-all">
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-slate-900 font-bold mb-6 text-sm uppercase tracking-wider">产品</h3>
                        <ul className="space-y-4">
                            <li>
                                <button
                                    onClick={() => onNavigate?.('ingredients')}
                                    className="text-slate-500 hover:text-orange-600 transition-colors text-sm text-left"
                                >
                                    生成食谱
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => onNavigate?.('square')}
                                    className="text-slate-500 hover:text-orange-600 transition-colors text-sm text-left"
                                >
                                    灵感广场
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => onNavigate?.('favorites')}
                                    className="text-slate-500 hover:text-orange-600 transition-colors text-sm text-left"
                                >
                                    我的收藏
                                </button>
                            </li>
                            <li><a href="#" className="text-slate-500 hover:text-orange-600 transition-colors text-sm">高级会员</a></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-slate-900 font-bold mb-6 text-sm uppercase tracking-wider">资源</h3>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-slate-500 hover:text-orange-600 transition-colors text-sm">烹饪技巧</a></li>
                            <li><a href="#" className="text-slate-500 hover:text-orange-600 transition-colors text-sm">食材指南</a></li>
                            <li><a href="#" className="text-slate-500 hover:text-orange-600 transition-colors text-sm">常见问题</a></li>
                            <li><a href="#" className="text-slate-500 hover:text-orange-600 transition-colors text-sm">隐私政策</a></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-slate-900 font-bold mb-6 text-sm uppercase tracking-wider">订阅新鲜事</h3>
                        <p className="text-slate-500 text-sm mb-4">
                            订阅我们的周报，获取最新的美食灵感和功能更新。
                        </p>
                        <form className="relative group" onSubmit={(e) => e.preventDefault()}>
                            <label htmlFor="footer-email" className="sr-only">电子邮箱</label>
                            <input
                                id="footer-email"
                                type="email"
                                placeholder="输入您的邮箱"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-600 transition-all pr-12"
                            />
                            <button type="submit" className="absolute right-2 top-2 p-1.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                                <Mail className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-400 text-xs">
                        © {new Date().getFullYear()} Recipe Rover. All rights reserved.
                    </p>
                    <div className="flex items-center gap-1 text-slate-400 text-xs">
                        <span>Made with</span>
                        <Heart className="w-3 h-3 text-orange-600 fill-orange-600" />
                        <span>for home chefs global</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
