import knowledge from "@/data/knowledge.json";
import { getEmbedding } from "./embed";
import { cosineSimilarity } from "./similarity";

export async function retrieveContext(query: string): Promise<string | null> {
  const queryEmbedding = await getEmbedding(query);

  let bestScore = -1;
  let bestAnswer: string | null = null;

  for (const item of knowledge) {
    const itemEmbedding = await getEmbedding(item.keyword);
    const score = cosineSimilarity(queryEmbedding, itemEmbedding);

    if (score > bestScore) {
      bestScore = score;
      bestAnswer = item.answer;
    }
  }

  return bestScore > 0.4 ? bestAnswer : null;
}
