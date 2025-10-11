"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

/** ——— Icons (inline, lightweight) ——— */
const Globe = (props: any) => (
  <svg viewBox="0 0 24 24" {...props}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
);
const ArrowRight = (props: any) => (
  <svg viewBox="0 0 24 24" {...props}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
);
const Parcel = (props: any) => (
  <svg viewBox="0 0 24 24" {...props}><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v2"/><path d="m3.45 11.45.69 1.38a2 2 0 0 0 1.76.97h12.2a2 2 0 0 0 1.76-.97l.69-1.38"/><path d="M17 18.5H7a2 2 0 0 1-2-2v-3.5h14v3.5a2 2 0 0 1-2 2Z"/></svg>
);
const Cargo = (props: any) => (
  <svg viewBox="0 0 24 24" {...props}><path d="M4.27 12.13 2 11.22v4.26l2.27.91L8 18.11V6.89L4.27 5.23v6.9Z"/><path d="m8 18.11 7.73 3.1-2.26-.91V6.89l2.26-.91L8 5.23v12.88Z"/><path d="M22 15.48v-4.26l-2.27.91-3.46 1.39v6.9l3.46-1.72L22 17.22Z"/><path d="m16.27 18.11 3.46 1.73L22 18.78"/></svg>
);
const Broker = (props: any) => (
  <svg viewBox="0 0 24 24" {...props}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="m9 12 2 2 4-4"/></svg>
);
const Check = (props: any) => (
  <svg viewBox="0 0 24 24" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);

/** ——— Booking ID with RTC-style animations ——— */
function TickIcon(props:any){return(<svg viewBox="0 0 24 24" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>);}
function LoaderDots(){return(<span className="relative inline-flex gap-1 items-center">
  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-rtc-dot" />
  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-rtc-dot [animation-delay:.15s]" />
  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-rtc-dot [animation-delay:.3s]" />
</span>);}

function BookingIdField({ onSubmit }: { onSubmit: (id: string) => void }) {
  const [value, setValue] = useState("");
  const [phase, setPhase] = useState<"idle"|"typing"|"checking"|"valid"|"invalid">("idle");

  const isPatternMatch = useMemo(() => /^[A-Za-z0-9]{8,12}$/.test(value.trim()), [value]);

  useEffect(() => {
    if (!value.trim()) { setPhase("idle"); return; }
    setPhase("typing");
    const t = setTimeout(() => {
      setPhase("checking");
      const ok = isPatternMatch; // replace with API check if needed
      setTimeout(() => setPhase(ok ? "valid" : "invalid"), 350);
    }, 400);
    return () => clearTimeout(t);
  }, [value, isPatternMatch]);

  const submit = () => {
    const id = value.trim();
    if (!id) return;
    onSubmit(id);
  };

  const ring =
    phase === "valid" ? "ring-2 ring-green-500/60" :
    phase === "invalid" ? "ring-2 ring-red-500/60 animate-rtc-shake" : "";

  return (
    <div>
      <label className="block text-sm font-medium mb-1">Booking ID</label>
      <div className={`rounded-xl p-[2px] bg-[linear-gradient(90deg,#d80000,rgba(216,0,0,.35),#d80000)] bg-[length:200%_100%] animate-rtc-shimmer`}>
        <div className={`rounded-xl bg-white px-3 py-2.5 flex items-center gap-2 transition-shadow ${ring}`}>
          <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 8h10M7 12h6" /></svg>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="e.g., aBCdE12fgH"
            className="flex-1 outline-none border-none bg-transparent placeholder-gray-400"
          />
          {phase === "checking" && <LoaderDots />}
          {phase === "valid" && <TickIcon className="w-5 h-5 text-green-600" />}
          {phase === "invalid" && <span className="text-xs text-red-600 font-medium">Invalid</span>}
        </div>
      </div>
      <button
        onClick={submit}
        className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#d80000] text-white font-semibold hover:bg-red-700 transition"
      >
        Track Now
      </button>

      {/* animations */}
      <style jsx global>{`
        @keyframes rtc-shimmer { 0%{background-position:0% 0%} 100%{background-position:200% 0%} }
        .animate-rtc-shimmer { animation: rtc-shimmer 3s linear infinite; }
        @keyframes rtc-dot { 0%,80%,100%{transform:scale(0.6);opacity:.4} 40%{transform:scale(1);opacity:1} }
        .animate-rtc-dot { animation: rtc-dot 1.2s infinite ease-in-out; }
        @keyframes rtc-shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-2px)} 40%{transform:translateX(2px)} 60%{transform:translateX(-1px)} 80%{transform:translateX(1px)} }
        .animate-rtc-shake { animation: rtc-shake .28s ease-in-out; }
      `}</style>
    </div>
  );
}

