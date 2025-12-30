import { i } from "@instantdb/react";

const _schema = i.schema({
  entities: {
    $users: i.entity({
      email: i.string().unique().indexed().optional(),
    }),
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.string(),
    }),
    ingredients: i.entity({
      name: i.string().indexed(),
      category: i.string().indexed(), // 如 "蔬菜", "肉类", "调料"
      userId: i.string().indexed(),
      createdAt: i.number().indexed(),
    }),
    recipes: i.entity({
      title: i.string().indexed(),
      ingredients: i.json(), // 存储数组如 ["盐", "糖"]
      instructions: i.string(),
      tips: i.string().optional(),
      cuisine: i.string().optional(),
      userId: i.string().indexed(),
      createdAt: i.number().indexed(),
    }),
    favorites: i.entity({
      createdAt: i.number().indexed(),
    }),
    // 分享到灵感广场的食谱
    sharedRecipes: i.entity({
      sharedAt: i.number().indexed(),
      description: i.string().optional(), // 用户分享时添加的描述
    }),
  },
  links: {
    userFavorites: {
      forward: { on: "favorites", has: "one", label: "user" },
      reverse: { on: "$users", has: "many", label: "favorites" },
    },
    recipeFavorites: {
      forward: { on: "favorites", has: "one", label: "recipe" },
      reverse: { on: "recipes", has: "many", label: "favorites" },
    },
    // 食谱图片关联 - 一个食谱可以有一张图片
    recipeImage: {
      forward: { on: "recipes", has: "one", label: "$file" },
      reverse: { on: "$files", has: "one", label: "recipe" },
    },
    // 用户头像关联
    userAvatar: {
      forward: { on: "$users", has: "one", label: "$file" },
      reverse: { on: "$files", has: "one", label: "user" },
    },
    // 分享食谱关联 - 一个分享对应一个食谱
    sharedRecipeLink: {
      forward: { on: "sharedRecipes", has: "one", label: "recipe" },
      reverse: { on: "recipes", has: "many", label: "shares" },
    },
    // 分享食谱与用户关联
    sharedRecipeUser: {
      forward: { on: "sharedRecipes", has: "one", label: "user" },
      reverse: { on: "$users", has: "many", label: "sharedRecipes" },
    },
  },
});

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema;
type AppSchema = _AppSchema;
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
