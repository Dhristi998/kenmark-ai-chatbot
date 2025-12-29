export async function generateAnswer(
  context: string | null,
  question: string
): Promise<string> {

  if (!context) {
    return "I don't have that information yet.";
  }

  const res = await fetch(
    "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: `
Answer ONLY using the context.

Context:
${context}

Question:
${question}

Answer:
`
      })
    }
  );

  const data = await res.json();
  return data?.[0]?.generated_text?.split("Answer:").pop()?.trim() || context;
}
