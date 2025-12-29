import knowledge from "@/data/knowledge.json";
import { getEmbedding } from "./embed";
import { cosineSimilarity } from "./similarity";

type KnowledgeItem = {
  keyword: string;
  answer: string;
};

let cachedEmbeddings:
  | { vector: number[]; text: string }[]
  | null = null;

async function prepareEmbeddings(data: KnowledgeItem[]) {
  if (cachedEmbeddings) return cachedEmbeddings;

  cachedEmbeddings = [];

  for (const item of data) {
    // ✅ KEY FIX: embed keyword + answer
    const combinedText = `${item.keyword}. ${item.answer}`;
    const vector = await getEmbedding(combinedText);

    cachedEmbeddings.push({
      vector,
      text: item.answer,
    });
  }

  return cachedEmbeddings;
}

export async function retrieveContext(query: string): Promise<string | null> {
  const queryEmbedding = await getEmbedding(query);
  const embeddings = await prepareEmbeddings(knowledge as KnowledgeItem[]);

  let bestScore = -1;
  let bestAnswer: string | null = null;

  for (const item of embeddings) {
    const score = cosineSimilarity(queryEmbedding, item.vector);

    if (score > bestScore) {
      bestScore = score;
      bestAnswer = item.text;
    }
  }

  console.log("BEST SCORE:", bestScore);

  // ✅ Lower threshold for MiniLM
  return bestScore > 0.30 ? bestAnswer : null;
}
