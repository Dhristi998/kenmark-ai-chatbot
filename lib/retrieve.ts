import { loadKnowledge } from "./loadExcel";
import { getEmbedding } from "./embed";
import { cosineSimilarity } from "./similarity";

const SIMILARITY_THRESHOLD = 0.4;

export async function retrieveContext(query: string): Promise<string | null> {
  const knowledge = loadKnowledge();

  // 1️⃣ DIRECT STRING MATCH (MOST IMPORTANT)
  const lowerQuery = query.toLowerCase();

  for (const row of knowledge) {
    if (row.text.toLowerCase().includes(lowerQuery)) {
      return row.text;
    }
  }

  // 2️⃣ SEMANTIC MATCH (INDIRECT QUESTIONS)
  const queryEmbedding = await getEmbedding(query);

  let bestScore = 0;
  let bestText: string | null = null;

  for (const row of knowledge) {
    const emb = await getEmbedding(row.text);
    const score = cosineSimilarity(queryEmbedding, emb);

    if (score > bestScore) {
      bestScore = score;
      bestText = row.text;
    }
  }

  if (bestScore >= SIMILARITY_THRESHOLD) {
    return bestText;
  }

  return null;
}
