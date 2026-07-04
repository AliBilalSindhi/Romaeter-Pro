import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { Terminal, Send, Sparkles, MessageSquare, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';

const SUGGESTIONS = [
  {
    label: "Stuck in Bootloop?",
    prompt: "I flashed a custom ROM and my device is stuck on the boot logo (bootloop). What are the exact recovery steps to fix this?"
  },
  {
    label: "Fix Play Integrity",
    prompt: "How can I bypass Google Play Integrity and SafetyNet on a rooted custom ROM running Android 14?"
  },
  {
    label: "GApps vs Vanilla",
    prompt: "What is the difference between Vanilla and GApps builds? Which one should I select and are there custom options?"
  },
  {
    label: "Backup EFS/IMEI",
    prompt: "Why is it critical to backup my EFS/IMEI partitions before flashing, and how can I do it using custom recovery?"
  }
];

export default function AiAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "### Welcome to the Custom ROM Flashing Assistant!\n\nI am your specialized server-side **AI Troubleshooter**. Ask me anything about:\n- Bootloops, brick recovery, and ADB/fastboot errors\n- Root access (Magisk, KernelSU) & bypassing Play Integrity\n- Dynamic partitions & dynamic flashing (`fastbootd`)\n\n*Choose a quick troubleshooting prompt below, or type your custom modding question!*",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            text: m.text
          }))
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "The server could not process the request. Make sure your GEMINI_API_KEY is configured.");
      }

      const data = await response.json();
      const modelMessage: Message = {
        role: 'model',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, modelMessage]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Unable to reach the AI Flashing Assistant. Check your network or API key settings.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm("Clear chat history?")) {
      setMessages([
        {
          role: 'model',
          text: "Welcome back! How can I help you customize or troubleshoot your Android device today?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setError(null);
    }
  };

  // Safe Lightweight Custom Markdown & Text Formatter for elegant presentation
  const renderFormattedText = (rawText: string) => {
    const lines = rawText.split('\n');
    let insideCodeBlock = false;
    let codeBlockContent: string[] = [];
    const elements: React.ReactNode[] = [];

    lines.forEach((line, idx) => {
      // Toggle triple backtick code blocks
      if (line.trim().startsWith('```')) {
        if (insideCodeBlock) {
          // Close block
          elements.push(
            <pre key={`code-${idx}`} className="p-3 bg-black border border-white/5 rounded-xl font-mono text-[11px] text-amber-400 overflow-x-auto my-2 select-all">
              <code>{codeBlockContent.join('\n')}</code>
            </pre>
          );
          codeBlockContent = [];
          insideCodeBlock = false;
        } else {
          insideCodeBlock = true;
        }
        return;
      }

      if (insideCodeBlock) {
        codeBlockContent.push(line);
        return;
      }

      // Headers ###
      if (line.trim().startsWith('###')) {
        const text = line.replace('###', '').trim();
        elements.push(
          <h4 key={idx} className="text-sm font-serif italic text-zinc-100 mt-3 mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" /> {text}
          </h4>
        );
        return;
      }

      // Bullet points
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const text = line.trim().substring(2);
        elements.push(
          <div key={idx} className="flex items-start gap-1.5 ml-2 my-1 text-xs text-white/75 leading-relaxed">
            <span className="text-amber-500 font-bold shrink-0 mt-0.5">•</span>
            <span>{parseInlineStyles(text)}</span>
          </div>
        );
        return;
      }

      // Default line
      if (line.trim() === '') {
        elements.push(<div key={idx} className="h-2" />);
      } else {
        elements.push(
          <p key={idx} className="text-xs text-white/70 leading-relaxed my-1">
            {parseInlineStyles(line)}
          </p>
        );
      }
    });

    return elements;
  };

  // Helper to parse **bold** and `code` inside lines
  const parseInlineStyles = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let currentText = text;
    let keyIdx = 0;

    while (currentText.length > 0) {
      const boldMatch = currentText.match(/\*\*(.*?)\*\*/);
      const codeMatch = currentText.match(/`(.*?)`/);

      const boldIndex = boldMatch && boldMatch.index !== undefined ? boldMatch.index : -1;
      const codeIndex = codeMatch && codeMatch.index !== undefined ? codeMatch.index : -1;

      if (boldIndex === -1 && codeIndex === -1) {
        parts.push(<span key={keyIdx++}>{currentText}</span>);
        break;
      }

      // Bold tag appears first or is the only one
      if (boldIndex !== -1 && (codeIndex === -1 || boldIndex < codeIndex)) {
        if (boldIndex > 0) {
          parts.push(<span key={keyIdx++}>{currentText.substring(0, boldIndex)}</span>);
        }
        parts.push(
          <strong key={keyIdx++} className="font-semibold text-white bg-white/5 px-1 py-0.5 rounded text-[11px] border border-white/10">
            {boldMatch[1]}
          </strong>
        );
        currentText = currentText.substring(boldIndex + boldMatch[0].length);
      } else if (codeIndex !== -1) {
        // Code tag appears first or is the only one
        if (codeIndex > 0) {
          parts.push(<span key={keyIdx++}>{currentText.substring(0, codeIndex)}</span>);
        }
        parts.push(
          <code key={keyIdx++} className="px-1.5 py-0.5 bg-black border border-white/5 rounded text-[11px] font-mono text-amber-400 select-all">
            {codeMatch[1]}
          </code>
        );
        currentText = currentText.substring(codeIndex + codeMatch[0].length);
      }
    }

    return parts;
  };

  return (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl flex flex-col h-[560px] relative overflow-hidden">
      {/* Terminal Title Bar */}
      <div className="p-4 bg-[#080808]/60 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-zinc-100 font-mono tracking-wider flex items-center gap-1">
              FLASH-ASSIST-BOT_v1.2
            </h3>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
              <span className="text-[9px] text-white/40 font-mono uppercase tracking-wider">SECURE SERVER-SIDE CONTEXT</span>
            </div>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="text-[10px] font-mono text-white/30 hover:text-white transition-colors cursor-pointer uppercase tracking-wider"
        >
          CLEAR LOG
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans select-text scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent">
        {messages.map((msg, index) => {
          const isModel = msg.role === 'model';
          return (
            <div
              key={index}
              className={`flex flex-col max-w-[85%] ${isModel ? 'self-start mr-auto' : 'self-end ml-auto'}`}
            >
              {/* Badge */}
              <span className={`text-[9px] font-mono mb-1 text-white/30 ${isModel ? 'text-left' : 'text-right'}`}>
                {isModel ? 'SYSTEM' : 'USER'} • {msg.timestamp}
              </span>

              {/* Message Bubble */}
              <div
                className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                  isModel
                    ? 'bg-white/5 border border-white/5 text-white/80'
                    : 'bg-white/10 border border-white/10 text-white shadow shadow-black/20'
                }`}
              >
                {renderFormattedText(msg.text)}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex flex-col max-w-[80%] self-start mr-auto">
            <span className="text-[9px] font-mono mb-1 text-white/30">SYSTEM • COMPUTING</span>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-white/60 flex items-center gap-2">
              <div className="flex space-x-1.5">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" />
              </div>
              <span className="text-[11px] font-mono text-white/40 ml-1">Analyzing flashing dependencies...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
            <div>
              <p className="font-bold">Execution Failed</p>
              <p className="text-[11px] text-rose-400/80 mt-0.5">{error}</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      {messages.length === 1 && !isLoading && (
        <div className="px-4 py-3 border-t border-white/5 bg-[#050505]/40">
          <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-2">
            Quick Diagnostic Prompts:
          </p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(sug.prompt)}
                className="text-[11px] font-mono text-white/50 hover:text-amber-400 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-amber-500/30 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
              >
                {sug.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(inputValue);
        }}
        className="p-3.5 bg-[#080808]/60 border-t border-white/5 flex gap-2"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask about fastboot commands, root, bootloops..."
          disabled={isLoading}
          className="flex-1 bg-[#050505] border border-white/10 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 focus:outline-none rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/20"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          className="p-2 bg-white text-black hover:bg-amber-500 disabled:bg-white/5 disabled:text-white/20 rounded-xl transition-colors cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
