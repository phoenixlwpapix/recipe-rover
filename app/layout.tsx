import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "食旅星球 Recipe Rover - AI 驱动的全球美食探索",
  description: "食旅星球利用人工智能技术，根据您现有的食材为您定制全球各地的精选家常菜谱。让烹饪成为一场足不出户的全球味蕾旅行。",
  keywords: ["AI菜谱", "食谱生成器", "全球美食", "智能烹饪", "食旅星球", "Recipe Rover"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
