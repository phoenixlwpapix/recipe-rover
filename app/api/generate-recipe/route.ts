import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { parseRecipe } from "../../../utils/recipeParser";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
      model: "imagen-4.0-generate-001",
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: "image/png",
        aspectRatio: "16:9",
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string =
        response.generatedImages[0].image!.imageBytes!;
      return `data:image/png;base64,${base64ImageBytes}`;
    }
    throw new Error("error_no_image_generated");
  } catch (error) {
    console.error("Error generating image:", error);
    if (
      error instanceof Error &&
      error.message === "error_no_image_generated"
    ) {
      throw error;
    }
    throw new Error("error_generate_image");
  }
};

export async function POST(request: NextRequest) {
  try {
    const { ingredients, cuisine, prompt } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const parsedRecipe = parseRecipe(text);
    const imagePrompt = `A delicious ${parsedRecipe.title} dish, photorealistic, high quality, food photography`;
    const image = await generateImage(imagePrompt);

    return NextResponse.json({ recipe: text, image });
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
