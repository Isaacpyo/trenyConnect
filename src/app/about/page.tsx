"use client";

import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="relative">
      {/* Gradient backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(900px 400px at 10% -10%, color-mix(in srgb, var(--brand) 12%, white), transparent), radial-gradient(800px 450px at 110% 0%, color-mix(in srgb, var(--brand) 10%, white), transparent)",
        }}
      />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-10 pb-8">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-3xl sm:text-4xl font-semibold tracking-tight"
        >
          About Treny Connect
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="mt-3 text-gray-700 max-w-3xl"
        >
          Treny Connect was founded with a single mission: to bridge the logistical gap
          between the United Kingdom and the vibrant markets of Africa. We saw a need
          for a shipping service that was not only reliable and fast but also transparent,
          customer-focused, and deeply knowledgeable about the unique challenges and
          opportunities of the UK–Africa trade corridor.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="mt-3 text-gray-700 max-w-3xl"
        >
          Our team is composed of logistics experts with decades of combined experience
          in international freight, customs brokerage, and last-mile delivery. We
          leverage cutting-edge technology for real-time tracking and a seamless booking
          experience, while keeping a human touch. With support teams in the UK and
          across our African destinations, you’ll have peace of mind from pickup to
          delivery.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="mt-5 rounded-2xl border bg-white p-4 sm:p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold">Our Mission</h2>
          <p className="mt-2 text-gray-700">
            To be the most trusted and efficient logistics partner for businesses and
            individuals shipping between the UK and Africa, empowering growth and
            connection through superior service and innovation.
          </p>
        </motion.div>
      </section>

      {/* Stats with subtle tilt/hover */}
      <section className="mx-auto max-w-6xl px-4 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[
            { k: "97%", v: "On-time delivery" },
            { k: "24/6", v: "Human support" },
            { k: "10+", v: "African destinations" },
            { k: "Real-time", v: "Tracking updates" },
          ].map((s, i) => (
            <motion.div
              key={s.k}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: 0.05 * i }}
              whileHover={{ y: -3 }}
              className="rounded-2xl border bg-white p-4 text-center shadow-sm"
            >
              <div className="text-2xl font-semibold text-[#d80000]">{s.k}</div>
              <div className="text-sm text-gray-600">{s.v}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <h3 className="text-lg font-semibold mb-4">How we deliver</h3>
        <ol className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4">
          {[
            { t: "Book & collect", d: "Seamless online booking and flexible pickup windows." },
            { t: "Customs cleared", d: "Experienced brokerage for smooth cross-border movement." },
            { t: "In-transit updates", d: "Real-time visibility from hub to destination city." },
            { t: "Last-mile delivery", d: "Reliable partners for doorstep delivery with proof." },
          ].map((step, i) => (
            <motion.li
              key={step.t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: 0.06 * i }}
              className="rounded-2xl border bg-white p-4 shadow-sm"
            >
              <div className="text-[#d80000] font-semibold">{String(i + 1).padStart(2, "0")}</div>
              <div className="mt-1 font-medium">{step.t}</div>
              <div className="text-sm text-gray-600">{step.d}</div>
            </motion.li>
          ))}
        </ol>
      </section>
    </div>
  );
}
