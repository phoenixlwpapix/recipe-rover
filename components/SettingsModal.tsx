"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { db } from "../db/instant";
import { Mail, LogOut, Camera, X, Loader2 } from "lucide-react";

interface InstantUser {
    id: string;
    email?: string | null;
}

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: InstantUser | null | undefined;
    onLogout: () => void;
}

export default function SettingsModal({ isOpen, onClose, user, onLogout }: SettingsModalProps) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Get user data with avatar link
    const { data } = db.useQuery({
        $users: {
            $: { where: { id: user?.id } },
            $file: {},
        },
    });

    const currentUser = data?.$users?.[0];
    const avatarUrl = currentUser?.$file?.url;
    const userInitial = user?.email?.[0]?.toUpperCase() || "U";

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user?.id) return;

        setIsUploading(true);
        try {
            const timestamp = Date.now();
            const path = `${user.id}/avatars/${timestamp}_${file.name}`;

            // Upload file to InstantDB Storage
            const { data: uploadData } = await db.storage.uploadFile(path, file);

            if (uploadData?.id) {
                // Link the uploaded file to the user as avatar
                await db.transact([
                    db.tx.$users[user.id].link({ $file: uploadData.id }),
                ]);
            }
        } catch (error) {
            console.error("Failed to upload avatar:", error);
            alert("上传头像失败，请稍后重试");
        } finally {
            setIsUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fadeIn"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-scaleIn border border-slate-100">
                {/* Header */}
                <div className="p-8 pb-4 flex justify-between items-center">
                    <h2 className="text-2xl font-black text-slate-900">个人设置</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="px-8 pb-8 space-y-8">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center text-3xl font-black text-orange-600 overflow-hidden border-4 border-white shadow-xl relative">
                                {avatarUrl ? (
                                    <Image src={avatarUrl} alt="Avatar" fill className="object-cover" sizes="96px" />
                                ) : (
                                    userInitial
                                )}

                                {isUploading && (
                                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                                        <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="absolute -bottom-2 -right-2 w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all group-hover:bg-orange-600"
                            >
                                <Camera className="w-5 h-5" />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>
                        <p className="text-sm font-bold text-slate-500">点击相机图标更换头像</p>
                    </div>

                    {/* Info Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                <Mail className="w-5 h-5 text-slate-400" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">当前账号</p>
                                <p className="text-slate-900 font-bold">{user?.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-slate-100">
                        <button
                            onClick={() => {
                                onLogout();
                                onClose();
                            }}
                            className="w-full flex items-center justify-center gap-3 p-4 bg-rose-50 text-rose-600 font-bold rounded-2xl hover:bg-rose-100 transition-all group overflow-hidden relative"
                        >
                            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            退出登录
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
