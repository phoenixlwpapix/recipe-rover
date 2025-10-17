"use client";

import React, { useState } from "react";
import { db } from "../db/instant"; // 相对路径，从 components 到 db

export default function Login() {
  const [sentEmail, setSentEmail] = useState("");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="max-w-sm w-full space-y-4 p-6 bg-white rounded-lg shadow">
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
      <h2 className="text-2xl font-bold text-center text-black">
        登录食旅星球
      </h2>
      <p className="text-gray-700 text-center text-sm">
        输入邮箱，我们发送验证码（无账户将自动创建）。
      </p>
      <input
        ref={inputRef}
        type="email"
        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        placeholder="your@email.com"
        required
        autoFocus
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 font-medium"
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
      <h2 className="text-2xl font-bold text-center text-black">输入验证码</h2>
      <p className="text-gray-700 text-center text-sm">
        已发送到 <strong>{sentEmail}</strong>。检查邮箱！
      </p>
      <input
        ref={inputRef}
        type="text"
        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        placeholder="123456"
        required
        autoFocus
        maxLength={6}
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 font-medium"
      >
        验证并登录
      </button>
    </form>
  );
}
