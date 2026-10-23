import { TriangleAlert, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import AcceptAllocationDialog from "../dialogs/AcceptAllocationDialog";
import ConfirmCollectionDialog from "../dialogs/ConfirmCollectionDialog";
import StatusBadge from "../shared/StatusBadge";

function DetailField({ label, children }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-0.5 text-sm font-medium text-foreground">{children}</div>
    </div>
  );
}

function StockRequestDetails({ request, onConfirmCollection, onAcceptAllocation }) {
  const isPending = request.status === "pending";
  const isRejected = request.status === "rejected";
  const isAllocationReady = request.status === "allocation-ready";
  const isAwaitingCollection = request.runStatus === "awaiting-collection";
  const hasAllocation = request.products.some((product) => product.allocated !== undefined);
  const allocationChanged = hasAllocation && request.products.some(
    (product) => product.allocated !== product.requested,
  );

  return (
    <div className="space-y-5 border-b bg-white px-5 py-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DetailField label="Request ID">
          <span className="font-mono">{request.id}</span>
        </DetailField>
        <DetailField label="Warehouse">{request.warehouse}</DetailField>
        <DetailField label="Request Date">{request.requestedDate}</DetailField>
        <DetailField label="Status"><StatusBadge status={request.status} /></DetailField>
        {!isPending ? (
          <>
            <DetailField label={isAllocationReady ? "Allocation Date" : "Decision Date"}>
              {request.allocationDate ?? request.decisionDate}
            </DetailField>
            <DetailField label={isAllocationReady ? "Proposed By" : "Decided By"}>
              {request.decidedBy}
            </DetailField>
          </>
        ) : null}
        {!isPending && !isRejected && !isAllocationReady ? (
          <>
            <DetailField label="Distribution Run">
              <span className="font-mono">{request.distributionRun}</span>
            </DetailField>
            <DetailField label="Run Status"><StatusBadge status={request.runStatus} /></DetailField>
          </>
        ) : null}
      </div>

      {isRejected ? (
        <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          <X aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <div className="text-xs">
            <p className="font-semibold">Rejection Reason</p>
            <p className="mt-0.5">{request.rejectionReason}</p>
          </div>
        </div>
      ) : null}

      {isAllocationReady && allocationChanged ? (
        <div className="flex gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-amber-800">
          <TriangleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <p className="text-xs">
            The warehouse changed your requested quantities. Compare the allocation before accepting.
            Collection begins only after you accept and a run is created.
          </p>
        </div>
      ) : null}

      <div>
        <p className="text-xs text-muted-foreground">Request Note</p>
        <p className="mt-0.5 text-sm italic text-foreground">{request.note || "—"}</p>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {hasAllocation ? "Requested vs Allocated" : "Products"}
        </h3>
        <Table className={hasAllocation ? "min-w-185 text-xs" : "min-w-150 text-xs"}>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-0">Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead className="text-right">Requested Qty</TableHead>
              {hasAllocation ? (
                <>
                  <TableHead className="text-right">Allocated Qty</TableHead>
                  <TableHead>Difference</TableHead>
                </>
              ) : null}
              <TableHead className="text-right">Warehouse Availability</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {request.products.map((product) => {
              const difference = (product.allocated ?? product.requested) - product.requested;

              return (
                <TableRow key={product.sku} className="hover:bg-transparent">
                  <TableCell className="px-0 font-medium">{product.name}</TableCell>
                  <TableCell className="font-mono text-[11px] text-muted-foreground">
                    {product.sku}
                  </TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">
                    {product.requested.toLocaleString("en-US")}
                  </TableCell>
                  {hasAllocation ? (
                    <>
                      <TableCell className="text-right font-semibold tabular-nums">
                        {product.allocated.toLocaleString("en-US")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={difference === 0
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-amber-300 bg-amber-50 text-amber-700"}
                        >
                          {difference === 0 ? "Unchanged" : `${difference} units`}
                        </Badge>
                      </TableCell>
                    </>
                  ) : null}
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {product.available.toLocaleString("en-US")}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {hasAllocation ? (
          <div className="mt-3 flex flex-wrap gap-5 text-xs font-semibold tabular-nums">
            <span>Requested: {request.totalUnits}</span>
            <span>Allocated: {request.allocatedTotalUnits}</span>
          </div>
        ) : null}
      </div>

      {hasAllocation && request.allocationNote ? (
        <div>
          <p className="text-xs text-muted-foreground">Warehouse Allocation Note</p>
          <p className="mt-0.5 text-sm italic">{request.allocationNote}</p>
        </div>
      ) : null}

      {isAllocationReady ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
          <p className="text-xs text-blue-800">
            Review the proposed allocation. Accepting creates a run with {request.allocatedTotalUnits} units.
          </p>
          <AcceptAllocationDialog request={request} onAcceptAllocation={onAcceptAllocation} />
        </div>
      ) : null}

      {isAwaitingCollection ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
          <p className="text-xs text-emerald-800">
            Your stock request has been approved. Visit{" "}
            <strong>{request.warehouse}</strong> to collect the stock and confirm pickup.
          </p>
          <ConfirmCollectionDialog
            request={request}
            onConfirmCollection={onConfirmCollection}
          />
        </div>
      ) : null}
    </div>
  );
}

export default StockRequestDetails;
