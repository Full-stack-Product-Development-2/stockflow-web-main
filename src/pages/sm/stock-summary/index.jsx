import React from "react";

import SMLayout from "@/layouts/SMLayout";

import StockSummaryFilters from "./com/StockSummaryFilters";
import GreetingBanner from "./com/GreetingBanner";
import StockOverview from "./com/StockOverview";
import MonthlyStockMovement from "./com/MonthlyStockMovement";
import ProductStock from "./com/ProductStock";

function StockSummary() {
  return (
    <SMLayout>
      <div className="mx-auto w-full max-w-6xl space-y-5">
        <StockSummaryFilters />
        <GreetingBanner />
        <StockOverview />
        <MonthlyStockMovement />
        <ProductStock />
      </div>
    </SMLayout>
  );
}

export default StockSummary;
