
import { useState } from "react";
import { db } from "../db/instant";
import { id } from "@instantdb/react";
import { Ingredient } from "../types";
import {
  PencilIcon,
  PlusIcon,
  CheckIcon,
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
  compactMode?: boolean;
}

function IngredientsPanel({
  selectedIngredients,
  onToggleIngredient,
  onDeleteIngredient,
  onClearSelectedIngredients,
  compactMode = false,
}: IngredientsPanelProps) {
  const [newIngredient, setNewIngredient] = useState("");
  const [newIngredientCategory, setNewIngredientCategory] = useState("肉类");
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const categoryStyles: Record<string, { container: string, badge: string, dot: string }> = {
    肉类: {
      container: "bg-rose-50/50 border-rose-100 hover:border-rose-200",
      badge: "bg-rose-100 text-rose-700 border-rose-200",
      dot: "bg-rose-500"
    },
    蔬菜: {
      container: "bg-emerald-50/50 border-emerald-100 hover:border-emerald-200",
      badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
      dot: "bg-emerald-500"
    },
    蛋白质: {
      container: "bg-amber-50/50 border-amber-100 hover:border-amber-200",
      badge: "bg-amber-100 text-amber-700 border-amber-200",
      dot: "bg-amber-500"
    },
    乳制品: {
      container: "bg-sky-50/50 border-sky-100 hover:border-sky-200",
      badge: "bg-sky-100 text-sky-700 border-sky-200",
      dot: "bg-sky-500"
    },
    调料: {
      container: "bg-violet-50/50 border-violet-100 hover:border-violet-200",
      badge: "bg-violet-100 text-violet-700 border-violet-200",
      dot: "bg-violet-500"
    },
    其他: {
      container: "bg-slate-50/50 border-slate-100 hover:border-slate-200",
      badge: "bg-slate-100 text-slate-700 border-slate-200",
      dot: "bg-slate-500"
    },
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
    <div className="space-y-10">
      {/* List section */}
      <div>
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">我的食材库</h3>
              <p className="text-slate-500 mt-1">选择您现有的食材，生成美味食谱</p>
            </div>
            <div className="flex items-center gap-3">
              {!showAddForm && (
                <button
                  onClick={() => setIsEditMode(!isEditMode)}
                  className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 border ${isEditMode
                    ? "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                >
                  <PencilIcon className="w-4 h-4 mr-2" />
                  {isEditMode ? "完成" : "管理食材"}
                </button>
              )}
              {!showAddForm && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="inline-flex items-center px-4 py-2 text-sm bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 transition-all duration-200 shadow-sm shadow-orange-200"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  添加食材
                </button>
              )}
            </div>
          </div>

          {/* Selected items display - hidden in compact mode */}
          {!compactMode && selectedIngredients.length > 0 && (
            <div className="mb-8 p-4 bg-orange-50 rounded-2xl border border-orange-100 transition-all animate-fadeIn">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-orange-800 uppercase tracking-wider">已选食材 ({selectedIngredients.length})</span>
                <button
                  onClick={onClearSelectedIngredients}
                  className="text-xs font-bold text-orange-600 hover:text-orange-800 transition-colors uppercase"
                >
                  重置选择
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedIngredients.map((ing) => (
                  <span
                    key={ing}
                    className="inline-flex items-center px-3 py-1.5 bg-white text-orange-700 font-medium rounded-lg border border-orange-200 shadow-sm text-sm"
                  >
                    <CheckIcon className="w-3.5 h-3.5 mr-1.5 text-orange-600" />
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {ingredientsLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-orange-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-400 font-medium">加载中...</p>
          </div>
        ) : allIngredients.length === 0 ? (
          <div className="text-center py-20 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-white rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-sm">
              <ShieldCheckIcon className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              暂无食材
            </h3>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">您的食材库还是空的。您可以手动添加，或是一键导入常用食材。</p>
            <button
              onClick={handleImportCommonIngredients}
              className="inline-flex items-center px-6 py-3 bg-white text-slate-900 border border-slate-200 font-bold rounded-2xl hover:bg-slate-50 transition-all duration-200 shadow-sm"
            >
              <PlusIcon className="w-5 h-5 mr-2 text-orange-500" />
              导入常用食材
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {["肉类", "蔬菜", "蛋白质", "乳制品", "调料", "其他"].map(
              (category) => {
                const categoryIngredients = allIngredients.filter(
                  (ing) => ing.category === category
                );
                if (categoryIngredients.length === 0) return null;
                const styles = categoryStyles[category] || categoryStyles.其他;
                return (
                  <div
                    key={category}
                    className={`rounded-[2rem] p-6 border-2 transition-all duration-300 ${styles.container}`}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${styles.dot} animate-pulse`}></span>
                        <div className={`px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-widest border ${styles.badge}`}>
                          {category}
                        </div>
                      </div>
                      <span className="text-xs font-bold bg-white/50 px-2 py-1 rounded-lg text-slate-500 border border-slate-100">
                        {categoryIngredients.length}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {categoryIngredients.map((ing) => (
                        <div key={ing.id} className="relative group/ing">
                          <button
                            onClick={() => onToggleIngredient(ing.name)}
                            className={`inline-flex items-center px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 border-2 ${selectedIngredients.includes(ing.name)
                              ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200 scale-[1.02]"
                              : "bg-white/80 border-transparent text-slate-600 hover:bg-white hover:border-slate-200 hover:text-slate-900 hover:shadow-sm"
                              }`}
                          >
                            {ing.name}
                          </button>
                          {isEditMode && (
                            <button
                              onClick={() =>
                                onDeleteIngredient(ing.id, ing.name)
                              }
                              className="absolute -top-2 -right-2 w-7 h-7 bg-white border-2 border-rose-100 text-rose-500 rounded-full hover:bg-rose-50 hover:border-rose-200 flex items-center justify-center shadow-xl transition-all scale-0 group-hover/ing:scale-100 z-10"
                              title="删除"
                            >
                              <XMarkIcon className="w-4 h-4" />
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

        {/* Form to add item */}
        {showAddForm && (
          <div className="bg-white rounded-3xl p-6 border-2 border-orange-100 shadow-xl shadow-orange-50/50 mb-10 animate-scaleIn">
            <h4 className="text-lg font-bold text-slate-900 mb-4">添加新食材</h4>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                placeholder="例如：西蓝花..."
                className="flex-1 border border-slate-200 px-5 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-slate-900 bg-slate-50/50 transition-all font-medium"
                onKeyDown={(e) => e.key === "Enter" && handleAddIngredient()}
                autoFocus
              />
              <div className="flex gap-3">
                <select
                  value={newIngredientCategory}
                  onChange={(e) => setNewIngredientCategory(e.target.value)}
                  className="border border-slate-200 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-slate-700 bg-slate-50/50 transition-all font-medium appearance-none cursor-pointer"
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
                  className="inline-flex items-center px-6 py-3 bg-orange-600 text-white font-bold rounded-2xl hover:bg-orange-700 transition-all shadow-sm shadow-orange-200 disabled:opacity-50"
                  disabled={!newIngredient.trim()}
                >
                  <PlusIcon className="w-5 h-5 mr-1" />
                  添加
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewIngredient("");
                  }}
                  className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cuisine section - hidden in compact mode */}
        {!compactMode && (
          <div className="mb-12">
            <label className="block text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              我的偏好
              <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">选择菜系</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {["中国菜", "法国菜", "意大利菜", "日本菜", "东南亚菜", "希腊菜", "美国菜", "墨西哥菜", "韩国菜", "印度菜"].map((cuisine) => (
                <button
                  key={cuisine}
                  className="px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-200 bg-white text-slate-600 border border-slate-100 hover:border-slate-300 hover:bg-slate-50"
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons - hidden in compact mode */}
        {!compactMode && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              className="group inline-flex items-center justify-center px-8 py-5 font-bold rounded-3xl transition-all duration-300 shadow-xl bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
              disabled
            >
              <BoltIcon className="w-6 h-6 mr-3" />
              立即生成精选食谱
            </button>
            <button
              className="group inline-flex items-center justify-center px-8 py-5 font-bold rounded-3xl transition-all duration-300 shadow-xl border-2 bg-white text-slate-300 border-slate-100 cursor-not-allowed"
              disabled
            >
              <StarIcon className="w-6 h-6 mr-3 text-indigo-300" />
              手气不错，随机灵感
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default IngredientsPanel;
