import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";


function SubmitReturnDialog({ run, stockRows, onClose, onSubmit }) {
  function parseWholeNumber(value) {
    if (!/^(0|[1-9]\d*)$/.test(value)) return null;

    const number = Number(value);
    return Number.isSafeInteger(number) ? number : null;
  }

  const [actuals, setActuals] = useState(() =>
    Object.fromEntries(stockRows.map((product) => [product.sku, String(product.remaining)])),
  );
  const [note, setNote] = useState("");

  const collected = stockRows.reduce((total, product) => total + product.collected, 0);
  const delivered = stockRows.reduce((total, product) => total + product.delivered, 0);
  const expected = collected - delivered;
  const values = stockRows.map((product) => {
    const actual = parseWholeNumber(actuals[product.sku] ?? "");
    const invalid = actual === null || actual > product.collected;
    return { ...product, actual, invalid, variance: invalid ? null : actual - product.remaining };
  });
  const hasInvalid = values.some((product) => product.invalid);
  const totalActual = values.reduce(
    (total, product) => total + (product.invalid ? 0 : product.actual),
    0,
  );
  const hasVariance = values.some((product) => !product.invalid && product.variance !== 0);
  const canSubmit = !hasInvalid && (!hasVariance || note.trim().length > 0);

  function handleSubmit(event) {
    event.preventDefault();
    if (!canSubmit) return;

    onSubmit({
      note: note.trim(),
      products: values.map((product) => ({ sku: product.sku, actualReturn: product.actual })),
    });
  }

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto bg-white sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Submit Return for Verification</DialogTitle>
          <DialogDescription className="sr-only">
            Reconcile collected and delivered stock before submitting the return.
          </DialogDescription>
        </DialogHeader>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3 rounded-lg bg-muted/50 p-3 text-xs sm:grid-cols-4">
            <div><p className="text-muted-foreground">Run ID</p><p className="font-mono font-semibold">{run.id}</p></div>
            <div><p className="text-muted-foreground">Return Warehouse</p><p className="font-medium">{run.warehouse}</p></div>
            <div><p className="text-muted-foreground">Total Collected</p><p className="font-semibold">{collected} units</p></div>
            <div><p className="text-muted-foreground">Total Delivered</p><p className="font-semibold">{delivered} units</p></div>
          </div>

          <div className="grid gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Product Reconciliation
            </h3>
            <div className="overflow-hidden rounded-lg border border-border">
              <Table className="min-w-160 text-xs">
                <TableHeader className="bg-muted/40">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="px-3">Product</TableHead>
                    <TableHead className="text-right">Collected</TableHead>
                    <TableHead className="text-right">Delivered</TableHead>
                    <TableHead className="text-right">Expected Return</TableHead>
                    <TableHead className="text-right">Actual Return</TableHead>
                    <TableHead className="pr-3 text-right">Variance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {values.map((product) => (
                    <TableRow key={product.sku} className="hover:bg-white">
                      <TableCell className="px-3 font-medium">{product.name}</TableCell>
                      <TableCell className="text-right tabular-nums">{product.collected}</TableCell>
                      <TableCell className="text-right tabular-nums">{product.delivered}</TableCell>
                      <TableCell className="text-right font-semibold tabular-nums">{product.remaining}</TableCell>
                      <TableCell className="w-24">
                        <Label htmlFor={`actual-return-${product.sku}`} className="sr-only">
                          Actual return for {product.name}
                        </Label>
                        <Input
                          id={`actual-return-${product.sku}`}
                          type="number"
                          min="0"
                          max={product.collected}
                          step="1"
                          value={actuals[product.sku]}
                          onChange={(event) =>
                            setActuals((current) => ({
                              ...current,
                              [product.sku]: event.target.value,
                            }))
                          }
                          aria-invalid={product.invalid || undefined}
                          className="bg-white text-right"
                        />
                      </TableCell>
                      <TableCell className={`pr-3 text-right font-medium tabular-nums ${product.variance === 0 ? "text-emerald-600" : "text-red-600"}`}>
                        {product.invalid ? "—" : product.variance}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter className="bg-white">
                  <TableRow>
                    <TableCell className="px-3 font-semibold">Total</TableCell>
                    <TableCell className="text-right">{collected}</TableCell>
                    <TableCell className="text-right">{delivered}</TableCell>
                    <TableCell className="text-right">{expected}</TableCell>
                    <TableCell className="text-right">{hasInvalid ? "—" : totalActual}</TableCell>
                    <TableCell className="pr-3 text-right">{hasInvalid ? "—" : totalActual - expected}</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
            {hasInvalid ? (
              <p className="text-xs text-red-600">Actual returns must be whole numbers from 0 to the collected quantity.</p>
            ) : null}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="return-note">Return Note{hasVariance ? " *" : ""}</Label>
            <Textarea
              id="return-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Explain any difference between expected and actual return."
              rows={3}
            />
            {hasVariance ? (
              <p className="text-xs text-amber-700">A note is required when the actual return differs from the expected return.</p>
            ) : null}
          </div>

          <DialogFooter className="sticky -bottom-4 z-10 bg-white">
            <DialogClose render={<Button type="button" variant="outline" />}>Cancel</DialogClose>
            <Button type="submit" disabled={!canSubmit} className="bg-[#f25522] text-white hover:bg-[#dd4617]">
              Submit Return for Verification
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default SubmitReturnDialog;
