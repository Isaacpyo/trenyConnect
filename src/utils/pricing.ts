// src/utils/pricing.ts

export type PackageInput = {
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  weightKg: number; // actual
};

export type InsuranceTier = "NONE" | "BASIC" | "STANDARD" | "PREMIUM";
export type AccountType = "PERSONAL" | "BUSINESS";

export type PriceBreakdown = {
  chargeableWeightKg: number;
  baseFee: number;
  weightFee: number;
  discountPct: number;     // 0–1
  discountValue: number;   // £
  insuranceFee: number;    // £
  subTotal: number;        // after discount, before insurance
  total: number;           // final
  notes: string[];
};

export const DIM_DIVISOR = 5000;

const round2 = (n: number) => Math.round(n * 100) / 100;

export function dimensionalWeightKg(p: PackageInput, divisor = DIM_DIVISOR): number {
  return (p.lengthCm * p.widthCm * p.heightCm) / divisor;
}

export function chargeableWeight(packages: PackageInput[], divisor = DIM_DIVISOR): number {
  const sum = packages.reduce((acc, p) => {
    const vol = dimensionalWeightKg(p, divisor);
    return acc + Math.max(p.weightKg, vol);
  }, 0);
  return Math.ceil(sum * 10) / 10; // up to 0.1 kg
}

function pickWeightDiscount(cwKg: number, tiers: { minKg: number; pct: number }[]): number {
  const sorted = [...tiers].sort((a, b) => b.minKg - a.minKg);
  return sorted.find(t => cwKg >= t.minKg)?.pct ?? 0;
}

function pickBusinessDiscount(parcelCount: number, tiers: { minParcels: number; pct: number }[]): number {
  const sorted = [...tiers].sort((a, b) => b.minParcels - a.minParcels);
  return sorted.find(t => parcelCount >= t.minParcels)?.pct ?? 0;
}

export type PricingConfig = {
  baseFee: number;                 // £
  perKgFee: number;                // £/kg
  dimDivisor?: number;             // default 5000
  accountType: AccountType;

  // PERSONAL (optional)
  bulkDiscountsByWeight?: { minKg: number; pct: number }[];

  // BUSINESS (optional)
  businessParcelDiscounts?: { minParcels: number; pct: number }[];

  // Fixed prices for insurance tier selection
  insuranceTierPrices: Record<InsuranceTier, number>;
};

export function calcPrice(
  packages: PackageInput[],
  cfg: PricingConfig,
  selectedInsuranceTier: InsuranceTier,
  parcelCount: number = packages.length
): PriceBreakdown {
  const notes: string[] = [];
  const divisor = cfg.dimDivisor ?? DIM_DIVISOR;

  const cw = chargeableWeight(packages, divisor);
  const weightFee = round2(cw * cfg.perKgFee);
  const subBeforeDisc = round2(cfg.baseFee + weightFee);

  let discountPct = 0;
  if (cfg.accountType === "BUSINESS" && cfg.businessParcelDiscounts) {
    discountPct = pickBusinessDiscount(parcelCount, cfg.businessParcelDiscounts);
    if (discountPct > 0) notes.push(`Business parcel-count discount: ${Math.round(discountPct * 100)}%.`);
  } else if (cfg.accountType === "PERSONAL" && cfg.bulkDiscountsByWeight) {
    discountPct = pickWeightDiscount(cw, cfg.bulkDiscountsByWeight);
    if (discountPct > 0) notes.push(`Weight-based discount: ${Math.round(discountPct * 100)}%.`);
  }

  const discountValue = round2(subBeforeDisc * discountPct);
  const subAfterDisc = round2(subBeforeDisc - discountValue);

  const insuranceFee = round2(cfg.insuranceTierPrices[selectedInsuranceTier] ?? 0);
  if (insuranceFee > 0) notes.push(`Fixed-price insurance applied: ${selectedInsuranceTier} (£${insuranceFee.toFixed(2)}).`);

  const total = round2(subAfterDisc + insuranceFee);

  notes.push(`Chargeable weight is max(actual, volumetric) (divisor ${divisor}).`);

  return {
    chargeableWeightKg: +cw.toFixed(1),
    baseFee: cfg.baseFee,
    weightFee,
    discountPct,
    discountValue,
    insuranceFee,
    subTotal: subAfterDisc,
    total,
    notes,
  };
}
