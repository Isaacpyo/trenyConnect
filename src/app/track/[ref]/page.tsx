// app/track/[ref]/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Consignment — Treny Connect",
};

const STATUSES = [
  "Created",
  "Picked Up",
  "In Transit",
  "At Customs",
  "Out for Delivery",
  "Delivered",
] as const;

function getMockStatusIndex(ref: string) {
  const sum = ref.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return Math.min(sum % STATUSES.length, STATUSES.length - 1);
}

export default async function TrackPage({
  params,
}: {
  params: Promise<{ ref: string }>;
}) {
  const { ref } = await params;
  const active = getMockStatusIndex(ref);

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-1">Tracking</h1>
      <p className="text-gray-600 mb-6">
        Reference: <span className="font-mono">{ref}</span>
      </p>

      <ol className="relative border-s ps-6 space-y-6">
        {STATUSES.map((label, i) => (
          <li key={label} className="relative">
            <span
              className={[
                "absolute -start-2 top-1.5 h-3 w-3 rounded-full",
                i <= active ? "bg-emerald-600" : "bg-gray-300",
              ].join(" ")}
            />
            <div
              className={[
                "rounded-xl border p-3 sm:p-4",
                i <= active ? "bg-emerald-50 border-emerald-200" : "bg-white",
              ].join(" ")}
            >
              <div className="font-medium">{label}</div>
              <div className="text-xs text-gray-600">Updated just now (demo)</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
