// app/create/page.tsx — Direction picker (no step), Addresses combined with flip,
// insurance tabs, beautified dropdowns, country->city cascading selects.

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

// ---------------- Types ----------------

type Direction = "SHIP_TO_AFRICA" | "SHIP_TO_UK";

type Party = {
  fullName: string;
  email?: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state?: string;
  postcode?: string;
  country: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // allow contentDescription on recipient
};

type GoodsInfo = {
  category: string;
  declaredValueGBP: number;
  notes?: string;
  insurance: InsuranceTier;
};

type PackageInput = {
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  weightKg: number;
};

type InsuranceTier = "NONE" | "BASIC" | "STANDARD" | "PREMIUM";

type PaymentInfo = {
  cardNumber: string;
  expiry: string;
  cvc: string;
  billingName: string;
  billingAddress1: string;
  billingAddress2?: string;
  billingCity: string;
  billingPostcode: string;
  billingCountry: string;
  agreeToTerms: boolean;
};

type WizardData = {
  direction: Direction | null; // <- now nullable until chosen
  sender: Party;
  recipient: Party;
  goods: GoodsInfo;
  pkg: PackageInput;
  phoneVerified: boolean;
  priceEstimate: number;
  payment?: PaymentInfo;
};

// ---------------- Constants ----------------

const DIM_DIVISOR = 5000;
const BASE_FEE = 12.5;
const PER_KG_FEE = 3.2;

const INSURANCE_PRICING: Record<InsuranceTier, number> = {
  NONE: 0,
  BASIC: 4,
  STANDARD: 9,
  PREMIUM: 25,
};

const CATEGORIES = [
  "Clothing",
  "Food (non-perishable)",
  "Electronics",
  "Documents",
  "Cosmetics",
  "Household",
  "Other",
];

const COUNTRY_CITIES: Record<string, string[]> = {
  Nigeria: ["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Benin City", "Enugu", "Onitsha"],
  Ghana: ["Accra", "Kumasi", "Tamale", "Takoradi", "Tema"],
  Kenya: ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret"],
  "South Africa": ["Johannesburg", "Cape Town", "Durban", "Pretoria", "Port Elizabeth"],
  Zimbabwe: ["Harare", "Bulawayo", "Mutare", "Gweru", "Masvingo"],
  Cameroon: ["Douala", "Yaoundé", "Bamenda", "Bafoussam"],
  "Côte d’Ivoire": ["Abidjan", "Bouaké", "Daloa", "San-Pédro"],
  "United Kingdom": ["London", "Manchester", "Birmingham", "Leeds", "Glasgow"],
};

// New step list (no “Direction” here)
const STEPS = [
  "Addresses",
  "Goods & Insurance",
  "Cost Calculator",
  "Phone Verification",
  "Payment & Billing",
  "Review & Submit",
] as const;

// ---------------- Component ----------------

