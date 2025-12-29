import knowledge from "../data/knowledge.json";
import { loadExcelKnowledge } from "./loadExcel";
import { getEmbedding } from "./embed";
import { cosineSimilarity } from "./similarity";

type KnowledgeItem = {
  keyword: string;
  answer: string;
};

const embeddingCache = new Map<string, number[]>();

async function cachedEmbedding(text: string) {
  if (!embeddingCache.has(text)) {
    embeddingCache.set(text, await getEmbedding(text));
  }
  return embeddingCache.get(text)!;
}

export async function retrieveContext(query: string): Promise<string | null> {
  const q = query.toLowerCase();

  const combined: KnowledgeItem[] = [
    ...(knowledge as KnowledgeItem[]),
    ...loadExcelKnowledge()
  ];

  // ✅ KEYWORD FAST PATH
  const keywordMatch = combined.find(item =>
    q.includes(item.keyword.toLowerCase())
  );
  if (keywordMatch) return keywordMatch.answer;

  // ✅ SEMANTIC PATH
  try {
    const queryEmbedding = await cachedEmbedding(query);

    let bestScore = 0;
    let bestAnswer: string | null = null;

    for (const item of combined) {
      const answerEmbedding = await cachedEmbedding(item.answer);
      const score = cosineSimilarity(queryEmbedding, answerEmbedding);

      if (score > bestScore) {
        bestScore = score;
        bestAnswer = item.answer;
      }
    }

    console.log("Semantic score:", bestScore);
    return bestScore > 0.45 ? bestAnswer : null;

  } catch (err) {
    console.error("Semantic failed:", err);
    return null;
  }
}
