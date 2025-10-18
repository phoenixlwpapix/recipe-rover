import { db } from "../db/instant";

interface FavoritesListProps {
  userId: string;
  onRecipeClick: (recipeText: string, favoriteId: string) => void;
  onDeleteFavorite: (favoriteId: string) => void;
  selectedFavoriteId?: string;
}

function FavoritesList({
  userId,
  onRecipeClick,
  onDeleteFavorite,
  selectedFavoriteId,
}: FavoritesListProps) {
  const { data, isLoading, error } = db.useQuery({
    favorites: {
      $: { where: { "user.id": userId } },
      recipe: {},
    },
  });

  if (isLoading) return <div className="text-sm text-gray-500">加载中...</div>;
  if (error)
    return <div className="text-sm text-red-500">错误: {error.message}</div>;

  const favorites = data?.favorites || [];

  if (favorites.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500 text-sm">暂无收藏食谱</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {favorites.slice(0, 10).map((fav) => (
        <div
          key={fav.id}
          className={`flex justify-between items-center p-2 rounded cursor-pointer group ${
            selectedFavoriteId === fav.id ? "bg-gray-100" : "hover:bg-gray-100"
          }`}
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
            }\n**Method:**\n${fav.recipe?.instructions}${
              fav.recipe?.tips ? `\n**Tips:**\n${fav.recipe.tips}` : ""
            }`;
            onRecipeClick(recipeText, fav.id);
          }}
        >
          <span className="text-sm text-gray-700 truncate flex-1">
            {fav.recipe?.title}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteFavorite(fav.id);
            }}
            className="ml-2 p-1 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
            title="删除收藏"
          >
            <svg
              className="w-4 h-4"
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
      ))}
      {favorites.length > 10 && (
        <div className="text-center py-2">
          <button className="text-sm text-blue-600 hover:text-blue-800">
            查看更多...
          </button>
        </div>
      )}
    </div>
  );
}

export default FavoritesList;
