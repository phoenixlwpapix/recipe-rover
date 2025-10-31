"use client";

import React, { useState } from "react";
import { db } from "../db/instant"; // 相对路径，从 components 到 db

export default function Login() {
  const [sentEmail, setSentEmail] = useState("");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-6 p-8 bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            欢迎来到食旅星球
          </h1>
          <p className="text-gray-600">探索全球美食，发现烹饪乐趣。</p>
          <p className="text-gray-600">加入我们，开始您的美食之旅！</p>
        </div>
        {!sentEmail ? (
          <EmailStep onSendEmail={setSentEmail} />
        ) : (
          <CodeStep sentEmail={sentEmail} />
        )}
      </div>
    </div>
  );
}

function EmailStep({ onSendEmail }: { onSendEmail: (email: string) => void }) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = inputRef.current!.value;
    try {
      await db.auth.sendMagicCode({ email });
      onSendEmail(email);
    } catch (err) {
      const error = err as { body?: { message?: string } };
      alert("错误：" + error.body?.message);
      onSendEmail("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        ref={inputRef}
        type="email"
        className="w-full border border-gray-300 px-3 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black transition duration-200"
        placeholder="your@email.com"
        required
        autoFocus
      />
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 font-medium transition duration-200"
      >
        发送验证码
      </button>
    </form>
  );
}

function CodeStep({ sentEmail }: { sentEmail: string }) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const code = inputRef.current!.value;
    try {
      await db.auth.signInWithMagicCode({ email: sentEmail, code });
      // 成功后，页面重载显示主页
    } catch (err) {
      inputRef.current!.value = "";
      const error = err as { body?: { message?: string } };
      alert("错误：" + error.body?.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-semibold text-center text-gray-800">
        输入验证码
      </h3>
      <p className="text-gray-600 text-center text-sm">
        验证码已发送至 <strong>{sentEmail}</strong>。请检查您的邮箱！
      </p>
      <input
        ref={inputRef}
        type="text"
        className="w-full border border-gray-300 px-3 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black transition duration-200"
        placeholder="123456"
        required
        autoFocus
        maxLength={6}
      />
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 font-medium transition duration-200"
      >
        验证并登录
      </button>
    </form>
  );
}
