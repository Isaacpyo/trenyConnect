"use client";

import { useState, useTransition } from "react";

type Props = {
  id: string;
  current: string;
  options: string[];
  onUpdate: (status: string) => Promise<void>;
  quick?: string[]; // optional quick-pick statuses
};

export default function StatusUpdater({
  id,
  current,
  options,
  onUpdate,
  quick = ["PICKED_UP", "IN_TRANSIT", "CUSTOMS", "OUT_FOR_DELIVERY", "DELIVERED"],
}: Props) {
  const [value, setValue] = useState(current);
  const [isPending, startTransition] = useTransition();

  const runUpdate = (next: string) => {
    if (next === current) return;
    startTransition(async () => {
      await onUpdate(next);
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col md:flex-row gap-2 md:items-center">
        <select
          className="input w-full md:w-auto"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        >
          {options.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <button
          className="px-4 py-2 rounded text-sm bg-black text-white disabled:opacity-50"
          disabled={isPending || value === current}
          onClick={() => runUpdate(value)}
        >
          {isPending ? "Updating…" : "Update status"}
        </button>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2">
        {quick.map((q) => (
          <button
            key={q}
            className={`px-3 py-1.5 rounded text-sm border ${
              q === current
                ? "bg-gray-200 border-gray-300 cursor-not-allowed"
                : "bg-white hover:bg-gray-50 border-gray-300"
            }`}
            disabled={isPending || q === current}
            onClick={() => runUpdate(q)}
            title={`Set status to ${q}`}
          >
            {q.replaceAll("_", " ")}
          </button>
        ))}
      </div>
    </div>
  );
}
