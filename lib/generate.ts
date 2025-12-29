export async function generateAnswer(
  context: string | null,
  question: string
): Promise<string> {
  if (!context) {
    return "I don’t have that information yet.";
  }

  return context;
}
