import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Initialize the API client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const IMAGE_MODEL = "gemini-2.5-flash-image";

/**
 * 生成食谱图片 API
 */
export async function POST(request: NextRequest) {
    try {
        const { title } = await request.json();

        if (!title) {
            return NextResponse.json(
                { error: "缺少 title 参数" },
                { status: 400 }
            );
        }

        const imagePrompt = `A delicious ${title} dish, professional food photography, appetizing presentation, warm lighting, high quality, 4K`;

        const response = await ai.models.generateContent({
            model: IMAGE_MODEL,
            contents: {
                parts: [{ text: imagePrompt }],
            },
            config: {
                responseModalities: ["image", "text"],
            },
        });

        // Parse response for inline image data
        if (response.candidates && response.candidates[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData?.data) {
                    const base64Data = part.inlineData.data;
                    const mimeType = part.inlineData.mimeType || "image/png";
                    return NextResponse.json({
                        image: `data:${mimeType};base64,${base64Data}`,
                    });
                }
            }
        }

        return NextResponse.json(
            { error: "图片生成失败", image: null },
            { status: 500 }
        );
    } catch (error) {
        console.error("Image generation error:", error);
        return NextResponse.json(
            {
                error: "图片生成失败",
                details: error instanceof Error ? error.message : String(error),
                image: null,
            },
            { status: 500 }
        );
    }
}
