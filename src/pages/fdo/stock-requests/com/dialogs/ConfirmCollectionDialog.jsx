import { CircleCheck } from "lucide-react";

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


function ConfirmCollectionDialog({ request, onConfirmCollection }) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            type="button"
            size="sm"
            className="bg-[#f25522] text-white hover:bg-[#dd4617]"
          />
        }
      >
        <CircleCheck aria-hidden="true" />
        Confirm Collection
      </DialogTrigger>

      <DialogContent className="bg-white sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Confirm Stock Collected</DialogTitle>
          <DialogDescription>
            Confirm that you have physically collected the listed stock from{" "}
            {request.warehouse} for run {request.distributionRun}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 rounded-lg bg-muted/70 p-4 text-sm">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">Warehouse</p>
              <p className="font-medium">{request.warehouse}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Distribution Run</p>
              <p className="font-mono font-semibold">{request.distributionRun}</p>
            </div>
          </div>

          <div>
            <p className="mb-1 text-xs text-muted-foreground">Products</p>
            {request.products.map((product) => (
              <div key={product.sku} className="flex justify-between gap-3 py-0.5">
                <span>{product.name}</span>
                <span className="shrink-0 font-semibold">{product.allocated ?? product.requested} units</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between border-t pt-2 font-semibold">
            <span>Total</span>
            <span>{request.allocatedTotalUnits ?? request.totalUnits} units</span>
          </div>
        </div>

        <p className="text-xs italic text-muted-foreground">
          I confirm that I have physically collected the listed stock from the warehouse.
        </p>

        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" />}>
            Cancel
          </DialogClose>
          <DialogClose
            onClick={() => onConfirmCollection(request.id)}
            render={
              <Button
                type="button"
                className="bg-[#f25522] text-white hover:bg-[#dd4617]"
              />
            }
          >
            Confirm Stock Collected
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmCollectionDialog;
