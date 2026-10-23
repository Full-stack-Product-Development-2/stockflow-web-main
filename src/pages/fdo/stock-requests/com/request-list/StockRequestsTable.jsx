import { Fragment } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import StatusBadge from "../shared/StatusBadge";
import StockRequestDetails from "./StockRequestDetails";

function StockRequestsTable({ requests, expandedRequestKey, onToggleRequest, onConfirmCollection, onAcceptAllocation }) {
  function handleRowKeyDown(event, requestKey) {
    if (event.target !== event.currentTarget) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onToggleRequest(requestKey);
    }
  }

  return (
    <Table className="min-w-235 text-xs">
      <TableHeader className="bg-muted/40 text-muted-foreground">
        <TableRow className="hover:bg-transparent">
          <TableHead className="px-4">Request ID</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Warehouse</TableHead>
          <TableHead className="text-right">Products</TableHead>
          <TableHead className="text-right">Requested Units</TableHead>
          <TableHead className="text-right">Allocated Units</TableHead>
          <TableHead>Request Status</TableHead>
          <TableHead>Run Status</TableHead>
          <TableHead className="w-12"><span className="sr-only">Expand request</span></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.length === 0 ? (
          <TableRow className="hover:bg-white">
            <TableCell colSpan={9} className="px-4 py-8 text-center text-muted-foreground">
              No stock requests match these filters.
            </TableCell>
          </TableRow>
        ) : (
          requests.map((request) => {
            const requestKey = `${request.id}-${request.runStatus ?? "none"}`;
            const isExpanded = expandedRequestKey === requestKey;
            const detailsId = `fdo-request-details-${requestKey}`;

            return (
              <Fragment key={requestKey}>
                <TableRow
                  tabIndex={0}
                  aria-expanded={isExpanded}
                  aria-controls={detailsId}
                  className="cursor-pointer bg-white focus-visible:bg-muted/50 focus-visible:outline-none"
                  onClick={() => onToggleRequest(requestKey)}
                  onKeyDown={(event) => handleRowKeyDown(event, requestKey)}
                >
                  <TableCell className="px-4 font-mono text-[11px] font-semibold text-[#e94713]">
                    {request.id}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{request.requestedDate}</TableCell>
                  <TableCell className="text-muted-foreground">{request.warehouse}</TableCell>
                  <TableCell className="text-right tabular-nums">{request.products.length}</TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">
                    {request.totalUnits.toLocaleString("en-US")}
                  </TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">
                    {request.allocatedTotalUnits?.toLocaleString("en-US") ?? "—"}
                  </TableCell>
                  <TableCell><StatusBadge status={request.status} /></TableCell>
                  <TableCell><StatusBadge status={request.runStatus} /></TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`${isExpanded ? "Collapse" : "Expand"} ${request.id}, ${request.runStatus ?? request.status}`}
                      aria-expanded={isExpanded}
                      aria-controls={detailsId}
                      onClick={(event) => {
                        event.stopPropagation();
                        onToggleRequest(requestKey);
                      }}
                    >
                      {isExpanded ? <ChevronDown /> : <ChevronRight />}
                    </Button>
                  </TableCell>
                </TableRow>
                {isExpanded ? (
                  <TableRow id={detailsId} className="hover:bg-white">
                    <TableCell colSpan={9} className="p-0 whitespace-normal">
                      <StockRequestDetails
                        request={request}
                        onConfirmCollection={onConfirmCollection}
                        onAcceptAllocation={onAcceptAllocation}
                      />
                    </TableCell>
                  </TableRow>
                ) : null}
              </Fragment>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}

export default StockRequestsTable;
