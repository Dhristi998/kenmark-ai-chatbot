"use client";
import { useState, useEffect, useRef } from "react";

type Message = {
  role: "user" | "bot";
  text: string;
};

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Hi! I’m the Kenmark AI Assistant 👋 How can I help you?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  async function sendMessage() {
    if (!input.trim()) return;

    const userText = input;
    setInput("");
    setTyping(true);

    setMessages((prev) => [...prev, { role: "user", text: userText }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "bot", text: data.reply || "No response generated." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Backend error occurred." },
      ]);
    } finally {
      setTyping(false);
    }
  }

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-black text-white rounded-xl shadow-2xl">
      <div className="p-3 font-semibold border-b border-gray-700">
        Kenmark AI Assistant
      </div>

      <div className="h-64 overflow-y-auto p-3 space-y-2 text-sm">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`px-3 py-2 rounded-lg max-w-[75%] ${
              m.role === "user" ? "bg-white text-black" : "bg-gray-800"
            }`}>
              {m.text}
            </div>
          </div>
        ))}

        {typing && <div className="text-xs text-gray-400">Typing…</div>}
        <div ref={endRef} />
      </div>

      <div className="p-2 border-t border-gray-700">
        <input
          className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-sm"
          placeholder="Ask about Kenmark ITan..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
      </div>
    </div>
  );
}
