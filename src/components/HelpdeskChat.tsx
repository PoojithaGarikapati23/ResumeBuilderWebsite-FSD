"use client"
import { useChat } from "@ai-sdk/react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, X, Send, Sparkles, User } from "lucide-react"

export function HelpdeskChat() {
  const [isOpen, setIsOpen] = useState(false)
  const { messages = [], input = '', handleInputChange, handleSubmit, isLoading } = useChat() as any
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl shadow-primary/20 bg-primary hover:bg-primary/90 z-50 p-0"
      >
        <MessageCircle className="h-6 w-6 text-primary-foreground" />
      </Button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-[380px] h-[600px] bg-background border border-border rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
      <div className="h-16 bg-primary flex items-center justify-between px-4 shrink-0 text-primary-foreground">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm">CareerCraft AI</h3>
            <p className="text-xs text-primary-foreground/70">Online</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-primary-foreground hover:bg-primary-foreground/20">
          <X className="w-5 h-5" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4 bg-muted/20" ref={scrollRef}>
        <div className="space-y-4 pb-4">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="bg-muted p-3 rounded-2xl rounded-tl-sm text-sm">
              Hi! I'm your AI Career Assistant. I can help you improve your resume, explain your ATS score, or figure out what jobs fit your skills best. How can I help today?
            </div>
          </div>

          {messages.map((m: any) => (
            <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-secondary' : 'bg-primary'}`}>
                {m.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4 text-primary-foreground" />}
              </div>
              <div className={`p-3 rounded-2xl text-sm whitespace-pre-wrap max-w-[80%] ${
                m.role === 'user' 
                  ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                  : 'bg-muted rounded-tl-sm'
              }`}>
                {m.content}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="bg-muted p-4 rounded-2xl rounded-tl-sm flex gap-1">
                <div className="w-2 h-2 rounded-full bg-foreground/30 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-foreground/30 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-foreground/30 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 bg-background border-t border-border">
        {messages.length === 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button onClick={() => handleInputChange({ target: { value: "Analyze my resume" } } as any)} className="whitespace-nowrap px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-full text-xs font-medium transition-colors border border-border">Analyze my resume</button>
            <button onClick={() => handleInputChange({ target: { value: "What jobs fit me?" } } as any)} className="whitespace-nowrap px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-full text-xs font-medium transition-colors border border-border">What jobs fit me?</button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input 
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..." 
            className="flex-1 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary h-10 rounded-full px-4"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="rounded-full shrink-0 w-10 h-10">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
