import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const firstRow = () => [{ id: 0, sku: "", quantity: "" }];


function RecordDeliveryDialog({ open, onOpenChange, run, outlets, stockRows, onRecord }) {
  function parseWholeNumber(value) {
    if (!/^[1-9]\d*$/.test(value)) return null;

    const number = Number(value);
    return Number.isSafeInteger(number) ? number : null;
  }

  const [outletId, setOutletId] = useState("");
  const [rows, setRows] = useState(firstRow);
  const [nextRowId, setNextRowId] = useState(1);
  const [note, setNote] = useState("");

  const selectedSkus = new Set(rows.map((row) => row.sku).filter(Boolean));
  const availableProducts = stockRows.filter((product) => product.remaining > 0);
  const canAddRow = rows.length < availableProducts.length;
  const validRows = rows.every((row) => {
    const product = stockRows.find((item) => item.sku === row.sku);
    const quantity = parseWholeNumber(row.quantity);
    return product && quantity !== null && quantity <= product.remaining;
  });
  const canRecord = outletId && rows.length > 0 && validRows;

  function resetForm() {
    setOutletId("");
    setRows(firstRow());
    setNextRowId(1);
    setNote("");
  }

  function handleOpenChange(nextOpen) {
    onOpenChange(nextOpen);
    if (!nextOpen) resetForm();
  }

  function updateRow(id, changes) {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, ...changes } : row)),
    );
  }

  function removeRow(id) {
    setRows((current) =>
      current.length === 1 ? firstRow() : current.filter((row) => row.id !== id),
    );
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!canRecord) return;

    const products = rows.map((row) => ({
      sku: row.sku,
      quantity: parseWholeNumber(row.quantity),
    }));
    if (onRecord({ outletId, products, note: note.trim() })) {
      handleOpenChange(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto bg-white sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Record Outlet Delivery</DialogTitle>
          <DialogDescription className="sr-only">
            Record delivered product quantities for an outlet on {run.id}.
          </DialogDescription>
        </DialogHeader>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-1.5">
            <p className="text-sm font-medium">Distribution Run</p>
            <div className="rounded-lg border border-input bg-muted/50 px-3 py-2 font-mono text-sm text-muted-foreground">
              {run.id}
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="delivery-outlet">Outlet <span className="text-red-600">*</span></Label>
            <Select
              value={outletId || null}
              onValueChange={setOutletId}
              itemToStringLabel={(value) => outlets.find((outlet) => outlet.id === value)?.name ?? ""}
            >
              <SelectTrigger id="delivery-outlet" className="w-full bg-white">
                <SelectValue placeholder="Select outlet..." />
              </SelectTrigger>
              <SelectContent>
                {outlets.map((outlet) => (
                  <SelectItem key={outlet.id} value={outlet.id}>{outlet.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <p className="text-sm font-medium">Products <span className="text-red-600">*</span></p>
            <div className="overflow-hidden rounded-lg border border-border">
              <div className="hidden grid-cols-[minmax(0,1fr)_5rem_5rem_2rem] gap-2 border-b bg-muted/40 px-3 py-2 text-xs text-muted-foreground sm:grid">
                <span>Product</span><span className="text-right">Remaining</span><span className="text-right">Deliver Qty</span><span />
              </div>
              {rows.map((row, index) => {
                const product = stockRows.find((item) => item.sku === row.sku);
                const quantity = parseWholeNumber(row.quantity);
                const invalid = row.quantity !== "" &&
                  (quantity === null || quantity > (product?.remaining ?? 0));

                return (
                  <div key={row.id} className="grid grid-cols-[minmax(0,1fr)_5rem_2rem] items-center gap-2 border-b border-border px-3 py-2 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_5rem_5rem_2rem]">
                    <div className="col-span-3 min-w-0 sm:col-span-1">
                      <Select
                        value={row.sku || null}
                        onValueChange={(sku) => updateRow(row.id, { sku, quantity: "" })}
                        itemToStringLabel={(value) => stockRows.find((item) => item.sku === value)?.name ?? ""}
                      >
                        <SelectTrigger aria-label={`Product ${index + 1}`} className="w-full bg-white">
                          <SelectValue placeholder="Select product..." />
                        </SelectTrigger>
                        <SelectContent>
                          {availableProducts
                            .filter((item) => item.sku === row.sku || !selectedSkus.has(item.sku))
                            .map((item) => (
                              <SelectItem key={item.sku} value={item.sku}>{item.name}</SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <span className="text-right text-xs tabular-nums text-muted-foreground">
                      {product?.remaining ?? "—"}
                    </span>
                    <Input
                      type="number"
                      min="1"
                      max={product?.remaining}
                      step="1"
                      value={row.quantity}
                      onChange={(event) => updateRow(row.id, { quantity: event.target.value })}
                      disabled={!product}
                      aria-label={`Delivery quantity for product ${index + 1}`}
                      aria-invalid={invalid || undefined}
                      className="bg-white text-right"
                      placeholder="0"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Remove product ${index + 1}`}
                      onClick={() => removeRow(row.id)}
                    >
                      <Trash2 aria-hidden="true" />
                    </Button>
                    {invalid ? (
                      <p className="col-span-3 text-xs text-red-600 sm:col-span-4">
                        Enter a whole number from 1 to {product?.remaining ?? 0}.
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setRows((current) => [...current, { id: nextRowId, sku: "", quantity: "" }]);
                setNextRowId((current) => current + 1);
              }}
              disabled={!canAddRow}
              className="justify-self-start"
            >
              <Plus aria-hidden="true" />
              Add Product
            </Button>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="delivery-note">Delivery Note</Label>
            <Textarea
              id="delivery-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Add any information about this outlet delivery."
              rows={3}
            />
          </div>

          <DialogFooter className="sticky -bottom-4 z-10 bg-white">
            <DialogClose render={<Button type="button" variant="outline" />}>Cancel</DialogClose>
            <Button type="submit" disabled={!canRecord} className="bg-[#f25522] text-white hover:bg-[#dd4617]">
              Record Delivery
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default RecordDeliveryDialog;
