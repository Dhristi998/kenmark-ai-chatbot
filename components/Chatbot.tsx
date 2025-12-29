"use client";
import { useState, useEffect, useRef } from "react";

type Message = {
  role: "user" | "bot";
  text: string;
};

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Hi! I’m the Kenmark AI Assistant 👋 How can I help you?",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");

    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "bot", text: data.reply },
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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-[#0f0f0f] text-white rounded-xl shadow-2xl overflow-hidden">
      <div className="px-4 py-3 bg-black border-b border-gray-800 font-semibold">
        Kenmark AI Assistant
      </div>

      <div className="h-64 px-3 py-2 overflow-y-auto space-y-2 text-sm">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-3 py-2 rounded-lg max-w-[75%] ${
                msg.role === "user"
                  ? "bg-white text-black"
                  : "bg-gray-800 text-white"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {typing && (
          <div className="text-xs text-gray-400">Typing…</div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-800 p-2">
        <input
          className="w-full bg-black border border-gray-700 rounded-md px-3 py-2 text-sm"
          placeholder="Ask about Kenmark ITan..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
      </div>
    </div>
  );
}
