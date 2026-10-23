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
import { acceptedReturns } from "@/data/mock/return-approvals";

import AcceptedReturnDetails from "./AcceptedReturnDetails";

function AcceptedReturnsTable() {
  const [expandedRunId, setExpandedRunId] = useState(null);

  function toggleRun(runId) {
    setExpandedRunId((currentId) => (currentId === runId ? null : runId));
  }

  function handleRowKeyDown(event, runId) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleRun(runId);
    }
  }

  return (
    <CardContent className="px-0 pb-0">
      <Table className="min-w-275 text-xs">
        <TableHeader className="bg-muted/40 text-muted-foreground">
          <TableRow className="hover:bg-transparent">
            <TableHead className="px-4">Run ID</TableHead>
            <TableHead>FDO</TableHead>
            <TableHead>Warehouse</TableHead>
            <TableHead className="text-right">Issued</TableHead>
            <TableHead className="text-right">Delivered</TableHead>
            <TableHead className="text-right">Returned</TableHead>
            <TableHead className="text-right">Variance</TableHead>
            <TableHead>Accepted Date</TableHead>
            <TableHead>Accepted By</TableHead>
            <TableHead className="w-12"><span className="sr-only">Expand return</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {acceptedReturns.map((approval) => {
            const isExpanded = expandedRunId === approval.id;
            const detailsId = `accepted-return-details-${approval.id}`;

            return (
              <Fragment key={approval.id}>
                <TableRow
                  tabIndex={0}
                  aria-expanded={isExpanded}
                  aria-controls={detailsId}
                  className="cursor-pointer focus-visible:bg-muted/50 focus-visible:outline-none"
                  onClick={() => toggleRun(approval.id)}
                  onKeyDown={(event) => handleRowKeyDown(event, approval.id)}
                >
                  <TableCell className="px-4 font-mono text-[11px] text-[#e94713]">{approval.id}</TableCell>
                  <TableCell className="font-medium">{approval.fdo}</TableCell>
                  <TableCell className="text-muted-foreground">{approval.warehouse}</TableCell>
                  <TableCell className="text-right font-medium tabular-nums">{approval.issued}</TableCell>
                  <TableCell className="text-right text-muted-foreground tabular-nums">{approval.delivered}</TableCell>
                  <TableCell className="text-right font-semibold text-emerald-600 tabular-nums">{approval.returned}</TableCell>
                  <TableCell className="text-right text-muted-foreground tabular-nums">{approval.variance}</TableCell>
                  <TableCell className="text-muted-foreground">{approval.acceptedDate}</TableCell>
                  <TableCell className="text-muted-foreground">{approval.acceptedBy}</TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`${isExpanded ? "Collapse" : "Expand"} ${approval.id}`}
                      aria-expanded={isExpanded}
                      aria-controls={detailsId}
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleRun(approval.id);
                      }}
                    >
                      {isExpanded ? <ChevronDown /> : <ChevronRight />}
                    </Button>
                  </TableCell>
                </TableRow>
                {isExpanded ? (
                  <TableRow id={detailsId} className="hover:bg-transparent">
                    <TableCell colSpan={10} className="p-0 whitespace-normal">
                      <AcceptedReturnDetails approval={approval} />
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

export default AcceptedReturnsTable;
