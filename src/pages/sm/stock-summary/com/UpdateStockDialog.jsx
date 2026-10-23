import { useState } from "react";
import { Plus } from "lucide-react";

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
  stockUpdateProductOptions,
  stockUpdateWarehouseOptions,
} from "@/data/mock/stock-summary";

const initialForm = {
  warehouse: stockUpdateWarehouseOptions[0].value,
  product: stockUpdateProductOptions[0].value,
  quantity: "",
  reference: "",
};

function UpdateStockDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);

  function resetForm() {
    setForm(initialForm);
  }

  function handleOpenChange(nextOpen) {
    setOpen(nextOpen);

    if (!nextOpen) {
      resetForm();
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setOpen(false);
    resetForm();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button className="bg-[#f25522] text-white hover:bg-[#dd4617]" />
        }
      >
        <Plus className="size-4" />
        Update Stock
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Stock</DialogTitle>
          <DialogDescription className="sr-only">
            Record stock received for a warehouse and product.
          </DialogDescription>
        </DialogHeader>

        <form className="grid gap-3" onSubmit={handleSubmit}>
          <div className="grid gap-1.5">
            <Label htmlFor="stock-warehouse">Warehouse</Label>
            <Select
              value={form.warehouse}
              onValueChange={(value) =>
                setForm((currentForm) => ({
                  ...currentForm,
                  warehouse: value,
                }))
              }
            >
              <SelectTrigger id="stock-warehouse" className="w-full">
                <SelectValue placeholder="Select a warehouse" />
              </SelectTrigger>
              <SelectContent>
                {stockUpdateWarehouseOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="stock-product">Product</Label>
            <Select
              value={form.product}
              onValueChange={(value) =>
                setForm((currentForm) => ({
                  ...currentForm,
                  product: value,
                }))
              }
            >
              <SelectTrigger id="stock-product" className="w-full">
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {stockUpdateProductOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="stock-quantity">Quantity Received</Label>
            <Input
              id="stock-quantity"
              name="quantity"
              type="number"
              min="1"
              step="1"
              value={form.quantity}
              onChange={handleChange}
              placeholder="e.g. 200"
              required
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="stock-reference">Reference / Note</Label>
            <Textarea
              id="stock-reference"
              name="reference"
              value={form.reference}
              onChange={handleChange}
              placeholder="e.g. GRN-2026-0806"
              rows={3}
            />
          </div>

          <DialogFooter className="mt-1">
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancel
            </DialogClose>
            <Button
              type="submit"
              className="bg-[#f25522] text-white hover:bg-[#dd4617]"
            >
              Add Stock
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateStockDialog;
