import { getStored, setStored, useStored } from "@/lib/local-store";
import { distributionRuns } from "@/data/mock/distribution-runs";
import { fdoDistributionDeliveries, fdoDistributionRun } from "@/data/mock/fdo-distributions";
import { fdoRunHistory } from "@/data/mock/fdo-run-history";
import { fdoStockRequests } from "@/data/mock/fdo-stock-requests";
import { acceptedReturns, pendingReturnApprovals } from "@/data/mock/return-approvals";
import { pendingStockRequests, stockRequestHistory } from "@/data/mock/stock-requests";

// Each screen keeps its own data shape, saved in localStorage and seeded from the mocks.
// The actions below are the hand-offs between roles: each one updates both sides.

// The FDO portal acts as this officer, matching the mock data.
export const CURRENT_FDO = { name: "Kasun Perera", route: "Colombo North" };
const MANAGER_NAME = "Amila Perera";

const seeds = {
  smPendingRequests: pendingStockRequests,
  smRequestHistory: stockRequestHistory,
  smRuns: distributionRuns,
  smPendingReturns: pendingReturnApprovals,
  smAcceptedReturns: acceptedReturns,
  fdoRequests: fdoStockRequests,
  fdoActiveRun: {
    run: fdoDistributionRun,
    deliveries: fdoDistributionDeliveries,
    returnSubmission: null,
  },
  fdoRunHistory,
};

const get = (name) => getStored(name, seeds[name]);
const set = (name, update) => setStored(name, seeds[name], update);

export function useWorkflow(name) {
  return useStored(name, seeds[name]);
}

export function formatDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatDateTime(date = new Date()) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function nextNumber(ids, prefix) {
  return Math.max(0, ...ids.map((id) => Number(id?.replace(prefix, "")) || 0)) + 1;
}

function nextRequestId() {
  const ids = [...get("smPendingRequests"), ...get("smRequestHistory"), ...get("fdoRequests")]
    .map((request) => request.id);
  return `REQ-${nextNumber(ids, "REQ-")}`;
}

function nextRunId() {
  const ids = [
    ...get("smRuns").map((run) => run.id),
    ...get("smPendingReturns").map((approval) => approval.id),
    ...get("smAcceptedReturns").map((approval) => approval.id),
    ...get("fdoRunHistory").map((run) => run.id),
    ...get("fdoRequests").map((request) => request.distributionRun),
    get("fdoActiveRun").run?.id,
  ];
  return `RUN-${nextNumber(ids, "RUN-")}`;
}

function sum(items, field) {
  return items.reduce((total, item) => total + (item[field] ?? 0), 0);
}

// FDO → manager: a new stock request.
export function submitStockRequest({ warehouse, requestedAt, note, products }) {
  const request = {
    id: nextRequestId(),
    requestedDate: formatDate(requestedAt),
    warehouse,
    note,
    status: "pending",
    totalUnits: sum(products, "requested"),
    products,
  };

  set("fdoRequests", (current) => [{ ...request, runStatus: null }, ...current]);
  set("smPendingRequests", (current) => [
    {
      ...request,
      fdo: CURRENT_FDO.name,
      route: CURRENT_FDO.route,
      plannedDistribution: "Not set",
    },
    ...current,
  ]);

  return request.id;
}

// Manager → FDO: proposed allocation for the FDO to accept.
export function sendAllocation(requestId, products, note) {
  const allocationDate = formatDate();
  const allocatedTotalUnits = sum(products, "allocated");

  set("smPendingRequests", (current) => current.map((request) =>
    request.id === requestId && request.status === "pending"
      ? {
          ...request,
          status: "awaiting-fdo-acceptance",
          allocationDate,
          allocationNote: note,
          allocatedTotalUnits,
          products,
        }
      : request,
  ));
  set("fdoRequests", (current) => current.map((request) =>
    request.id === requestId && ["pending", "allocation-ready"].includes(request.status)
      ? {
          ...request,
          status: "allocation-ready",
          allocationDate,
          decidedBy: MANAGER_NAME,
          allocationNote: note,
          allocatedTotalUnits,
          products: request.products.map((product) => ({
            ...product,
            allocated: products.find((item) => item.sku === product.sku)?.allocated ?? 0,
          })),
        }
      : request,
  ));
}

