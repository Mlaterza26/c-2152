import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircleQuestion, X, Send, Bot, User } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const knowledgeBase: { keywords: string[]; answer: string }[] = [
  {
    keywords: ["credit", "submit", "request", "credit request"],
    answer:
      "To submit a credit request:\n\n1. Go to **Client Success → Revenue Credit Request** in the sidebar\n2. Find the invoice in the table\n3. Click the **Credit** button on the right\n4. In the dialog, enter **Revised Net Amount** and/or **Revised Units** for the line items that need adjustment\n5. Review the **Net Impact** column to verify the changes\n6. Click **Submit Request**\n\nFinance will be notified via Asana and the request will appear on the Requests page.",
  },
  {
    keywords: ["invoice", "unlock", "locked"],
    answer:
      "Invoice unlocking is managed through the **Invoice Unlocks** workflow under Client Success. This workflow is coming soon to the OMS. In the meantime, contact the Finance team directly via Asana or email to request an invoice unlock.",
  },
  {
    keywords: ["billing", "schedule", "custom"],
    answer:
      "Custom Billing Schedules can be set up through the **Custom Billing Schedule** workflow under Client Success. This workflow is coming soon. Currently, custom billing schedules are configured directly in Operative.One by the Finance team.",
  },
  {
    keywords: ["team", "teams", "sidebar", "navigate", "navigation"],
    answer:
      "The sidebar shows teams with available workflows. Currently **Client Success** is active with 5 workflows:\n\n• Revenue Credit Request (live)\n• Custom Billing Schedule (coming soon)\n• General Order Questions (coming soon)\n• EOM Billing Help (coming soon)\n• Invoice Unlocks (coming soon)\n\nOther teams (Ad Ops, US Sales, Finance, Planning) will be enabled in future phases.",
  },
  {
    keywords: ["export", "excel", "download", "spreadsheet"],
    answer:
      "You can export credit request data to Excel from the credit revision dialog:\n\n1. Open a credit request by clicking **Credit** on any invoice\n2. Fill in your revisions\n3. Click **Export to Excel** at the bottom-left\n\nThe file includes invoice header info, all line items with Net Impact calculations, and a totals row with currency formatting.",
  },
  {
    keywords: ["net impact", "impact", "calculation", "revised"],
    answer:
      "**Net Impact** is calculated as:\n\n`Net Impact = Revised Net Amount − Original Net Amount`\n\n• Positive values (shown in green) mean an increase\n• Negative values (shown in red) mean a decrease/credit\n\nThe **TOTALS** row at the bottom sums all Net Impact values to show the overall effect of the revision.",
  },
  {
    keywords: ["operative", "operative.one", "data", "source"],
    answer:
      "The OMS displays data sourced from **Operative.One**, your order management platform. Currently the app uses demo data. In production, it will connect to the Operative.One API to pull live invoice and line-item data in real time.",
  },
  {
    keywords: ["asana", "task", "workflow", "notification"],
    answer:
      "When a credit request is submitted, the OMS will:\n\n1. Create an **Asana task** in the \"Finance - Credit Requests\" project\n2. Send an **email notification** to finance@futureplc.com\n3. Track the request status on the **Requests** page\n\n**Note:** This is currently in demo mode — no real tasks or emails are created.",
  },
  {
    keywords: ["demo", "mode", "prototype", "test"],
    answer:
      "The OMS is currently in **demo mode**. All data is simulated and no real integrations are active:\n\n• No Asana tasks are created\n• No emails are sent\n• Invoice data is sample data, not from Operative.One\n\nYou'll see a **DEMO MODE** banner on credit request confirmations. This is safe to explore and test freely!",
  },
  {
    keywords: ["help", "what can", "how to use", "getting started"],
    answer:
      "Welcome to the **Future Process Assistant**! I can help you with:\n\n• **Submitting credit requests** — step-by-step guidance\n• **Understanding workflows** — what's available and coming soon\n• **Navigating the OMS** — finding teams, invoices, and requests\n• **Excel exports** — downloading revision data\n• **Net Impact calculations** — how revisions affect totals\n\nJust type your question and I'll guide you through the process!",
  },
];

const defaultGreeting: Message = {
  id: "greeting",
  role: "assistant",
  content:
    "Hi! I'm the Future Process Assistant. I can help you navigate workflows, submit requests, and understand OMS processes.\n\nTry asking:\n• \"How do I submit a credit request?\"\n• \"What teams are available?\"\n• \"How is Net Impact calculated?\"",
};

