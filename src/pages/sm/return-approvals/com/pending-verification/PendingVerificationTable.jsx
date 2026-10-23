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
import { pendingReturnApprovals } from "@/data/mock/return-approvals";

import PendingVerificationDetails from "./PendingVerificationDetails";

function PendingVerificationTable() {
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
      <Table className="table-fixed text-xs [&_td]:whitespace-normal [&_th]:whitespace-normal">
        <TableHeader className="bg-muted/40 text-muted-foreground">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[8%] px-4">Run ID</TableHead>
            <TableHead className="w-[13%]">FDO</TableHead>
            <TableHead className="w-[17%]">Warehouse</TableHead>
            <TableHead className="w-[11%]">Route</TableHead>
            <TableHead className="w-[6%] px-1.5 text-right">Issued</TableHead>
            <TableHead className="w-[7%] px-1.5 text-right">Delivered</TableHead>
            <TableHead className="w-[8%] px-1.5 text-right leading-tight">Exp. Return</TableHead>
            <TableHead className="w-[8%] px-1.5 text-right leading-tight">FDO Declared</TableHead>
            <TableHead className="w-[6%] px-1.5 text-right">Variance</TableHead>
            <TableHead className="w-[12%]">Submitted</TableHead>
            <TableHead className="w-[4%] px-1"><span className="sr-only">Expand return</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingReturnApprovals.map((approval) => {
            const isExpanded = expandedRunId === approval.id;
            const detailsId = `pending-return-details-${approval.id}`;

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
                  <TableCell className="text-muted-foreground">{approval.route}</TableCell>
                  <TableCell className="px-1.5 text-right font-medium tabular-nums">{approval.issued}</TableCell>
                  <TableCell className="px-1.5 text-right text-muted-foreground tabular-nums">{approval.delivered}</TableCell>
                  <TableCell className="px-1.5 text-right font-medium tabular-nums">{approval.expectedReturn}</TableCell>
                  <TableCell className="px-1.5 text-right font-medium tabular-nums">{approval.declaredReturn}</TableCell>
                  <TableCell className={`px-1.5 text-right font-medium tabular-nums ${approval.variance > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                    {approval.variance}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{approval.submittedAt}</TableCell>
                  <TableCell className="px-1">
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
                    <TableCell colSpan={11} className="p-0 whitespace-normal">
                      <PendingVerificationDetails approval={approval} />
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

export default PendingVerificationTable;
