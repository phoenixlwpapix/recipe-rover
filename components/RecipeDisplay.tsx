import ReactMarkdown from "react-markdown";
import { parseRecipe } from "../utils/recipeParser";

interface RecipeDisplayProps {
  recipe: string;
  onAddToFavorites: () => void;
}

function RecipeDisplay({ recipe, onAddToFavorites }: RecipeDisplayProps) {
  const parsedRecipe = parseRecipe(recipe);

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-black">
        {parsedRecipe.title || "食谱"}
      </h2>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Ingredients 左栏 */}
        <div>
          <h3 className="text-xl font-semibold text-black mb-4 border-b pb-2">
            Ingredients
          </h3>
          <div className="text-gray-700 leading-relaxed">
            <ReactMarkdown
              components={{
                p: ({ children }) => (
                  <p className="text-gray-700 mb-2">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside space-y-1">
                    {children}
                  </ul>
                ),
                li: ({ children }) => (
                  <li className="text-gray-700">{children}</li>
                ),
              }}
            >
              {parsedRecipe.ingredients}
            </ReactMarkdown>
          </div>
        </div>

        {/* Method 右栏 */}
        <div>
          <h3 className="text-xl font-semibold text-black mb-4 border-b pb-2">
            Method
          </h3>
          <div className="text-gray-700 leading-relaxed">
            <ReactMarkdown
              components={{
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside space-y-2">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-gray-700">{children}</li>
                ),
                p: ({ children }) => (
                  <p className="text-gray-700 mb-2">{children}</p>
                ),
              }}
            >
              {parsedRecipe.instructions}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Tips 栏 */}
      {parsedRecipe.tips && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-black mb-4 border-b pb-2">
            Tips
          </h3>
          <div className="text-gray-700 leading-relaxed bg-blue-50 p-4 rounded-lg">
            <ReactMarkdown
              components={{
                p: ({ children }) => (
                  <p className="text-gray-700 mb-2">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside space-y-1">
                    {children}
                  </ul>
                ),
                li: ({ children }) => (
                  <li className="text-gray-700">{children}</li>
                ),
              }}
            >
              {parsedRecipe.tips}
            </ReactMarkdown>
          </div>
        </div>
      )}

      <button
        onClick={onAddToFavorites}
        className="mt-6 bg-yellow-500 text-white px-6 py-3 rounded-md hover:bg-yellow-600 font-medium transition-colors"
      >
        收藏食谱
      </button>
    </div>
  );
}

export default RecipeDisplay;
