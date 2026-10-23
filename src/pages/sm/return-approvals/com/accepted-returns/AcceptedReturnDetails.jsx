import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import ReturnDetailField from "../shared/ReturnDetailField";

function AcceptedReturnDetails({ approval }) {
  return (
    <div className="space-y-4 border-b bg-background px-6 py-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ReturnDetailField label="FDO">{approval.fdo}</ReturnDetailField>
        <ReturnDetailField label="Warehouse">{approval.warehouse}</ReturnDetailField>
        <ReturnDetailField label="Accepted Date">{approval.acceptedDate}</ReturnDetailField>
        <ReturnDetailField label="Accepted By">{approval.acceptedBy}</ReturnDetailField>
        <ReturnDetailField label="Verification Note" className="sm:col-span-2 lg:col-span-4">
          {approval.verificationNote}
        </ReturnDetailField>
      </div>

      <Table className="min-w-200 text-xs">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="px-0">Product</TableHead>
            <TableHead className="text-right">Issued</TableHead>
            <TableHead className="text-right">Delivered</TableHead>
            <TableHead className="text-right">Expected Return</TableHead>
            <TableHead className="text-right">Verified Return</TableHead>
            <TableHead className="pr-0 text-right">Variance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {approval.products.map((product) => {
            const variance = Math.abs(product.expectedReturn - product.verifiedReturn);

            return (
              <TableRow key={product.name} className="hover:bg-transparent">
                <TableCell className="px-0 font-medium">{product.name}</TableCell>
                <TableCell className="text-right tabular-nums">{product.issued}</TableCell>
                <TableCell className="text-right tabular-nums">{product.delivered}</TableCell>
                <TableCell className="text-right tabular-nums">{product.expectedReturn}</TableCell>
                <TableCell className="text-right font-semibold text-emerald-600 tabular-nums">
                  {product.verifiedReturn}
                </TableCell>
                <TableCell className={`pr-0 text-right font-medium tabular-nums ${variance > 0 ? "text-red-600" : "text-emerald-600"}`}>
                  {variance}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default AcceptedReturnDetails;
