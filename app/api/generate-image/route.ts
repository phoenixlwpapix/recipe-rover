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
        const { title, ingredients, instructions } = await request.json();

        if (!title) {
            return NextResponse.json(
                { error: "缺少 title 参数" },
                { status: 400 }
            );
        }

        const ingredientsText = Array.isArray(ingredients) ? ingredients.join(", ") : ingredients || "";
        const instructionsContext = instructions ? instructions.slice(0, 200).replace(/\n/g, " ") : "";

        // Constructed prompt based on user requirements and Michelin style guide
        const imagePrompt = `
Subject: ${title}.
Key Ingredients: ${ingredientsText}.
Cooking Context: ${instructionsContext}.

Style Description: Top-down flat lay of a Michelin-star fine dining main course, high-end commercial aesthetic, dish centered with balanced composition and generous negative space. Only small aromatic spices and herbs (such as whole peppercorns, star anise, bay leaves, thyme sprigs, rosemary, dried chili flakes) delicately scattered around the plate as decoration - absolutely NO main ingredients like meat chunks, cut vegetables, or cooked proteins outside the plate. Elegant white porcelain plate with clean lines, low-saturation color palette emphasizing texture and refinement. Soft directional overhead lighting creating subtle shadows to enhance form and detail. Background in dark luxury tones (charcoal, deep gray, dark walnut wood). Calm, elegant, professional mood suitable for luxury restaurant menus and Michelin-level visual branding, ultra-high resolution, photorealistic food photography.
`.trim();

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
