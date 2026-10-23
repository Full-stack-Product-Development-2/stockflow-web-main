import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { pendingStockRequests } from "@/data/mock/stock-requests";

import PendingRequestsTable from "./pending-request/PendingRequestsTable";
import RequestHistoryTable from "./request-history/RequestHistoryTable";

function StockRequestsTable() {
  const [view, setView] = useState("pending");
  const [requests, setRequests] = useState(pendingStockRequests);
  const isPending = view === "pending";

  function sendAllocation(requestId, products, note) {
    setRequests((current) => current.map((request) =>
      request.id === requestId && request.status === "pending"
        ? {
            ...request,
            status: "awaiting-fdo-acceptance",
            allocationDate: new Intl.DateTimeFormat("en-GB", {
              day: "numeric", month: "short", year: "numeric",
            }).format(new Date()),
            allocationNote: note,
            allocatedTotalUnits: products.reduce((total, product) => total + product.allocated, 0),
            products,
          }
        : request,
    ));
  }

  return (
    <Card className="gap-0 rounded-2xl py-0 shadow-none">
      <CardHeader className="border-b px-4 py-4">
        <div role="tablist" aria-label="Stock request views" className="flex w-fit rounded-xl bg-muted p-1">
          <Button
            type="button"
            role="tab"
            size="sm"
            variant={isPending ? "outline" : "ghost"}
            aria-selected={isPending}
            className={isPending ? "bg-background shadow-sm" : "text-muted-foreground"}
            onClick={() => setView("pending")}
          >
            Active Requests
            <Badge className="bg-[#f25522] px-1.5 text-white">
              {requests.length}
            </Badge>
          </Button>
          <Button
            type="button"
            role="tab"
            size="sm"
            variant={!isPending ? "outline" : "ghost"}
            aria-selected={!isPending}
            className={!isPending ? "bg-background shadow-sm" : "text-muted-foreground"}
            onClick={() => setView("history")}
          >
            Request History
          </Button>
        </div>
      </CardHeader>

      {isPending ? (
        <PendingRequestsTable requests={requests} onSendAllocation={sendAllocation} />
      ) : <RequestHistoryTable />}
    </Card>
  );
}

export default StockRequestsTable;
