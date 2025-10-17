export interface ParsedRecipe {
  title: string;
  ingredients: string;
  instructions: string;
  tips?: string;
}

export function parseRecipe(text: string): ParsedRecipe {
  console.log("原始食谱文本:", text);

  // 使用正则表达式更灵活地解析
  const titleMatch =
    text.match(/\*\*标题[:：]\*\*\s*(.+)/i) || text.match(/标题[:：]\s*(.+)/i);
  const title = titleMatch ? titleMatch[1].trim() : "";

  // 提取材料部分 (Ingredients)
  const ingredientsSection =
    text.match(/\*\*材料[:：]\*\*\s*\n?([\s\S]*?)(?=\*\*步骤[:：]\*\*|$)/i) ||
    text.match(/材料[:：]\s*\n?([\s\S]*?)(?=步骤[:：]|$)/i) ||
    text.match(
      /\*\*Ingredients[:：]\*\*\s*\n?([\s\S]*?)(?=\*\*Method[:：]\*\*|$)/i
    ) ||
    text.match(/Ingredients[:：]\s*\n?([\s\S]*?)(?=Method[:：]|$)/i);
  const ingredients = ingredientsSection ? ingredientsSection[1].trim() : "";

  // 提取步骤部分 (Method)
  const instructionsSection =
    text.match(/\*\*步骤[:：]\*\*\s*\n?([\s\S]*?)(?=\*\*Tips[:：]?\*\*|$)/i) ||
    text.match(/步骤[:：]\s*\n?([\s\S]*?)(?=Tips[:：]?|$)/i) ||
    text.match(
      /\*\*Method[:：]\*\*\s*\n?([\s\S]*?)(?=\*\*Tips[:：]?\*\*|$)/i
    ) ||
    text.match(/Method[:：]\s*\n?([\s\S]*?)(?=Tips[:：]?|$)/i);
  const instructions = instructionsSection ? instructionsSection[1].trim() : "";

  // 提取Tips部分
  const tipsSection =
    text.match(/\*\*Tips[:：]?\*\*\s*\n?([\s\S]*)/i) ||
    text.match(/Tips[:：]?\s*\n?([\s\S]*)/i);
  const tips = tipsSection ? tipsSection[1].trim() : "";

  const result = { title, ingredients, instructions, tips };
  console.log("解析结果:", result);

  return result;
}
