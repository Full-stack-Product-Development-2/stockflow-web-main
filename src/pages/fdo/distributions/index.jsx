import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  fdoDistributionDeliveries,
  fdoDistributionOutlets,
  fdoDistributionRun,
  fdoNextDeliveryNumber,
} from "@/data/mock/fdo-distributions";
import FDOLayout from "@/layouts/FDOLayout";

import DeliveryHistoryTable from "./com/delivery-history/DeliveryHistoryTable";
import FinishRunDialog from "./com/dialogs/FinishRunDialog";
import RecordDeliveryDialog from "./com/dialogs/RecordDeliveryDialog";
import SubmitReturnDialog from "./com/dialogs/SubmitReturnDialog";
import DistributionRunCard from "./com/run-summary/DistributionRunCard";
import ReturnSubmittedNotice from "./com/run-summary/ReturnSubmittedNotice";
import RemainingStockTable from "./com/stock/RemainingStockTable";

function FDODistributions() {
  function formatDateTime(date) {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  }

  function getStockRows(products, recordedDeliveries) {
    return products.map((product) => {
      const delivered = recordedDeliveries.reduce(
        (total, delivery) =>
          total +
          (delivery.products.find((item) => item.sku === product.sku)?.quantity ?? 0),
        0,
      );

      return { ...product, delivered, remaining: product.collected - delivered };
    });
  }

  const [deliveries, setDeliveries] = useState(fdoDistributionDeliveries);
  const [status, setStatus] = useState(fdoDistributionRun.status);
  const [returnSubmission, setReturnSubmission] = useState(null);
  const [dialog, setDialog] = useState(null);
  const stockRows = useMemo(
    () => getStockRows(fdoDistributionRun.products, deliveries),
    [deliveries],
  );
  const run = { ...fdoDistributionRun, status };

  function recordDelivery({ outletId, products, note }) {
    if (status !== "in-progress" || !products.length) return false;

    const outlet = fdoDistributionOutlets.find((item) => item.id === outletId);
    const uniqueSkus = new Set(products.map((product) => product.sku));
    if (!outlet || uniqueSkus.size !== products.length) return false;

    const validProducts = products.every((product) => {
      const stock = stockRows.find((item) => item.sku === product.sku);
      return stock && Number.isSafeInteger(product.quantity) &&
        product.quantity > 0 && product.quantity <= stock.remaining;
    });
    if (!validProducts) return false;

    const delivery = {
      id: `DEL-${fdoNextDeliveryNumber + deliveries.length}`,
      dateTime: formatDateTime(new Date()),
      outletId,
      outlet: outlet.name,
      area: outlet.area,
      note,
      products: products.map((product) => ({
        ...product,
        name: stockRows.find((item) => item.sku === product.sku).name,
      })),
      totalUnits: products.reduce((total, product) => total + product.quantity, 0),
    };

    setDeliveries((current) => [delivery, ...current]);
    return true;
  }

  function submitReturn({ note, products }) {
    if (status !== "in-progress" || deliveries.length === 0) return;

    setReturnSubmission({ submittedAt: formatDateTime(new Date()), note, products });
    setStatus("return-submitted");
    setDialog(null);
  }

  return (
    <FDOLayout>
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <header>
          <h1 className="text-lg font-semibold">Distributions</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your active distribution run, record deliveries, and submit returns.
          </p>
        </header>

        <DistributionRunCard
          run={run}
          stockRows={stockRows}
          deliveries={deliveries}
          onFinishRun={() => setDialog("finish")}
        />

        {status === "in-progress" && stockRows.some((product) => product.remaining > 0) ? (
          <section className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-orange-200 bg-white px-5 py-4">
            <div>
              <h2 className="font-semibold">Ready to deliver to an outlet?</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Record each outlet delivery as you complete it during the distribution run.
              </p>
            </div>
            <Button type="button" onClick={() => setDialog("delivery")} className="bg-[#f25522] text-white hover:bg-[#dd4617]">
              <Plus aria-hidden="true" />
              Record Outlet Delivery
            </Button>
          </section>
        ) : null}

        {returnSubmission ? (
          <ReturnSubmittedNotice submittedAt={returnSubmission.submittedAt} />
        ) : null}

        <RemainingStockTable products={stockRows} />
        <DeliveryHistoryTable deliveries={deliveries} />
      </div>

      <RecordDeliveryDialog
        open={dialog === "delivery"}
        onOpenChange={(open) => setDialog(open ? "delivery" : null)}
        run={run}
        outlets={fdoDistributionOutlets}
        stockRows={stockRows}
        onRecord={recordDelivery}
      />
      {dialog === "finish" ? (
        <FinishRunDialog
          onClose={() => setDialog(null)}
          onPrepareReturn={() => setDialog("return")}
        />
      ) : null}
      {dialog === "return" ? (
        <SubmitReturnDialog
          run={run}
          stockRows={stockRows}
          onClose={() => setDialog(null)}
          onSubmit={submitReturn}
        />
      ) : null}
    </FDOLayout>
  );
}

export default FDODistributions;
