"use client";

import { useState } from "react";
import Button from "@/components/common/Button";
import { getConsignmentByRef } from "@/lib/firestore";
import { STATUS_FLOW } from "@/utils/constants";

export default function TrackingPage() {
  const [ref, setRef] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const onTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await getConsignmentByRef(ref.trim());
    setData(res);
    setLoading(false);
  };

  return (
    <section className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Track Shipment</h1>
      <form onSubmit={onTrack} className="flex gap-2">
        <input className="input flex-1" placeholder="Enter tracking reference" value={ref} onChange={(e) => setRef(e.target.value)} />
        <Button>Track</Button>
      </form>

      {loading && <p className="mt-4 text-sm">Loading…</p>}

      {data && (
        <div className="mt-4 p-4 rounded-lg border bg-white">
          <p className="font-semibold">{data.trackingRef}</p>
          <p className="text-sm text-gray-600">Status: {data.status}</p>
          <ol className="mt-3 list-decimal list-inside text-sm text-gray-700">
            {STATUS_FLOW.map((s) => (
              <li key={s} className={s === data.status ? "font-semibold" : ""}>{s}</li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
