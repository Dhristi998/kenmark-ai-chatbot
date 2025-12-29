import { NextResponse } from "next/server";
import { retrieveContext } from "@/lib/retrieve";
import { generateAnswer } from "@/lib/generate";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const context = await retrieveContext(message);
    const reply = await generateAnswer(context, message);

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json(
      { reply: "Backend error occurred." },
      { status: 500 }
    );
  }
}
