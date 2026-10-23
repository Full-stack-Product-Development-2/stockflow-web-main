import { ImageIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import DistributionStatusBadge from "./DistributionStatusBadge";

const stages = [
  "Request Approved",
  "Stock Received",
  "In Progress",
  "Return Submitted",
  "Run Closed",
];

const completedStageByStatus = {
  "awaiting-collection": 0,
  "stock-received": 1,
  "in-progress": 2,
  "return-submitted": 3,
  closed: 4,
};

function DetailField({ label, children }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-0.5 text-sm font-medium">{children}</div>
    </div>
  );
}

function RunProgress({ status }) {
  const completedStage = completedStageByStatus[status];

  return (
    <div className="grid grid-cols-5 gap-2">
      {stages.map((stage, index) => {
        const complete = index <= completedStage;

        return (
          <div key={stage}>
            <div className={`h-1.5 rounded-full ${complete ? "bg-emerald-500" : "bg-muted"}`} />
            <p className={`mt-2 text-[10px] font-medium ${complete ? "text-emerald-700" : "text-muted-foreground"}`}>
              {stage}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function DistributionRunDetails({ run }) {
  return (
    <div className="space-y-5 border-b bg-background px-6 py-5">
      <RunProgress status={run.status} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DetailField label="FDO">{run.fdo}</DetailField>
        <DetailField label="Warehouse">{run.warehouse}</DetailField>
        <DetailField label="Route">{run.route}</DetailField>
        <DetailField label="Issued Date">{run.issuedDate}</DetailField>
        <DetailField label="Assigned Outlets">{run.assignedOutlets}</DetailField>
        <DetailField label="Status">
          <DistributionStatusBadge status={run.status} />
        </DetailField>
        {run.closedDate ? <DetailField label="Closed">{run.closedDate}</DetailField> : null}
        {run.acceptedBy ? <DetailField label="Accepted By">{run.acceptedBy}</DetailField> : null}
      </div>

      <div>
        <p className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground">
          PRODUCT RECONCILIATION
        </p>
        <Table className="table-fixed text-xs [&_td]:whitespace-normal [&_th]:whitespace-normal">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[28%] px-0">Product</TableHead>
              <TableHead className="text-right">Issued</TableHead>
              <TableHead className="text-right">Delivered</TableHead>
              <TableHead className="text-right">Expected Return</TableHead>
              <TableHead className="text-right">Actual Return</TableHead>
              <TableHead className="pr-0 text-right">Variance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {run.products.map((product) => {
              const hasActualReturn = product.actualReturn !== null;
              const variance = hasActualReturn
                ? Math.abs(product.expectedReturn - product.actualReturn)
                : null;

              return (
                <TableRow key={product.name} className="hover:bg-transparent">
                  <TableCell className="px-0 font-medium">{product.name}</TableCell>
                  <TableCell className="text-right tabular-nums">{product.issued}</TableCell>
                  <TableCell className="text-right tabular-nums">{product.delivered}</TableCell>
                  <TableCell className="text-right tabular-nums">{product.expectedReturn}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {hasActualReturn ? product.actualReturn : <span className="italic text-muted-foreground">Pending</span>}
                  </TableCell>
                  <TableCell className={`pr-0 text-right tabular-nums ${variance > 0 ? "text-red-600" : "text-emerald-600"}`}>
                    {variance === null ? <span className="text-muted-foreground">—</span> : variance}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {run.deliveries.length > 0 ? (
        <div>
          <p className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground">
            OUTLET DELIVERY HISTORY
          </p>
          <Table className="table-fixed text-xs [&_td]:whitespace-normal [&_th]:whitespace-normal">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[18%] px-0">Outlet</TableHead>
                <TableHead className="w-[14%]">Delivery Date</TableHead>
                <TableHead>Products</TableHead>
                <TableHead className="w-[10%] text-right">Total Units</TableHead>
                <TableHead className="w-[18%]">Proof</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {run.deliveries.map((delivery) => (
                <TableRow key={`${run.id}-${delivery.outlet}`} className="hover:bg-transparent">
                  <TableCell className="px-0 font-medium">{delivery.outlet}</TableCell>
                  <TableCell className="text-muted-foreground">{delivery.date}</TableCell>
                  <TableCell className="text-muted-foreground">{delivery.products}</TableCell>
                  <TableCell className="text-right font-medium tabular-nums">{delivery.totalUnits}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                        Verified
                      </Badge>
                      <button type="button" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
                        <ImageIcon className="size-3" /> View
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : null}
    </div>
  );
}

export default DistributionRunDetails;
