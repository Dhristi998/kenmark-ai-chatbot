import knowledge from "@/data/knowledge.json";
import { getEmbedding } from "./embed";
import { cosineSimilarity } from "./similarity";

export async function retrieveContext(query: string): Promise<string | null> {
  const lowerQuery = query.toLowerCase();

  // 🔹 1. HARD KEYWORD FALLBACK (GUARANTEED)
  for (const item of knowledge) {
    if (lowerQuery.includes(item.keyword)) {
      return item.answer;
    }
  }

  // 🔹 2. SEMANTIC SEARCH
  const queryEmbedding = await getEmbedding(query);

  let bestScore = 0;
  let bestAnswer: string | null = null;

  for (const item of knowledge) {
    const enrichedText = `
      ${item.keyword}
      contact reach email phone support help communication
      ${item.answer}
    `;

    const itemEmbedding = await getEmbedding(enrichedText);
    const score = cosineSimilarity(queryEmbedding, itemEmbedding);

    if (score > bestScore) {
      bestScore = score;
      bestAnswer = item.answer;
    }
  }

  console.log("QUERY:", query);
  console.log("BEST SCORE:", bestScore);
  console.log("BEST ANSWER:", bestAnswer);

  return bestScore > 0.22 ? bestAnswer : null;
}
