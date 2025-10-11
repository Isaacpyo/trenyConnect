// app/support/page.tsx
"use client";

import { useState } from "react";
import { motion, type MotionProps } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  MessageCircle,
  Paperclip,
  Search,
} from "lucide-react";

const fadeUp: MotionProps = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.28, ease: "easeOut" },
};

export default function SupportPage() {
  const router = useRouter();

  // Tracking hero
  const [tracking, setTracking] = useState("");
  function onTrack() {
    const ref = tracking.trim();
    if (!ref) return;
    router.push(`/track/${encodeURIComponent(ref)}`);
  }

  // Contact form
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    topic: "",
    subject: "",
    message: "",
    file: null as File | null,
  });

  const canSubmit =
    form.name.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    form.subject.trim() &&
    form.message.trim();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      // TODO: Wire to server action or /api/support
      await new Promise((r) => setTimeout(r, 900));
      setSent(true);
      setForm({
        name: "",
        email: "",
        phone: "",
        topic: "",
        subject: "",
        message: "",
        file: null,
      });
    } finally {
      setSubmitting(false);
      setTimeout(() => setSent(false), 2500);
    }
  }

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6">
      <motion.h1 {...fadeUp} className="text-2xl sm:text-3xl font-semibold tracking-tight">
        Support
      </motion.h1>
      <motion.p
        initial={fadeUp.initial}
        animate={fadeUp.animate}
        transition={{ ...(fadeUp.transition as object), delay: 0.05 }}
        className="text-gray-600 mt-2"
      >
        Questions, issues, or special requests? We’ll get back within one business day.
      </motion.p>

      {/* Customer Service / Tracking (centered hero) */}
      <motion.section
        initial={fadeUp.initial}
        animate={fadeUp.animate}
        transition={{ ...(fadeUp.transition as object), delay: 0.08 }}
        className="mt-6 rounded-2xl border bg-white p-6 sm:p-10 shadow-sm text-center"
      >
        <div className="text-sm font-semibold text-[#d80000] uppercase tracking-wide">
          Customer Service
        </div>
        <h2 className="mt-2 text-xl sm:text-2xl font-semibold">Find the right team to help you</h2>
        <p className="mt-2 text-gray-700 max-w-2xl mx-auto">
          Your tracking number lets us find the right division contact to answer your questions.
        </p>

        <div className="mt-6 max-w-xl mx-auto flex flex-col sm:flex-row gap-3">
          <label className="flex-1">
            <span className="sr-only">Tracking number</span>
            <input
              value={tracking}
              onChange={(e) => setTracking(e.target.value)}
              placeholder="Enter tracking number (e.g., TRN123456)"
              className="w-full rounded-xl border px-5 py-4 text-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#d80000]/40"
            />
          </label>
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onTrack}
            className="btn-brand px-8 py-4 text-lg inline-flex items-center justify-center gap-2"
          >
            <Search className="h-5 w-5" />
            Track
          </motion.button>
        </div>
      </motion.section>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Contact Details + Social + Map */}
        <motion.aside
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ ...(fadeUp.transition as object), delay: 0.12 }}
          className="rounded-2xl border bg-white p-4 sm:p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold mb-4">Contact details</h2>

          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-brand-ink/80" />
              <div>
                <div className="font-medium">Treny Connect</div>
                <div className="text-gray-600">
                  28 Dunford Drive,<br />
                  Doncaster, DN5 — United Kingdom
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-brand-ink/80" />
              <Link href="tel:+447552120197" className="underline decoration-dotted">
                +44 7552 120197
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-brand-ink/80" />
              <Link href="mailto:support@treny.co.uk" className="underline decoration-dotted">
                support@treny.co.uk
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-brand-ink/80" />
              <div className="text-gray-700">Mon–Sat: 9:00–18:00 (UK time)</div>
            </div>
          </div>

          <div className="h-px bg-gray-200 my-5" />

          <h3 className="text-sm font-semibold mb-2">Follow us</h3>
          <div className="flex flex-wrap items-center gap-2">
            <SocialLink href="https://facebook.com/treny" label="Facebook">
              <Facebook className="h-5 w-5" />
            </SocialLink>
            <SocialLink href="https://instagram.com/treny" label="Instagram">
              <Instagram className="h-5 w-5" />
            </SocialLink>
            <SocialLink href="https://twitter.com/treny" label="Twitter / X">
              <Twitter className="h-5 w-5" />
            </SocialLink>
            <SocialLink href="https://wa.me/447552120197" label="WhatsApp">
              <MessageCircle className="h-5 w-5" />
            </SocialLink>
          </div>

          <div className="h-px bg-gray-200 my-5" />

          <h3 className="text-sm font-semibold mb-2">Find us</h3>
          <div className="overflow-hidden rounded-xl border">
            <iframe
              title="Map"
              className="w-full h-48"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://maps.google.com/maps?q=Doncaster%20DN5&t=&z=13&ie=UTF8&iwloc=&output=embed"
            />
          </div>
        </motion.aside>

        {/* Form */}
        <motion.section
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ ...(fadeUp.transition as object), delay: 0.16 }}
          className="lg:col-span-2 rounded-2xl border bg-white p-4 sm:p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold mb-4">Send us a message</h2>
          <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <LabelInput
              label="Your name"
              value={form.name}
              onChange={(v) => setForm((f) => ({ ...f, name: v }))}
            />
            <LabelInput
              type="email"
              label="Email address"
              value={form.email}
              onChange={(v) => setForm((f) => ({ ...f, email: v }))}
            />
            <LabelInput
              label="Phone (optional)"
              placeholder="+44 7..."
              value={form.phone}
              onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
            />
            <LabelSelect
              label="Topic"
              value={form.topic}
              onChange={(v) => setForm((f) => ({ ...f, topic: v }))}
              options={[
                "Shipping enquiry",
                "Pricing & insurance",
                "Pickup & delivery",
                "Account & billing",
                "Other",
              ]}
            />
            <div className="sm:col-span-2">
              <LabelInput
                label="Subject"
                value={form.subject}
                onChange={(v) => setForm((f) => ({ ...f, subject: v }))}
              />
            </div>
            <div className="sm:col-span-2">
              <LabelTextarea
                label="Message"
                value={form.message}
                placeholder="Tell us how we can help…"
                onChange={(v) => setForm((f) => ({ ...f, message: v }))}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block">
                <div className="text-sm mb-1 text-gray-700">Attachment (optional)</div>
                <div className="relative">
                  <input
                    type="file"
                    onChange={(e) =>
                      setForm((f) => ({ ...f, file: e.target.files?.[0] || null }))
                    }
                    className="field pr-10"
                  />
                  <Paperclip className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
                {form.file && (
                  <div className="mt-1 text-xs text-gray-600">
                    Selected: <span className="font-medium">{form.file.name}</span>
                  </div>
                )}
              </label>
            </div>

            <div className="sm:col-span-2 flex items-center justify-between gap-3 mt-1">
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg border bg-emerald-50 text-emerald-700 px-3 py-2 text-sm"
                >
                  Message sent — we’ll reply shortly.
                </motion.div>
              ) : (
                <div className="text-xs text-gray-500">
                  We aim to respond within one business day.
                </div>
              )}

              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={!canSubmit || submitting}
                className="btn-brand disabled:opacity-50"
              >
                {submitting ? "Sending…" : "Send message"}
              </motion.button>
            </div>
          </form>
        </motion.section>
      </div>

      {/* FAQ */}
      <motion.section
        initial={fadeUp.initial}
        animate={fadeUp.animate}
        transition={{ ...(fadeUp.transition as object), delay: 0.18 }}
        className="mt-6 rounded-2xl border bg-white p-4 sm:p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold mb-3">Frequently asked questions</h2>
        <div className="divide-y divide-gray-200">
          <FaqItem
            q="What items can I ship?"
            a="Most non-perishable goods, clothing, documents, and household items are accepted. Restricted items (e.g., aerosols, flammables, cash) cannot be shipped. If unsure, contact support."
          />
          <FaqItem
            q="How is shipping cost calculated?"
            a="We use the greater of actual vs volumetric weight (L×W×H ÷ 5000), plus base fees and any selected insurance. You can preview costs in the Create Consignment calculator."
          />
          <FaqItem
            q="Do you offer insurance?"
            a="Yes — BASIC (to £100), STANDARD (to £500), and PREMIUM (to £2000), or opt out. Choose your cover during booking."
          />
          <FaqItem
            q="How long does delivery take?"
            a="Transit times vary by origin, destination city and customs clearance. Typical corridor deliveries take 3–7 working days after pickup."
          />
          <FaqItem
            q="Where can I track my shipment?"
            a="Use your tracking reference (e.g., TRN123456) on the Track page or in the Customer Service box above to get real-time updates."
          />
        </div>
      </motion.section>
    </div>
  );
}

/* ---------- UI helpers ---------- */

function LabelInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <div className="text-sm mb-1 text-gray-700">{label}</div>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="field"
      />
    </label>
  );
}

function LabelTextarea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <div className="text-sm mb-1 text-gray-700">{label}</div>
      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="field min-h-[120px]"
      />
    </label>
  );
}

function LabelSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <div className="text-sm mb-1 text-gray-700">{label}</div>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="field appearance-none pr-10"
        >
          <option value="" disabled>
            Select…
          </option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
          ▾
        </span>
      </div>
    </label>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex items-center gap-2 rounded-xl border border-brand/30 bg-white px-3 py-2 text-sm transition hover:bg-brand/5"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
      <span className="hidden sm:inline">{label}</span>
    </motion.a>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group py-3">
      <summary className="cursor-pointer list-none">
        <div className="flex items-center justify-between">
          <div className="font-medium">{q}</div>
          <div className="text-gray-400 group-open:rotate-180 transition">▾</div>
        </div>
      </summary>
      <div className="mt-2 text-sm text-gray-600">{a}</div>
    </details>
  );
}
