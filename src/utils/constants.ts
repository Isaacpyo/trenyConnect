export const PRICING_MATRIX = {
  base: 12.5,
  perKg: 3.2,
} as const;

export const STATUS_FLOW = [
  "CREATED",
  "PICKED_UP",
  "IN_TRANSIT",
  "CUSTOMS",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
] as const;
