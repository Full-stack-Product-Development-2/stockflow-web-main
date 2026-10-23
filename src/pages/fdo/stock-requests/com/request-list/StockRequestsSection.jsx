import { useMemo, useState } from "react";

import { Card } from "@/components/ui/card";
import {
  acceptAllocation as acceptRequestAllocation,
  confirmCollection as confirmRequestCollection,
  submitStockRequest,
  useWorkflow,
} from "@/data/workflow";

import RequestStockDialog from "../dialogs/RequestStockDialog";
import StockRequestFilters from "./StockRequestFilters";
import StockRequestsTable from "./StockRequestsTable";

const initialFilters = { query: "", warehouse: "all", status: "all" };

function StockRequestsSection() {
  const requests = useWorkflow("fdoRequests");
  const [filters, setFilters] = useState(initialFilters);
  const [expandedRequestKey, setExpandedRequestKey] = useState(null);

  const visibleRequests = useMemo(() => {
    const query = filters.query.trim().toLowerCase();

    return requests.filter((request) =>
      (!query || request.id.toLowerCase().includes(query)) &&
      (filters.warehouse === "all" || request.warehouse === filters.warehouse) &&
      (filters.status === "all" || request.status === filters.status),
    );
  }, [filters, requests]);

  function confirmCollection(requestId) {
    confirmRequestCollection(requestId);
    setExpandedRequestKey(`${requestId}-in-progress`);
  }

  function acceptAllocation(requestId) {
    acceptRequestAllocation(requestId);
    setExpandedRequestKey(`${requestId}-awaiting-collection`);
  }

  function submitRequest(request) {
    const requestId = submitStockRequest(request);
    setFilters(initialFilters);
    setExpandedRequestKey(`${requestId}-none`);
  }

  function changeFilter(name, value) {
    setFilters((current) => ({ ...current, [name]: value }));
    setExpandedRequestKey(null);
  }

  function toggleRequest(requestKey) {
    setExpandedRequestKey((currentKey) =>
      currentKey === requestKey ? null : requestKey,
    );
  }

  return (
    <section aria-labelledby="fdo-stock-requests-heading" className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="fdo-stock-requests-heading" className="text-lg font-semibold">
            Stock Requests
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Request stock from a warehouse and track approval status.
          </p>
        </div>
        <RequestStockDialog onSubmitRequest={submitRequest} />
      </div>

      <Card className="gap-0 rounded-xl bg-white py-0 shadow-none">
        <StockRequestFilters filters={filters} onFilterChange={changeFilter} />
        <StockRequestsTable
          requests={visibleRequests}
          expandedRequestKey={expandedRequestKey}
          onToggleRequest={toggleRequest}
          onConfirmCollection={confirmCollection}
          onAcceptAllocation={acceptAllocation}
        />
      </Card>
    </section>
  );
}

export default StockRequestsSection;
