import FDOLayout from "@/layouts/FDOLayout";

import StockRequestsSection from "./com/request-list/StockRequestsSection";
import StockSummaryCards from "./com/summary/StockSummaryCards";

function FDOStockRequests() {
  return (
    <FDOLayout>
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <StockSummaryCards />
        <StockRequestsSection />
      </div>
    </FDOLayout>
  );
}

export default FDOStockRequests;
