import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


function RemainingStockTable({ products }) {
  return (
    <section aria-labelledby="remaining-stock-heading" className="space-y-2">
      <h2 id="remaining-stock-heading" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Remaining Stock With FDO
      </h2>
      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <Table className="min-w-150 text-xs">
          <TableHeader className="bg-muted/40">
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-4">Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead className="text-right">Collected</TableHead>
              <TableHead className="text-right">Delivered</TableHead>
              <TableHead className="pr-4 text-right">Remaining With FDO</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.sku} className="bg-white hover:bg-white">
                <TableCell className="px-4 font-medium">{product.name}</TableCell>
                <TableCell className="font-mono text-muted-foreground">{product.sku}</TableCell>
                <TableCell className="text-right tabular-nums">{product.collected}</TableCell>
                <TableCell className="text-right tabular-nums text-muted-foreground">{product.delivered}</TableCell>
                <TableCell className="pr-4 text-right font-semibold tabular-nums">{product.remaining}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}

export default RemainingStockTable;
