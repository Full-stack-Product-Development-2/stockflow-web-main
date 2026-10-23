import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function DetailField({ label, value }) {
  return (
    <div>
      <p className="text-muted-foreground">{label}</p>
      <p className="font-medium text-foreground">{value}</p>
    </div>
  );
}

function RunHistoryDetails({ run }) {
  return (
    <div className="space-y-5 text-sm">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DetailField label="Collected" value={run.collectedAt} />
        <DetailField label="Return Submitted" value={run.returnSubmittedAt} />
        <DetailField label="Closed" value={run.closedAt} />
        <DetailField label="Accepted By" value={run.acceptedBy} />
      </div>

      {run.returnNote ? (
        <div>
          <p className="text-muted-foreground">Your Return Note</p>
          <p className="italic text-foreground">{run.returnNote}</p>
        </div>
      ) : null}

      <div>
        <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Product Reconciliation
        </h3>
        <Table className="min-w-170 text-xs">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-0">Product</TableHead>
              <TableHead className="text-right">Collected</TableHead>
              <TableHead className="text-right">Delivered</TableHead>
              <TableHead className="text-right">Expected Return</TableHead>
              <TableHead className="text-right">Verified Return</TableHead>
              <TableHead className="pr-0 text-right">Variance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {run.products.map((product) => {
              const expectedReturn = product.collected - product.delivered;
              const variance = product.verifiedReturn - expectedReturn;

              return (
                <TableRow key={product.name} className="hover:bg-white">
                  <TableCell className="px-0 font-medium">{product.name}</TableCell>
                  <TableCell className="text-right tabular-nums">{product.collected}</TableCell>
                  <TableCell className="text-right tabular-nums">{product.delivered}</TableCell>
                  <TableCell className="text-right tabular-nums">{expectedReturn}</TableCell>
                  <TableCell className="text-right font-medium tabular-nums text-emerald-600">
                    {product.verifiedReturn}
                  </TableCell>
                  <TableCell className={`pr-0 text-right font-medium tabular-nums ${variance === 0 ? "text-emerald-600" : "text-red-600"}`}>
                    {variance}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default RunHistoryDetails;
