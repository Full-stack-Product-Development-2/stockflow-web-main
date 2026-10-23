import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function DetailField({ label, children, className = "" }) {
  return (
    <div className={className}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-0.5 text-sm font-medium text-foreground">{children}</div>
    </div>
  );
}

function RequestProductTable({ products, showAvailability = false }) {
  return (
    <Table className="min-w-160 text-xs">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="h-auto px-0 py-2 text-muted-foreground">Product</TableHead>
          <TableHead className="h-auto px-3 py-2 text-muted-foreground">SKU</TableHead>
          <TableHead className="h-auto px-3 py-2 text-right text-muted-foreground">
            Requested Qty
          </TableHead>
          {showAvailability ? (
            <>
              <TableHead className="h-auto px-3 py-2 text-right text-muted-foreground">
                Available
              </TableHead>
              <TableHead className="h-auto px-3 py-2 text-muted-foreground">Status</TableHead>
            </>
          ) : null}
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => {
          const hasStock = !showAvailability || product.available >= product.requested;

          return (
            <TableRow key={product.sku} className="hover:bg-transparent">
              <TableCell className="px-0 py-2.5 font-medium">{product.name}</TableCell>
              <TableCell className="px-3 py-2.5 font-mono text-[11px] text-muted-foreground">
                {product.sku}
              </TableCell>
              <TableCell className="px-3 py-2.5 text-right font-medium tabular-nums">
                {product.requested}
              </TableCell>
              {showAvailability ? (
                <>
                  <TableCell
                    className={`px-3 py-2.5 text-right font-semibold tabular-nums ${
                      hasStock ? "" : "text-red-600"
                    }`}
                  >
                    {product.available}
                  </TableCell>
                  <TableCell className="px-3 py-2.5">
                    <Badge
                      variant="outline"
                      className={
                        hasStock
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-red-200 bg-red-50 text-red-700"
                      }
                    >
                      {hasStock ? "Available" : "Insufficient Stock"}
                    </Badge>
                  </TableCell>
                </>
              ) : null}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export { DetailField, RequestProductTable };
