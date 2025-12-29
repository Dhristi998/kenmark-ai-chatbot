export async function getEmbedding(text: string): Promise<number[]> {
  const res = await fetch(
    "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: text })
    }
  );

  const data = await res.json();
  return Array.isArray(data[0]) ? data[0] : data;
}
