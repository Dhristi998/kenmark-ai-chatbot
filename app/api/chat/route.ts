import { NextResponse } from "next/server";
import { retrieveContext } from "@/lib/retrieve";
import { generateAnswer } from "@/lib/generate";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const context = await retrieveContext(message);
    console.log("Retrieved context:", context);

    const reply = await generateAnswer(context, message);

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json(
      { reply: "Backend error occurred." },
      { status: 500 }
    );
  }
}