// Manager → FDO: request rejected.
export function rejectRequest(requestId, reason) {
  const request = get("smPendingRequests").find((item) => item.id === requestId);
  if (!request) return;

  const decisionDate = formatDate();

  set("smPendingRequests", (current) => current.filter((item) => item.id !== requestId));
  set("smRequestHistory", (current) => [
    { ...request, status: "rejected", decisionDate, rejectedBy: MANAGER_NAME, rejectionReason: reason },
    ...current,
  ]);
  set("fdoRequests", (current) => current.map((item) =>
    item.id === requestId && ["pending", "allocation-ready"].includes(item.status)
      ? { ...item, status: "rejected", decisionDate, decidedBy: MANAGER_NAME, rejectionReason: reason }
      : item,
  ));
}

// FDO → manager: allocation accepted, which opens a distribution run.
export function acceptAllocation(requestId) {
  const accepted = get("fdoRequests").find(
    (request) => request.id === requestId && request.status === "allocation-ready",
  );
  if (!accepted) return;

  const runId = nextRunId();
  const decisionDate = formatDate();
  const issuedProducts = accepted.products.map((product) => ({
    name: product.name,
    sku: product.sku,
    issued: product.allocated ?? product.requested,
  }));
  const issued = sum(issuedProducts, "issued");

  set("fdoRequests", (current) => [
    {
      ...accepted,
      status: "approved",
      runStatus: "awaiting-collection",
      decisionDate: accepted.allocationDate,
      distributionRun: runId,
    },
    ...current.filter((request) => request !== accepted),
  ]);
  set("smPendingRequests", (current) => current.filter((request) => request.id !== requestId));
  set("smRequestHistory", (current) => [
    {
      id: accepted.id,
      fdo: CURRENT_FDO.name,
      warehouse: accepted.warehouse,
      route: CURRENT_FDO.route,
      requestedDate: accepted.requestedDate,
      decisionDate,
      distributionRun: runId,
      status: "approved",
      totalUnits: accepted.totalUnits,
      products: accepted.products,
    },
    ...current,
  ]);
  set("smRuns", (current) => [
    {
      id: runId,
      requestId: accepted.id,
      fdo: CURRENT_FDO.name,
      warehouse: accepted.warehouse,
      route: CURRENT_FDO.route,
      issuedDate: decisionDate,
      issued,
      delivered: 0,
      expectedReturn: issued,
      status: "awaiting-collection",
      assignedOutlets: "None yet",
      products: issuedProducts.map((product) => ({
        ...product,
        delivered: 0,
        expectedReturn: product.issued,
        actualReturn: null,
      })),
      deliveries: [],
    },
    ...current,
  ]);
}

// FDO → manager: stock picked up, the run becomes the FDO's active run.
export function confirmCollection(requestId) {
  const request = get("fdoRequests").find(
    (item) => item.id === requestId && item.runStatus === "awaiting-collection",
  );
  if (!request || get("fdoActiveRun").run?.status === "in-progress") return;

  set("fdoRequests", (current) => current.map((item) =>
    item === request ? { ...item, runStatus: "in-progress" } : item,
  ));
  set("smRuns", (current) => current.map((run) =>
    run.id === request.distributionRun ? { ...run, status: "stock-received" } : run,
  ));
  set("fdoActiveRun", {
    run: {
      id: request.distributionRun,
      requestId: request.id,
      warehouse: request.warehouse,
      route: CURRENT_FDO.route,
      issuedDate: request.decisionDate,
      collectedAt: formatDateTime(),
      status: "in-progress",
      products: request.products.map((product) => ({
        name: product.name,
        sku: product.sku,
        collected: product.allocated ?? product.requested,
      })),
    },
    deliveries: [],
    returnSubmission: null,
  });
}

// FDO → manager: an outlet delivery on the active run.
export function recordDelivery(delivery) {
  const runId = get("fdoActiveRun").run.id;

  set("fdoActiveRun", (current) => ({ ...current, deliveries: [delivery, ...current.deliveries] }));
  set("smRuns", (current) => current.map((run) => {
    if (run.id !== runId) return run;

    const deliveries = [
      ...run.deliveries,
      {
        outlet: delivery.outlet,
        date: formatDate(),
        products: delivery.products.map((product) => `${product.name} ×${product.quantity}`).join(", "),
        totalUnits: delivery.totalUnits,
      },
    ];

    return {
      ...run,
      status: "in-progress",
      delivered: run.delivered + delivery.totalUnits,
      expectedReturn: run.expectedReturn - delivery.totalUnits,
      assignedOutlets: [...new Set(deliveries.map((item) => item.outlet))].join(", "),
      deliveries,
      products: run.products.map((product) => {
        const quantity = delivery.products.find((item) => item.name === product.name)?.quantity ?? 0;
        return {
          ...product,
          delivered: product.delivered + quantity,
          expectedReturn: product.expectedReturn - quantity,
        };
      }),
    };
  }));
}

