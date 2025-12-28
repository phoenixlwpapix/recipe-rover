import type { InstantRules } from "@instantdb/react";

const rules = {
    // 已登录用户可以上传、查看自己目录下的文件
    "$files": {
        "allow": {
            "view": "isOwner",
            "create": "isOwner",
            "delete": "isOwner",
        },
        "bind": ["isOwner", "data.path.startsWith(auth.id + '/')"],
    },
} satisfies InstantRules;

export default rules;
