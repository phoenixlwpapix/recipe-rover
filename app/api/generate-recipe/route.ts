import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Initialize the API client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// Model configuration
const TEXT_MODEL = "gemini-2.5-flash";

/**
 * 生成食谱文本
 */
const generateRecipeText = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
    });

    const text = (response as GenerateContentResponse).text;
    if (!text) {
      throw new Error("No text generated");
    }
    return text;
  } catch (error) {
    console.error("Error generating recipe text:", error);
    throw error;
  }
};

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "缺少 prompt 参数" },
        { status: 400 }
      );
    }

    // 只生成食谱文本，图片异步生成
    const recipeText = await generateRecipeText(prompt);

    return NextResponse.json({
      recipe: recipeText,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        error: "生成失败",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
