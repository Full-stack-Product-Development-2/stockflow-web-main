import { useState } from "react";
import { CircleX } from "lucide-react";

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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function RejectRequestDialog({ request }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const reasonFieldId = `rejection-reason-${request.id}`;

  function handleOpenChange(nextOpen) {
    setOpen(nextOpen);

    if (!nextOpen) {
      setReason("");
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!reason.trim()) {
      return;
    }

    setOpen(false);
    setReason("");
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button type="button" variant="destructive" size="sm" />}>
        <CircleX />
        Reject Request
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reject Request {request.id}</DialogTitle>
          <DialogDescription>
            Provide a reason for rejecting this stock request.
          </DialogDescription>
        </DialogHeader>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-3 text-xs text-amber-800">
            Rejected requests cannot be reopened. The Field Distribution Officer must
            submit a new request.
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor={reasonFieldId}>
              Rejection Reason <span className="text-red-600">*</span>
            </Label>
            <Textarea
              id={reasonFieldId}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Explain why this request is being rejected..."
              rows={3}
              required
            />
          </div>

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancel
            </DialogClose>
            <Button
              type="submit"
              variant="destructive"
              disabled={!reason.trim()}
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default RejectRequestDialog;
