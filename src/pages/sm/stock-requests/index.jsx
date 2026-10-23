import SMLayout from "@/layouts/SMLayout";

import StockRequestsTable from "./com/StockRequestsTable";

function StockRequests() {
  return (
    <SMLayout>
      <div className="mx-auto w-full max-w-6xl space-y-5">
        <div>
          <h1 className="text-lg font-semibold">Stock Requests</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review requests and propose stock allocations for FDO acceptance.
          </p>
        </div>

        <StockRequestsTable />
      </div>
    </SMLayout>
  );
}

export default StockRequests;
