import { i } from "@instantdb/react";

const _schema = i.schema({
  entities: {
    $users: i.entity({
      email: i.string().unique().indexed().optional(),
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
      userId: i.string().indexed(),
      createdAt: i.number().indexed(),
    }),
    favorites: i.entity({
      createdAt: i.number().indexed(),
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
  },
});

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
