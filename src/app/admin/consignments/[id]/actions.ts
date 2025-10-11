"use server";

import { revalidatePath } from "next/cache";
import { adminDb } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

// Keep in sync with your app STATUS_FLOW
export const ALLOWED_STATUSES = [
  "CREATED",
  "PICKED_UP",
  "IN_TRANSIT",
  "CUSTOMS",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
] as const;

type Status = (typeof ALLOWED_STATUSES)[number];

export async function updateConsignmentStatusAction(id: string, nextStatus: Status) {
  if (!ALLOWED_STATUSES.includes(nextStatus)) {
    throw new Error("Invalid status");
  }

  const ref = adminDb.collection("consignments").doc(id);

  // Optional: append to a simple timeline array
  await ref.update({
    status: nextStatus,
    updatedAt: FieldValue.serverTimestamp(),
    timeline: FieldValue.arrayUnion({
      at: FieldValue.serverTimestamp(),
      status: nextStatus,
    }),
  });

  // Revalidate both detail + list pages
  revalidatePath(`/admin/consignments/${id}`);
  revalidatePath(`/admin/consignments`);
}
