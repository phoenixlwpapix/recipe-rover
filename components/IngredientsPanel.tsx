import { useState, useEffect } from "react";
import { db } from "../db/instant";
import { id } from "@instantdb/react";

interface IngredientsPanelProps {
  selectedIngredients: string[];
  onToggleIngredient: (ingredientName: string) => void;
  onAddIngredient: () => void;
  onDeleteIngredient: (ingredientId: string, ingredientName: string) => void;
  onGenerateRecipe: () => void;
  loading: boolean;
  selectedCuisine: string;
  onCuisineChange: (cuisine: string) => void;
}

function IngredientsPanel({
  selectedIngredients,
  onToggleIngredient,
  onAddIngredient,
  onDeleteIngredient,
  onGenerateRecipe,
  loading,
  selectedCuisine,
  onCuisineChange,
}: IngredientsPanelProps) {
  const [newIngredient, setNewIngredient] = useState("");
  const [newIngredientCategory, setNewIngredientCategory] = useState("肉类");
  const [showAddForm, setShowAddForm] = useState(false);

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

  const ingredients = ingredientsData?.ingredients || [];

  const handleAddIngredient = async () => {
    if (!newIngredient.trim() || !user?.id) return;
    try {
      await db.transact(
        db.tx.ingredients[id()].update({
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
    <>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-black mb-2">我的食材库</h2>
        <p className="text-gray-700">从个人食材库中选择材料，生成美味食谱。</p>
      </div>

      {/* 配料表 */}
      <div className="mb-8">
        {ingredientsLoading ? (
          <div>加载中...</div>
        ) : ingredients.length === 0 ? (
          <div className="text-center py-8 text-gray-500">这里空空如也...</div>
        ) : (
          <div className="space-y-4 mb-4">
            {["肉类", "蔬菜", "蛋白质", "乳制品", "调料", "其他"].map(
              (category) => {
                const categoryIngredients = ingredients.filter(
                  (ing) => ing.category === category
                );
                if (categoryIngredients.length === 0) return null;
                return (
                  <div key={category} className="flex items-center gap-4 mb-4">
                    <button
                      className={`text-lg font-semibold text-black whitespace-nowrap min-w-0 flex-shrink-0 px-3 py-2 rounded-md ${
                        categoryColors[category] || "bg-gray-100"
                      }`}
                      onClick={() => {}}
                    >
                      {category}
                    </button>
                    <div className="flex flex-wrap gap-2 flex-1">
                      {categoryIngredients.map((ing) => (
                        <div key={ing.id} className="relative">
                          <button
                            onClick={() => onToggleIngredient(ing.name)}
                            className={`inline-block px-3 py-2 rounded-md border text-sm ${
                              selectedIngredients.includes(ing.name)
                                ? "bg-blue-100 border-blue-500"
                                : "bg-white border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            <span className="font-medium text-black whitespace-nowrap">
                              {ing.name}
                            </span>
                          </button>
                          {selectedIngredients.includes(ing.name) && (
                            <button
                              onClick={() =>
                                onDeleteIngredient(ing.id, ing.name)
                              }
                              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full hover:bg-red-600 text-xs flex items-center justify-center"
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
        <div className="mb-4">
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              添加食材
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                placeholder="食材名称..."
                className="flex-1 border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                onKeyDown={(e) => e.key === "Enter" && handleAddIngredient()}
                autoFocus
              />
              <div className="flex gap-2">
                <select
                  value={newIngredientCategory}
                  onChange={(e) => setNewIngredientCategory(e.target.value)}
                  className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
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
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 whitespace-nowrap"
                >
                  添加
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewIngredient("");
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 whitespace-nowrap"
                >
                  取消
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 选中的食材 */}
        {selectedIngredients.length > 0 && (
          <div className="mb-4">
            <h3 className="font-medium text-black mb-2">已选食材：</h3>
            <div className="flex flex-wrap gap-2">
              {selectedIngredients.map((ing) => (
                <span
                  key={ing}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 菜系选择 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            选择菜系：
          </label>
          <div className="flex flex-wrap gap-2">
            {cuisines.map((cuisine) => (
              <button
                key={cuisine}
                onClick={() => onCuisineChange(cuisine)}
                className={`px-3 py-2 rounded-md border text-sm ${
                  selectedCuisine === cuisine
                    ? "bg-blue-100 border-blue-500 text-blue-800"
                    : "bg-white border-gray-300 hover:bg-gray-50 text-black"
                }`}
              >
                {cuisine}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onGenerateRecipe}
          disabled={loading || selectedIngredients.length === 0}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 font-medium disabled:opacity-50"
        >
          {loading ? "生成中..." : "生成菜谱"}
        </button>
      </div>
    </>
  );
}

export default IngredientsPanel;