// FDO → manager: leftover stock declared for verification.
export function submitReturn({ note, products }, stockRows) {
  const { run } = get("fdoActiveRun");
  const submittedAt = formatDateTime();
  const rows = stockRows.map((row) => ({
    ...row,
    declaredReturn: products.find((product) => product.sku === row.sku)?.actualReturn ?? 0,
  }));
  const expectedReturn = sum(rows, "remaining");
  const declaredReturn = sum(rows, "declaredReturn");

  set("fdoActiveRun", (current) => ({
    ...current,
    run: { ...current.run, status: "return-submitted" },
    returnSubmission: { submittedAt, note, products },
  }));
  set("fdoRequests", (current) => current.map((request) =>
    request.distributionRun === run.id ? { ...request, runStatus: "return-submitted" } : request,
  ));
  set("smRuns", (current) => current.map((item) =>
    item.id === run.id
      ? {
          ...item,
          status: "return-submitted",
          products: item.products.map((product) => ({
            ...product,
            actualReturn: rows.find((row) => row.name === product.name)?.declaredReturn ?? product.actualReturn,
          })),
        }
      : item,
  ));
  set("smPendingReturns", (current) => [
    {
      id: run.id,
      fdo: CURRENT_FDO.name,
      warehouse: run.warehouse,
      route: run.route,
      issued: sum(rows, "collected"),
      delivered: sum(rows, "delivered"),
      expectedReturn,
      declaredReturn,
      variance: Math.abs(expectedReturn - declaredReturn),
      submittedAt,
      note,
      products: rows.map((row) => ({
        name: row.name,
        issued: row.collected,
        delivered: row.delivered,
        expectedReturn: row.remaining,
        declaredReturn: row.declaredReturn,
      })),
    },
    ...current.filter((approval) => approval.id !== run.id),
  ]);
}

// Manager → FDO: return verified, the run closes.
export function acceptReturn(runId, verifiedReturns, verificationNote) {
  const approval = get("smPendingReturns").find((item) => item.id === runId);
  if (!approval) return;

  const closedDate = formatDate();
  const products = approval.products.map((product) => ({
    ...product,
    verifiedReturn: Number(verifiedReturns[product.name] ?? product.declaredReturn),
  }));
  const returned = sum(products, "verifiedReturn");

  set("smPendingReturns", (current) => current.filter((item) => item.id !== runId));
  set("smAcceptedReturns", (current) => [
    {
      id: approval.id,
      fdo: approval.fdo,
      warehouse: approval.warehouse,
      issued: approval.issued,
      delivered: approval.delivered,
      returned,
      variance: Math.abs(approval.expectedReturn - returned),
      acceptedDate: closedDate,
      acceptedBy: MANAGER_NAME,
      verificationNote,
      products: products.map(({ name, issued, delivered, expectedReturn, verifiedReturn }) => ({
        name, issued, delivered, expectedReturn, verifiedReturn,
      })),
    },
    ...current,
  ]);
  set("smRuns", (current) => current.map((run) =>
    run.id === runId
      ? {
          ...run,
          status: "closed",
          closedDate,
          acceptedBy: MANAGER_NAME,
          products: run.products.map((product) => ({
            ...product,
            actualReturn: products.find((item) => item.name === product.name)?.verifiedReturn ?? product.actualReturn,
          })),
        }
      : run,
  ));

  if (approval.fdo !== CURRENT_FDO.name) return;

  const activeRun = get("fdoActiveRun").run;
  const collectedAt = activeRun?.id === runId ? activeRun.collectedAt : approval.submittedAt;

  set("fdoRequests", (current) => current.map((request) =>
    request.distributionRun === runId ? { ...request, runStatus: "closed" } : request,
  ));
  set("fdoActiveRun", (current) =>
    current.run?.id === runId ? { ...current, run: { ...current.run, status: "closed" } } : current,
  );
  set("fdoRunHistory", (current) => [
    {
      id: runId,
      warehouse: approval.warehouse,
      collectionDate: collectedAt.split(",")[0],
      collectedAt,
      returnSubmittedAt: approval.submittedAt,
      closedDate,
      closedAt: formatDateTime(),
      acceptedBy: MANAGER_NAME,
      returnNote: approval.note,
      status: "Closed",
      products: products.map(({ name, issued, delivered, verifiedReturn }) => ({
        name, collected: issued, delivered, verifiedReturn,
      })),
    },
    ...current.filter((run) => run.id !== runId),
  ]);
}
