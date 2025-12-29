export async function generateAnswer(
  context: string | null,
  question: string
): Promise<string> {

  // 🚫 Guard: never hallucinate
  if (!context) {
    return "I don't have that information yet.";
  }

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `
You are an AI assistant for Kenmark ITan Solutions.

Rules:
- Use ONLY the provided context
- Do NOT add outside knowledge
- If the answer is not present, say you don't know politely

Context:
${context}

Question:
${question}

Answer:
`,
          parameters: {
            max_new_tokens: 150,
            temperature: 0.2,
            return_full_text: false
          }
        }),
      }
    );

    const data = await response.json();

    // 🛑 HF error handling
    if (data?.error) {
      console.error("HuggingFace Error:", data.error);
      return context;
    }

    // ✅ HF returns an array of objects
    if (Array.isArray(data) && data[0]?.generated_text) {
      return data[0].generated_text.trim();
    }

    return context;
  } catch (err) {
    console.error("HF request failed:", err);
    return context;
  }
}