function findAnswer(query: string): string {
  const lower = query.toLowerCase();

  let bestMatch: { score: number; answer: string } = { score: 0, answer: "" };

  for (const entry of knowledgeBase) {
    let score = 0;
    for (const keyword of entry.keywords) {
      if (lower.includes(keyword)) {
        score += keyword.split(" ").length; // multi-word keywords score higher
      }
    }
    if (score > bestMatch.score) {
      bestMatch = { score, answer: entry.answer };
    }
  }

  if (bestMatch.score > 0) return bestMatch.answer;

  return "I'm not sure about that yet. Try asking about:\n\n• Credit requests\n• Invoice workflows\n• Team navigation\n• Excel exports\n• Net Impact calculations\n\nIn Phase 2, I'll be connected to your full process documentation for more detailed answers!";
}

export default function ProcessAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([defaultGreeting]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  function handleOpen() {
    setIsOpen(true);
    setHasBeenOpened(true);
  }

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking delay
    await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 800));

    const answer = findAnswer(trimmed);
    const assistantMsg: Message = {
      id: `asst-${Date.now()}`,
      role: "assistant",
      content: answer,
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, assistantMsg]);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function renderContent(content: string) {
    // Simple markdown-like rendering for bold and bullet points
    return content.split("\n").map((line, i) => {
      let processed = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      processed = processed.replace(/`(.+?)`/g, '<code class="bg-black/10 px-1 rounded text-xs">$1</code>');

      if (line.startsWith("• ")) {
        return (
          <div key={i} className="flex gap-2 ml-1">
            <span className="shrink-0">•</span>
            <span dangerouslySetInnerHTML={{ __html: processed.slice(2) }} />
          </div>
        );
      }
      if (/^\d+\.\s/.test(line)) {
        const num = line.match(/^(\d+)\.\s/)?.[1];
        return (
          <div key={i} className="flex gap-2 ml-1">
            <span className="shrink-0">{num}.</span>
            <span dangerouslySetInnerHTML={{ __html: processed.replace(/^\d+\.\s/, "") }} />
          </div>
        );
      }
      if (line === "") return <div key={i} className="h-2" />;
      return <div key={i} dangerouslySetInnerHTML={{ __html: processed }} />;
    });
  }

  return (
    <>
      {/* Chat Panel */}
      <div
        className={`fixed top-0 right-0 h-full z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ width: "min(400px, 100vw)" }}
      >
        <div className="flex flex-col h-full bg-white shadow-2xl border-l border-border">
          {/* Header */}
          <div className="bg-future-blue text-white px-5 py-4 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-white/15 flex items-center justify-center">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight">Future Process Assistant</h3>
                  <p className="text-[11px] text-white/60 leading-tight mt-0.5">
                    Ask me about workflows, processes, or procedures
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 rounded-full hover:bg-white/15 flex items-center justify-center transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    msg.role === "assistant"
                      ? "bg-future-red text-white"
                      : "bg-future-blue text-white"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <Bot className="h-3.5 w-3.5" />
                  ) : (
                    <User className="h-3.5 w-3.5" />
                  )}
                </div>
                <div
                  className={`rounded-xl px-3.5 py-2.5 max-w-[85%] text-[13px] leading-relaxed ${
                    msg.role === "user"
                      ? "bg-gray-100 text-foreground"
                      : "bg-white border border-border text-foreground shadow-sm"
                  }`}
                >
                  {renderContent(msg.content)}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5">
                <div className="h-7 w-7 rounded-full bg-future-red text-white flex items-center justify-center shrink-0">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="bg-white border border-border rounded-xl px-4 py-3 shadow-sm">
                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-future-red/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 rounded-full bg-future-red/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 rounded-full bg-future-red/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border p-3 shrink-0 bg-gray-50">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about a process..."
                className="flex-1 text-sm bg-white"
                disabled={isTyping}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                size="icon"
                className="bg-future-red hover:bg-future-red/90 shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 text-center">
              DEMO — Phase 2 will connect to your process documentation
            </p>
          </div>
        </div>
      </div>

      {/* Backdrop (mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Floating Help Button */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className={`fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-future-red text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 flex items-center justify-center group ${
            !hasBeenOpened ? "animate-help-pulse" : ""
          }`}
          title="Process Assistant"
        >
          <MessageCircleQuestion className="h-6 w-6 group-hover:scale-105 transition-transform" />
        </button>
      )}
    </>
  );
}
