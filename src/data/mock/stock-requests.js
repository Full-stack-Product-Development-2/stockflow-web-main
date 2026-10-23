export const pendingStockRequests = [
  {
    id: "REQ-1061",
    fdo: "Kasun Perera",
    warehouse: "Colombo Central Warehouse",
    route: "Colombo North",
    requestedDate: "6 Aug 2026",
    plannedDistribution: "9 Aug 2026",
    note: "Stock running low at Colombo North outlets, please prioritise.",
    status: "pending",
    totalUnits: 240,
    products: [
      { name: "Premium Rice 5kg", sku: "RIC-5K-001", requested: 80, available: 1200 },
      { name: "Black Tea 200g", sku: "TEA-200-004", requested: 60, available: 420 },
      { name: "Bottled Water 1.5L", sku: "WTR-15L-006", requested: 100, available: 1500 },
    ],
  },
  {
    id: "REQ-1055",
    fdo: "Nimal Silva",
    warehouse: "Colombo Central Warehouse",
    route: "Colombo South",
    requestedDate: "6 Aug 2026",
    plannedDistribution: "8 Aug 2026",
    note: "Retail replenishment for the Colombo South route.",
    status: "pending",
    totalUnits: 240,
    products: [
      { name: "Premium Rice 5kg", sku: "RIC-5K-001", requested: 100, available: 2320 },
      { name: "Cooking Oil 1L", sku: "OIL-1L-002", requested: 80, available: 1445 },
      { name: "Black Tea 200g", sku: "TEA-200-004", requested: 60, available: 740 },
    ],
  },
  {
    id: "REQ-1056",
    fdo: "Tharushi Fernando",
    warehouse: "Kandy Regional Warehouse",
    route: "Kandy Central",
    requestedDate: "6 Aug 2026",
    plannedDistribution: "9 Aug 2026",
    note: "High demand expected for milk powder this week.",
    status: "pending",
    totalUnits: 400,
    products: [
      { name: "Milk Powder 400g", sku: "MLK-400-003", requested: 200, available: 90 },
      { name: "Black Tea 200g", sku: "TEA-200-004", requested: 80, available: 200 },
      { name: "Laundry Soap Bar", sku: "SOP-BAR-005", requested: 120, available: 450 },
    ],
  },
];

export const stockRequestHistory = [
  {
    id: "REQ-1054",
    fdo: "Kasun Perera",
    warehouse: "Colombo Central Warehouse",
    route: "Colombo North",
    requestedDate: "5 Aug 2026",
    decisionDate: "6 Aug 2026",
    status: "rejected",
    totalUnits: 180,
    rejectedBy: "Amila Perera",
    rejectionReason:
      "A separate request (REQ-1058) was approved for this FDO. Only one active run is permitted at a time.",
    products: [
      { name: "Premium Rice 5kg", sku: "RIC-5K-001", requested: 60 },
      { name: "Cooking Oil 1L", sku: "OIL-1L-002", requested: 40 },
      { name: "Milk Powder 400g", sku: "MLK-400-003", requested: 30 },
      { name: "Laundry Soap Bar", sku: "SOP-BAR-005", requested: 50 },
    ],
  },
  {
    id: "REQ-1058",
    fdo: "Kasun Perera",
    warehouse: "Colombo Central Warehouse",
    route: "Colombo North",
    requestedDate: "6 Aug 2026",
    decisionDate: "6 Aug 2026",
    distributionRun: "RUN-1010",
    status: "approved",
    totalUnits: 90,
    products: [
      { name: "Milk Powder 400g", sku: "MLK-400-003", requested: 50 },
      { name: "Black Tea 200g", sku: "TEA-200-004", requested: 40 },
    ],
  },
];

export const stockRequestStatusOptions = [
  { label: "All Statuses", value: "all" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

export const stockRequestWarehouseOptions = [
  { label: "All Warehouses", value: "all" },
  { label: "Colombo Central Warehouse", value: "Colombo Central Warehouse" },
  { label: "Kandy Regional Warehouse", value: "Kandy Regional Warehouse" },
  { label: "Galle Regional Warehouse", value: "Galle Regional Warehouse" },
];

export const stockRequestFdoOptions = [
  { label: "All FDOs", value: "all" },
  { label: "Kasun Perera", value: "Kasun Perera" },
  { label: "Nimal Silva", value: "Nimal Silva" },
  { label: "Tharushi Fernando", value: "Tharushi Fernando" },
  { label: "Ravindu Jayasinghe", value: "Ravindu Jayasinghe" },
];