/** ——— Section shell ——— */
const Section = ({ children, className = "" }: { children: any; className?: string }) => (
  <section className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>{children}</section>
);

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900">
      {/* Hero */}
      <div className="bg-[#d80000]">
        <Section className="py-10 sm:py-16">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="flex items-center gap-3">
                <Globe className="w-8 h-8 stroke-white fill-none stroke-2" />
                <p className="text-white/80 text-sm font-medium tracking-wide">
                  UK ⇄ Africa logistics, simplified
                </p>
              </div>
              <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold text-white leading-tight">
                Ship faster. Track smarter. Pay transparently.
              </h1>
              <p className="mt-4 text-white/90 text-lg max-w-prose">
                Treny Connect moves your parcels and cargo between the UK and Africa with
                real-time tracking, clear pricing, and expert customs handling.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/create"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-[#d80000] font-semibold hover:bg-gray-100 transition"
                >
                  Get a Quote & Book <ArrowRight className="w-5 h-5 ml-2 stroke-current fill-none" />
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-red-700/40 text-white font-semibold hover:bg-red-700/60 transition"
                >
                  Explore Services
                </Link>
              </div>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-white/90">
                <div className="flex items-center"><Check className="w-5 h-5 mr-2 stroke-white" />Transparent pricing</div>
                <div className="flex items-center"><Check className="w-5 h-5 mr-2 stroke-white" />Real-time tracking</div>
                <div className="flex items-center"><Check className="w-5 h-5 mr-2 stroke-white" />UK & Africa support</div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl bg-white shadow-xl p-6 md:p-8">
                <h3 className="font-bold text-xl">Track a Shipment</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Enter your Booking ID to get status updates instantly.
                </p>

                {/* — Replace old input with the animated one — */}
                <div className="mt-4">
                  <BookingIdField onSubmit={(id) => router.push(`/track/${encodeURIComponent(id)}`)} />
                </div>

                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <Parcel className="w-7 h-7 mx-auto stroke-[#d80000] fill-none" />
                    <p className="mt-2 text-sm font-medium">Parcels</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <Cargo className="w-7 h-7 mx-auto stroke-[#d80000] fill-none" />
                    <p className="mt-2 text-sm font-medium">Cargo</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <Broker className="w-7 h-7 mx-auto stroke-[#d80000] fill-none" />
                    <p className="mt-2 text-sm font-medium">Customs</p>
                  </div>
                </div>
              </div>
              <div className="absolute -z-10 -top-6 -right-6 w-40 h-40 rounded-full bg-white/20 blur-2xl" />
            </div>
          </div>
        </Section>
      </div>

      {/* Feature tiles */}
      <Section className="py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Feature
            title="Door-to-door service"
            text="Pickup across the UK and delivery across major African cities."
            Icon={Parcel}
          />
          <Feature
            title="Cargo & freight"
            text="Air and sea options for pallets and containers with competitive rates."
            Icon={Cargo}
          />
          <Feature
            title="Expert customs"
            text="We prepare and submit documents so your goods clear without delay."
            Icon={Broker}
          />
        </div>
      </Section>

      {/* Quick quote CTA */}
      <Section className="py-4">
        <div className="rounded-2xl bg-white shadow-md border border-gray-200 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold">Ready to ship?</h3>
            <p className="text-gray-600">Get an instant estimate based on weight, size, and destination.</p>
          </div>
          <Link
            href="/create"
            className="inline-flex items-center px-5 py-3 rounded-lg bg-[#d80000] text-white font-semibold hover:bg-red-700 transition"
          >
            Get a Quote <ArrowRight className="w-5 h-5 ml-2 stroke-white" />
          </Link>
        </div>
      </Section>

      {/* Services highlight */}
      <Section className="py-12">
        <div className="grid md:grid-cols-2 gap-8">
          <ServiceCard
            title="Parcel & Document"
            text="Speedy, secure shipping for your smaller packages and documents."
            Icon={Parcel}
            href="/services"
          />
          <ServiceCard
            title="Cargo & Freight"
            text="Larger commercial shipments via air or sea—efficient and cost-effective."
            Icon={Cargo}
            href="/services"
          />
        </div>
      </Section>

      {/* How it works */}
      <Section className="py-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center">How it works</h2>
        <div className="mt-8 grid md:grid-cols-4 gap-6">
          <Step n={1} title="Get a quote" text="Enter size, weight, and destination on the booking page." />
          <Step n={2} title="Book pickup" text="Pick a slot—doorstep collection anywhere in the UK." />
          <Step n={3} title="Customs handled" text="We prepare documents and manage clearance." />
          <Step n={4} title="Track to delivery" text="Real-time updates until your parcel is delivered." />
        </div>
      </Section>

      {/* Social proof */}
      <Section className="py-12">
        <div className="rounded-2xl bg-white shadow-md border border-gray-200 p-6 sm:p-8">
          <h3 className="text-xl font-bold">Trusted by businesses & families</h3>
          <p className="text-gray-600 mt-2">
            “Smooth from pickup to delivery. The tracking was spot-on and customs were painless.”
          </p>
          <p className="text-sm text-gray-500 mt-1">— A. Adeyemi, London → Lagos</p>
        </div>
      </Section>

      {/* FAQ */}
      <Section className="py-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center">Frequently asked questions</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Faq q="What is volumetric weight?" a="(L × W × H) / 5000 (cm). We charge the greater of actual vs volumetric weight." />
          <Faq q="Do you handle customs?" a="Yes. We prepare and submit all documents. Duties/taxes may apply in destination." />
          <Faq q="Where do you ship?" a="From the UK to major African cities like Lagos, Accra, Nairobi, Johannesburg, and more." />
        </div>
      </Section>

      {/* Final CTA */}
      <Section className="py-14">
        <div className="text-center">
          <h3 className="text-2xl sm:text-3xl font-extrabold">Ship with confidence today</h3>
          <p className="mt-2 text-gray-600">
            Clear pricing, reliable delivery, and real human support on both sides.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/create" className="inline-flex items-center px-6 py-3 rounded-lg bg-[#d80000] text-white font-semibold hover:bg-red-700 transition">
              Start a Shipment
            </Link>
            <Link href="/about" className="inline-flex items-center px-6 py-3 rounded-lg bg-gray-900 text-white font-semibold hover:bg-black transition">
              About Treny Connect
            </Link>
          </div>
        </div>
      </Section>

      {/* Simple footer (remove if you’re using a global Footer in layout.tsx) */}
      <footer className="border-t border-gray-200 py-8">
        <Section>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-600">
            <p>© {new Date().getFullYear()} Treny Connect. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/about" className="hover:text-gray-900">About</Link>
              <Link href="/services" className="hover:text-gray-900">Services</Link>
              <Link href="/faq" className="hover:text-gray-900">FAQ</Link>
              <Link href="/support" className="hover:text-gray-900">Support</Link>
            </div>
          </div>
        </Section>
      </footer>
    </div>
  );
}

