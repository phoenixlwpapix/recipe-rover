import type { InstantRules } from "@instantdb/react";

const rules = {
    // $files 权限规则 - 图片为食谱图片，允许所有人查看
    "$files": {
        "allow": {
            "view": "true",  // 所有人可查看（食谱图片不敏感）
            "create": "isOwner",
            "delete": "isOwner",
        },
        "bind": [
            "isOwner", "data.path.startsWith(auth.id + '/')"
        ],
    },
    // sharedRecipes 对所有人可见
    "sharedRecipes": {
        "allow": {
            "view": "true",
            "create": "auth.id != null",
            "delete": "isOwner",
        },
        "bind": [
            "isOwner", "auth.id != null && data.user == auth.id"
        ],
    },
    // recipes 权限
    "recipes": {
        "allow": {
            "view": "true",  // 允许查看所有食谱（用于灵感广场）
            "create": "auth.id != null",
            "update": "isOwner",
            "delete": "isOwner",
        },
        "bind": [
            "isOwner", "data.userId == auth.id"
        ],
    },
} satisfies InstantRules;

export default rules;


