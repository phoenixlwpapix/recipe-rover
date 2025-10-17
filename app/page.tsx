"use client";

import { useState, useEffect } from "react";
import { db } from "../db/instant"; // 相对路径，从 app 到根 db
import { id } from "@instantdb/react";
import Login from "../components/Login"; // 从 app 到根 components
import FavoritesList from "../components/FavoritesList";
import RecipeDisplay from "../components/RecipeDisplay";
import IngredientsPanel from "../components/IngredientsPanel";
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
          )}。请根据中国菜的烹饪特点和风味来设计食谱。格式如下：
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
        alert("生成失败");
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
      await db.transact([
        db.tx.favorites[favoriteId].update({
          user: user.id,
          recipe: {
            title: parsedRecipe.title,
            ingredients: parsedRecipe.ingredients,
            instructions: parsedRecipe.instructions,
            tips: parsedRecipe.tips,
          },
        }),
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
      {/* 左侧栏 */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-black mb-8">Recipe Rover</h1>
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("ingredients")}
              className={`w-full text-left px-4 py-3 rounded-md font-medium ${
                activeTab === "ingredients"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              我的配料表
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              className={`w-full text-left px-4 py-3 rounded-md font-medium ${
                activeTab === "favorites"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              我的收藏
            </button>
          </nav>
        </div>
        <div className="p-6 border-t">
          <button
            onClick={() => db.auth.signOut()}
            className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            登出
          </button>
        </div>
      </div>

      {/* 右侧内容 */}
      <div className="flex-1 p-8">
        {activeTab === "ingredients" ? (
          <IngredientsPanel
            selectedIngredients={selectedIngredients}
            onToggleIngredient={toggleIngredient}
            onAddIngredient={() => {}}
            onDeleteIngredient={deleteIngredient}
            onGenerateRecipe={generateRecipe}
            loading={loading}
          />
        ) : (
          <FavoritesList
            userId={user.id}
            onRecipeClick={(recipeText) => setSelectedRecipe(recipeText)}
            onDeleteFavorite={deleteFavorite}
          />
        )}
        {recipe && activeTab === "ingredients" && (
          <RecipeDisplay recipe={recipe} onAddToFavorites={addToFavorites} />
        )}
        {selectedRecipe && activeTab === "favorites" && (
          <RecipeDisplay recipe={selectedRecipe} onAddToFavorites={() => {}} />
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
