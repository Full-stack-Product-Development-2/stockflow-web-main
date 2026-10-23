import { TriangleAlert } from "lucide-react";

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


function FinishRunDialog({ onClose, onPrepareReturn }) {
  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="bg-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Finish Run &amp; Submit Return</DialogTitle>
          <DialogDescription className="sr-only">
            Confirm whether to continue deliveries or prepare the return.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-3 rounded-lg border border-amber-300 bg-amber-50 px-3 py-3 text-xs text-amber-800">
          <TriangleAlert aria-hidden="true" className="size-4 shrink-0" />
          <p>
            Once the return is submitted, you cannot record additional outlet deliveries
            unless the Warehouse Manager requests a revision.
          </p>
        </div>

        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" />}>
            Continue Distribution
          </DialogClose>
          <Button
            type="button"
            onClick={onPrepareReturn}
            className="bg-[#f25522] text-white hover:bg-[#dd4617]"
          >
            Prepare Return
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default FinishRunDialog;
