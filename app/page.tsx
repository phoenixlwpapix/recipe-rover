"use client";

import { useState, useEffect } from "react";
import { db } from "../db/instant"; // 相对路径，从 app 到根 db
import { id } from "@instantdb/react";
import Login from "../components/Login"; // 从 app 到根 components
import RecipeDisplay from "../components/RecipeDisplay";
import RecipeSkeleton from "../components/RecipeSkeleton";
import IngredientsPanel from "../components/IngredientsPanel";
import Sidebar from "../components/Sidebar";
import ConfirmModal from "../components/ConfirmModal";
import { parseRecipe } from "../utils/recipeParser";

function SignedInContent() {
  const [activeTab, setActiveTab] = useState<"ingredients" | "favorites">(
    "ingredients"
  );
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [recipe, setRecipe] = useState("");
  const [savedRecipeId, setSavedRecipeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });
  const user = db.useUser();

  const toggleIngredient = (ingredientName: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredientName)
        ? prev.filter((i) => i !== ingredientName)
        : [...prev, ingredientName]
    );
  };

  const deleteIngredient = (ingredientId: string, ingredientName: string) => {
    setConfirmModal({
      isOpen: true,
      title: "删除食材",
      message: `确定要删除食材"${ingredientName}"吗？此操作无法撤销。`,
      onConfirm: async () => {
        try {
          await db.transact([db.tx.ingredients[ingredientId].delete()]);
          setSelectedIngredients((prev) =>
            prev.filter((i) => i !== ingredientName)
          );
          setConfirmModal({
            isOpen: false,
            title: "",
            message: "",
            onConfirm: () => {},
          });
        } catch (error) {
          console.error("删除食材失败:", error);
          alert("删除食材失败，请重试");
          setConfirmModal({
            isOpen: false,
            title: "",
            message: "",
            onConfirm: () => {},
          });
        }
      },
    });
  };

  const generateRecipe = async () => {
    if (selectedIngredients.length === 0) {
      alert("请先选择食材");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients: selectedIngredients,
          cuisine: "中国菜",
          prompt: `使用这些食材生成一个中国菜风格的详细食谱：${selectedIngredients.join(
            ", "
          )}。请根据中国菜的烹饪特点和风味来设计食谱，不要加入任何拼音或英文。格式如下：
**标题：** [食谱标题]
**Ingredients:**
- [材料1]
- [材料2]
...
**Method:**
1. [步骤1]
2. [步骤2]
3. [步骤3]
...
**Tips:**
[一些实用的烹饪小贴士]`,
        }),
      });
      const data = await res.json();
      if (data.recipe) {
        setRecipe(data.recipe);
        // TODO: 实现保存食谱逻辑
        console.log("食谱生成成功:", data.recipe);
      } else {
        alert("生成失败: " + (data.error || "未知错误"));
      }
    } catch (error) {
      alert("错误：" + error);
    }
    setLoading(false);
  };

  const addToFavorites = async () => {
    console.log("开始收藏食谱");
    if (!user?.id) {
      alert("请先登录");
      return;
    }

    if (!recipe) {
      alert("没有食谱可以收藏");
      return;
    }

    try {
      const parsedRecipe = parseRecipe(recipe);
      const favoriteId = id();
      const recipeId = id();
      await db.transact([
        db.tx.recipes[recipeId].update({
          title: parsedRecipe.title,
          ingredients: parsedRecipe.ingredients,
          instructions: parsedRecipe.instructions,
          tips: parsedRecipe.tips,
          userId: user.id,
          createdAt: Date.now(),
        }),
        db.tx.favorites[favoriteId].update({
          createdAt: Date.now(),
        }),
        db.tx.favorites[favoriteId].link({ user: user.id }),
        db.tx.favorites[favoriteId].link({ recipe: recipeId }),
      ]);
      alert("收藏成功！");
      console.log("食谱收藏成功");
    } catch (error) {
      console.error("收藏失败:", error);
      alert("收藏失败，请重试");
    }
  };

  const deleteFavorite = async (favoriteId: string) => {
    setConfirmModal({
      isOpen: true,
      title: "删除收藏",
      message: "确定要删除这个收藏的食谱吗？此操作无法撤销。",
      onConfirm: async () => {
        try {
          await db.transact([db.tx.favorites[favoriteId].delete()]);
          setConfirmModal({
            isOpen: false,
            title: "",
            message: "",
            onConfirm: () => {},
          });
        } catch (error) {
          console.error("删除失败:", error);
          alert("删除失败，请重试");
          setConfirmModal({
            isOpen: false,
            title: "",
            message: "",
            onConfirm: () => {},
          });
        }
      },
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 移动端汉堡菜单按钮 */}
      <div className="md:hidden fixed top-4 left-4 z-20">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-white rounded-md shadow-lg"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                isMobileMenuOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>
      </div>

      {/* 移动端遮罩 */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* 左侧栏 - 桌面端固定，移动端抽屉 */}
      <div
        className={`
        fixed left-0 top-0 h-full z-40 transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static md:z-10
      `}
      >
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setIsMobileMenuOpen(false); // 移动端切换标签后关闭菜单
          }}
          onRecipeClick={(recipeText: string) => {
            setSelectedRecipe(recipeText);
            setIsMobileMenuOpen(false); // 移动端选择食谱后关闭菜单
          }}
          onDeleteFavorite={deleteFavorite}
        />
      </div>

      {/* 右侧内容 */}
      <div className="flex-1 md:ml-64 p-8 pt-16 md:pt-8">
        {activeTab === "ingredients" ? (
          <IngredientsPanel
            selectedIngredients={selectedIngredients}
            onToggleIngredient={toggleIngredient}
            onAddIngredient={() => {}}
            onDeleteIngredient={deleteIngredient}
            onGenerateRecipe={generateRecipe}
            loading={loading}
          />
        ) : selectedRecipe ? (
          <RecipeDisplay recipe={selectedRecipe} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              请从左侧选择一个收藏的食谱查看详情
            </p>
          </div>
        )}
        {loading && activeTab === "ingredients" && <RecipeSkeleton />}
        {recipe && !loading && activeTab === "ingredients" && (
          <div>
            <RecipeDisplay recipe={recipe} />
            <div className="mt-4 text-center">
              <button
                onClick={addToFavorites}
                className="bg-yellow-500 text-white px-6 py-3 rounded-md hover:bg-yellow-600 font-medium transition-colors"
              >
                收藏食谱
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() =>
          setConfirmModal({
            isOpen: false,
            title: "",
            message: "",
            onConfirm: () => {},
          })
        }
      />
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <db.SignedIn>
        <SignedInContent />
      </db.SignedIn>
      <db.SignedOut>
        <Login />
      </db.SignedOut>
    </main>
  );
}
