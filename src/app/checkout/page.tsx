"use client";

import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripeClient";
import CheckoutForm from "@/components/payments/CheckoutForm";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        body: JSON.stringify({ amount: 1999, currency: "gbp" }), // £19.99
      });
      const data = await res.json();
      setClientSecret(data.clientSecret ?? null);
    })();
  }, []);

  if (!clientSecret) return <p>Loading…</p>;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <div className="max-w-md mx-auto p-4">
        <CheckoutForm />
      </div>
    </Elements>
  );
}
