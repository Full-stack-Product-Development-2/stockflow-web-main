import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { stockOverviewItems } from "@/data/mock/stock-summary";

import UpdateStockDialog from "./UpdateStockDialog";

function OverviewCard({ detail, icon: Icon, label, value }) {
  return (
    <Card className="gap-0 rounded-xl py-0 shadow-none">
      <CardHeader className="flex-row items-center justify-between px-4 pt-4">
        <CardTitle className="text-xs font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <Icon className="size-4 text-muted-foreground" strokeWidth={1.7} />
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-4">
        <p className="text-2xl font-semibold tracking-tight text-foreground">
          {value}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}

function StockOverview() {
  return (
    <section aria-labelledby="stock-overview-heading">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="stock-overview-heading" className="text-base font-semibold">
            Stock Overview
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            All Warehouses — August 2026
          </p>
        </div>
        <UpdateStockDialog />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {stockOverviewItems.map((item) => (
          <OverviewCard key={item.label} {...item} />
        ))}
      </div>
    </section>
  );
}

export default StockOverview;
