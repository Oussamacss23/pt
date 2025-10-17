import React, { useState } from "react";

// Minimal Chat widget that calls a local proxy at /api/openai
// Props:
// - startOpen (bool) : if true the widget starts visible
// - large (bool) : if true render as a mini page / panel
// Note: For production, never expose your OpenAI key in client-side code.

export default function ChatWidget({ startOpen = false, large = false, aiAvatar = '/assets/coding-pov.png' }) {
  const [open, setOpen] = useState(startOpen);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "ai", text: "Hi! Ask me anything about my projects or skills." },
  ]);
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const proxyUrl = import.meta.env.VITE_OPENAI_PROXY_URL || '/api/openai';
      const res = await fetch(proxyUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await res.json();
      if (!res.ok) {
        const err = data?.error || data;
        throw new Error(typeof err === 'string' ? err : JSON.stringify(err));
      }
      const aiText = data?.text || "Sorry, I couldn't get a response.";
      setMessages((m) => [...m, { from: "ai", text: aiText }]);
    } catch (err) {
      setMessages((m) => [...m, { from: "ai", text: "Error: " + err.message }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed z-50 right-8" style={{ bottom: large ? 80 : 32 }}>
      <div className="flex flex-col items-end">
        {open && (
          <div
            className={`p-4 bg-midnight/95 text-white rounded-lg shadow-lg ${
              large ? 'w-96 h-96' : 'w-80 max-w-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold">AI Assistant</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOpen(false)}
                  className="text-sm px-2 py-1 rounded bg-gray-700"
                  aria-label="Close chat"
                >
                  Close
                </button>
              </div>
            </div>

            <div className={`overflow-auto mb-3 ${large ? 'h-64' : 'h-40'}`}>
              {messages.map((m, i) => (
                m.from === 'ai' ? (
                  <div key={i} className="mb-2 text-sm flex items-start gap-2">
                    <img src={aiAvatar} alt="AI avatar" className="w-8 h-8 rounded-full object-cover" />
                    <div className="bg-gray-800 text-white inline-block px-3 py-1 rounded">
                      {m.text}
                    </div>
                  </div>
                ) : (
                  <div key={i} className="mb-2 text-sm text-right">
                    <div className="bg-blue-600 text-white inline-block px-3 py-1 rounded">
                      {m.text}
                    </div>
                  </div>
                )
              ))}
            </div>

            <div className="flex gap-2">
              <input
                className="flex-1 px-2 py-1 rounded bg-white text-black placeholder-gray-500 focus:outline-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Ask me about this portfolio..."
              />
              <button onClick={send} className="px-3 py-1 bg-sand rounded" disabled={loading}>
                {loading ? '...' : 'Send'}
              </button>
            </div>
          </div>
        )}

        {!open && (
          <button
            onClick={() => setOpen((s) => !s)}
            className="p-3 rounded-full bg-sand shadow-lg"
            aria-label="Toggle chat"
          >
            💬
          </button>
        )}
      </div>
    </div>
  );
}
