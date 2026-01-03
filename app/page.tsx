"use client";

import { useState } from "react";
import { db } from "../db/instant";
import { id } from "@instantdb/react";
import LandingPage from "../components/LandingPage";
import Login from "../components/Login";
import RecipeDisplay from "../components/RecipeDisplay";
import RecipeSkeleton from "../components/RecipeSkeleton";
import IngredientsPanel from "../components/IngredientsPanel";
import Navbar from "../components/Navbar";
import FavoritesGrid from "../components/FavoritesGrid";
import InspirationSquare from "../components/InspirationSquare";
import ConfirmModal from "../components/ConfirmModal";
import SettingsModal from "../components/SettingsModal";
import Toast from "../components/Toast";
import { parseRecipe } from "../utils/recipeParser";
import { base64ToFile } from "../utils/imageUtils";
import { ArrowLeftIcon, ShareIcon } from "@heroicons/react/24/outline";
import Footer from "../components/Footer";
import GuestInspirationView from "../components/GuestInspirationView";


function AppContent() {
  const [activeTab, setActiveTab] = useState<"ingredients" | "favorites" | "square">("ingredients");
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [recipe, setRecipe] = useState("");
  const [recipeImage, setRecipeImage] = useState<string | undefined>();
  const [imageLoading, setImageLoading] = useState(false);

  // States for generated recipe after saving
  const [generatedRecipeFavoriteId, setGeneratedRecipeFavoriteId] = useState<string | null>(null);
  const [generatedRecipeRecipeId, setGeneratedRecipeRecipeId] = useState<string | null>(null);
  const [generatedRecipeIsShared, setGeneratedRecipeIsShared] = useState(false);
  const [generatedRecipeShareId, setGeneratedRecipeShareId] = useState<string | undefined>(undefined);

  // States for Favorites View
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [selectedRecipeRecipeId, setSelectedRecipeRecipeId] = useState<string | null>(null);
  const [selectedRecipeCuisine, setSelectedRecipeCuisine] = useState<string | undefined>(undefined);
  const [selectedRecipeIsShared, setSelectedRecipeIsShared] = useState<boolean>(false);
  const [selectedRecipeShareId, setSelectedRecipeShareId] = useState<string | undefined>(undefined);

  // States for Inspiration Square
  const [squareSelectedRecipe, setSquareSelectedRecipe] = useState<string | null>(null);
  const [squareSelectedId, setSquareSelectedId] = useState<string | null>(null);
  const [squareRecipeImage, setSquareRecipeImage] = useState<string | undefined>(undefined);
  const [squareRecipeCuisine, setSquareRecipeCuisine] = useState<string | undefined>(undefined);
  const [squareSharerEmail, setSquareSharerEmail] = useState<string | undefined>(undefined);
  const [squareIsOwnShare, setSquareIsOwnShare] = useState<boolean>(false);

  // Common Loading States
  const [loading, setLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<"manual" | "random" | null>(null);
  const [selectedCuisine, setSelectedCuisine] = useState("中国菜");

  // Settings Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isIngredientEditMode, setIsIngredientEditMode] = useState(false);

  // UI States
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => { },
  });

  const [toast, setToast] = useState<{
    isOpen: boolean;
    type: "success" | "error" | "loading";
    title: string;
    message?: string;
  }>({
    isOpen: false,
    type: "success",
    title: "",
  });

  const user = db.useUser();

  const { data: ingredientsData } = db.useQuery({
    ingredients: {
      $: { where: { userId: user?.id || "guest" } },
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
            onConfirm: () => { },
          });
        } catch (error) {
          console.error("删除食材失败:", error);
          setToast({ isOpen: true, type: "error", title: "删除食材失败", message: "请重试" });
          setConfirmModal({
            isOpen: false,
            title: "",
            message: "",
            onConfirm: () => { },
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
        setRecipeImage(undefined); // 清除旧图片
        setImageLoading(true); // 开始加载图片
        // 重置收藏状态
        setGeneratedRecipeFavoriteId(null);
        setGeneratedRecipeRecipeId(null);
        setGeneratedRecipeIsShared(false);
        setGeneratedRecipeShareId(undefined);

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

        console.log("食谱生成成功:", data.recipe);

        // 异步生成图片
        const parsedRecipe = parseRecipe(data.recipe);

        // Extract top 5 ingredients
        const topIngredients = parsedRecipe.ingredients
          .split('\n')
          .filter(line => line.trim().match(/^[-*•]|\d+\./))
          .slice(0, 5)
          .map(line => line.replace(/^[-*•]|\d+\.\s*/, '').trim());

        fetch("/api/generate-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: parsedRecipe.title,
            ingredients: topIngredients,
            instructions: parsedRecipe.instructions
          }),
        })
          .then((imgRes) => imgRes.json())
          .then((imgData) => {
            if (imgData.image) {
              setRecipeImage(imgData.image);
            }
          })
          .catch((imgError) => {
            console.error("图片生成失败:", imgError);
          })
          .finally(() => {
            setImageLoading(false);
          });
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
      setToast({ isOpen: true, type: "error", title: "请先登录", message: "登录后才能收藏食谱" });
      return;
    }

    if (!recipe) {
      setToast({ isOpen: true, type: "error", title: "无法收藏", message: "没有食谱可以收藏" });
      return;
    }

    setToast({ isOpen: true, type: "loading", title: "正在收藏...", message: "请稍候" });

    try {
      const parsedRecipe = parseRecipe(recipe);
      const favoriteId = id();
      const recipeId = id();

      // 先创建食谱和收藏记录
      await db.transact([
        db.tx.recipes[recipeId].update({
          title: parsedRecipe.title,
          ingredients: parsedRecipe.ingredients,
          instructions: parsedRecipe.instructions,
          tips: parsedRecipe.tips,
          cuisine: selectedCuisine,
          userId: user.id,
          createdAt: Date.now(),
        }),
        db.tx.favorites[favoriteId].update({
          createdAt: Date.now(),
        }),
        db.tx.favorites[favoriteId].link({ user: user.id }),
        db.tx.favorites[favoriteId].link({ recipe: recipeId }),
      ]);

      // 如果有图片，上传到 InstantDB Storage 并关联到食谱
      if (recipeImage && recipeImage.startsWith("data:")) {
        setToast({ isOpen: true, type: "loading", title: "正在上传图片...", message: "请稍候" });
        try {
          const timestamp = Date.now();
          const imagePath = `${user.id}/recipes/${recipeId}_${timestamp}.png`;
          const imageFile = base64ToFile(recipeImage, `recipe_${recipeId}.png`);

          const { data: uploadData } = await db.storage.uploadFile(imagePath, imageFile, {
            contentType: "image/png",
          });

          if (uploadData?.id) {
            await db.transact([
              db.tx.recipes[recipeId].link({ $file: uploadData.id }),
            ]);
          }
          console.log("图片上传成功:", imagePath);
        } catch (imageError) {
          console.error("图片上传失败:", imageError);
        }
      }

      // 更新生成菜谱的收藏状态
      setGeneratedRecipeFavoriteId(favoriteId);
      setGeneratedRecipeRecipeId(recipeId);
      setToast({ isOpen: true, type: "success", title: "收藏成功！", message: "食谱已添加到收藏夹" });
    } catch (error) {
      console.error("收藏失败:", error);
      setToast({ isOpen: true, type: "error", title: "收藏失败", message: "请重试" });
    }
  };

  const deleteFavorite = async (favoriteId: string, shareId?: string) => {
    setConfirmModal({
      isOpen: true,
      title: "删除收藏",
      message: shareId
        ? "确定要删除这个收藏的食谱吗？该食谱也会从灵感广场撤下。此操作无法撤销。"
        : "确定要删除这个收藏的食谱吗？此操作无法撤销。",
      onConfirm: async () => {
        try {
          // Delete favorite record
          await db.transact([db.tx.favorites[favoriteId].delete()]);

          // Also delete share record if exists
          if (shareId) {
            await db.transact([db.tx.sharedRecipes[shareId].delete()]);
          }

          // If we were viewing this recipe, go back to grid
          if (selectedRecipeId === favoriteId) {
            setSelectedRecipe(null);
            setSelectedRecipeId(null);
          }

          // Reset generated recipe favorite state if applicable
          if (generatedRecipeFavoriteId === favoriteId) {
            setGeneratedRecipeFavoriteId(null);
            setGeneratedRecipeRecipeId(null);
            setGeneratedRecipeIsShared(false);
            setGeneratedRecipeShareId(undefined);
          }

          setConfirmModal({
            isOpen: false,
            title: "",
            message: "",
            onConfirm: () => { },
          });
          setToast({ isOpen: true, type: "success", title: "删除成功", message: "食谱已删除" });
        } catch (error) {
          console.error("删除失败:", error);
          setToast({ isOpen: true, type: "error", title: "删除失败", message: "请重试" });
          setConfirmModal({
            isOpen: false,
            title: "",
            message: "",
            onConfirm: () => { },
          });
        }
      },
    });
  };

  // Handler for clicking a recipe in the Favorites Grid
  const handleFavoriteClick = (
    recipeText: string,
    favoriteId: string,
    recipeId: string,
    image?: string,
    cuisine?: string,
    isShared?: boolean,
    shareId?: string
  ) => {
    setSelectedRecipe(recipeText);
    setSelectedRecipeId(favoriteId);
    setSelectedRecipeRecipeId(recipeId);
    setRecipeImage(image);
    setSelectedRecipeCuisine(cuisine);
    setSelectedRecipeIsShared(isShared || false);
    setSelectedRecipeShareId(shareId);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handler for clicking a recipe in the Inspiration Square
  const handleSquareRecipeClick = (
    recipeText: string,
    sharedId: string,
    image?: string,
    cuisine?: string,
    sharerEmail?: string,
    isOwn?: boolean
  ) => {
    setSquareSelectedRecipe(recipeText);
    setSquareSelectedId(sharedId);
    setSquareRecipeImage(image);
    setSquareRecipeCuisine(cuisine);
    setSquareSharerEmail(sharerEmail);
    setSquareIsOwnShare(isOwn || false);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Share a favorite recipe to the Inspiration Square
  const shareToSquare = async (recipeId: string) => {
    if (!user?.id) {
      setToast({ isOpen: true, type: "error", title: "请先登录", message: "登录后才能分享食谱" });
      return;
    }

    setToast({ isOpen: true, type: "loading", title: "正在分享...", message: "请稍候" });

    try {
      const sharedRecipeId = id();
      await db.transact([
        db.tx.sharedRecipes[sharedRecipeId].update({
          sharedAt: Date.now(),
        }),
        db.tx.sharedRecipes[sharedRecipeId].link({ recipe: recipeId }),
        db.tx.sharedRecipes[sharedRecipeId].link({ user: user.id }),
      ]);

      // Update local state if we're in favorites detail view
      setSelectedRecipeIsShared(true);
      setSelectedRecipeShareId(sharedRecipeId);

      // Update local state if we're in ingredients tab with generated recipe
      if (generatedRecipeRecipeId === recipeId) {
        setGeneratedRecipeIsShared(true);
        setGeneratedRecipeShareId(sharedRecipeId);
      }

      setToast({ isOpen: true, type: "success", title: "分享成功！", message: "食谱已发布到灵感广场" });
    } catch (error) {
      console.error("分享失败:", error);
      setToast({ isOpen: true, type: "error", title: "分享失败", message: "请重试" });
    }
  };

  // Unshare a recipe from the Inspiration Square
  const unshareFromSquare = async (shareId: string) => {
    setConfirmModal({
      isOpen: true,
      title: "取消分享",
      message: "确定要将这个食谱从灵感广场撤下吗？其他用户将无法再看到它。",
      onConfirm: async () => {
        try {
          await db.transact([db.tx.sharedRecipes[shareId].delete()]);

          // Update local state
          setSelectedRecipeIsShared(false);
          setSelectedRecipeShareId(undefined);

          // Update generated recipe share state if applicable
          if (generatedRecipeShareId === shareId) {
            setGeneratedRecipeIsShared(false);
            setGeneratedRecipeShareId(undefined);
          }

          // If we're in the square view, go back to grid
          if (squareSelectedId === shareId) {
            setSquareSelectedRecipe(null);
            setSquareSelectedId(null);
          }

          setConfirmModal({
            isOpen: false,
            title: "",
            message: "",
            onConfirm: () => { },
          });
          setToast({ isOpen: true, type: "success", title: "已取消分享", message: "食谱已从广场撤下" });
        } catch (error) {
          console.error("取消分享失败:", error);
          setToast({ isOpen: true, type: "error", title: "取消分享失败", message: "请重试" });
          setConfirmModal({
            isOpen: false,
            title: "",
            message: "",
            onConfirm: () => { },
          });
        }
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab: 'ingredients' | 'favorites' | 'square') => {
          setActiveTab(tab);
          if (tab === 'ingredients') {
            setSelectedRecipe(null);
            setSquareSelectedRecipe(null);
          } else if (tab === 'favorites') {
            setSquareSelectedRecipe(null);
          } else if (tab === 'square') {
            setSelectedRecipe(null);
          }
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        user={user}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">

        {/* Ingredients / Generator Tab - Two Column Layout */}
        {activeTab === "ingredients" && (
          <div className="space-y-12">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column - Ingredients Library */}
              <div className="lg:w-3/5 xl:w-2/3">
                <section className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-6 md:p-10 transition-all h-fit">
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
                    compactMode={true}
                    onEditModeChange={setIsIngredientEditMode}
                  />
                </section>
              </div>

              {/* Right Column - Action Panel */}
              <div className={`lg:w-2/5 xl:w-1/3 transition-all duration-500 ${isIngredientEditMode ? "opacity-30 pointer-events-none scale-[0.98] blur-[1px]" : ""}`}>
                {/* Sticky Action Panel */}
                <div className="lg:sticky lg:top-24">
                  <section className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-6 transition-all">
                    {/* Selected Ingredients Summary */}
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                        已选食材
                        {selectedIngredients.length > 0 && (
                          <span className="text-sm font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                            {selectedIngredients.length}
                          </span>
                        )}
                      </h3>
                      {selectedIngredients.length > 0 ? (
                        <div className="flex flex-wrap gap-2 p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-100">
                          {selectedIngredients.map((ing) => (
                            <span
                              key={ing}
                              className="inline-flex items-center px-3 py-1.5 bg-white text-orange-700 font-medium rounded-lg border border-orange-200 shadow-sm text-sm"
                            >
                              {ing}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-center">
                          <p className="text-slate-400 text-sm">在左侧选择食材开始</p>
                        </div>
                      )}
                      {selectedIngredients.length > 0 && (
                        <button
                          onClick={clearSelectedIngredients}
                          className="mt-3 text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors"
                        >
                          清空选择
                        </button>
                      )}
                    </div>

                    {/* Cuisine Selection */}
                    <div className="mb-6">
                      <label className="block text-sm font-bold text-slate-700 mb-3">菜系偏好</label>
                      <select
                        value={selectedCuisine}
                        onChange={(e) => setSelectedCuisine(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all cursor-pointer"
                      >
                        {["中国菜", "法国菜", "意大利菜", "日本菜", "东南亚菜", "希腊菜", "美国菜", "墨西哥菜", "韩国菜", "印度菜"].map((cuisine) => (
                          <option key={cuisine} value={cuisine}>{cuisine}</option>
                        ))}
                      </select>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <button
                        onClick={() => generateRecipe()}
                        disabled={loading || selectedIngredients.length === 0}
                        className={`w-full group inline-flex items-center justify-center px-6 py-4 font-bold rounded-2xl transition-all duration-300 shadow-lg ${loading || selectedIngredients.length === 0
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                          : "bg-orange-600 text-white hover:bg-orange-700 hover:translate-y-[-2px] shadow-orange-200"
                          }`}
                      >
                        {loading && loadingType === "manual" ? (
                          <>
                            <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                            正在为您策划...
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                            </svg>
                            立即生成精选食谱
                          </>
                        )}
                      </button>
                      <button
                        onClick={async () => {
                          clearSelectedIngredients();
                          if (ingredients.length > 0) {
                            const meats = ingredients.filter((i) => i.category === "肉类");
                            const nonMeat = ingredients.filter((i) => i.category !== "肉类");
                            let picks: string[] = [];
                            if (meats.length > 0) {
                              const mainMeat = meats[Math.floor(Math.random() * meats.length)].name;
                              picks.push(mainMeat);
                            }
                            const shuffle = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);
                            const otherPicks = shuffle(nonMeat).slice(0, Math.min(4, nonMeat.length)).map((i) => i.name);
                            picks = [...picks, ...otherPicks];
                            if (picks.length < 1) return;
                            const cuisinesList = ["中国菜", "法国菜", "意大利菜", "日本菜", "东南亚菜", "希腊菜", "美国菜", "墨西哥菜", "韩国菜", "印度菜"];
                            const randomCuisine = cuisinesList[Math.floor(Math.random() * cuisinesList.length)];
                            setSelectedCuisine(randomCuisine);
                            picks.forEach((name) => toggleIngredient(name));
                            setTimeout(() => generateRecipe(picks, "random"), 0);
                          }
                        }}
                        disabled={loading || ingredients.length === 0}
                        className={`w-full group inline-flex items-center justify-center px-6 py-4 font-bold rounded-2xl transition-all duration-300 border-2 ${loading || ingredients.length === 0
                          ? "bg-white text-slate-300 border-slate-100 cursor-not-allowed"
                          : "bg-white text-indigo-600 border-indigo-100 hover:bg-indigo-50 hover:border-indigo-200 hover:translate-y-[-2px]"
                          }`}
                      >
                        {loading && loadingType === "random" ? (
                          <>
                            <div className="w-5 h-5 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mr-3"></div>
                            随机寻找灵感...
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-indigo-500">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                            </svg>
                            手气不错，随机灵感
                          </>
                        )}
                      </button>
                    </div>
                  </section>
                </div>
              </div>
            </div>

            {/* Full Width Recipe Display Area Below */}
            {loading && <RecipeSkeleton />}

            {recipe && !loading && (
              <div data-recipe-display className="animate-fadeIn">
                <RecipeDisplay
                  recipe={recipe}
                  image={recipeImage}
                  imageLoading={imageLoading}
                  onAddToFavorites={generatedRecipeFavoriteId ? undefined : addToFavorites}
                  onDeleteFavorite={generatedRecipeFavoriteId ? deleteFavorite : undefined}
                  favoriteId={generatedRecipeFavoriteId || undefined}
                  recipeId={generatedRecipeRecipeId || undefined}
                  onShareToSquare={generatedRecipeFavoriteId && !generatedRecipeIsShared ? shareToSquare : undefined}
                  onUnshare={generatedRecipeIsShared ? unshareFromSquare : undefined}
                  shareId={generatedRecipeShareId}
                  isShared={generatedRecipeIsShared}
                  cuisine={selectedCuisine}
                />
              </div>
            )}
          </div>
        )}

        {/* Favorites Tab */}
        {activeTab === "favorites" && (
          <div className="space-y-6">
            {selectedRecipe ? (
              // Detail View
              <div className="animate-slide-in">
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="flex items-center text-slate-500 hover:text-slate-800 transition-colors mb-6 group font-medium"
                >
                  <div className="p-2 rounded-full bg-white border border-slate-200 mr-3 group-hover:border-slate-400 transition-colors shadow-sm">
                    <ArrowLeftIcon className="w-5 h-5" />
                  </div>
                  返回收藏列表
                </button>
                <RecipeDisplay
                  recipe={selectedRecipe}
                  image={recipeImage}
                  onDeleteFavorite={deleteFavorite}
                  favoriteId={selectedRecipeId || undefined}
                  recipeId={selectedRecipeRecipeId || undefined}
                  onShareToSquare={selectedRecipeIsShared ? undefined : shareToSquare}
                  onUnshare={selectedRecipeIsShared ? unshareFromSquare : undefined}
                  shareId={selectedRecipeShareId}
                  isShared={selectedRecipeIsShared}
                  cuisine={selectedRecipeCuisine}
                />
              </div>
            ) : (
              // Grid View
              <div className="animate-fadeIn">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-slate-800 mb-2">我的收藏</h2>
                  <p className="text-slate-500">这里保存着您所有的美味灵感</p>
                </div>
                <FavoritesGrid
                  userId={user?.id || ""}
                  onRecipeClick={handleFavoriteClick}
                  onDeleteFavorite={deleteFavorite}
                  onShareToSquare={shareToSquare}
                  onUnshare={unshareFromSquare}
                />
              </div>
            )}
          </div>
        )}

        {/* Inspiration Square Tab */}
        {activeTab === "square" && (
          <div className="space-y-6">
            {squareSelectedRecipe ? (
              // Detail View
              <div className="animate-slide-in">
                <button
                  onClick={() => setSquareSelectedRecipe(null)}
                  className="flex items-center text-slate-500 hover:text-slate-800 transition-colors mb-6 group font-medium"
                >
                  <div className="p-2 rounded-full bg-white border border-slate-200 mr-3 group-hover:border-slate-400 transition-colors shadow-sm">
                    <ArrowLeftIcon className="w-5 h-5" />
                  </div>
                  返回灵感广场
                </button>
                {squareSharerEmail && (
                  <div className="mb-4 inline-flex items-center gap-2 text-sm text-purple-600 bg-purple-50 px-4 py-2 rounded-full font-medium">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    来自 {squareSharerEmail.split('@')[0]} 的分享
                  </div>
                )}
                <RecipeDisplay
                  recipe={squareSelectedRecipe}
                  image={squareRecipeImage}
                  cuisine={squareRecipeCuisine}
                  onUnshare={squareIsOwnShare ? unshareFromSquare : undefined}
                  shareId={squareSelectedId || undefined}
                  isShared={true}
                />
              </div>
            ) : (
              // Grid View
              <div className="animate-fadeIn">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-slate-800 mb-2">灵感广场</h2>
                  <p className="text-slate-500">发现来自社区的美味灵感</p>
                </div>
                <InspirationSquare
                  userId={user?.id}
                  onRecipeClick={handleSquareRecipeClick}
                  onUnshare={unshareFromSquare}
                />
              </div>
            )}
          </div>
        )}

      </main>

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
            onConfirm: () => { },
          })
        }
      />

      <Toast
        isOpen={toast.isOpen}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={() => setToast({ ...toast, isOpen: false })}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        user={user}
        onLogout={() => db.auth.signOut()}
      />
      <Footer onNavigate={(tab) => {
        setActiveTab(tab);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }} />
    </div>

  );
}


export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showGuestApp, setShowGuestApp] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50">
      <db.SignedIn>
        <AppContent />
      </db.SignedIn>
      <db.SignedOut>
        {showLogin ? (
          <Login onBack={() => setShowLogin(false)} />
        ) : showGuestApp ? (
          <GuestInspirationView
            onLogin={() => setShowLogin(true)}
            onBack={() => setShowGuestApp(false)}
          />
        ) : (
          <LandingPage
            onGetStarted={() => setShowLogin(true)}
            onNavigateToInspiration={() => setShowGuestApp(true)}
          />
        )}
      </db.SignedOut>
    </main>
  );
}

