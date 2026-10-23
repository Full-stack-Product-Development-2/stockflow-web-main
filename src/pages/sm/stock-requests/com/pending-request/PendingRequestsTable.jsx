import { Fragment, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import RequestStatusBadge from "../shared/RequestStatusBadge";
import PendingRequestDetails from "./PendingRequestDetails";

function PendingRequestsTable({ requests, onSendAllocation }) {
  const [expandedRequestId, setExpandedRequestId] = useState(null);

  function toggleRequest(requestId) {
    setExpandedRequestId((currentId) =>
      currentId === requestId ? null : requestId,
    );
  }

  function handleRowKeyDown(event, requestId) {
    if (event.target !== event.currentTarget) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleRequest(requestId);
    }
  }

  return (
    <CardContent className="px-0 pb-0">
      <Table className="min-w-255 text-xs">
        <TableHeader className="bg-muted/40 text-muted-foreground">
          <TableRow className="hover:bg-transparent">
            <TableHead className="px-4">Request ID</TableHead>
            <TableHead>FDO</TableHead>
            <TableHead>Warehouse</TableHead>
            <TableHead>Route</TableHead>
            <TableHead>Requested Date</TableHead>
            <TableHead>Products</TableHead>
            <TableHead className="text-right">Total Units</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-12">
              <span className="sr-only">Expand request</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => {
            const isExpanded = expandedRequestId === request.id;
            const detailsId = `pending-request-details-${request.id}`;

            return (
              <Fragment key={request.id}>
                <TableRow
                  tabIndex={0}
                  aria-expanded={isExpanded}
                  aria-controls={detailsId}
                  className="cursor-pointer focus-visible:bg-muted/50 focus-visible:outline-none"
                  onClick={() => toggleRequest(request.id)}
                  onKeyDown={(event) => handleRowKeyDown(event, request.id)}
                >
                  <TableCell className="px-4 font-mono text-[11px] text-[#e94713]">
                    {request.id}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{request.fdo}</TableCell>
                  <TableCell className="text-muted-foreground">{request.warehouse}</TableCell>
                  <TableCell className="text-muted-foreground">{request.route}</TableCell>
                  <TableCell className="text-muted-foreground">{request.requestedDate}</TableCell>
                  <TableCell className="font-medium">{request.products.length} products</TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">
                    {request.totalUnits}
                  </TableCell>
                  <TableCell>
                    <RequestStatusBadge status={request.status} />
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`${isExpanded ? "Collapse" : "Expand"} ${request.id}`}
                      aria-expanded={isExpanded}
                      aria-controls={detailsId}
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleRequest(request.id);
                      }}
                    >
                      {isExpanded ? <ChevronDown /> : <ChevronRight />}
                    </Button>
                  </TableCell>
                </TableRow>
                {isExpanded ? (
                  <TableRow id={detailsId} className="hover:bg-transparent">
                    <TableCell colSpan={9} className="p-0 whitespace-normal">
                      <PendingRequestDetails request={request} onSendAllocation={onSendAllocation} />
                    </TableCell>
                  </TableRow>
                ) : null}
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
    </CardContent>
  );
}

export default PendingRequestsTable;
