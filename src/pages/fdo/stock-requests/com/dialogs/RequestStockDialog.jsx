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
  DialogTrigger,
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
import {
  fdoRequestProducts,
  fdoRequestWarehouseOptions,
} from "@/data/mock/fdo-stock-requests";

const emptyRows = () => [{ id: 0, sku: "", quantity: "" }];
const warehouses = fdoRequestWarehouseOptions.filter((option) => option.value !== "all");


function RequestStockDialog({ onSubmitRequest }) {
  function parseQuantity(value) {
    if (!/^[1-9]\d*$/.test(value)) return null;
    const quantity = Number(value);
    return Number.isSafeInteger(quantity) ? quantity : null;
  }

  const [open, setOpen] = useState(false);
  const [warehouse, setWarehouse] = useState("");
  const [requestDate, setRequestDate] = useState(() => new Date());
  const [rows, setRows] = useState(emptyRows);
  const [nextRowId, setNextRowId] = useState(1);
  const [note, setNote] = useState("");

  const selectedSkus = new Set(rows.map((row) => row.sku).filter(Boolean));
  const selectedProducts = rows.flatMap((row) => {
    const product = fdoRequestProducts.find((item) => item.sku === row.sku);
    const requested = parseQuantity(row.quantity);
    return product && requested ? [{ ...product, requested }] : [];
  });
  const hasInvalidRow = rows.some(
    (row) => row.sku && parseQuantity(row.quantity) === null,
  );
  const canSubmit = warehouse && !hasInvalidRow && selectedProducts.length > 0;

  function resetForm() {
    setWarehouse("");
    setRows(emptyRows());
    setNextRowId(1);
    setNote("");
  }

  function handleOpenChange(nextOpen) {
    setOpen(nextOpen);
    if (nextOpen) setRequestDate(new Date());
    else resetForm();
  }

  function updateRow(id, changes) {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, ...changes } : row)),
    );
  }

  function removeRow(id) {
    setRows((current) =>
      current.length === 1 ? emptyRows() : current.filter((row) => row.id !== id),
    );
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!canSubmit) return;

    onSubmitRequest({
      warehouse,
      requestedAt: requestDate,
      note: note.trim(),
      products: selectedProducts,
    });
    handleOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button type="button" className="bg-[#f25522] text-white hover:bg-[#dd4617]" />
        }
      >
        <Plus aria-hidden="true" />
        Request Stock
      </DialogTrigger>

      <DialogContent className="max-h-[90dvh] gap-0 overflow-hidden bg-white p-0 sm:max-w-2xl">
        <DialogHeader className="px-5 py-5 pr-12">
          <DialogTitle>Request Stock</DialogTitle>
          <DialogDescription className="sr-only">
            Choose a warehouse, add products and quantities, and submit a stock request.
          </DialogDescription>
        </DialogHeader>

        <form className="flex min-h-0 flex-col" onSubmit={handleSubmit}>
          <div className="grid min-h-0 gap-4 overflow-y-auto px-5 pb-5">
            <div className="grid gap-1.5">
              <Label htmlFor="request-warehouse">
                Warehouse <span className="text-red-600">*</span>
              </Label>
              <Select
                value={warehouse || null}
                onValueChange={(value) => {
                  setWarehouse(value);
                  setRows(emptyRows());
                  setNextRowId(1);
                }}
                itemToStringLabel={(value) =>
                  warehouses.find((option) => option.value === value)?.label ?? ""
                }
              >
                <SelectTrigger id="request-warehouse" className="w-full bg-white sm:max-w-xs">
                  <SelectValue placeholder="Select warehouse..." />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1.5">
              <p className="text-sm font-medium">Request Date</p>
              <div className="rounded-lg bg-muted/60 px-3 py-2 text-sm text-muted-foreground">
                {new Intl.DateTimeFormat("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                }).format(requestDate)}
              </div>
            </div>

            <div className="grid gap-2">
              <p className="text-sm font-medium">
                Products <span className="text-red-600">*</span>
              </p>
              <div className="overflow-hidden rounded-lg border border-border">
                <div className="hidden grid-cols-[minmax(0,1fr)_7rem_5rem_6rem_2rem] items-center gap-2 border-b bg-muted/40 px-3 py-2 text-xs text-muted-foreground sm:grid">
                  <span>Product</span>
                  <span>SKU</span>
                  <span className="text-right">Available</span>
                  <span className="text-right">Requested</span>
                  <span />
                </div>
                {rows.map((row, index) => {
                  const product = fdoRequestProducts.find((item) => item.sku === row.sku);
                  const quantity = parseQuantity(row.quantity);
                  const isInvalid = row.quantity !== "" && quantity === null;
                  const exceedsAvailability = quantity > (product?.available ?? 0);

                  return (
                    <div
                      key={row.id}
                      className="grid grid-cols-[minmax(0,1fr)_6rem_2rem] items-center gap-2 border-b border-border px-3 py-3 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_7rem_5rem_6rem_2rem]"
                    >
                      <div className="col-span-3 min-w-0 sm:col-span-1">
                        <Select
                          value={row.sku || null}
                          onValueChange={(sku) => updateRow(row.id, { sku, quantity: "" })}
                          disabled={!warehouse}
                          itemToStringLabel={(value) =>
                            fdoRequestProducts.find((item) => item.sku === value)?.name ?? ""
                          }
                        >
                          <SelectTrigger
                            aria-label={`Product ${index + 1}`}
                            className="w-full min-w-0 bg-white"
                          >
                            <SelectValue
                              placeholder={warehouse ? "Select product..." : "Select warehouse first"}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {fdoRequestProducts
                              .filter((item) => item.sku === row.sku || !selectedSkus.has(item.sku))
                              .map((item) => (
                                <SelectItem key={item.sku} value={item.sku}>
                                  {item.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="min-w-0">
                        <p className="break-all font-mono text-xs text-muted-foreground">
                          {product?.sku ?? "—"}
                        </p>
                        {product ? (
                          <p className="text-xs text-muted-foreground sm:hidden">
                            {product.available.toLocaleString("en-US")} available
                          </p>
                        ) : null}
                      </div>
                      <span className="hidden text-right text-xs tabular-nums text-muted-foreground sm:block">
                        {product ? product.available.toLocaleString("en-US") : "—"}
                      </span>
                      <Input
                        type="number"
                        min="1"
                        step="1"
                        value={row.quantity}
                        onChange={(event) => updateRow(row.id, { quantity: event.target.value })}
                        disabled={!product}
                        aria-label={`Requested quantity for product ${index + 1}`}
                        aria-invalid={isInvalid || undefined}
                        className="w-full bg-white text-right"
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
                      {isInvalid || exceedsAvailability ? (
                        <p className={`col-span-3 text-xs sm:col-span-5 ${isInvalid ? "text-red-600" : "text-amber-700"}`}>
                          {isInvalid
                            ? "Enter a positive whole number."
                            : "This exceeds warehouse availability and will need stock manager review."}
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
                disabled={!warehouse || rows.length >= fdoRequestProducts.length}
                className="justify-self-start"
              >
                <Plus aria-hidden="true" />
                Add Product
              </Button>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="fdo-request-note">Request Note</Label>
              <Textarea
                id="fdo-request-note"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Add any information relevant to this stock request."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="mx-0 mb-0 shrink-0 rounded-b-xl bg-muted/30">
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancel
            </DialogClose>
            <Button
              type="submit"
              disabled={!canSubmit}
              className="bg-[#f25522] text-white hover:bg-[#dd4617]"
            >
              Submit Stock Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default RequestStockDialog;