export default function CreateConsignmentPage() {
  const [step, setStep] = useState(0); // first step after choosing direction
  const [submitting, setSubmitting] = useState(false);

  const [data, setData] = useState<WizardData>({
    direction: null, // <- not chosen yet
    sender: {
      fullName: "",
      email: "",
      phone: "",
      address1: "",
      city: "",
      postcode: "",
      country: "United Kingdom",
    },
    recipient: {
      fullName: "",
      phone: "",
      address1: "",
      city: "",
      country: "Nigeria",
      contentDescription: "",
    },
    goods: { category: "", declaredValueGBP: 0, notes: "", insurance: "NONE" },
    pkg: { lengthCm: 0, widthCm: 0, heightCm: 0, weightKg: 0 },
    phoneVerified: false,
    priceEstimate: 0,
  });

  // Labels
  const senderLabel =
    data.direction === "SHIP_TO_AFRICA"
      ? "Sender Details (UK)"
      : data.direction === "SHIP_TO_UK"
      ? "Sender Details (Africa)"
      : "Sender Details";
  const recipientLabel =
    data.direction === "SHIP_TO_AFRICA"
      ? "Recipient Details (Africa)"
      : data.direction === "SHIP_TO_UK"
      ? "Recipient Details (UK)"
      : "Recipient Details";

  // Calculator
  const chargeableWeight = useMemo(() => {
    const volKg = (data.pkg.lengthCm * data.pkg.widthCm * data.pkg.heightCm) / DIM_DIVISOR;
    return Math.max(Number(data.pkg.weightKg || 0), Number(volKg || 0));
  }, [data.pkg]);

  const estimate = useMemo(() => {
    const weightFee = chargeableWeight * PER_KG_FEE;
    const subTotal = BASE_FEE + weightFee + INSURANCE_PRICING[data.goods.insurance];
    return Number(subTotal.toFixed(2));
  }, [chargeableWeight, data.goods.insurance]);

  if (data.priceEstimate !== estimate) {
    setTimeout(() => setData((d) => ({ ...d, priceEstimate: estimate })), 0);
  }

  // Validation with new step indices
  function currentStepValid(s: number = step): boolean {
    switch (s) {
      // 0: Addresses
      case 0: {
        const a = data.sender;
        const b = data.recipient;
        const senderOk = !!(a.fullName && a.phone && a.address1 && a.city && a.country);
        const recipientOk = !!(b.fullName && b.phone && b.address1 && b.city && b.country);
        return senderOk && recipientOk;
      }
      // 1: Goods & Insurance
      case 1: {
        const g = data.goods;
        return !!(g.category && g.declaredValueGBP >= 0 && g.insurance);
      }
      // 2: Calculator
      case 2: {
        const p = data.pkg;
        return p.lengthCm > 0 && p.widthCm > 0 && p.heightCm > 0 && p.weightKg > 0;
      }
      // 3: Phone
      case 3:
        return data.phoneVerified === true;
      // 4: Payment
      case 4: {
        const p = data.payment!;
        if (!p) return false;
        return !!(
          p.cardNumber &&
          p.expiry &&
          p.cvc &&
          p.billingName &&
          p.billingAddress1 &&
          p.billingCity &&
          p.billingPostcode &&
          p.billingCountry &&
          p.agreeToTerms
        );
      }
      // 5: Review
      case 5:
        return true;
      default:
        return false;
    }
  }

  function next() {
    if (!currentStepValid(step)) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function submit() {
    if (!currentStepValid(5)) return;
    setSubmitting(true);
    try {
      const trackingRef =
        "TRN" + Math.floor(Math.random() * 1_000_000).toString().padStart(6, "0");
      window.location.href = `/track/${trackingRef}`;
    } finally {
      setSubmitting(false);
    }
  }

  // ---------------- JSX ----------------
  const hasDirection = !!data.direction;

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-4">Create Consignment</h1>

      {/* Direction chooser appears BEFORE stepper */}
      {!hasDirection && (
        <Card title="Where are you shipping?">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <BigTab
              active={false}
              onClick={() =>
                setData((d) => ({
                  ...d,
                  direction: "SHIP_TO_AFRICA",
                  sender: { ...d.sender, country: "United Kingdom" },
                  recipient: { ...d.recipient, country: d.recipient.country || "Nigeria" },
                }))
              }
              title="Ship to Africa"
              subtitle="Send from the UK to an African destination"
            />
            <BigTab
              active={false}
              onClick={() =>
                setData((d) => ({
                  ...d,
                  direction: "SHIP_TO_UK",
                  sender: { ...d.sender, country: d.sender.country || "Nigeria" },
                  recipient: { ...d.recipient, country: "United Kingdom" },
                }))
              }
              title="Ship to the UK"
              subtitle="Send from Africa to the UK"
            />
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Pick a direction to start. Steps will appear after your selection.
          </p>
        </Card>
      )}

      {/* Stepper shows only AFTER direction is selected */}
      {hasDirection && (
        <div className="mt-4">
          {/* NEW: tiny change-direction link */}
          <div className="mb-2 flex justify-end">
            <button
              type="button"
              className="text-xs text-gray-600 underline hover:text-brand transition"
              onClick={() => {
                setStep(0);
                setData((d) => ({ ...d, direction: null }));
              }}
              aria-label="Change shipping direction"
            >
              Change direction
            </button>
          </div>

          <UnifiedStepper
            steps={STEPS as unknown as string[]}
            activeIndex={step}
            onStepClick={(i) => {
              if (i <= step) setStep(i);
            }}
          />
        </div>
      )}

      <div className="mt-6 space-y-6">
        {/* Step 0: Addresses (Sender & Recipient in one card, order flips) */}
        {hasDirection && step === 0 && (
          <Card title="Addresses">
            {/* When shipping TO AFRICA: Sender(UK) on top, Recipient(Africa) below
                When shipping TO UK:    Recipient(UK) on top, Sender(Africa) below */}
            {data.direction === "SHIP_TO_AFRICA" ? (
              <>
                {/* Sender (UK) first */}
                <div className="pb-4">
                  <h3 className="text-base font-semibold mb-2">{senderLabel}</h3>
                  <PartyForm
                    value={data.sender}
                    direction={data.direction}
                    side="sender"
                    onChange={(v) => setData((d) => ({ ...d, sender: v }))}
                  />
                </div>

                <div className="h-px bg-gray-200 my-4" />

                {/* Recipient (Africa) second */}
                <div className="pt-4">
                  <h3 className="text-base font-semibold mb-2">{recipientLabel}</h3>
                  <PartyForm
                    value={data.recipient}
                    direction={data.direction}
                    side="recipient"
                    onChange={(v) => setData((d) => ({ ...d, recipient: v }))}
                    showContentDescription
                  />
                </div>
              </>
            ) : (
              <>
                {/* Recipient (UK) first */}
                <div className="pb-4">
                  <h3 className="text-base font-semibold mb-2">{recipientLabel}</h3>
                  <PartyForm
                    value={data.recipient}
                    direction={data.direction!}
                    side="recipient"
                    onChange={(v) => setData((d) => ({ ...d, recipient: v }))}
                    showContentDescription
                  />
                </div>

                <div className="h-px bg-gray-200 my-4" />

                {/* Sender (Africa) second */}
                <div className="pt-4">
                  <h3 className="text-base font-semibold mb-2">{senderLabel}</h3>
                  <PartyForm
                    value={data.sender}
                    direction={data.direction!}
                    side="sender"
                    onChange={(v) => setData((d) => ({ ...d, sender: v }))}
                  />
                </div>
              </>
            )}
          </Card>
        )}

        {hasDirection && step === 1 && (
          <Card title="Category of Goods & Insurance">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                label="Category of Goods"
                value={data.goods.category}
                onChange={(v) =>
                  setData((d) => ({ ...d, goods: { ...d.goods, category: v } }))
                }
                options={["", ...CATEGORIES]}
              />
              <NumberInput
                label="Declared Value (GBP)"
                value={data.goods.declaredValueGBP}
                onChange={(n) =>
                  setData((d) => ({
                    ...d,
                    goods: { ...d.goods, declaredValueGBP: n },
                  }))
                }
              />
            </div>

            <div className="mt-4">
              <InsuranceTabs
                value={data.goods.insurance}
                onChange={(v) =>
                  setData((d) => ({ ...d, goods: { ...d.goods, insurance: v } }))
                }
              />
              <p className="text-sm text-gray-600 mt-2">
                BASIC (to £100), STANDARD (to £500), PREMIUM (to £2000).
              </p>
            </div>

            <Textarea
              label="Notes (optional)"
              placeholder="Any special handling notes?"
              value={data.goods.notes || ""}
              onChange={(v) =>
                setData((d) => ({ ...d, goods: { ...d.goods, notes: v } }))
              }
            />
          </Card>
        )}

        {hasDirection && step === 2 && (
          <Card title="How to Use Our Cost Calculator">
            <p className="text-gray-700 mb-4">
              Enter package dimensions (cm) and weight (kg). We compare actual vs volumetric
              (L×W×H ÷ {DIM_DIVISOR}) and use the larger as the chargeable weight.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <NumberInput
                label="Length (cm)"
                value={data.pkg.lengthCm}
                onChange={(n) =>
                  setData((d) => ({ ...d, pkg: { ...d.pkg, lengthCm: n } }))
                }
              />
              <NumberInput
                label="Width (cm)"
                value={data.pkg.widthCm}
                onChange={(n) =>
                  setData((d) => ({ ...d, pkg: { ...d.pkg, widthCm: n } }))
                }
              />
              <NumberInput
                label="Height (cm)"
                value={data.pkg.heightCm}
                onChange={(n) =>
                  setData((d) => ({ ...d, pkg: { ...d.pkg, heightCm: n } }))
                }
              />
              <NumberInput
                label="Weight (kg)"
                value={data.pkg.weightKg}
                onChange={(n) =>
                  setData((d) => ({ ...d, pkg: { ...d.pkg, weightKg: n } }))
                }
              />
            </div>
            <div className="mt-4 rounded-2xl border bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600">Chargeable Weight</div>
                  <div className="text-xl font-semibold">
                    {chargeableWeight.toFixed(2)} kg
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Estimated Total</div>
                  <div className="text-2xl font-bold">£{estimate.toFixed(2)}</div>
                  <div className="text-xs text-gray-500">
                    Incl. base, per-kg &amp; insurance
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {hasDirection && step === 3 && (
          <Card title="Phone Number Verification">
            {!data.phoneVerified ? (
              <div className="space-y-3">
                <Input
                  label="Sender Phone (reconfirm)"
                  placeholder="+44 7..."
                  value={data.sender.phone}
                  onChange={(v) =>
                    setData((d) => ({ ...d, sender: { ...d.sender, phone: v } }))
                  }
                />
                <div className="flex flex-wrap items-end gap-2">
                  <button
                    type="button"
                    onClick={() => alert("OTP sent (demo). Enter 123456 to verify.")}
                    className="btn-brand"
                  >
                    Send Code
                  </button>
                  <Input label="Enter Code" placeholder="123456" value={""} onChange={() => {}} />
                  <button
                    type="button"
                    onClick={() => setData((d) => ({ ...d, phoneVerified: true }))}
                    className="btn-outline"
                  >
                    Verify (demo)
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Integrate Firebase SMS or Twilio Verify here.
                </p>
              </div>
            ) : (
              <div className="rounded-lg border p-3 bg-emerald-50 text-emerald-700">
                Phone verified ✅
              </div>
            )}
          </Card>
        )}

        {hasDirection && step === 4 && (
          <Card title="Payment & Billing">
            <p className="text-gray-700 mb-3">Replace with Stripe Elements in production.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Card Number"
                placeholder="4242 4242 4242 4242"
                value={data.payment?.cardNumber || ""}
                onChange={(v) =>
                  setData((d) => ({
                    ...d,
                    payment: { ...d.payment, cardNumber: v } as PaymentInfo,
                  }))
                }
              />
              <Input
                label="Expiry (MM/YY)"
                placeholder="12/27"
                value={data.payment?.expiry || ""}
                onChange={(v) =>
                  setData((d) => ({
                    ...d,
                    payment: { ...d.payment, expiry: v } as PaymentInfo,
                  }))
                }
              />
              <Input
                label="CVC"
                placeholder="123"
                value={data.payment?.cvc || ""}
                onChange={(v) =>
                  setData((d) => ({
                    ...d,
                    payment: { ...d.payment, cvc: v } as PaymentInfo,
                  }))
                }
              />
              <Input
                label="Billing Name"
                value={data.payment?.billingName || ""}
                onChange={(v) =>
                  setData((d) => ({
                    ...d,
                    payment: { ...d.payment, billingName: v } as PaymentInfo,
                  }))
                }
              />
              <Input
                label="Billing Address 1"
                value={data.payment?.billingAddress1 || ""}
                onChange={(v) =>
                  setData((d) => ({
                    ...d,
                    payment: { ...d.payment, billingAddress1: v } as PaymentInfo,
                  }))
                }
              />
              <Input
                label="Billing Address 2 (optional)"
                value={data.payment?.billingAddress2 || ""}
                onChange={(v) =>
                  setData((d) => ({
                    ...d,
                    payment: { ...d.payment, billingAddress2: v } as PaymentInfo,
                  }))
                }
              />
              <Input
                label="City"
                value={data.payment?.billingCity || ""}
                onChange={(v) =>
                  setData((d) => ({
                    ...d,
                    payment: { ...d.payment, billingCity: v } as PaymentInfo,
                  }))
                }
              />
              <Input
                label="Postcode"
                value={data.payment?.billingPostcode || ""}
                onChange={(v) =>
                  setData((d) => ({
                    ...d,
                    payment: { ...d.payment, billingPostcode: v } as PaymentInfo,
                  }))
                }
              />
              <Input
                label="Country"
                value={data.payment?.billingCountry || "United Kingdom"}
                onChange={(v) =>
                  setData((d) => ({
                    ...d,
                    payment: { ...d.payment, billingCountry: v } as PaymentInfo,
                  }))
                }
              />
            </div>
            <div className="mt-3 flex items-center gap-2">
              <input
                id="agree"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300"
                checked={!!data.payment?.agreeToTerms}
                onChange={(e) =>
                  setData((d) => ({
                    ...d,
                    payment: {
                      ...(d.payment || {}),
                      agreeToTerms: e.target.checked,
                    } as PaymentInfo,
                  }))
                }
              />
              <label htmlFor="agree" className="text-sm text-gray-700">
                I agree to the Terms &amp; Privacy Policy.
              </label>
            </div>
          </Card>
        )}

        {hasDirection && step === 5 && (
          <Card title="Review & Submit">
            <div className="space-y-3 text-sm">
              <SummaryRow
                label="Direction"
                value={data.direction === "SHIP_TO_AFRICA" ? "UK → Africa" : "Africa → UK"}
              />
              <SummaryRow
                label="Sender"
                value={`${data.sender.fullName || "-"}, ${data.sender.country}`}
              />
              <SummaryRow
                label="Recipient"
                value={`${data.recipient.fullName || "-"}, ${data.recipient.country}`}
              />
              <SummaryRow
                label="Goods"
                value={`${data.goods.category || "-"} (£${data.goods.declaredValueGBP})`}
              />
              <SummaryRow label="Insurance" value={data.goods.insurance} />
              <SummaryRow label="Chargeable Weight" value={`${chargeableWeight.toFixed(2)} kg`} />
              <SummaryRow label="Estimate" value={`£${estimate.toFixed(2)}`} />
            </div>
          </Card>
        )}
      </div>

      {/* Nav buttons appear only after a direction is chosen */}
      {hasDirection && (
        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={back}
            disabled={step === 0}
            className="btn-outline disabled:opacity-40"
          >
            Back
          </button>
          <div className="flex items-center gap-3">
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={next}
                disabled={!currentStepValid(step)}
                className="btn-brand disabled:opacity-40"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={submitting}
                className="btn-brand"
              >
                {submitting ? "Submitting..." : "Submit & Get Tracking"}
              </button>
            )}
          </div>
        </div>
      )}

      <div className="mt-8 text-sm text-gray-600">
        Need help? See our <Link className="underline" href="/help">Shipping Guide</Link>.
      </div>
    </div>
  );
}

