import { db } from "../db/instant";

interface FavoritesListProps {
  userId: string;
  onRecipeClick: (recipeText: string) => void;
  onDeleteFavorite: (favoriteId: string) => void;
}

function FavoritesList({
  userId,
  onRecipeClick,
  onDeleteFavorite,
}: FavoritesListProps) {
  const { data, isLoading, error } = db.useQuery({
    favorites: {
      $: { where: { "user.id": userId } },
      recipe: {},
    },
  });

  if (isLoading) return <div>加载中...</div>;
  if (error) return <div>错误: {error.message}</div>;

  const favorites = data?.favorites || [];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-black mb-2">我的收藏</h2>
        <p className="text-gray-700">查看你收藏的美味食谱。</p>
      </div>
      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">暂无收藏食谱</p>
          <p className="text-gray-500 mt-2">生成食谱后点击收藏按钮来添加收藏</p>
        </div>
      ) : (
        <div className="space-y-4">
          {favorites.map((fav: any) => (
            <div
              key={fav.id}
              className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer relative"
              onClick={() => {
                // 重新构建食谱文本用于显示
                const recipeText = `**标题：** ${
                  fav.recipe?.title
                }\n**Ingredients:**\n${
                  Array.isArray(fav.recipe?.ingredients)
                    ? fav.recipe.ingredients
                        .map((ing: string) => `- ${ing}`)
                        .join("\n")
                    : fav.recipe?.ingredients
                }\n**Method:**\n${fav.recipe?.instructions}`;
                onRecipeClick(recipeText);
              }}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-black mb-2">
                    {fav.recipe?.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    收藏时间:{" "}
                    {new Date(fav.createdAt || Date.now()).toLocaleString(
                      "zh-CN",
                      {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteFavorite(fav.id);
                  }}
                  className="ml-4 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                  title="删除收藏"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoritesList;
