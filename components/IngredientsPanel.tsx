import { useState } from "react";
import { db } from "../db/instant";
import { id } from "@instantdb/react";
import { Ingredient } from "../types";
import {
  PencilIcon,
  PlusIcon,
  CheckIcon,
  TrashIcon,
  ShieldCheckIcon,
  BoltIcon,
  StarIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface IngredientsPanelProps {
  selectedIngredients: string[];
  onToggleIngredient: (ingredientName: string) => void;
  onDeleteIngredient: (ingredientId: string, ingredientName: string) => void;
  onGenerateRecipe: (
    forcedIngredients?: string[],
    type?: "manual" | "random"
  ) => void;
  onClearSelectedIngredients: () => void;
  loading: boolean;
  loadingType?: "manual" | "random";
  selectedCuisine: string;
  onCuisineChange: (cuisine: string) => void;
  ingredients: Ingredient[];
}

function IngredientsPanel({
  selectedIngredients,
  onToggleIngredient,
  onDeleteIngredient,
  onGenerateRecipe,
  onClearSelectedIngredients,
  loading,
  loadingType,
  selectedCuisine,
  onCuisineChange,
  ingredients,
}: IngredientsPanelProps) {
  const [newIngredient, setNewIngredient] = useState("");
  const [newIngredientCategory, setNewIngredientCategory] = useState("肉类");
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const cuisines = [
    "中国菜",
    "法国菜",
    "意大利菜",
    "日本菜",
    "东南亚菜",
    "希腊菜",
    "美国菜",
    "墨西哥菜",
    "韩国菜",
    "印度菜",
  ];

  const categoryColors: Record<string, string> = {
    肉类: "bg-red-100",
    蔬菜: "bg-green-100",
    蛋白质: "bg-yellow-100",
    乳制品: "bg-blue-100",
    调料: "bg-purple-100",
    其他: "bg-gray-100",
  };

  const user = db.useUser();

  const { data: ingredientsData, isLoading: ingredientsLoading } = db.useQuery({
    ingredients: {
      $: { where: { userId: user?.id } },
    },
  });

  const allIngredients = ingredientsData?.ingredients || [];

  const commonIngredients = {
    肉类: ["鸡肉", "牛肉", "猪肉"],
    蔬菜: ["西红柿", "洋葱", "大蒜"],
    蛋白质: ["鸡蛋", "豆腐", "豆类"],
    乳制品: ["牛奶", "奶酪", "酸奶"],
    调料: ["盐", "胡椒", "酱油"],
  };

  const handleImportCommonIngredients = async () => {
    if (!user?.id) return;
    const ingredientsToAdd = [];
    for (const [category, ingredients] of Object.entries(commonIngredients)) {
      for (const name of ingredients) {
        ingredientsToAdd.push(
          db.tx.ingredients[id()].create({
            name,
            category,
            userId: user.id,
            createdAt: Date.now(),
          })
        );
      }
    }
    try {
      await db.transact(ingredientsToAdd);
    } catch (error) {
      console.error("导入常见食材失败:", error);
      alert("导入常见食材失败");
    }
  };

  const handleAddIngredient = async () => {
    if (!newIngredient.trim() || !user?.id) return;
    try {
      await db.transact(
        db.tx.ingredients[id()].create({
          name: newIngredient.trim(),
          category: newIngredientCategory,
          userId: user!.id,
          createdAt: Date.now(),
        })
      );
      setNewIngredient("");
      setShowAddForm(false);
    } catch (error) {
      console.error("添加食材失败:", error);
      alert("添加食材失败");
    }
  };

  return (
    <div className="space-y-8">
      {/* 配料表 */}
      <div>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-slate-800">食材选择</h3>
            <div className="flex gap-2">
              {!showAddForm && (
                <button
                  onClick={() => setIsEditMode(!isEditMode)}
                  className={`inline-flex items-center px-3 py-1.5 text-sm font-semibold rounded-lg transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl ${
                    isEditMode
                      ? "bg-gradient-to-r from-red-500 to-rose-500 text-white hover:from-red-600 hover:to-rose-600"
                      : "bg-gradient-to-r from-slate-500 to-slate-600 text-white hover:from-slate-600 hover:to-slate-700"
                  }`}
                >
                  <PencilIcon className="w-3.5 h-3.5 mr-1.5" />
                  {isEditMode ? "退出编辑" : "编辑食材"}
                </button>
              )}
              {!showAddForm && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="inline-flex items-center px-3 py-1.5 text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <PlusIcon className="w-3.5 h-3.5 mr-1.5" />
                  添加食材
                </button>
              )}
            </div>
          </div>

          {/* 选中的食材 */}
          {selectedIngredients.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2 items-center">
                {selectedIngredients.map((ing) => (
                  <span
                    key={ing}
                    className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 font-medium rounded-lg border border-blue-300/50 shadow-sm text-sm"
                  >
                    <CheckIcon className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                    {ing}
                  </span>
                ))}
                <button
                  onClick={onClearSelectedIngredients}
                  className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-red-500 to-rose-500 text-white text-sm font-semibold rounded-lg hover:from-red-600 hover:to-rose-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl ml-2"
                >
                  <TrashIcon className="w-3.5 h-3.5 mr-1" />
                  清空
                </button>
              </div>
            </div>
          )}
        </div>
        {ingredientsLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
            <p className="mt-4 text-slate-600">加载中...</p>
          </div>
        ) : allIngredients.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full mx-auto mb-6 flex items-center justify-center">
              <ShieldCheckIcon className="w-16 h-16 text-slate-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              食材库是空的
            </h3>
            <p className="text-slate-500 mb-6">开始添加食材，创造美味食谱吧</p>
            <button
              onClick={handleImportCommonIngredients}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              一键导入常见食材
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {["肉类", "蔬菜", "蛋白质", "乳制品", "调料", "其他"].map(
              (category) => {
                const categoryIngredients = allIngredients.filter(
                  (ing) => ing.category === category
                );
                if (categoryIngredients.length === 0) return null;
                return (
                  <div
                    key={category}
                    className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div
                        className={`text-base font-semibold text-slate-800 whitespace-nowrap min-w-0 flex-shrink-0 px-3 py-1.5 rounded-lg shadow-md ${
                          categoryColors[category] || "bg-gray-100"
                        }`}
                      >
                        {category}
                      </div>
                      <div className="text-sm text-slate-600">
                        {categoryIngredients.length} 个食材
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {categoryIngredients.map((ing) => (
                        <div key={ing.id} className="relative">
                          <button
                            onClick={() => onToggleIngredient(ing.name)}
                            className={`inline-flex items-center px-3 py-1.5 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                              selectedIngredients.includes(ing.name)
                                ? "bg-gradient-to-r from-blue-500 to-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/25 transform scale-105"
                                : "bg-white/80 backdrop-blur-sm border-slate-300 hover:border-slate-400 hover:bg-white hover:shadow-md text-slate-700 hover:text-slate-800"
                            }`}
                          >
                            <span className="whitespace-nowrap">
                              {ing.name}
                            </span>
                          </button>
                          {isEditMode && (
                            <button
                              onClick={() =>
                                onDeleteIngredient(ing.id, ing.name)
                              }
                              className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-full hover:from-red-600 hover:to-rose-600 text-xs flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200"
                              title="删除食材"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}

        {/* 添加新食材 */}
        {showAddForm && (
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                placeholder="食材名称..."
                className="flex-1 border border-slate-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black bg-white/80 backdrop-blur-sm transition-all duration-200"
                onKeyDown={(e) => e.key === "Enter" && handleAddIngredient()}
                autoFocus
              />
              <div className="flex gap-3">
                <select
                  value={newIngredientCategory}
                  onChange={(e) => setNewIngredientCategory(e.target.value)}
                  className="border border-slate-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black bg-white/80 backdrop-blur-sm transition-all duration-200"
                >
                  <option value="肉类">肉类</option>
                  <option value="蔬菜">蔬菜</option>
                  <option value="蛋白质">蛋白质</option>
                  <option value="乳制品">乳制品</option>
                  <option value="调料">调料</option>
                  <option value="其他">其他</option>
                </select>
                <button
                  onClick={handleAddIngredient}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <CheckIcon className="w-4 h-4 mr-2" />
                  添加
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewIngredient("");
                  }}
                  className="inline-flex items-center px-6 py-3 bg-slate-500 text-white font-semibold rounded-xl hover:bg-slate-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <XMarkIcon className="w-4 h-4 mr-2" />
                  取消
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 菜系选择 */}
        <div className="mb-8">
          <label className="block text-lg font-semibold text-slate-800 mb-4">
            选择菜系
          </label>
          <div className="flex flex-wrap gap-2">
            {cuisines.map((cuisine) => (
              <button
                key={cuisine}
                onClick={() => onCuisineChange(cuisine)}
                className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  selectedCuisine === cuisine
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/25 transform scale-105"
                    : "bg-white/80 backdrop-blur-sm border-slate-300 hover:border-slate-400 hover:bg-white hover:shadow-md text-slate-700 hover:text-slate-800"
                }`}
              >
                {cuisine}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => onGenerateRecipe()}
            disabled={loading || selectedIngredients.length === 0}
            className={`inline-flex items-center justify-center px-8 py-4 font-semibold rounded-xl transition-all duration-200 shadow-lg ${
              loading || selectedIngredients.length === 0
                ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 hover:shadow-xl"
            }`}
          >
            {loading && loadingType === "manual" ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                生成中...
              </>
            ) : (
              <>
                <BoltIcon className="w-5 h-5 mr-2" />
                生成菜谱
              </>
            )}
          </button>
          <button
            onClick={async () => {
              // Always clear previous selections first
              onClearSelectedIngredients();

              if (allIngredients.length > 0) {
                // 1. Pick one main meat (if exists)
                const meats = allIngredients.filter(
                  (i: Ingredient) => i.category === "肉类"
                );
                if (meats.length === 0) return; // do nothing if no meat
                const mainMeat =
                  meats[Math.floor(Math.random() * meats.length)].name;

                // 2. Pick up to four non-meat, unique additional ingredients
                const nonMeat = allIngredients.filter(
                  (i: Ingredient) =>
                    i.category !== "肉类" && i.name !== mainMeat
                );
                const shuffle = (arr: Ingredient[]) =>
                  [...arr].sort(() => Math.random() - 0.5);
                const randomOthers = shuffle(nonMeat)
                  .slice(0, Math.min(4, nonMeat.length))
                  .map((i) => i.name);
                const picks = [mainMeat, ...randomOthers];

                // 3. Select all (skip if less than one other ingredient)
                if (picks.length < 2) return; // need at least meat plus one more

                // 4. Pick a random cuisine
                const randomCuisine =
                  cuisines[Math.floor(Math.random() * cuisines.length)];
                onCuisineChange(randomCuisine);

                picks.forEach((name) => onToggleIngredient(name));
                // Wait zero tick for state to fully reflect (ensures onGenerateRecipe gets all)
                setTimeout(() => {
                  onGenerateRecipe(picks, "random");
                }, 0);
                return;
              }
            }}
            disabled={loading || allIngredients.length === 0}
            className={`inline-flex items-center justify-center px-8 py-4 font-semibold rounded-xl transition-all duration-200 shadow-lg ${
              loading || allIngredients.length === 0
                ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-500 to-violet-500 text-white hover:from-purple-600 hover:to-violet-600 transform hover:scale-105 hover:shadow-xl"
            }`}
          >
            {loading && loadingType === "random" ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                生成中...
              </>
            ) : (
              <>
                <StarIcon className="w-5 h-5 mr-2" />
                手气不错
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default IngredientsPanel;
