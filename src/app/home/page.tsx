"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  IconFileInvoice,
  IconBook2,
  IconChartBar,
  IconRefresh,
} from "@tabler/icons-react";

export default function Page() {
  const router = useRouter();
  const [chatStarted, setChatStarted] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<
    { sender: "user" | "ai"; text: string }[]
  >([]);
  const [aiLoading, setAiLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Simulate AI response with delay
  function getAIResponse(userMsg: string): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`You said: "${userMsg}". How can I help further?`);
      }, 900);
    });
  }

  async function handleChatSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!chatInput.trim() || aiLoading) return;
    const userMsg = chatInput.trim();
    setMessages((msgs) => [...msgs, { sender: "user", text: userMsg }]);
    setChatInput("");
    setChatStarted(true);
    setAiLoading(true);
    const aiMsg = await getAIResponse(userMsg);
    setMessages((msgs) => [...msgs, { sender: "ai", text: aiMsg }]);
    setAiLoading(false);
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (chatInput.trim() && !aiLoading) {
        handleChatSubmit(e as any);
      }
    }
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, aiLoading]);

  function handleRestart() {
    setMessages([]);
    setChatInput("");
    setChatStarted(false);
    setAiLoading(false);
  }

  function FeatureCards() {
    return (
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl min-w-0">
        <button
          className="flex-1 flex flex-col items-center p-8 border border-gray-200 rounded-2xl bg-gray-50 text-lg font-semibold cursor-pointer shadow transition-shadow hover:shadow-lg min-w-0"
          onClick={() => router.push("/e-invoicing")}
        >
          <IconFileInvoice className="mb-3 h-10 w-10 text-blue-500" />
          <span className="whitespace-nowrap w-full text-center">
            E-invoicing
          </span>
        </button>
        <button
          className="flex-1 flex flex-col items-center p-8 border border-gray-200 rounded-2xl bg-gray-50 text-lg font-semibold cursor-pointer shadow transition-shadow hover:shadow-lg min-w-0"
          onClick={() => router.push("/bookkeeping")}
        >
          <IconBook2 className="mb-3 h-10 w-10 text-green-500" />
          <span className="whitespace-nowrap w-full text-center">
            Bookkeeping
          </span>
        </button>
        <button
          className="flex-1 flex flex-col items-center p-8 border border-gray-200 rounded-2xl bg-gray-50 text-lg font-semibold cursor-pointer shadow transition-shadow hover:shadow-lg min-w-0"
          onClick={() => router.push("/analytics")}
        >
          <IconChartBar className="mb-3 h-10 w-10 text-purple-500" />
          <span className="whitespace-nowrap w-full text-center">
            Analytics
          </span>
        </button>
      </div>
    );
  }

  return (
    <main className="h-full w-full flex items-center justify-center bg-gradient-to-b from-white to-blue-50 px-4">
      <div className="w-full max-w-4xl">
        {!chatStarted && (
          <>
            <h1 className="text-5xl font-bold mb-12 text-center">Welcome!</h1>
            <div className="mb-12 flex justify-center">
              <FeatureCards />
            </div>
            <p className="mb-6 text-2xl text-center">
              How may I assist you today?
            </p>
            <form
              onSubmit={handleChatSubmit}
              className="w-full max-w-2xl mx-auto flex gap-4"
            >
              <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Chat with me"
                rows={4}
                className="flex-1 p-5 text-2xl border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none bg-white"
                style={{ minHeight: "64px", maxHeight: "140px" }}
              />
              <button
                type="submit"
                className="px-8 py-4 bg-blue-600 text-white text-xl rounded-xl hover:bg-blue-700 disabled:opacity-60"
                disabled={aiLoading}
              >
                Send
              </button>
            </form>
          </>
        )}

        {chatStarted && (
          <div
            className="w-full max-h-screen max-w-4xl flex flex-col gap-4 mx-auto"
            style={{ height: "80vh", minHeight: 480 }}
          >
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-2xl">Chat</span>
              <button
                onClick={handleRestart}
                className="flex items-center gap-2 text-gray-500 hover:text-blue-600 text-lg"
                title="Restart chat"
              >
                <IconRefresh className="w-6 h-6" /> Restart
              </button>
            </div>
            <div className="flex-1 min-h-0 flex flex-col">
              <div className="flex flex-col gap-4 min-h-[320px] max-h-[500px] overflow-y-auto bg-white rounded-2xl p-6 border border-gray-200 shadow-inner">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-5 rounded-xl max-w-[80%] break-words break-all text-xl ${
                      msg.sender === "user"
                        ? "bg-blue-100 self-end text-right"
                        : "bg-gray-100 self-start text-left"
                    }`}
                  >
                    {msg.text}
                  </div>
                ))}
                {aiLoading && (
                  <div className="p-5 rounded-xl bg-gray-100 text-left text-gray-400 max-w-[80%] self-start animate-pulse text-xl">
                    AI is typing...
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            </div>
            <form onSubmit={handleChatSubmit} className="flex gap-4 mt-2">
              <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Type your message..."
                rows={2}
                className="flex-1 p-4 text-2xl border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none bg-white"
                style={{ minHeight: "64px", maxHeight: "140px" }}
                disabled={aiLoading}
              />
              <button
                type="submit"
                className="px-8 py-4 bg-blue-600 text-white text-xl rounded-xl hover:bg-blue-700 disabled:opacity-60"
                disabled={aiLoading || !chatInput.trim()}
              >
                Send
              </button>
            </form>
            <div className="mt-12 max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium shadow-sm hover:shadow-md hover:bg-gray-100 transition"
                  onClick={() => router.push("/e-invoicing")}
                >
                  <IconFileInvoice className="h-5 w-5 text-blue-500" />
                  <span>E-invoicing</span>
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium shadow-sm hover:shadow-md hover:bg-gray-100 transition"
                  onClick={() => router.push("/bookkeeping")}
                >
                  <IconBook2 className="h-5 w-5 text-green-500" />
                  <span>Bookkeeping</span>
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium shadow-sm hover:shadow-md hover:bg-gray-100 transition"
                  onClick={() => router.push("/analytics")}
                >
                  <IconChartBar className="h-5 w-5 text-purple-500" />
                  <span>Analytics</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
