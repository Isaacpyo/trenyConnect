/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/consignments.ts (server-only file)
import { adminDb } from "@/lib/firebaseAdmin";
import type { Timestamp } from "firebase-admin/firestore";

export type Consignment = {
  id: string;
  trackingRef?: string; // made optional
  status?: string;      // made optional
  price?: number;
  priceBreakdown?: any;
  documents?: string[];
  createdAt?: number | Timestamp;
  [key: string]: any;
};

export async function getConsignmentById(id: string): Promise<Consignment | null> {
  const snap = await adminDb.collection("consignments").doc(id).get();
  if (!snap.exists) return null;

  const data = snap.data();
  if (!data) return null; // satisfies TS

  return { id: snap.id, ...(data as Omit<Consignment, "id">) };
}

export async function listRecentConsignments(limit = 20): Promise<Consignment[]> {
  const snap = await adminDb
    .collection("consignments")
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();

  return snap.docs.map((d) => {
    const data = d.data();
    // Optional: skip docs missing data/createdAt to avoid runtime issues
    return { id: d.id, ...(data as Omit<Consignment, "id">) };
  });
}

