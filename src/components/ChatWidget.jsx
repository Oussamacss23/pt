import React, { useState } from "react";

export default function ChatWidget({ startOpen = false, large = false, aiAvatar = '/assets/coding-pov.png' }) {
  const [open, setOpen] = useState(startOpen);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  const suggestions = [
    { text: "General Help", desc: "Get general information" },
    { text: "Suggestions", desc: "Help me find things" },
    { text: "Job Application", desc: "Inquire about job opportunities" }
  ];

  async function send(message = input) {
    if (!message.trim()) return;

    setShowWelcome(false);
    const userMsg = { from: "user", text: message };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const proxyUrl = import.meta.env.VITE_OPENAI_PROXY_URL || '/api/chat-fallback';
      const res = await fetch(proxyUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: message }),
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

  const handleSuggestionClick = (suggestion) => {
    send(suggestion.text);
  };

  return (
    <div className="fixed z-50 right-8" style={{ bottom: large ? 80 : 32 }}>
      <div className="flex flex-col items-end">
        {open && (
          <div className={`bg-gray-900 text-white rounded-2xl shadow-2xl border border-gray-700 ${large ? 'w-[28rem] h-[32rem]' : 'w-80 h-96'
            }`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <span className="font-medium">AI Assistant</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Close chat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Chat Content */}
            <div className="flex-1 flex flex-col">
              {showWelcome && messages.length === 0 ? (
                /* Welcome Screen */
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                  <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-2">Hey! Oussama</h2>
                    <p className="text-gray-400">What can I help with?</p>
                  </div>

                  <div className="space-y-3 w-full max-w-xs">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-left transition-colors border border-gray-600"
                      >
                        <div className="font-medium text-sm">{suggestion.text}</div>
                        <div className="text-xs text-gray-400 mt-1">{suggestion.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Messages */
                <div className="flex-1 overflow-auto p-4 space-y-4">
                  {messages.map((m, i) => (
                    m.from === 'ai' ? (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-sm">AI</span>
                        </div>
                        <div className="bg-gray-800 text-white px-4 py-2 rounded-2xl rounded-tl-md max-w-[80%]">
                          {m.text}
                        </div>
                      </div>
                    ) : (
                      <div key={i} className="flex justify-end">
                        <div className="bg-teal-500 text-white px-4 py-2 rounded-2xl rounded-tr-md max-w-[80%]">
                          {m.text}
                        </div>
                      </div>
                    )
                  ))}
                  {loading && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">AI</span>
                      </div>
                      <div className="bg-gray-800 text-white px-4 py-2 rounded-2xl rounded-tl-md">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t border-gray-700">
                <div className="flex items-center gap-2 bg-gray-800 rounded-full px-4 py-2">
                  <input
                    className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && send()}
                    placeholder="Ask me anything..."
                  />
                  <button
                    onClick={() => send()}
                    className="text-teal-500 hover:text-teal-400 transition-colors disabled:opacity-50"
                    disabled={loading || !input.trim()}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="p-4 rounded-full bg-teal-500 hover:bg-teal-600 shadow-lg transition-colors"
            aria-label="Open chat"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.98L3 21l1.98-5.874A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
