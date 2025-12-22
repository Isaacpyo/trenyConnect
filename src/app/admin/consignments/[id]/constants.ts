// src/app/admin/consignments/[id]/constants.ts
export const ALLOWED_STATUSES = [
  "CREATED",
  "PICKED_UP",
  "IN_TRANSIT",
  "CUSTOMS",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
] as const;

export type Status = (typeof ALLOWED_STATUSES)[number];
