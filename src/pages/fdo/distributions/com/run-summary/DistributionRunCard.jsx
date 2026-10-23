import { CircleCheck, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";


function RunStatusBadge({ status }) {
  const submitted = status === "return-submitted";

  return (
    <span
      className={`rounded-md border px-2 py-1 text-xs font-medium ${
        submitted
          ? "border-violet-200 bg-violet-50 text-violet-700"
          : "border-amber-300 bg-amber-50 text-amber-700"
      }`}
    >
      {submitted ? "Return Submitted" : "In Progress"}
    </span>
  );
}

function DistributionRunCard({ run, stockRows, deliveries, onFinishRun }) {
  const collected = stockRows.reduce((total, product) => total + product.collected, 0);
  const delivered = stockRows.reduce((total, product) => total + product.delivered, 0);
  const outletsVisited = new Set(deliveries.map((delivery) => delivery.outletId)).size;
  const metrics = [
    { label: "Collected", value: collected },
    { label: "Delivered", value: delivered },
    { label: "Remaining", value: collected - delivered },
    { label: "Outlets Visited", value: outletsVisited },
  ];

  return (
    <section aria-label="Active distribution run" className="overflow-hidden rounded-xl border border-border bg-white">
      <div className="flex flex-wrap items-center justify-between gap-4 p-5">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#fdf1ed] text-[#e94713]">
            <Truck aria-hidden="true" className="size-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-mono text-lg font-semibold">{run.id}</h2>
              <RunStatusBadge status={run.status} />
            </div>
            <p className="text-sm text-muted-foreground">
              Request: {run.requestId} · {run.warehouse}
            </p>
          </div>
        </div>
        {run.status === "in-progress" && deliveries.length > 0 ? (
          <Button type="button" variant="outline" onClick={onFinishRun}>
            <CircleCheck aria-hidden="true" />
            Finish Run &amp; Submit Return
          </Button>
        ) : null}
      </div>

      <div className="grid grid-cols-2 border-y border-border sm:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="border-r border-b border-border p-4 last:border-r-0 even:border-r-0 sm:border-b-0 sm:even:border-r sm:last:border-r-0">
            <p className="text-sm text-muted-foreground">{metric.label}</p>
            <p className="mt-1 text-xl font-semibold tabular-nums">
              {metric.value.toLocaleString("en-US")}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-1 px-5 py-3 text-xs text-muted-foreground">
        <span>Issued: {run.issuedDate}</span>
        <span>Collected: {run.collectedAt}</span>
        <span>Route: {run.route}</span>
      </div>
    </section>
  );
}

export default DistributionRunCard;
