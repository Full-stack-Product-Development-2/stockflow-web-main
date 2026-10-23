import React from "react";

import SMLayout from "@/layouts/SMLayout";

import ReturnApprovalsTable from "./com/ReturnApprovalsTable";

function ReturnApprovals() {
  return (
    <SMLayout>
      <div className="mx-auto w-full max-w-6xl space-y-5">
        <div>
          <h1 className="text-lg font-semibold">Return Approvals</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            2 returns pending warehouse verification
          </p>
        </div>

        <ReturnApprovalsTable />
      </div>
    </SMLayout>
  );
}

export default ReturnApprovals;
