export const pendingReturnApprovals = [
  {
    id: "RUN-1008",
    fdo: "Tharushi Fernando",
    warehouse: "Kandy Regional Warehouse",
    route: "Kandy Central",
    issued: 200,
    delivered: 145,
    expectedReturn: 55,
    declaredReturn: 50,
    variance: 5,
    submittedAt: "5 Aug 2026, 15:00",
    note: "Distribution complete. Some shortage on soap bars.",
    products: [
      { name: "Black Tea 200g", issued: 80, delivered: 55, expectedReturn: 25, declaredReturn: 22 },
      { name: "Laundry Soap Bar", issued: 120, delivered: 90, expectedReturn: 30, declaredReturn: 28 },
    ],
  },
  {
    id: "RUN-1009",
    fdo: "Ravindu Jayasinghe",
    warehouse: "Galle Regional Warehouse",
    route: "Galle City",
    issued: 120,
    delivered: 102,
    expectedReturn: 18,
    declaredReturn: 18,
    variance: 0,
    submittedAt: "5 Aug 2026, 17:00",
    note: "Clean run, all returns accounted for.",
    products: [
      { name: "Premium Rice 5kg", issued: 50, delivered: 42, expectedReturn: 8, declaredReturn: 8 },
      { name: "Bottled Water 1.5L", issued: 70, delivered: 60, expectedReturn: 10, declaredReturn: 10 },
    ],
  },
];

export const acceptedReturns = [
  {
    id: "RUN-1003",
    fdo: "Nimal Silva",
    warehouse: "Colombo Central Warehouse",
    issued: 140,
    delivered: 100,
    returned: 40,
    variance: 0,
    acceptedDate: "5 Aug 2026",
    acceptedBy: "Amila Perera",
    verificationNote:
      "50 units of PRD-01 variance confirmed. Recorded for reconciliation.",
    products: [
      { name: "Premium Rice 5kg", issued: 80, delivered: 50, expectedReturn: 30, verifiedReturn: 30 },
      { name: "Laundry Soap Bar", issued: 60, delivered: 50, expectedReturn: 10, verifiedReturn: 10 },
    ],
  },
];
