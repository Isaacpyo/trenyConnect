// src/lib/pricingMatrix.ts
export const PRICING_MATRIX_UK_TO_AFRICA = {
  cities: { Lagos:{s:2.5,e:4.5}, Accra:{s:2.8,e:4.8}, Nairobi:{s:3.0,e:5.2}, Johannesburg:{s:2.2,e:4.0} },
  fees: { doorstepService: 25.00, customsClearance: 35.00 },
  dimensionalFactor: 5000,
  insuranceTiers: {
    none: { name: "No Insurance", cost: 0, cover: 0 },
    basic: { name: "Basic Cover", cost: 2.00, cover: 100 },
    standard: { name: "Standard Cover", cost: 8.00, cover: 500 },
    premium: { name: "Premium Cover", cost: 25.00, cover: 2000 }
  },
  bulkDiscounts: [
    { minParcels: 5, discount: 0.05 },
    { minParcels: 10, discount: 0.10 },
  ],
};

export const PRICING_MATRIX_AFRICA_TO_UK = {
  ...PRICING_MATRIX_UK_TO_AFRICA,
  cities: {
    Lagos: { s: 3.0, e: 5.4 }, Accra: { s: 3.4, e: 5.8 }, Nairobi: { s: 3.6, e: 6.2 }, Johannesburg: { s: 2.6, e: 4.8 }
  },
  fees: { doorstepService: 30.00, customsClearance: 40.00 },
};