/** ——— Smaller components ——— */
function Feature({
  title,
  text,
  Icon,
}: {
  title: string;
  text: string;
  Icon: any;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition">
      <Icon className="w-8 h-8 stroke-[#d80000] fill-none" />
      <h3 className="mt-4 font-bold text-lg">{title}</h3>
      <p className="mt-1 text-gray-600">{text}</p>
    </div>
  );
}

function ServiceCard({
  title,
  text,
  Icon,
  href,
}: {
  title: string;
  text: string;
  Icon: any;
  href: string;
}) {
  return (
    <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm flex items-start gap-4">
      <div className="shrink-0">
        <Icon className="w-10 h-10 stroke-[#d80000] fill-none" />
      </div>
      <div className="grow">
        <h3 className="font-bold text-xl">{title}</h3>
        <p className="text-gray-600 mt-1">{text}</p>
        <Link href={href} className="inline-flex items-center gap-1 mt-3 font-medium text-[#d80000] hover:text-red-700">
          Learn more <ArrowRight className="w-4 h-4 stroke-current" />
        </Link>
      </div>
    </div>
  );
}

function Step({ n, title, text }: { n: number; title: string; text: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <div className="w-10 h-10 rounded-full bg-[#d80000] text-white flex items-center justify-center font-bold">{n}</div>
      <h4 className="mt-3 font-semibold">{title}</h4>
      <p className="text-gray-600 mt-1">{text}</p>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200">
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center text-left">
        <span className="font-semibold">{q}</span>
        <span className="text-gray-400">{open ? "–" : "+"}</span>
      </button>
      {open && <p className="mt-3 text-gray-600">{a}</p>}
    </div>
  );
}
