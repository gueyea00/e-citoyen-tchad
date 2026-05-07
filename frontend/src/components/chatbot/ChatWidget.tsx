import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatWidget() {
  const { t, dir, locale } = useLanguage();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const fetchReply = async (userMsg: string) => {
    setTyping(true);
    try {
      const data = await apiClient.fetch("/chatbot/message", {
        method: "POST",
        body: JSON.stringify({
          message: userMsg,
          locale: locale,
          history: messages.map(msg => ({ role: msg.role, content: msg.content }))
        }),
      });
      
      setMessages((prev) => [
        ...prev,
        {
          role: data.role || "assistant",
          content: data.content || "Désolé, je ne parviens pas à obtenir une réponse.",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Erreur réseau. Veuillez vérifier que l'API et la BDD sont lancées." },
      ]);
    } finally {
      setTyping(false);
    }
  };

  const send = () => {
    if (!input.trim()) return;
    const msg = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setInput("");
    fetchReply(msg);
  };

  const handleSuggestion = (s: string) => {
    setMessages((prev) => [...prev, { role: "user", content: s }]);
    fetchReply(s);
  };

  return (
    <>
      {/* Toggle button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 end-6 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-float flex items-center justify-center hover:scale-105 transition-transform"
          aria-label="Open chat"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div
          className="fixed bottom-6 end-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] h-[500px] bg-card border border-border rounded-2xl shadow-float flex flex-col overflow-hidden animate-fade-in"
          dir={dir}
        >
          {/* Header */}
          <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <img src="/images/logo.png" alt="" className="h-7 w-7" />
              <span className="font-semibold text-sm">{t.chatbot.title}</span>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close"><X className="h-5 w-5" /></button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {/* Welcome */}
            <div className="bg-muted rounded-xl rounded-ts-none px-3 py-2 text-sm text-foreground max-w-[85%]">
              {t.chatbot.welcome}
            </div>

            {/* Suggestions */}
            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2">
                {[t.chatbot.suggestion1, t.chatbot.suggestion2, t.chatbot.suggestion3].map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestion(s)}
                    className="text-xs bg-secondary/20 text-secondary-foreground rounded-full px-3 py-1.5 hover:bg-secondary/30 transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`rounded-xl px-3 py-2 text-sm max-w-[85%] ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-be-none"
                      : "bg-muted text-foreground rounded-bs-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {typing && (
              <div className="bg-muted rounded-xl rounded-bs-none px-3 py-2 text-sm text-muted-foreground max-w-[85%]">
                <span className="animate-pulse">...</span>
              </div>
            )}

            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border p-3 flex gap-2 shrink-0">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={t.chatbot.placeholder}
              className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
            />
            <Button size="sm" onClick={send} disabled={!input.trim() || typing} className="bg-primary text-primary-foreground">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
