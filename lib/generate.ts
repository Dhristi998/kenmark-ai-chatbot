export async function generateAnswer(
  context: string | null,
  question: string
): Promise<string> {

  // 🚫 Guard: No context → no hallucination
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
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: `
You are an AI assistant for Kenmark ITan Solutions.
Answer the question using ONLY the information in the context.
If the context does not contain the answer, say politely you don't know.

Context:
${context}

Question:
${question}

Answer:
          `
        })
      }
    );

    const data = await response.json();

    // 🛑 Hugging Face sometimes returns errors as objects
    if (data.error) {
      console.error("HF Error:", data.error);
      return context;
    }

    const generated = data?.[0]?.generated_text;

    // ✂️ Clean up prompt echo
    if (generated) {
      return generated.split("Answer:").pop()?.trim() || context;
    }

    return context;
  } catch (error) {
    console.error("HF fetch failed:", error);
    return context;
  }
}
