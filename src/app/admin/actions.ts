"use server";

import { adminDb } from "@/lib/firebaseAdmin";

export async function getConsignmentByIdAction(id: string) {
  const snap = await adminDb.collection("consignments").doc(id).get();
  return snap.exists ? { id: snap.id, ...snap.data() } : null;
}

export async function listRecentConsignmentsAction(limit = 20) {
  const snap = await adminDb
    .collection("consignments")
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();

  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
