import { Send } from "lucide-react";

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

function SendAllocationDialog({ request, products, note, allocatedTotal, disabled, onSendAllocation }) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            type="button"
            size="sm"
            disabled={disabled}
            className="bg-[#f25522] text-white hover:bg-[#dd4617]"
          />
        }
      >
        <Send aria-hidden="true" />
        Send Allocation to FDO
      </DialogTrigger>

      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Send Allocation for {request.id}?</DialogTitle>
          <DialogDescription>
            Send your proposed allocation of {allocatedTotal} units to {request.fdo}.
            The original request for {request.totalUnits} units stays unchanged.
            The FDO must accept this allocation before a distribution run is created.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" />}>
            Cancel
          </DialogClose>
          <DialogClose
            onClick={() => onSendAllocation(request.id, products, note)}
            render={<Button type="button" className="bg-[#f25522] text-white hover:bg-[#dd4617]" />}
          >
            Send Allocation
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SendAllocationDialog;
