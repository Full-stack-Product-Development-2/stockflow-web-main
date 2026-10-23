import { useState } from "react";
import { CircleAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

import { DetailField } from "../shared/RequestDetailParts";
import RejectRequestDialog from "./RejectRequestDialog";
import SendAllocationDialog from "./SendAllocationDialog";

function PendingRequestDetails({ request, onSendAllocation }) {
  const [quantities, setQuantities] = useState(() =>
    Object.fromEntries(request.products.map((product) => [product.sku, String(product.requested)])),
  );
  const [allocationNote, setAllocationNote] = useState("");
  const isSent = request.status === "awaiting-fdo-acceptance";
  const hasInsufficientStock = request.products.some(
    (product) => product.available < product.requested,
  );
  const allocatedProducts = request.products.map((product) => {
    const value = quantities[product.sku] ?? "";
    const parsed = /^(0|[1-9]\d*)$/.test(value) ? Number(value) : NaN;
    return {
      ...product,
      allocated: isSent ? product.allocated : parsed,
    };
  });
  const validAllocation = allocatedProducts.every(
    (product) => Number.isSafeInteger(product.allocated) &&
      product.allocated >= 0 &&
      product.allocated <= product.requested &&
      product.allocated <= product.available,
  );
  const allocatedTotal = allocatedProducts.reduce(
    (total, product) => total + (Number.isFinite(product.allocated) ? product.allocated : 0),
    0,
  );
  const hasChanges = allocatedProducts.some(
    (product) => product.allocated !== product.requested,
  );
  const note = isSent ? request.allocationNote : allocationNote;
  const canSend = validAllocation && allocatedTotal > 0 && (!hasChanges || note.trim());

  return (
    <div className="space-y-4 border-b bg-white px-6 py-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DetailField label="FDO">{request.fdo}</DetailField>
        <DetailField label="Warehouse">{request.warehouse}</DetailField>
        <DetailField label="Route">{request.route}</DetailField>
        <DetailField label="Request Date">{request.requestedDate}</DetailField>
        <DetailField label="Planned Distribution">{request.plannedDistribution}</DetailField>
        <DetailField label="FDO Note" className="sm:col-span-2 lg:col-span-3">
          <span className="italic">{request.note}</span>
        </DetailField>
      </div>

      {isSent ? (
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-3 text-sm text-blue-800">
          Allocation sent to {request.fdo}. A run will be created only after the FDO accepts it.
        </div>
      ) : hasInsufficientStock ? (
        <div className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-3 text-sm text-amber-800">
          <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <p>Some requested quantities exceed stock. Reduce the allocation to available units before sending it.</p>
        </div>
      ) : null}

      <Table className="min-w-175 text-xs">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="px-0">Product</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead className="text-right">FDO Requested</TableHead>
            <TableHead className="text-right">Available</TableHead>
            <TableHead className="text-right">Warehouse Allocation</TableHead>
            <TableHead>Change</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allocatedProducts.map((product) => {
            const difference = product.allocated - product.requested;
            const invalid = !Number.isSafeInteger(product.allocated) ||
              product.allocated < 0 ||
              product.allocated > product.requested ||
              product.allocated > product.available;

            return (
              <TableRow key={product.sku} className="hover:bg-transparent">
                <TableCell className="px-0 font-medium">{product.name}</TableCell>
                <TableCell className="font-mono text-[11px] text-muted-foreground">{product.sku}</TableCell>
                <TableCell className="text-right tabular-nums">{product.requested}</TableCell>
                <TableCell className="text-right tabular-nums text-muted-foreground">
                  {product.available.toLocaleString("en-US")}
                </TableCell>
                <TableCell className="text-right">
                  {isSent ? (
                    <span className="font-semibold tabular-nums">{product.allocated}</span>
                  ) : (
                    <Input
                      type="number"
                      min="0"
                      max={Math.min(product.requested, product.available)}
                      step="1"
                      value={quantities[product.sku]}
                      onChange={(event) => setQuantities((current) => ({
                        ...current,
                        [product.sku]: event.target.value,
                      }))}
                      aria-label={`Allocation for ${product.name}`}
                      aria-invalid={invalid || undefined}
                      className="ml-auto w-20 bg-white text-right"
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={invalid || difference < 0
                      ? "border-amber-300 bg-amber-50 text-amber-700"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700"}
                  >
                    {invalid ? "Adjust quantity" : difference === 0 ? "No change" : `${difference} units`}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="flex flex-wrap gap-6 text-sm font-semibold tabular-nums">
        <p>Requested: {request.totalUnits}</p>
        <p>Proposed Allocation: {allocatedTotal}</p>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor={`allocation-note-${request.id}`}>Allocation Note to FDO{hasChanges && !isSent ? " *" : ""}</Label>
        {isSent ? (
          <p className="text-sm italic">{note || "No allocation note."}</p>
        ) : (
          <Textarea
            id={`allocation-note-${request.id}`}
            value={allocationNote}
            onChange={(event) => setAllocationNote(event.target.value)}
            placeholder="Explain any changes to the requested quantities."
            rows={2}
          />
        )}
      </div>

      {!isSent ? (
        <div className="flex flex-wrap justify-end gap-2">
          <RejectRequestDialog request={request} />
          <SendAllocationDialog
            request={request}
            products={allocatedProducts}
            note={allocationNote.trim()}
            allocatedTotal={allocatedTotal}
            disabled={!canSend}
            onSendAllocation={onSendAllocation}
          />
        </div>
      ) : null}
    </div>
  );
}

export default PendingRequestDetails;
