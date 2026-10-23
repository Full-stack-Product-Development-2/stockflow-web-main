import { Fragment, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import RunHistoryDetails from "./RunHistoryDetails";

function RunHistoryTable({ runs }) {
  const [expandedId, setExpandedId] = useState(null);

  function getRunTotals(run) {
    return run.products.reduce(
      (totals, product) => {
        const expectedReturn = product.collected - product.delivered;
        totals.collected += product.collected;
        totals.delivered += product.delivered;
        totals.returned += product.verifiedReturn;
        totals.variance += product.verifiedReturn - expectedReturn;
        return totals;
      },
      { collected: 0, delivered: 0, returned: 0, variance: 0 },
    );
  }

  function toggle(id) {
    setExpandedId((current) => (current === id ? null : id));
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white">
      <Table className="min-w-240 text-xs">
        <TableHeader className="bg-muted/40 text-muted-foreground">
          <TableRow className="hover:bg-transparent">
            <TableHead className="px-4">Run ID</TableHead>
            <TableHead>Warehouse</TableHead>
            <TableHead>Collection Date</TableHead>
            <TableHead>Closed Date</TableHead>
            <TableHead className="text-right">Collected</TableHead>
            <TableHead className="text-right">Delivered</TableHead>
            <TableHead className="text-right">Returned</TableHead>
            <TableHead className="text-right">Variance</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-12"><span className="sr-only">Expand run</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {runs.map((run) => {
            const totals = getRunTotals(run);
            const expanded = expandedId === run.id;
            const detailsId = `run-history-details-${run.id}`;

            return (
              <Fragment key={run.id}>
                <TableRow
                  tabIndex={0}
                  aria-expanded={expanded}
                  aria-controls={detailsId}
                  className="cursor-pointer bg-white focus-visible:bg-muted/50 focus-visible:outline-none"
                  onClick={() => toggle(run.id)}
                  onKeyDown={(event) => {
                    if (event.target !== event.currentTarget) return;
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      toggle(run.id);
                    }
                  }}
                >
                  <TableCell className="px-4 font-mono font-semibold text-[#e94713]">{run.id}</TableCell>
                  <TableCell className="text-muted-foreground">{run.warehouse}</TableCell>
                  <TableCell className="text-muted-foreground">{run.collectionDate}</TableCell>
                  <TableCell className="text-muted-foreground">{run.closedDate}</TableCell>
                  <TableCell className="text-right font-medium tabular-nums">{totals.collected}</TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">{totals.delivered}</TableCell>
                  <TableCell className="text-right font-medium tabular-nums">{totals.returned}</TableCell>
                  <TableCell className={`text-right font-medium tabular-nums ${totals.variance === 0 ? "text-emerald-600" : "text-red-600"}`}>
                    {totals.variance}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-600">
                      {run.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`${expanded ? "Collapse" : "Expand"} ${run.id}`}
                      aria-expanded={expanded}
                      aria-controls={detailsId}
                      onClick={(event) => {
                        event.stopPropagation();
                        toggle(run.id);
                      }}
                    >
                      {expanded ? <ChevronDown aria-hidden="true" /> : <ChevronRight aria-hidden="true" />}
                    </Button>
                  </TableCell>
                </TableRow>
                {expanded ? (
                  <TableRow id={detailsId} className="hover:bg-white">
                    <TableCell colSpan={10} className="whitespace-normal border-t border-border bg-white p-5">
                      <RunHistoryDetails run={run} />
                    </TableCell>
                  </TableRow>
                ) : null}
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default RunHistoryTable;
