import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Send, RotateCcw, Bot, Maximize2, Minimize2, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { api } from '../services/api';

export default function MillworkAiWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [sessionId, setSessionId] = useState(() => {
    return sessionStorage.getItem('vww_ai_session_id') || ('sess_' + Math.random().toString(36).substring(2, 9));
  });
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: 'Namaste! I am **Vishwakarma AI**, your architectural millwork & digital quotation consultant.\n\nNeed advice on **plywood grades (BWP/BWR/HDHMR)**, **shutter finishes**, or how our **direct workshop rates & 300-DPI A4 quotations** work? Ask me anything!'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    sessionStorage.setItem('vww_ai_session_id', sessionId);
  }, [sessionId]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isExpanded]);

  const handleSend = async (messageText) => {
    const text = (messageText || input).trim();
    if (!text || isLoading) return;

    const userMessage = { sender: 'user', text };
    setMessages((prev) => [...prev, userMessage]);
    if (!messageText) setInput('');
    setIsLoading(true);

    try {
      const response = await api.askPublicAi(text, sessionId);
      if (response && response.reply) {
        if (response.sessionId) setSessionId(response.sessionId);
        setMessages((prev) => [...prev, { sender: 'assistant', text: response.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: 'assistant', text: 'I received an empty response from the workshop brain. Please try asking again!' }
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: '⚠️ Unable to connect to the backend AI service. Please ensure the Spring Boot server is running on port 8080.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    const newSession = 'sess_' + Math.random().toString(36).substring(2, 9);
    setSessionId(newSession);
    setMessages([
      {
        sender: 'assistant',
        text: 'Consultation cleared! What woodwork, cabinetry, or estimation question can I assist you with?'
      }
    ]);
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <aside aria-label="AI Quotation Assistant" className="fixed bottom-24 right-6 z-40 flex items-center group">
        <div className="hidden sm:block mr-3 px-3 py-1.5 rounded-lg bg-[#2b1a0e] text-amber-100 text-xs font-medium shadow-lg border border-amber-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          ✨ Ask Millwork AI Estimator
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#2b1a0e] via-amber-900 to-amber-700 text-amber-100 flex items-center justify-center shadow-xl hover:scale-105 transition-all focus:outline-none focus:ring-4 focus:ring-amber-500/30 border border-amber-500/30"
          aria-label="Toggle AI Millwork Estimator"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />}
        </button>
      </aside>

      {/* Floating Chat Modal */}
      {isOpen && (
        <div 
          className={`fixed z-50 bg-white dark:bg-[#1a120b] rounded-2xl shadow-2xl border border-amber-900/20 dark:border-amber-700/30 flex flex-col overflow-hidden font-sans transition-all duration-300 ${
            isExpanded
              ? 'inset-4 sm:inset-10 w-auto h-auto max-w-4xl mx-auto'
              : 'bottom-40 right-4 sm:right-6 w-[94vw] sm:w-[480px] md:w-[520px] h-[640px] max-h-[82vh]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#2b1a0e] via-[#3a2212] to-[#4a2d18] text-white px-4 py-3 flex items-center justify-between border-b border-amber-900/30 select-none">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-inner">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-sm tracking-wide text-amber-100 flex items-center gap-2">
                  Vishwakarma AI
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <div className="text-[11px] text-amber-200/80">Millwork & Digital Quotation Consultant</div>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Collapse View" : "Expand Full View"}
                className="p-1.5 rounded-lg text-amber-200/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={handleReset}
                title="Restart Consultation"
                className="p-1.5 rounded-lg text-amber-200/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                className="p-1.5 rounded-lg text-amber-200/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Suggestions Bar */}
          <div className="bg-[#faf7f2] dark:bg-[#22170f] px-3 py-2 border-b border-stone-200 dark:border-stone-800 flex gap-2 overflow-x-auto text-[11px] no-scrollbar">
            <button
              onClick={() => handleSend('Explain BWP vs BWR vs HDHMR for kitchen and wardrobes.')}
              className="px-3 py-1.5 rounded-full bg-white dark:bg-[#2e2015] border border-stone-300 dark:border-stone-700 hover:border-amber-600 text-stone-700 dark:text-stone-300 whitespace-nowrap transition-colors shadow-2xs font-medium"
            >
              🪵 BWP vs BWR vs HDHMR
            </button>
            <button
              onClick={() => handleSend('How is modular kitchen cost calculated per square foot with SAC 9954?')}
              className="px-3 py-1.5 rounded-full bg-white dark:bg-[#2e2015] border border-stone-300 dark:border-stone-700 hover:border-amber-600 text-stone-700 dark:text-stone-300 whitespace-nowrap transition-colors shadow-2xs font-medium"
            >
              🍳 Kitchen Rates Breakdown
            </button>
            <button
              onClick={() => handleSend('What finishes are available for designer wardrobes (Acrylic vs Laminate vs Veneer)?')}
              className="px-3 py-1.5 rounded-full bg-white dark:bg-[#2e2015] border border-stone-300 dark:border-stone-700 hover:border-amber-600 text-stone-700 dark:text-stone-300 whitespace-nowrap transition-colors shadow-2xs font-medium"
            >
              🚪 Wardrobe Finishes
            </button>
            <button
              onClick={() => handleSend('Explain SAC 9954 and 18% GST compliance for millwork quotes.')}
              className="px-3 py-1.5 rounded-full bg-white dark:bg-[#2e2015] border border-stone-300 dark:border-stone-700 hover:border-amber-600 text-stone-700 dark:text-stone-300 whitespace-nowrap transition-colors shadow-2xs font-medium"
            >
              📜 SAC 9954 & GST
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#fbf9f5] dark:bg-[#140d08]">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`relative group max-w-[92%] sm:max-w-[88%] rounded-2xl p-4 text-[13px] sm:text-[14px] leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-[#2b1a0e] to-amber-900 text-amber-50 rounded-br-xs'
                      : 'bg-white dark:bg-[#20160e] text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-800 rounded-bl-xs'
                  }`}
                >
                  {/* Copy Button for Assistant responses */}
                  {msg.sender === 'assistant' && (
                    <button
                      onClick={() => copyToClipboard(msg.text, index)}
                      title="Copy response"
                      className="absolute top-2.5 right-2.5 p-1 rounded-md text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-100 dark:bg-stone-800"
                    >
                      {copiedIndex === index ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  )}

                  {/* Rich GFM Markdown Renderer */}
                  {msg.sender === 'user' ? (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  ) : (
                    <div className="markdown-prose prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h3: ({ node, ...props }) => (
                            <h3 className="font-semibold text-stone-900 dark:text-amber-100 text-sm mt-3 mb-1.5 flex items-center gap-1.5" {...props} />
                          ),
                          h4: ({ node, ...props }) => (
                            <h4 className="font-semibold text-stone-800 dark:text-amber-200 text-xs mt-2.5 mb-1" {...props} />
                          ),
                          p: ({ node, ...props }) => (
                            <p className="my-1.5 text-stone-800 dark:text-stone-200" {...props} />
                          ),
                          ul: ({ node, ...props }) => (
                            <ul className="my-2 ml-4 list-disc space-y-1 text-stone-800 dark:text-stone-200" {...props} />
                          ),
                          ol: ({ node, ...props }) => (
                            <ol className="my-2 ml-4 list-decimal space-y-1 text-stone-800 dark:text-stone-200" {...props} />
                          ),
                          li: ({ node, ...props }) => (
                            <li className="pl-0.5" {...props} />
                          ),
                          strong: ({ node, ...props }) => (
                            <strong className="font-semibold text-amber-950 dark:text-amber-200" {...props} />
                          ),
                          hr: () => (
                            <hr className="my-3 border-stone-200 dark:border-stone-800" />
                          ),
                          // Beautiful Responsive Table
                          table: ({ node, ...props }) => (
                            <div className="my-3 overflow-x-auto rounded-xl border border-stone-300 dark:border-stone-700 shadow-2xs">
                              <table className="w-full text-left text-xs border-collapse" {...props} />
                            </div>
                          ),
                          thead: ({ node, ...props }) => (
                            <thead className="bg-[#f0eae1] dark:bg-[#2b1e15] text-amber-950 dark:text-amber-100 font-semibold border-b border-stone-300 dark:border-stone-700" {...props} />
                          ),
                          th: ({ node, ...props }) => (
                            <th className="px-3 py-2 text-xs font-semibold whitespace-nowrap" {...props} />
                          ),
                          tbody: ({ node, ...props }) => (
                            <tbody className="divide-y divide-stone-200 dark:divide-stone-800 bg-white dark:bg-[#1a120b]" {...props} />
                          ),
                          tr: ({ node, ...props }) => (
                            <tr className="hover:bg-amber-50/50 dark:hover:bg-amber-950/20 transition-colors" {...props} />
                          ),
                          td: ({ node, ...props }) => (
                            <td className="px-3 py-2 text-stone-700 dark:text-stone-300 align-top text-xs" {...props} />
                          )
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2.5 text-stone-500 dark:text-stone-400 text-xs px-2 py-2 bg-white/60 dark:bg-black/20 rounded-xl border border-amber-900/10 w-fit">
                <span className="w-2 h-2 rounded-full bg-amber-600 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-amber-600 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-amber-600 animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-xs font-medium text-stone-600 dark:text-stone-300">Consulting workshop calculation engine...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white dark:bg-[#1a120b] border-t border-stone-200 dark:border-stone-800 flex gap-2 items-center"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about plywood grades, modular kitchen rates, SAC 9954..."
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-100 dark:bg-[#251b13] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-amber-600 dark:focus:border-amber-500 transition-colors"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#2b1a0e] to-amber-800 hover:from-[#3d2614] hover:to-amber-700 text-amber-100 flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
