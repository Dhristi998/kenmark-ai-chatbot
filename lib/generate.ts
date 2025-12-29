export async function generateAnswer(
  context: string | null,
  question: string
): Promise<string> {

  if (!context) {
    return "I don't have that information yet.";
  }

  const response = await fetch(
    "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: `Context:\n${context}\n\nQuestion:\n${question}\n\nAnswer:`
      })
    }
  );

  const data = await response.json();
  const text = data?.[0]?.generated_text;

  return text?.split("Answer:").pop()?.trim() || context;
}
