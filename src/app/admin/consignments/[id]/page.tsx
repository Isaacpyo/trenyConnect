import ShipmentDocuments from "@/components/admin/ShipmentDocuments";
import StatusUpdater from "@/components/admin/StatusUpdater";
import { getConsignmentById } from "@/lib/server/consignments";
import Link from "next/link";
import { ALLOWED_STATUSES, updateConsignmentStatusAction } from "./actions";

type Props = { params: { id: string } };

export default async function ConsignmentDetailPage({ params }: Props) {
  const consignment = await getConsignmentById(params.id);
  if (!consignment) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Consignment not found</h1>
        <Link href="/admin/consignments" className="underline">Back to consignments</Link>
      </div>
    );
  }

  const created =
    typeof consignment.createdAt === "number"
      ? new Date(consignment.createdAt)
      : consignment.createdAt?.toDate?.() ?? null;

  // Server action adapter for the client widget
  async function onUpdate(status: string) {
    "use server";
    // Narrow the type on server side
    await updateConsignmentStatusAction(params.id, status as any);
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Consignment {consignment.trackingRef}</h1>
        <Link href="/admin/consignments" className="text-sm underline">Back to list</Link>
      </div>

      <div className="rounded-lg border bg-white p-4 space-y-3">
        <p><span className="font-semibold">Status:</span> {consignment.status}</p>
        {created && <p><span className="font-semibold">Created:</span> {created.toLocaleString()}</p>}

        {/* Status updater */}
        <div className="pt-2 border-t">
          <p className="text-sm font-semibold mb-2">Update status</p>
          <StatusUpdater
            id={consignment.id}
            current={consignment.status ?? ""}
            options={Array.from(ALLOWED_STATUSES)}
            onUpdate={onUpdate}
          />
        </div>
      </div>

      {typeof consignment.price === "number" && (
        <div className="rounded-lg border bg-white p-4">
          <p><span className="font-semibold">Total Price:</span> £{consignment.price.toFixed(2)}</p>
        </div>
      )}

      {consignment.priceBreakdown && (
        <div className="rounded-lg border bg-white p-4">
          <h2 className="font-semibold mb-2">Price breakdown</h2>
          <pre className="text-sm overflow-auto">{JSON.stringify(consignment.priceBreakdown, null, 2)}</pre>
        </div>
      )}

      <div className="rounded-lg border bg-white p-4">
        <h2 className="font-semibold mb-2">Shipper & Receiver</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium">Shipper</p>
            <p>{consignment.shipperName}</p>
            <p>{consignment.shipperPhone}</p>
            <p>{consignment.shipperEmail}</p>
            <p>{consignment.fromCity}, {consignment.fromCountry}</p>
          </div>
          <div>
            <p className="font-medium">Receiver</p>
            <p>{consignment.receiverName}</p>
            <p>{consignment.receiverPhone}</p>
            <p>{consignment.receiverEmail}</p>
            <p>{consignment.toCity}</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <h2 className="font-semibold mb-2">Parcels</h2>
        {Array.isArray(consignment.packages) ? (
          <div className="space-y-2 text-sm">
            {consignment.packages.map((p: any, idx: number) => (
              <div key={idx} className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <p><b>#{idx + 1}</b></p>
                <p>L×W×H: {p.lengthCm}×{p.widthCm}×{p.heightCm} cm</p>
                <p>Weight: {p.weightKg} kg</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600">No parcels found.</p>
        )}
      </div>

      <ShipmentDocuments urls={consignment.documents} />

      {/* Optional: show timeline */}
      {Array.isArray(consignment.timeline) && consignment.timeline.length > 0 && (
        <div className="rounded-lg border bg-white p-4">
          <h2 className="font-semibold mb-2">Timeline</h2>
          <ul className="text-sm list-disc list-inside">
            {consignment.timeline
              .slice() // clone
              .reverse() // newest first
              .map((t: any, i: number) => {
                const d =
                  t?.at?.toDate?.() ??
                  (typeof t?.at === "number" ? new Date(t.at) : null);
                return (
                  <li key={i}>
                    <span className="font-medium">{t.status}</span>
                    {d ? ` • ${d.toLocaleString()}` : ""}
                  </li>
                );
              })}
          </ul>
        </div>
      )}
    </div>
  );
}
