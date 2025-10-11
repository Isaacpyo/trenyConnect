import Link from "next/link";
import { listRecentConsignments } from "@/lib/server/consignments";

export default async function ConsignmentsListPage() {
  const consignments = await listRecentConsignments(30);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Recent consignments</h1>
      <div className="rounded-lg border bg-white divide-y">
        {consignments.length === 0 && (
          <div className="p-4 text-sm text-gray-600">No consignments yet.</div>
        )}
        {consignments.map((c) => {
          const created =
            typeof c.createdAt === "number"
              ? new Date(c.createdAt)
              : c.createdAt?.toDate?.() ?? null;
          return (
            <div key={c.id} className="p-4 flex items-center justify-between">
              <div className="text-sm">
                <p className="font-medium">{c.trackingRef}</p>
                <p className="text-gray-600">
                  {c.status} {created ? `• ${created.toLocaleString()}` : ""}
                </p>
              </div>
              <Link href={`/admin/consignments/${c.id}`} className="text-sm underline">
                View
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
