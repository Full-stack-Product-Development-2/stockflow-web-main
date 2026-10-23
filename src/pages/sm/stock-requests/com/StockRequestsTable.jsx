import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { sendAllocation, useWorkflow } from "@/data/workflow";

import PendingRequestsTable from "./pending-request/PendingRequestsTable";
import RequestHistoryTable from "./request-history/RequestHistoryTable";

function StockRequestsTable() {
  const [view, setView] = useState("pending");
  const requests = useWorkflow("smPendingRequests");
  const isPending = view === "pending";

  return (
    <Card className="gap-0 rounded-2xl py-0 shadow-none">
      <CardHeader className="border-b px-4 py-4">
        <div role="tablist" aria-label="Stock request views" className="flex w-fit max-w-full overflow-x-auto rounded-xl bg-muted p-1">
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
