// app/account/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/hooks/useAppContext";

type Order = {
  id: string;
  trackingRef: string;
  route: string;
  status: "Created" | "In Transit" | "Customs" | "Out for Delivery" | "Delivered";
  timeline: { label: string; at?: string }[];
};

type Payment = {
  id: string;
  date: string;
  amountGBP: number;
  method: string;
  status: "Paid" | "Refunded" | "Pending";
};

type Details = {
  fullName: string;
  email: string;
  phone: string;
  address1: string;
  city: string;
  country: string;
};

export default function AccountPage() {
  const { user } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/auth/sign-in?next=/account");
  }, [user, router]);

  const [tab, setTab] = useState<"details" | "orders" | "payments" | "logout">("details");

  // Init with plain strings; hydrate from `user` in an effect
  const [details, setDetails] = useState<Details>({
    fullName: "",
    email: "",
    phone: "",
    address1: "",
    city: "",
    country: "United Kingdom",
  });

  useEffect(() => {
    if (!user) return;
    setDetails((d) => ({
      ...d,
      fullName: user.name ?? d.fullName,
      email: user.email ?? d.email,
      // add mappings only if your user object really has them:
      // phone: user.phone ?? d.phone,
      // address1: user.address1 ?? d.address1,
      // city: user.city ?? d.city,
      // country: user.country ?? d.country,
    }));
  }, [user]);

  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    // TODO: fetch from your API
    const demoOrders: Order[] = [
      {
        id: "1",
        trackingRef: "TRN123456",
        route: "UK → Lagos",
        status: "In Transit",
        timeline: [
          { label: "Created", at: "2025-09-01 09:12" },
          { label: "In Transit", at: "2025-09-02 14:40" },
          { label: "Customs" },
          { label: "Out for Delivery" },
          { label: "Delivered" },
        ],
      },
      {
        id: "2",
        trackingRef: "TRN654321",
        route: "Lagos → UK",
        status: "Delivered",
        timeline: [
          { label: "Created", at: "2025-08-12 11:00" },
          { label: "In Transit", at: "2025-08-13 08:30" },
          { label: "Customs", at: "2025-08-14 13:10" },
          { label: "Out for Delivery", at: "2025-08-15 10:00" },
          { label: "Delivered", at: "2025-08-15 13:45" },
        ],
      },
    ];
    const demoPayments: Payment[] = [
      { id: "pmt_1", date: "2025-09-01", amountGBP: 42.5, method: "Visa •••• 4242", status: "Paid" },
      { id: "pmt_2", date: "2025-08-12", amountGBP: 65.0, method: "Visa •••• 4242", status: "Paid" },
    ];
    setOrders(demoOrders);
    setPayments(demoPayments);
  }, []);

  function saveDetails(e: React.FormEvent) {
    e.preventDefault();
    // TODO: POST to /api/account/details
    alert("Details saved (demo).");
  }

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/");
  }

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">My Account</h1>

      {/* Tabs */}
      <div className="mt-4 rounded-2xl border bg-white p-2 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <Tab label="Personal Details" active={tab === "details"} onClick={() => setTab("details")} />
          <Tab label="Orders" active={tab === "orders"} onClick={() => setTab("orders")} />
          <Tab label="Payments" active={tab === "payments"} onClick={() => setTab("payments")} />
          <Tab label="Logout" active={tab === "logout"} onClick={() => setTab("logout")} />
        </div>
      </div>

      {/* Panels */}
      <div className="mt-4 space-y-4">
        {tab === "details" && (
          <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border bg-white p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Personal Details</h2>
            <form onSubmit={saveDetails} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Full name" value={details.fullName} onChange={(v) => setDetails({ ...details, fullName: v })} />
              <Field type="email" label="Email" value={details.email} onChange={(v) => setDetails({ ...details, email: v })} />
              <Field label="Phone" value={details.phone} onChange={(v) => setDetails({ ...details, phone: v })} />
              <Field label="Address line 1" value={details.address1} onChange={(v) => setDetails({ ...details, address1: v })} />
              <Field label="City" value={details.city} onChange={(v) => setDetails({ ...details, city: v })} />
              <Field label="Country" value={details.country} onChange={(v) => setDetails({ ...details, country: v })} />
              <div className="sm:col-span-2 flex justify-end">
                <button type="submit" className="btn-brand">Save changes</button>
              </div>
            </form>
          </motion.section>
        )}

        {tab === "orders" && (
          <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border bg-white p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Your Orders</h2>
            <div className="space-y-3">
              {orders.map((o) => (
                <div key={o.id} className="rounded-xl border p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="font-medium">{o.trackingRef} • {o.route}</div>
                    <Link href={`/track/${o.trackingRef}`} className="text-sm underline">View tracking</Link>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Status: {o.status}</div>
                  <div className="mt-3"><OrderProgress timeline={o.timeline} /></div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {tab === "payments" && (
          <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border bg-white p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Payments</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-gray-600">
                  <tr>
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4">Amount</th>
                    <th className="py-2 pr-4">Method</th>
                    <th className="py-2 pr-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id} className="border-t">
                      <td className="py-2 pr-4">{p.date}</td>
                      <td className="py-2 pr-4">£{p.amountGBP.toFixed(2)}</td>
                      <td className="py-2 pr-4">{p.method}</td>
                      <td className="py-2 pr-4">{p.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.section>
        )}

        {tab === "logout" && (
          <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border bg-white p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-3">Logout</h2>
            <p className="text-gray-600">You can sign out of your account using the button below.</p>
            <button onClick={logout} className="btn-brand mt-3">Logout</button>
          </motion.section>
        )}
      </div>
    </div>
  );
}

/* UI bits */
function Tab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-xl border px-4 py-2 text-sm transition",
        active ? "bg-[#d80000] text-white border-[#d80000]" : "bg-white hover:bg-[#d80000]/5 border-[#d80000]/30",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <div className="text-sm mb-1 text-gray-700">{label}</div>
      <input className="field" type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function OrderProgress({ timeline }: { timeline: { label: string; at?: string }[] }) {
  const firstMissing = useMemo(() => timeline.findIndex(s => !s.at), [timeline]);
  const activeIdx = firstMissing === -1 ? timeline.length - 1 : Math.max(0, firstMissing - 1);

  return (
    <ol className="flex items-center justify-between gap-2">
      {timeline.map((s, i) => {
        const done = !!s.at;
        const active = i === activeIdx + 1 && !done;
        return (
          <li key={i} className="flex-1">
            <div className="flex items-center gap-2">
              <div className={[
                "h-2.5 w-2.5 rounded-full",
                done ? "bg-[#d80000]" : active ? "bg-[#d80000]/60 animate-pulse" : "bg-gray-300",
              ].join(" ")} />
              <div className="text-xs">
                <div className="font-medium">{s.label}</div>
                {s.at && <div className="text-gray-500">{s.at}</div>}
              </div>
            </div>
            {i < timeline.length - 1 && (
              <div className={["h-0.5 ml-[5px] mt-2", done ? "bg-[#d80000]" : "bg-gray-200"].join(" ")} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