// ---------------- Reusable UI ----------------

function UnifiedStepper({
  steps,
  activeIndex,
  onStepClick,
}: {
  steps: string[];
  activeIndex: number;
  onStepClick?: (i: number) => void;
}) {
  return (
    <div className="rounded-2xl border bg-white p-2 shadow-sm">
      <ol className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {steps.map((label, i) => {
          const done = i < activeIndex;
          const active = i === activeIndex;
          return (
            <li key={i}>
              <button
                type="button"
                disabled={i > activeIndex}
                onClick={() => onStepClick?.(i)}
                className={[
                  "w-full rounded-xl border px-3 py-2 text-left transition-colors",
                  "font-medium text-[13px] sm:text-sm",
                  active
                    ? "bg-brand text-white border-brand"
                    : done
                    ? "bg-brand/10 border-brand/30 text-brand-ink"
                    : "bg-gray-50 hover:bg-gray-100 border-gray-200",
                ].join(" ")}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={[
                      "h-2.5 w-2.5 rounded-full",
                      active || done ? "bg-white" : "bg-gray-300",
                    ].join(" ")}
                  />
                  <span>{label}</span>
                </div>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-white p-4 sm:p-6 shadow-sm animate-[fadeIn_220ms_ease]">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      {children}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px) }
          to { opacity: 1; transform: translateY(0) }
        }
      `}</style>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <div className="text-sm mb-1 text-gray-700">{label}</div>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="field"
      />
    </label>
  );
}

function NumberInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="block">
      <div className="text-sm mb-1 text-gray-700">{label}</div>
      <input
        inputMode="decimal"
        type="number"
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(parseFloat(e.target.value || "0"))}
        className="field"
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <div className="text-sm mb-1 text-gray-700">{label}</div>
      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="field min-h-[90px]"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <div className="text-sm mb-1 text-gray-700">{label}</div>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="field appearance-none pr-10"
        >
          {options.map((o, idx) => (
            <option key={idx} value={o} disabled={idx === 0 && o === ""}>
              {idx === 0 && o === "" ? "Select..." : o}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
          ▾
        </span>
      </div>
    </label>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border p-3 bg-white">
      <div className="text-gray-600">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

// Enhanced hover effect: subtle lift + ring
function BigTab({
  title,
  subtitle,
  active,
  onClick,
}: {
  title: string;
  subtitle?: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full rounded-2xl border px-4 py-5 text-left shadow-sm transition",
        "transform duration-150 ease-out",
        "hover:-translate-y-0.5 hover:shadow-md",
        "hover:ring-2 hover:ring-brand/30 hover:border-brand",
        active ? "bg-brand text-white border-brand" : "bg-white hover:bg-brand/5 border-brand/30",
      ].join(" ")}
    >
      <div className="text-lg font-semibold">{title}</div>
      {subtitle && (
        <div className={active ? "text-white/90" : "text-gray-600"}>{subtitle}</div>
      )}
    </button>
  );
}

function InsuranceTabs({
  value,
  onChange,
}: {
  value: InsuranceTier;
  onChange: (v: InsuranceTier) => void;
}) {
  const items: { key: InsuranceTier; label: string; note: string }[] = [
    { key: "BASIC", label: "BASIC", note: "to £100" },
    { key: "STANDARD", label: "STANDARD", note: "to £500" },
    { key: "PREMIUM", label: "PREMIUM", note: "to £2000" },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
      {items.map((it) => {
        const active = value === it.key;
        return (
          <button
            key={it.key}
            type="button"
            onClick={() => onChange(it.key)}
            className={[
              "rounded-xl border px-4 py-3 text-left transition",
              "transform duration-150 ease-out hover:-translate-y-0.5 hover:shadow-sm",
              "hover:ring-2 hover:ring-brand/30 hover:border-brand",
              active ? "bg-brand text-white border-brand" : "bg-white hover:bg-brand/5 border-brand/30",
            ].join(" ")}
          >
            <div className="font-semibold">{it.label}</div>
            <div className={active ? "text-white/90" : "text-gray-600"}>{it.note}</div>
          </button>
        );
      })}
      <button
        type="button"
        onClick={() => onChange("NONE")}
        className={[
          "rounded-xl border px-4 py-3 text-left transition",
          "transform duration-150 ease-out hover:-translate-y-0.5 hover:shadow-sm",
          "hover:ring-2 hover:ring-brand/30 hover:border-brand",
          value === "NONE" ? "bg-brand text-white border-brand" : "bg-white hover:bg-brand/5 border-brand/30",
        ].join(" ")}
      >
        <div className="font-semibold">NO INSURANCE</div>
        <div className={value === "NONE" ? "text-white/90" : "text-gray-600"}>£0 added</div>
      </button>
    </div>
  );
}

// Party form with cascading country -> city dropdowns and conditional postcode
function PartyForm({
  value,
  onChange,
  direction,
  side,
  showContentDescription,
}: {
  value: Party;
  onChange: (v: Party) => void;
  direction: Direction;
  side: "sender" | "recipient";
  showContentDescription?: boolean;
}) {
  const africaCountries = [
    "Nigeria",
    "Ghana",
    "Kenya",
    "South Africa",
    "Zimbabwe",
    "Cameroon",
    "Côte d’Ivoire",
  ];
  const isUKSide =
    (direction === "SHIP_TO_AFRICA" && side === "sender") ||
    (direction === "SHIP_TO_UK" && side === "recipient");

  const countries = isUKSide ? ["United Kingdom"] : africaCountries;
  const cities = COUNTRY_CITIES[value.country] || [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <Input label="Full Name" value={value.fullName} onChange={(v) => onChange({ ...value, fullName: v })} />
      {isUKSide && (
        <Input label="Email" type="email" value={value.email || ""} onChange={(v) => onChange({ ...value, email: v })} />
      )}
      <Input
        label="Phone"
        placeholder={isUKSide ? "+44 7..." : "+234 80..."}
        value={value.phone}
        onChange={(v) => onChange({ ...value, phone: v })}
      />
      <Input label="Address line 1" value={value.address1} onChange={(v) => onChange({ ...value, address1: v })} />
      <Input label="Address line 2 (optional)" value={value.address2 || ""} onChange={(v) => onChange({ ...value, address2: v })} />

      <Select
        label="Country"
        value={value.country}
        onChange={(v) => {
          const nextCities = COUNTRY_CITIES[v] || [];
          onChange({ ...value, country: v, city: nextCities[0] || "" });
        }}
        options={["", ...countries]}
      />

      <Select
        label="City/Town"
        value={value.city}
        onChange={(v) => onChange({ ...value, city: v })}
        options={["", ...(cities.length ? cities : ["Other"])]}
      />

      {!isUKSide && (
        <Input label="State/Region (optional)" value={value.state || ""} onChange={(v) => onChange({ ...value, state: v })} />
      )}
      {isUKSide && (
        <Input label="Postcode" value={value.postcode || ""} onChange={(v) => onChange({ ...value, postcode: v })} />
      )}

      {showContentDescription && (
        <Textarea
          label="Content Description (what’s inside)"
          placeholder="e.g., 3x shirts, 2x shoes, spices..."
          value={value.contentDescription || ""}
          onChange={(v) => onChange({ ...value, contentDescription: v })}
        />
      )}
    </div>
  );
}

/* Tailwind helpers (set your brand once in globals.css)
:root { --brand: #d80000; --brand-ink: #5a0c0c; }
.bg-brand { background-color: var(--brand); }
.text-brand { color: var(--brand); }
.text-brand-ink { color: var(--brand-ink); }
.border-brand { border-color: var(--brand); }
.btn-brand { @apply rounded-xl px-4 py-2 text-white shadow-sm; background-color: var(--brand); }
.btn-brand:hover { filter: brightness(0.95); }
.btn-outline { @apply rounded-xl px-4 py-2 border; border-color: var(--brand); color: var(--brand-ink); }
.btn-outline:hover { background-color: color-mix(in srgb, var(--brand) 10%, white); }
.field { @apply w-full rounded-xl border px-3 py-2.5 bg-white focus:outline-none; box-shadow: 0 0 0 0 rgba(0,0,0,0); }
.field:focus { box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand) 20%, transparent); border-color: var(--brand); }
*/
