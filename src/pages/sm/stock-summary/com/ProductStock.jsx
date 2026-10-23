import { useMemo, useState } from "react";
import { ArrowUpDown, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  productStatusOptions,
  productStockItems,
} from "@/data/mock/stock-summary";

const statusStyles = {
  healthy: "border-emerald-200 bg-emerald-50 text-emerald-700",
  "low-stock": "border-amber-200 bg-amber-50 text-amber-700",
  "variance-detected": "border-red-200 bg-red-50 text-red-700",
};

const statusLabels = Object.fromEntries(
  productStatusOptions.map(({ label, value }) => [value, label]),
);

function ProductStock() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return productStockItems.filter((product) => {
      const matchesQuery =
        !normalizedQuery ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.sku.toLowerCase().includes(normalizedQuery);
      const matchesStatus = status === "all" || product.status === status;

      return matchesQuery && matchesStatus;
    });
  }, [query, status]);

  return (
    <section aria-labelledby="product-stock-heading">
      <Card className="gap-0 rounded-xl py-0 shadow-none">
        <CardHeader className="flex flex-col gap-3 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle id="product-stock-heading" className="text-sm font-semibold">
            Product Stock
          </CardTitle>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <div className="relative min-w-52">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search product or SKU..."
                className="pl-8 text-xs"
                aria-label="Search product stock"
              />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {productStatusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table className="min-w-175 text-left text-xs">
            <TableHeader className="bg-muted/50 text-muted-foreground">
              <TableRow>
                <TableHead className="h-auto px-4 py-3 text-muted-foreground">Product</TableHead>
                <TableHead className="h-auto px-4 py-3 text-muted-foreground">SKU</TableHead>
                <TableHead className="h-auto px-4 py-3 text-right text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    Remaining Stock <ArrowUpDown className="size-3" />
                  </span>
                </TableHead>
                <TableHead className="h-auto px-4 py-3 text-right text-muted-foreground">With FDOs</TableHead>
                <TableHead className="h-auto px-4 py-3 text-right text-muted-foreground">Variance</TableHead>
                <TableHead className="h-auto px-4 py-3 text-muted-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <TableRow key={product.sku} className="hover:bg-muted/30">
                    <TableCell className="px-4 py-3 font-medium text-foreground">{product.name}</TableCell>
                    <TableCell className="px-4 py-3 font-mono text-[11px] text-muted-foreground">{product.sku}</TableCell>
                    <TableCell className="px-4 py-3 text-right font-semibold tabular-nums">{product.stock.toLocaleString()}</TableCell>
                    <TableCell className="px-4 py-3 text-right tabular-nums text-muted-foreground">{product.fdos}</TableCell>
                    <TableCell className="px-4 py-3 text-right tabular-nums text-muted-foreground">{product.variance}</TableCell>
                    <TableCell className="px-4 py-3">
                    <Badge
                      variant="outline"
                      className={`px-1.5 text-[10px] ${
                        statusStyles[product.status] ??
                        "border-border bg-muted text-muted-foreground"
                      }`}
                    >
                      {statusLabels[product.status] ?? product.status}
                    </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-sm text-muted-foreground"
                  >
                    No products match the selected filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}

export default ProductStock;
