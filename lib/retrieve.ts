import knowledge from "@/data/knowledge.json";
import { getEmbedding } from "./embed";
import { cosineSimilarity } from "./similarity";

type KnowledgeItem = {
  keyword: string;
  answer: string;
};

const THRESHOLD = 0.35;
const cache = new Map<string, number[]>();

async function embedCached(text: string) {
  if (!cache.has(text)) {
    cache.set(text, await getEmbedding(text));
  }
  return cache.get(text)!;
}

export async function retrieveContext(query: string): Promise<string | null> {
  const q = query.toLowerCase();
  const items = knowledge as KnowledgeItem[];

  // ✅ 1. STRONG keyword matching
  for (const item of items) {
    if (q.includes(item.keyword.toLowerCase())) {
      return item.answer;
    }
  }

  // ✅ 2. Semantic fallback
  const qEmb = await embedCached(query);

  let bestScore = 0;
  let bestAnswer: string | null = null;

  for (const item of items) {
    const kEmb = await embedCached(item.keyword);
    const score = cosineSimilarity(qEmb, kEmb);

    if (score > bestScore) {
      bestScore = score;
      bestAnswer = item.answer;
    }
  }

  return bestScore >= THRESHOLD ? bestAnswer : null;
}
