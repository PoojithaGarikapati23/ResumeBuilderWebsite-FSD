"use client";
import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Sparkles, User, Bot } from "lucide-react";

export function HelpdeskChat() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    messages = [],
    input = "",
    handleInputChange,
    handleSubmit,
    isLoading,
    setInput,
  } = useChat() as any;
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg shadow-indigo-600/30 bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 z-50 p-0 border-none transition-transform hover:scale-110 duration-300"
      >
        <MessageCircle className="h-7 w-7 text-white" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[400px] h-[650px] bg-slate-950/80 backdrop-blur-xl border border-slate-800/60 rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
      <div className="h-20 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 flex items-center justify-between px-6 shrink-0 border-b border-slate-800/60 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-10 blur-xl" />
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-base text-white tracking-wide">
              CareerCraft AI
            </h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-xs text-indigo-300 font-medium">
                Online & Ready
              </p>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="text-slate-400 hover:text-white hover:bg-slate-800/50 relative z-10 rounded-full"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-5 bg-[#05050f]/80" ref={scrollRef}>
        <div className="space-y-6 pb-4">
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl rounded-tl-sm text-sm text-slate-300 leading-relaxed shadow-sm">
              Hi! I'm your AI Career Assistant. I can help you improve your
              resume, explain your ATS score, or figure out what jobs fit your
              skills best. How can I help today?
            </div>
          </div>

          {messages.map((m: any) => (
            <div
              key={m.id}
              className={`flex gap-4 ${m.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg ${
                  m.role === "user"
                    ? "bg-slate-800 border border-slate-700"
                    : "bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/20"
                }`}
              >
                {m.role === "user" ? (
                  <User className="w-4 h-4 text-slate-300" />
                ) : (
                  <Sparkles className="w-4 h-4 text-white" />
                )}
              </div>
              <div
                className={`p-4 rounded-2xl text-sm whitespace-pre-wrap max-w-[80%] leading-relaxed shadow-sm ${
                  m.role === "user"
                    ? "bg-indigo-600 text-white rounded-tr-sm shadow-indigo-600/20"
                    : "bg-slate-900/80 border border-slate-800 text-slate-300 rounded-tl-sm"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl rounded-tl-sm flex items-center gap-2 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"></div>
                <div
                  className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 rounded-full bg-pink-400 animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-5 bg-slate-950/90 border-t border-slate-800/60 backdrop-blur-md">
        {messages.length === 0 && (
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none">
            <button
              onClick={() => {
                setInput("Analyze my resume");
              }}
              className="whitespace-nowrap px-4 py-2 bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800 rounded-full text-xs font-semibold text-indigo-300 transition-all shadow-sm"
            >
              Analyze my resume
            </button>
            <button
              onClick={() => {
                setInput("What jobs fit me?");
              }}
              className="whitespace-nowrap px-4 py-2 bg-slate-900 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-800 rounded-full text-xs font-semibold text-purple-300 transition-all shadow-sm"
            >
              What jobs fit me?
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask me anything..."
            className="flex-1 bg-slate-900 border-slate-800 text-slate-200 placeholder:text-slate-500 focus-visible:ring-indigo-500/50 h-12 rounded-xl px-5 shadow-inner shadow-black/20"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            className="rounded-xl shrink-0 w-12 h-12 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 border-none transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
