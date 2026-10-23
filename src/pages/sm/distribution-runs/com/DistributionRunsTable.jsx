import { Fragment, useMemo, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { distributionRuns } from "@/data/mock/distribution-runs";

import DistributionRunDetails from "./DistributionRunDetails";
import DistributionRunFilters from "./DistributionRunFilters";
import DistributionStatusBadge from "./DistributionStatusBadge";

const initialFilters = {
  query: "",
  status: "all",
  warehouse: "all",
  fdo: "all",
};

function matchesStatus(runStatus, selectedStatus) {
  if (selectedStatus === "all") {
    return true;
  }

  if (selectedStatus === "approved") {
    return runStatus === "awaiting-collection";
  }

  return runStatus === selectedStatus;
}

function DistributionRunsTable() {
  const [filters, setFilters] = useState(initialFilters);
  const [expandedRunId, setExpandedRunId] = useState(null);

  const visibleRuns = useMemo(() => {
    const query = filters.query.trim().toLowerCase();

    return distributionRuns.filter((run) => {
      const matchesQuery =
        !query ||
        run.id.toLowerCase().includes(query) ||
        run.requestId.toLowerCase().includes(query) ||
        run.fdo.toLowerCase().includes(query) ||
        run.route.toLowerCase().includes(query);

      return (
        matchesQuery &&
        matchesStatus(run.status, filters.status) &&
        (filters.warehouse === "all" || run.warehouse === filters.warehouse) &&
        (filters.fdo === "all" || run.fdo === filters.fdo)
      );
    });
  }, [filters]);

  function changeFilter(name, value) {
    setFilters((currentFilters) => ({ ...currentFilters, [name]: value }));
    setExpandedRunId(null);
  }

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
    <Card className="gap-0 rounded-2xl py-0 shadow-none">
      <DistributionRunFilters filters={filters} onFilterChange={changeFilter} />

      <CardContent className="px-0 pb-0">
        <Table className="table-fixed text-xs [&_td]:whitespace-normal [&_th]:whitespace-normal">
          <TableHeader className="bg-muted/40 text-muted-foreground">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[7%] px-4">Run ID</TableHead>
              <TableHead className="w-[8%]">Request ID</TableHead>
              <TableHead className="w-[12%]">FDO</TableHead>
              <TableHead className="w-[17%]">Warehouse</TableHead>
              <TableHead className="w-[10%]">Route</TableHead>
              <TableHead className="w-[10%]">Issued Date</TableHead>
              <TableHead className="w-[6%] px-1.5 text-right">Issued</TableHead>
              <TableHead className="w-[6%] px-1.5 text-right">Delivered</TableHead>
              <TableHead className="w-[7%] px-1.5 text-right leading-tight">Exp. Return</TableHead>
              <TableHead className="w-[13%]">Status</TableHead>
              <TableHead className="w-[4%] px-1"><span className="sr-only">Expand run</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleRuns.length > 0 ? (
              visibleRuns.map((run) => {
                const isExpanded = expandedRunId === run.id;
                const detailsId = `distribution-run-details-${run.id}`;

                return (
                  <Fragment key={run.id}>
                    <TableRow
                      tabIndex={0}
                      aria-expanded={isExpanded}
                      aria-controls={detailsId}
                      className="cursor-pointer focus-visible:bg-muted/50 focus-visible:outline-none"
                      onClick={() => toggleRun(run.id)}
                      onKeyDown={(event) => handleRowKeyDown(event, run.id)}
                    >
                      <TableCell className="px-4 font-mono text-[11px] text-[#e94713]">{run.id}</TableCell>
                      <TableCell className="font-mono text-[11px] text-muted-foreground">{run.requestId}</TableCell>
                      <TableCell className="font-medium">{run.fdo}</TableCell>
                      <TableCell className="text-muted-foreground">{run.warehouse}</TableCell>
                      <TableCell className="text-muted-foreground">{run.route}</TableCell>
                      <TableCell className="text-muted-foreground">{run.issuedDate}</TableCell>
                      <TableCell className="px-1.5 text-right font-semibold tabular-nums">{run.issued}</TableCell>
                      <TableCell className="px-1.5 text-right text-muted-foreground tabular-nums">{run.delivered}</TableCell>
                      <TableCell className="px-1.5 text-right text-muted-foreground tabular-nums">{run.expectedReturn}</TableCell>
                      <TableCell><DistributionStatusBadge status={run.status} /></TableCell>
                      <TableCell className="px-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`${isExpanded ? "Collapse" : "Expand"} ${run.id}`}
                          aria-expanded={isExpanded}
                          aria-controls={detailsId}
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleRun(run.id);
                          }}
                        >
                          {isExpanded ? <ChevronDown /> : <ChevronRight />}
                        </Button>
                      </TableCell>
                    </TableRow>
                    {isExpanded ? (
                      <TableRow id={detailsId} className="hover:bg-transparent">
                        <TableCell colSpan={11} className="p-0 whitespace-normal">
                          <DistributionRunDetails run={run} />
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </Fragment>
                );
              })
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={11} className="h-28 text-center text-sm text-muted-foreground">
                  No distribution runs match the selected filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default DistributionRunsTable;
