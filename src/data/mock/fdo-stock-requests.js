export const fdoStockSummaryMetrics = [
  { label: "Active Products", value: "6", detail: "unique SKUs tracked" },
  { label: "Remaining Stock", value: "9,820", detail: "units in warehouse" },
  { label: "With FDOs", value: "225", detail: "units in progress" },
  { label: "Variance", value: "0", detail: "units unaccounted" },
];

export const fdoRequestProducts = [
  { name: "Premium Rice 5kg", sku: "RIC-5K-001", available: 1200 },
  { name: "Cooking Oil 1L", sku: "OIL-1L-002", available: 860 },
  { name: "Milk Powder 400g", sku: "MLK-400-003", available: 540 },
  { name: "Black Tea 200g", sku: "TEA-200-004", available: 420 },
  { name: "Laundry Soap Bar", sku: "SOP-BAR-005", available: 980 },
  { name: "Bottled Water 1.5L", sku: "WTR-15L-006", available: 1500 },
];

export const fdoRequestWarehouseOptions = [
  { label: "All Warehouses", value: "all" },
  { label: "Colombo Central Warehouse", value: "Colombo Central Warehouse" },
  { label: "Kandy Regional Warehouse", value: "Kandy Regional Warehouse" },
  { label: "Galle Regional Warehouse", value: "Galle Regional Warehouse" },
];

export const fdoRequestStatusOptions = [
  { label: "All Statuses", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Allocation Ready", value: "allocation-ready" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

export const fdoStockRequests = [
  {
    id: "REQ-1058",
    requestedDate: "6 Aug 2026",
    warehouse: "Colombo Central Warehouse",
    status: "approved",
    runStatus: "return-submitted",
    decisionDate: "6 Aug 2026",
    decidedBy: "Amila Perera",
    distributionRun: "RUN-1010",
    note: "Stock for mid-week Colombo North top-up.",
    totalUnits: 90,
    products: [
      { name: "Milk Powder 400g", sku: "MLK-400-003", requested: 50, available: 540 },
      { name: "Black Tea 200g", sku: "TEA-200-004", requested: 40, available: 420 },
    ],
  },
  {
    id: "REQ-1061",
    requestedDate: "6 Aug 2026",
    warehouse: "Colombo Central Warehouse",
    status: "allocation-ready",
    runStatus: null,
    allocationDate: "6 Aug 2026",
    decidedBy: "Amila Perera",
    note: "Stock running low at Colombo North outlets, please prioritise.",
    allocationNote: "Black Tea reduced by 10 units to protect warehouse reserve stock.",
    totalUnits: 240,
    allocatedTotalUnits: 230,
    products: [
      { name: "Premium Rice 5kg", sku: "RIC-5K-001", requested: 80, allocated: 80, available: 1200 },
      { name: "Black Tea 200g", sku: "TEA-200-004", requested: 60, allocated: 50, available: 420 },
      { name: "Bottled Water 1.5L", sku: "WTR-15L-006", requested: 100, allocated: 100, available: 1500 },
    ],
  },
  {
    id: "REQ-1058",
    requestedDate: "6 Aug 2026",
    warehouse: "Colombo Central Warehouse",
    status: "approved",
    runStatus: "awaiting-collection",
    decisionDate: "6 Aug 2026",
    decidedBy: "Amila Perera",
    distributionRun: "RUN-1010",
    note: "Stock for mid-week Colombo North top-up.",
    totalUnits: 90,
    products: [
      { name: "Milk Powder 400g", sku: "MLK-400-003", requested: 50, available: 540 },
      { name: "Black Tea 200g", sku: "TEA-200-004", requested: 40, available: 420 },
    ],
  },
  {
    id: "REQ-1054",
    requestedDate: "5 Aug 2026",
    warehouse: "Colombo Central Warehouse",
    status: "rejected",
    runStatus: null,
    decisionDate: "6 Aug 2026",
    decidedBy: "Amila Perera",
    rejectionReason:
      "A separate request (REQ-1058) was approved for this FDO. Only one active run is permitted at a time.",
    note: "Regular weekly run for Colombo North outlets.",
    totalUnits: 180,
    products: [
      { name: "Premium Rice 5kg", sku: "RIC-5K-001", requested: 60, available: 1200 },
      { name: "Cooking Oil 1L", sku: "OIL-1L-002", requested: 40, available: 860 },
      { name: "Milk Powder 400g", sku: "MLK-400-003", requested: 30, available: 540 },
      { name: "Laundry Soap Bar", sku: "SOP-BAR-005", requested: 50, available: 980 },
    ],
  },
  {
    id: "REQ-1059",
    requestedDate: "4 Aug 2026",
    warehouse: "Colombo Central Warehouse",
    status: "approved",
    runStatus: "closed",
    decisionDate: "4 Aug 2026",
    decidedBy: "Amila Perera",
    distributionRun: "RUN-1011",
    note: "Regular August Colombo North run.",
    totalUnits: 190,
    products: [
      { name: "Premium Rice 5kg", sku: "RIC-5K-001", requested: 80, available: 1200 },
      { name: "Cooking Oil 1L", sku: "OIL-1L-002", requested: 60, available: 860 },
      { name: "Laundry Soap Bar", sku: "SOP-BAR-005", requested: 50, available: 980 },
    ],
  },
];
