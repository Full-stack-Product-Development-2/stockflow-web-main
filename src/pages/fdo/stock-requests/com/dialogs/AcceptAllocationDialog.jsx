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


function AcceptAllocationDialog({ request, onAcceptAllocation }) {
  return (
    <Dialog>
      <DialogTrigger
        render={<Button type="button" size="sm" className="bg-[#f25522] text-white hover:bg-[#dd4617]" />}
      >
        <CircleCheck aria-hidden="true" />
        Accept Allocation & Create Run
      </DialogTrigger>

      <DialogContent className="bg-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Accept Allocation for {request.id}?</DialogTitle>
          <DialogDescription>
            You requested {request.totalUnits} units. The warehouse proposes{" "}
            {request.allocatedTotalUnits} units. Accepting creates a distribution run
            with the proposed quantities and makes it ready for collection.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" />}>
            Cancel
          </DialogClose>
          <DialogClose
            onClick={() => onAcceptAllocation(request.id)}
            render={<Button type="button" className="bg-[#f25522] text-white hover:bg-[#dd4617]" />}
          >
            Accept & Create Run
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AcceptAllocationDialog;
