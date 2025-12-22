"use server";

import { revalidatePath } from "next/cache";
import { adminDb } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";
import { ALLOWED_STATUSES, type Status } from "./constants";

export async function updateConsignmentStatusAction(id: string, nextStatus: Status) {
  if (!ALLOWED_STATUSES.includes(nextStatus)) {
    throw new Error("Invalid status");
  }

  const ref = adminDb.collection("consignments").doc(id);

  await ref.update({
    status: nextStatus,
    updatedAt: FieldValue.serverTimestamp(),
    timeline: FieldValue.arrayUnion({
      at: FieldValue.serverTimestamp(),
      status: nextStatus,
    }),
  });

  revalidatePath(`/admin/consignments/${id}`);
  revalidatePath(`/admin/consignments`);
}
