import { db } from "@/lib/firebaseConfig";
import { doc, onSnapshot, getDoc } from "firebase/firestore";

export type InsuranceTierKey = "NONE" | "BASIC" | "STANDARD" | "PREMIUM";

export type PricingDoc = {
  baseFee: number;            // e.g., 12.5
  perKgFee: number;           // e.g., 3.2
  dimDivisor: number;         // e.g., 5000
  // Weight discounts (still supported for Personal)
  bulkDiscountsByWeight: { minKg: number; pct: number }[];
  // Business parcel-count discounts
  businessParcelDiscounts: { minParcels: number; pct: number }[];

  // Fixed-price insurance tiers
  insuranceFixed: Record<InsuranceTierKey, { label: string; price: number; cover: number }>;
};

export const DEFAULT_PRICING: PricingDoc = {
  baseFee: 12.5,
  perKgFee: 3.2,
  dimDivisor: 5000,
  bulkDiscountsByWeight: [
    { minKg: 100, pct: 0.15 },
    { minKg: 50,  pct: 0.10 },
    { minKg: 20,  pct: 0.05 },
  ],
  businessParcelDiscounts: [
    { minParcels: 11, pct: 0.10 },
    { minParcels: 5,  pct: 0.05 },
  ],
  insuranceFixed: {
    NONE:     { label: "No Insurance",                  price: 0,  cover: 0 },
    BASIC:    { label: "Basic Cover (up to £100)",      price: 2,  cover: 100 },
    STANDARD: { label: "Standard Cover (up to £500)",   price: 8,  cover: 500 },
    PREMIUM:  { label: "Premium Cover (up to £2000)",   price: 25, cover: 2000 },
  },
};

export async function getPricingOnce(): Promise<PricingDoc> {
  const snap = await getDoc(doc(db, "pricing", "default"));
  return (snap.data() as PricingDoc) || DEFAULT_PRICING;
}

export function listenPricing(cb: (p: PricingDoc) => void) {
  return onSnapshot(doc(db, "pricing", "default"), (snap) => {
    cb((snap.data() as PricingDoc) || DEFAULT_PRICING);
  });
}
