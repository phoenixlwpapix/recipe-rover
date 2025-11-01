"use client";

import { useState } from "react";
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
  // const [savedRecipeId, setSavedRecipeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<"manual" | "random" | null>(
    null
  );
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCuisine, setSelectedCuisine] = useState("中国菜");
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const user = db.useUser();

  const { data: ingredientsData } = db.useQuery({
    ingredients: {
      $: { where: { userId: user?.id } },
    },
  });

  const ingredients = ingredientsData?.ingredients || [];

  const toggleIngredient = (ingredientName: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredientName)
        ? prev.filter((i) => i !== ingredientName)
        : [...prev, ingredientName]
    );
  };

  const clearSelectedIngredients = () => {
    setSelectedIngredients([]);
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

  const generateRecipe = async (
    forcedIngredients?: string[],
    type: "manual" | "random" = "manual"
  ) => {
    const ingredientsToUse = forcedIngredients || selectedIngredients;
    if (ingredientsToUse.length === 0) {
      alert("请先选择食材");
      return;
    }
    setLoading(true);
    setLoadingType(type);
    try {
      const prompt = `你是一位经验丰富的家庭厨师，擅长用简单食材制作美味家常菜。请使用这些食材生成一个${selectedCuisine}风格的家常菜谱：${ingredientsToUse.join(
        ", "
      )}。请注重实用性、营养均衡和简单易做，整个菜谱中不要加入任何拼音或英文。格式如下：
**标题：** [食谱标题]
**材料:**
- [材料1]
- [材料2]
...
**步骤:**
1. [步骤1]
2. [步骤2]
3. [步骤3]
...
**小贴士:**
[一些实用的烹饪小贴士]`;

      console.log("发送的提示词:", prompt);

      const res = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients: ingredientsToUse,
          cuisine: selectedCuisine,
          prompt,
        }),
      });
      const data = await res.json();
      if (data.recipe) {
        setRecipe(data.recipe);
        // Scroll to recipe section after generation
        setTimeout(() => {
          const recipeElement = document.querySelector("[data-recipe-display]");
          if (recipeElement) {
            recipeElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }, 100);
        // TODO: 实现保存食谱逻辑
        console.log("食谱生成成功:", data.recipe);
      } else {
        alert("生成失败: " + (data.error || "未知错误"));
      }
    } catch (error) {
      alert("错误：" + error);
    }
    setLoading(false);
    setLoadingType(null);
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
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* 移动端汉堡菜单按钮 */}
      <div className="md:hidden fixed top-6 left-6 z-20">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-white/20"
        >
          <svg
            className="w-6 h-6 text-slate-700"
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
          className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* 左侧栏 - 桌面端固定，移动端抽屉 */}
      <div
        className={`
        fixed left-0 top-0 h-full z-40 transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:z-10 md:sticky md:top-0 md:h-screen
      `}
      >
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            if (tab === "ingredients") {
              setIsMobileMenuOpen(false); // 移动端切换到配料表时关闭菜单
            }
          }}
          onRecipeClick={(recipeText: string, favoriteId: string) => {
            setSelectedRecipe(recipeText);
            setSelectedRecipeId(favoriteId);
            setActiveTab("favorites"); // 切换到收藏标签页显示详情
            setIsMobileMenuOpen(false); // 移动端选择食谱后关闭菜单
            // 滚动到页面顶部
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onDeleteFavorite={deleteFavorite}
          selectedFavoriteId={selectedRecipeId || undefined}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </div>

      {/* 右侧内容 */}
      <div className="flex-1 p-0 pt-20 md:pt-8 md:p-8 md:overflow-y-auto flex flex-col min-h-screen">
        {activeTab === "ingredients" ? (
          <IngredientsPanel
            selectedIngredients={selectedIngredients}
            onToggleIngredient={toggleIngredient}
            onDeleteIngredient={deleteIngredient}
            onGenerateRecipe={generateRecipe}
            loadingType={loadingType || undefined}
            onClearSelectedIngredients={clearSelectedIngredients}
            loading={loading}
            selectedCuisine={selectedCuisine}
            onCuisineChange={setSelectedCuisine}
            ingredients={ingredients}
          />
        ) : selectedRecipe ? (
          <RecipeDisplay
            recipe={selectedRecipe}
            onDeleteFavorite={deleteFavorite}
            favoriteId={selectedRecipeId || undefined}
            onAddToFavorites={addToFavorites}
          />
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">
                选择收藏的食谱
              </h3>
              <p className="text-slate-500">
                请从左侧选择一个收藏的食谱查看详情
              </p>
            </div>
          </div>
        )}
        {loading && activeTab === "ingredients" && <RecipeSkeleton />}
        {recipe && !loading && activeTab === "ingredients" && (
          <div data-recipe-display>
            <RecipeDisplay recipe={recipe} onAddToFavorites={addToFavorites} />
          </div>
        )}

        {/* Footer */}
        <footer className="mt-auto pt-8 border-t border-slate-200">
          <div className="text-center text-slate-500 text-sm">
            <p>© 2025 食旅星球. Made with ❤️ for food lovers.</p>
          </div>
        </footer>
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
