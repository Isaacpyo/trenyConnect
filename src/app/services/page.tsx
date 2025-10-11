"use client";

import Link from "next/link";

/* Lightweight inline icons to match your current look */
const Parcel = (props: any) => (
  <svg viewBox="0 0 24 24" {...props} className={`w-10 h-10 stroke-[#d80000] fill-none ${props.className ?? ""}`}>
    <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v2"/>
    <path d="m3.45 11.45.69 1.38a2 2 0 0 0 1.76.97h12.2a2 2 0 0 0 1.76-.97l.69-1.38"/>
    <path d="M17 18.5H7a2 2 0 0 1-2-2v-3.5h14v3.5a2 2 0 0 1-2 2Z"/>
  </svg>
);
const Cargo = (props: any) => (
  <svg viewBox="0 0 24 24" {...props} className={`w-10 h-10 stroke-[#d80000] fill-none ${props.className ?? ""}`}>
    <path d="M4.27 12.13 2 11.22v4.26l2.27.91L8 18.11V6.89L4.27 5.23v6.9Z"/>
    <path d="m8 18.11 7.73 3.1-2.26-.91V6.89l2.26-.91L8 5.23v12.88Z"/>
    <path d="M22 15.48v-4.26l-2.27.91-3.46 1.39v6.9l3.46-1.72L22 17.22Z"/>
    <path d="m16.27 18.11 3.46 1.73L22 18.78"/>
  </svg>
);
const Broker = (props: any) => (
  <svg viewBox="0 0 24 24" {...props} className={`w-10 h-10 stroke-[#d80000] fill-none ${props.className ?? ""}`}>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
);

export default function ServicesPage() {
  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <section className="bg-[#d80000] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight">Our Services</h1>
          <p className="mt-3 text-white/90 max-w-2xl">
            From urgent documents to commercial freight, Treny Connect delivers UK ⇄ Africa
            with transparent pricing, real-time tracking, and expert customs handling.
          </p>
          <div className="mt-6">
            <Link
              href="/create"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-white text-[#d80000] font-semibold hover:bg-gray-100 transition"
            >
              Get a Quote & Book
            </Link>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <ServiceBlock
          Icon={Parcel}
          title="Parcel & Document Shipping"
          body="Fast, secure delivery for smaller packages and important documents. Choose Standard or Express based on your timeline, with end-to-end tracking included."
          bullets={[
            "Doorstep collection across the UK",
            "Express and Standard options",
            "Real-time tracking & delivery confirmation",
          ]}
        />

        <ServiceBlock
          right
          Icon={Cargo}
          title="Cargo & Freight (Air & Sea)"
          body="Cost-effective transport for pallets and containers. We optimise routes, handle documentation, and coordinate with carriers for reliable schedules."
          bullets={[
            "Air freight for time-sensitive cargo",
            "Sea freight for bulk/containers",
            "Consolidation and warehousing options",
          ]}
        />

        <ServiceBlock
          Icon={Broker}
          title="Customs Clearance & Brokerage"
          body="Skip the headaches. Our in-house team prepares and submits all customs documents and coordinates inspections to keep your shipment moving."
          bullets={[
            "Commercial invoice preparation",
            "Duties & taxes guidance",
            "Regulatory compliance support",
          ]}
        />
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="rounded-2xl bg-white shadow-md border border-gray-200 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Ready to move a shipment?</h2>
            <p className="text-gray-600">Instant estimate based on weight, dimensions, and destination.</p>
          </div>
          <Link
            href="/create"
            className="inline-flex items-center px-5 py-3 rounded-lg bg-[#d80000] text-white font-semibold hover:bg-red-700 transition"
          >
            Start a Shipment
          </Link>
        </div>
      </section>
    </main>
  );
}

function ServiceBlock({
  Icon,
  title,
  body,
  bullets,
  right = false,
}: {
  Icon: any;
  title: string;
  body: string;
  bullets: string[];
  right?: boolean;
}) {
  const content = (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 h-full">
      <div className="flex items-start gap-4">
        <Icon />
        <div>
          <h3 className="text-2xl font-bold">{title}</h3>
          <p className="mt-2 text-gray-700">{body}</p>
          <ul className="mt-4 space-y-2 text-gray-700">
            {bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1 inline-block w-2 h-2 rounded-full bg-[#d80000]" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid md:grid-cols-2 gap-6 items-stretch">
      {right ? <div className="order-2 md:order-1">{content}</div> : <div>{content}</div>}
      <div className={`rounded-2xl bg-gray-100 border border-gray-200 ${right ? "order-1 md:order-2" : ""}`}>
        {/* Placeholder visual block; replace with an image if you like */}
        <div className="h-56 sm:h-72 w-full rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300" />
      </div>
    </div>
  );
}
