import { Fragment, useMemo, useState } from "react";
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
import { stockRequestHistory } from "@/data/mock/stock-requests";

import RequestStatusBadge from "../shared/RequestStatusBadge";
import HistoryRequestDetails from "./HistoryRequestDetails";
import RequestHistoryFilters from "./RequestHistoryFilters";

const initialFilters = {
  query: "",
  status: "all",
  warehouse: "all",
  fdo: "all",
};

function RequestHistoryTable() {
  const [expandedRequestId, setExpandedRequestId] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const requests = useMemo(() => {
    const normalizedQuery = filters.query.trim().toLowerCase();

    return stockRequestHistory.filter((request) => {
      const matchesQuery =
        !normalizedQuery ||
        request.id.toLowerCase().includes(normalizedQuery) ||
        request.fdo.toLowerCase().includes(normalizedQuery) ||
        request.warehouse.toLowerCase().includes(normalizedQuery) ||
        request.route.toLowerCase().includes(normalizedQuery);

      return (
        matchesQuery &&
        (filters.status === "all" || request.status === filters.status) &&
        (filters.warehouse === "all" || request.warehouse === filters.warehouse) &&
        (filters.fdo === "all" || request.fdo === filters.fdo)
      );
    });
  }, [filters]);

  function changeFilter(name, value) {
    setFilters((currentFilters) => ({ ...currentFilters, [name]: value }));
    setExpandedRequestId(null);
  }

  function toggleRequest(requestId) {
    setExpandedRequestId((currentId) =>
      currentId === requestId ? null : requestId,
    );
  }

  function handleRowKeyDown(event, requestId) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleRequest(requestId);
    }
  }

  return (
    <>
      <RequestHistoryFilters filters={filters} onFilterChange={changeFilter} />
      <CardContent className="px-0 pb-0">
        <Table className="min-w-255 text-xs">
          <TableHeader className="bg-muted/40 text-muted-foreground">
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-4">Request ID</TableHead>
              <TableHead>FDO</TableHead>
              <TableHead>Warehouse</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Requested Date</TableHead>
              <TableHead className="text-right">Total Units</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Decision Date</TableHead>
              <TableHead className="w-12">
                <span className="sr-only">Expand request</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length > 0 ? (
              requests.map((request) => {
                const isExpanded = expandedRequestId === request.id;
                const detailsId = `history-request-details-${request.id}`;

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
                      <TableCell className="text-right font-semibold tabular-nums">
                        {request.totalUnits}
                      </TableCell>
                      <TableCell>
                        <RequestStatusBadge status={request.status} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">{request.decisionDate}</TableCell>
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
                          <HistoryRequestDetails request={request} />
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </Fragment>
                );
              })
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={9} className="h-28 text-center text-sm text-muted-foreground">
                  No requests match the selected filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </>
  );
}

export default RequestHistoryTable;
