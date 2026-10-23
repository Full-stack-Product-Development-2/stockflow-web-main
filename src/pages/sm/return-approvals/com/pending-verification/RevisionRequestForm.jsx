import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function RevisionRequestForm({ approvalId, onCancel, onSubmit }) {
  const [feedback, setFeedback] = useState("");
  const fieldId = `revision-feedback-${approvalId}`;

  function handleSubmit(event) {
    event.preventDefault();

    if (!feedback.trim()) {
      return;
    }

    onSubmit(feedback.trim());
  }

  return (
    <form
      className="grid gap-3 rounded-lg border bg-background p-3"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-1.5">
        <Label htmlFor={fieldId}>
          Revision Feedback <span className="text-red-600">*</span>
        </Label>
        <Textarea
          id={fieldId}
          value={feedback}
          onChange={(event) => setFeedback(event.target.value)}
          placeholder="Explain what needs to be corrected in the return submission..."
          rows={3}
          required
          autoFocus
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="submit"
          size="sm"
          variant="destructive"
          disabled={!feedback.trim()}
        >
          Send Revision Request
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default RevisionRequestForm;
