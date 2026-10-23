import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fdoStockSummaryMetrics } from "@/data/mock/fdo-stock-requests";


function StockSummaryCards() {
  return (
    <section aria-label="Stock summary" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {fdoStockSummaryMetrics.map((metric) => (
        <Card key={metric.label} className="gap-0 rounded-xl bg-white py-0 shadow-none">
          <CardHeader className="px-4 pt-4">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {metric.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-3">
            <p className="text-2xl font-semibold tracking-tight text-foreground">
              {metric.value}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{metric.detail}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

export default StockSummaryCards;
