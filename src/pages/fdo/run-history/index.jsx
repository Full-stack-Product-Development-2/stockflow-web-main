import { fdoRunHistory } from "@/data/mock/fdo-run-history";
import FDOLayout from "@/layouts/FDOLayout";

import RunHistoryTable from "./com/RunHistoryTable";

function FDORunHistory() {
  return (
    <FDOLayout>
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <header>
          <h1 className="text-lg font-semibold">Run History</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Completed and closed distribution runs for your record.
          </p>
        </header>

        <RunHistoryTable runs={fdoRunHistory} />
      </div>
    </FDOLayout>
  );
}

export default FDORunHistory;
