export interface Ingredient {
  id: string;
  name: string;
  category: string;
  userId: string;
  createdAt: number;
}

export interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string;
  userId: string;
  createdAt: number;
}

export interface Favorite {
  id: string;
  createdAt: number;
  user: string;
  recipe: string;
}

export interface ParsedRecipe {
  title: string;
  ingredients: string[];
  instructions: string;
}
