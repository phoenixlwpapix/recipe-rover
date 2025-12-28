"use client";

import React, { useEffect } from "react";
import { CheckCircleIcon, XCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface ToastProps {
    isOpen: boolean;
    type: "success" | "error" | "loading";
    title: string;
    message?: string;
    onClose: () => void;
    autoClose?: boolean;
    autoCloseDelay?: number;
}

function Toast({
    isOpen,
    type,
    title,
    message,
    onClose,
    autoClose = true,
    autoCloseDelay = 3000,
}: ToastProps) {
    useEffect(() => {
        if (isOpen && autoClose && type !== "loading") {
            const timer = setTimeout(() => {
                onClose();
            }, autoCloseDelay);
            return () => clearTimeout(timer);
        }
    }, [isOpen, autoClose, autoCloseDelay, onClose, type]);

    if (!isOpen) return null;

    const iconMap = {
        success: <CheckCircleIcon className="w-6 h-6 text-green-500" />,
        error: <XCircleIcon className="w-6 h-6 text-red-500" />,
        loading: (
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        ),
    };

    const bgColorMap = {
        success: "bg-green-50 border-green-200",
        error: "bg-red-50 border-red-200",
        loading: "bg-blue-50 border-blue-200",
    };

    return (
        <div className="fixed top-6 right-6 z-50 animate-slide-in">
            <div
                className={`flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg border ${bgColorMap[type]} backdrop-blur-sm min-w-[280px] max-w-[400px]`}
            >
                <div className="flex-shrink-0 mt-0.5">{iconMap[type]}</div>
                <div className="flex-1">
                    <p className="font-semibold text-slate-800">{title}</p>
                    {message && (
                        <p className="text-sm text-slate-600 mt-0.5">{message}</p>
                    )}
                </div>
                {type !== "loading" && (
                    <button
                        onClick={onClose}
                        className="flex-shrink-0 p-1 hover:bg-slate-200/50 rounded-lg transition-colors"
                    >
                        <XMarkIcon className="w-4 h-4 text-slate-500" />
                    </button>
                )}
            </div>
        </div>
    );
}

export default Toast;
