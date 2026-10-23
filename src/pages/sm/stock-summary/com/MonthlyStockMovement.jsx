import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  stockMovementConfig,
  stockMovementData,
} from "@/data/mock/stock-summary";

function MonthlyStockMovement() {
  return (
    <section aria-labelledby="monthly-stock-movement-heading">
      <Card className="gap-0 rounded-xl py-0 shadow-none">
        <CardHeader className="px-4 pt-4">
          <CardTitle
            id="monthly-stock-movement-heading"
            className="text-sm font-semibold"
          >
            Monthly Stock Movement
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-3">
          <ChartContainer
            config={stockMovementConfig}
            className="h-64 w-full min-w-0"
          >
            <BarChart
              accessibilityLayer
              data={stockMovementData}
              margin={{ top: 8, right: 12, left: -12 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                domain={[0, 2400]}
                ticks={[0, 600, 1200, 1800, 2400]}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <ChartTooltip
                cursor={{ fill: "var(--muted)", fillOpacity: 0.55 }}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <ChartLegend
                content={
                  <ChartLegendContent className="flex-wrap gap-x-3 gap-y-1 text-[10px]" />
                }
              />
              <Bar
                dataKey="delivered"
                fill="var(--color-delivered)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="issued"
                fill="var(--color-issued)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="returned"
                fill="var(--color-returned)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="variance"
                fill="var(--color-variance)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="withFdos"
                fill="var(--color-withFdos)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </section>
  );
}

export default MonthlyStockMovement;
