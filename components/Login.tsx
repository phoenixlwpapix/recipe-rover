"use client";

import React, { useState } from "react";
import { db } from "../db/instant";
import { Mail, ShieldCheck, ArrowRight, Utensils, Loader2, ArrowLeft } from "lucide-react";

export default function Login({ onBack }: { onBack?: () => void }) {
  const [sentEmail, setSentEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] relative overflow-hidden px-4">
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          返回首页
        </button>
      )}
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-100/50 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10">
        {/* Logo and Brand */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-orange-200 mb-6 group hover:rotate-6 transition-transform">
            <Utensils className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            欢迎回来
          </h1>
          <p className="text-slate-500 mt-2 font-medium">进入食旅星球，开启您的味蕾之旅</p>
        </div>

        {/* Card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-slate-200/50 border border-white">
          {!sentEmail ? (
            <EmailStep onSendEmail={setSentEmail} isLoading={isLoading} setIsLoading={setIsLoading} />
          ) : (
            <CodeStep sentEmail={sentEmail} onReset={() => setSentEmail("")} />
          )}
        </div>

        {/* Footer info */}
        <p className="text-center text-slate-400 text-sm mt-8 px-8">
          点击“继续”即表示您同意我们的 <a href="#" className="text-slate-600 hover:text-orange-600 font-medium underline-offset-4 underline">服务条款</a> 和 <a href="#" className="text-slate-600 hover:text-orange-600 font-medium underline-offset-4 underline">隐私政策</a>
        </p>
      </div>
    </div>
  );
}

function EmailStep({
  onSendEmail,
  isLoading,
  setIsLoading
}: {
  onSendEmail: (email: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = inputRef.current!.value;
    setIsLoading(true);
    try {
      await db.auth.sendMagicCode({ email });
      onSendEmail(email);
    } catch (err) {
      const error = err as { body?: { message?: string } };
      alert("发送验证码失败: " + (error.body?.message || "未知错误"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-bold text-slate-700 ml-1">
          电子邮箱
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-orange-600 transition-colors">
            <Mail className="w-5 h-5" />
          </div>
          <input
            id="email"
            ref={inputRef}
            type="email"
            className="w-full bg-slate-50/50 border border-slate-200 pl-11 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500/50 text-slate-900 font-medium transition-all duration-300"
            placeholder="name@company.com"
            required
            autoFocus
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-orange-600 text-white py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-orange-700 active:scale-[0.98] transition-all shadow-xl shadow-orange-600/20 disabled:opacity-70 disabled:cursor-not-allowed group"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            发送登录码
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
    </form>
  );
}

function CodeStep({ sentEmail, onReset }: { sentEmail: string; onReset: () => void }) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const performLogin = async (verificationCode: string) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await db.auth.signInWithMagicCode({ email: sentEmail, code: verificationCode });
    } catch (err) {
      setCode(""); // Clear on error
      const error = err as { body?: { message?: string } };
      alert("验证码错误: " + (error.body?.message || "请重新检查您的验证码"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow digits
    if (value.length <= 6) {
      setCode(value);
      if (value.length === 6) {
        performLogin(value);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (code.length === 6) {
      performLogin(code);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-50 rounded-xl text-indigo-600 mb-2">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">验证您的身份</h3>
        <p className="text-slate-500 text-sm">
          六位验证码已发送至 <span className="text-slate-900 font-bold">{sentEmail}</span>
        </p>
      </div>

      <div className="relative group">
        <input
          type="text"
          value={code}
          onChange={handleChange}
          className="w-full bg-slate-50/50 border border-slate-200 px-4 py-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500/50 text-slate-900 text-center text-2xl font-black tracking-[0.5em] transition-all duration-300"
          placeholder="000000"
          required
          autoFocus
          maxLength={6}
          inputMode="numeric"
          autoComplete="one-time-code"
          disabled={isLoading}
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[1px] rounded-2xl">
            <Loader2 className="w-6 h-6 text-orange-600 animate-spin" />
          </div>
        )}
      </div>

      <div className="space-y-3">
        <button
          type="submit"
          disabled={isLoading || code.length !== 6}
          className="w-full bg-slate-900 text-white py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 active:scale-[0.98] transition-all shadow-xl shadow-slate-900/10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "验证并登录"}
        </button>
        <button
          type="button"
          onClick={onReset}
          disabled={isLoading}
          className="w-full bg-white text-slate-600 py-3 px-6 rounded-2xl font-bold hover:bg-slate-50 transition-all border border-slate-100 disabled:opacity-50"
        >
          返回修改邮箱
        </button>
      </div>
    </form>
  );
}
