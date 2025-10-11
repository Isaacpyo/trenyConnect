"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

/**
 * Minimal client-side chat widget.
 * - Answers basic FAQs locally (no network).
 * - If unsure, suggests talking to a human (links to /support).
 * - You can wire it to your own /api/chat (OpenAI, etc) by replacing `getBotReply`.
 */
export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [msgs, setMsgs] = useState<{ from: "user" | "bot"; text: string }[]>([
    { from: "bot", text: "Hi! I’m Treny Assist. Ask me about shipping, pricing, insurance, tracking, or talk to a human." },
  ]);

  const boxRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open) setTimeout(() => boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: "smooth" }), 10);
  }, [open, msgs.length]);

  async function onSend(e?: React.FormEvent) {
    e?.preventDefault();
    const q = input.trim();
    if (!q) return;
    setMsgs((m) => [...m, { from: "user", text: q }]);
    setInput("");
    setBusy(true);

    // Replace this with a call to your server: await fetch("/api/chat", { ... })
    const reply = await getBotReply(q);

    setMsgs((m) => [...m, { from: "bot", text: reply }]);
    setBusy(false);
  }

  return (
    <>
      {/* FAB */}
      <motion.button
        className="fixed bottom-5 right-5 z-50 rounded-full bg-[#d80000] text-white shadow-lg px-4 py-3"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen((v) => !v)}
        aria-label="Open support chat"
      >
        {open ? "Close" : "Chat • Help"}
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-5 z-50 w-[90vw] max-w-sm rounded-2xl border bg-white shadow-xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="font-semibold text-[#d80000]">Treny Assist</div>
              <button className="text-sm underline" onClick={() => setOpen(false)}>Minimise</button>
            </div>

            <div ref={boxRef} className="max-h-[50vh] overflow-auto p-3 space-y-2">
              {msgs.map((m, i) => (
                <div
                  key={i}
                  className={[
                    "rounded-xl px-3 py-2 text-sm max-w-[85%]",
                    m.from === "user"
                      ? "ml-auto bg-[#d80000] text-white"
                      : "bg-gray-100 text-gray-800",
                  ].join(" ")}
                >
                  {m.text}
                </div>
              ))}
            </div>

            <div className="px-3 pb-3">
              <form onSubmit={onSend} className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your question…"
                  className="field flex-1"
                />
                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={busy}
                  className="px-3 py-2 rounded-lg bg-[#d80000] text-white disabled:opacity-50"
                >
                  {busy ? "…" : "Send"}
                </motion.button>
              </form>
              <div className="mt-2 text-[11px] text-gray-500">
                Need more help? <Link href="/support" className="underline">Talk to a human</Link>.
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

// Super-simple client-side Q&A. Swap with your server-side GPT if you want.
async function getBotReply(q: string): Promise<string> {
  const text = q.toLowerCase();

  // intent map
  const answers: { test: RegExp; reply: string }[] = [
    {
      test: /(price|cost|how much|quote)/,
      reply:
        "You can get an instant estimate in Create Consignment. We charge base + per-kg and use the higher of actual vs volumetric weight (L×W×H ÷ 5000). Insurance is optional (BASIC/STANDARD/PREMIUM).",
    },
    {
      test: /(insur|cover)/,
      reply:
        "We offer BASIC (to £100), STANDARD (to £500) and PREMIUM (to £2000). You can choose this in the Goods & Insurance step.",
    },
    {
      test: /(track|where is|status|reference|trn)/,
      reply:
        "Pop your tracking ref (e.g., TRN123456) into the Track page or the tracking box on Support to see live updates. If you share your ref here, I can route you to the right team.",
    },
    {
      test: /(deliver|timeline|how long|days|when)/,
      reply:
        "Typical corridor deliveries take ~3–7 working days after pickup, depending on the destination city and customs.",
    },
    {
      test: /(prohibit|ban|allowed|items|ship)/,
      reply:
        "Most non-perishable goods, clothing, documents, household items are fine. Restricted: aerosols, flammables, cash, etc. If unsure, message support.",
    },
  ];

  const hit = answers.find((a) => a.test.test(text));
  if (hit) return hit.reply + " If that doesn’t solve it, a human can help on our Support page.";

  return "I may not have the perfect answer for that. Want me to connect you with a human on our Support page?";
}
