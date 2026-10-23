import { Fragment, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


function DeliveryHistoryTable({ deliveries }) {
  const [expandedId, setExpandedId] = useState(null);

  function toggle(id) {
    setExpandedId((current) => (current === id ? null : id));
  }

  return (
    <section aria-labelledby="delivery-history-heading" className="space-y-2">
      <h2 id="delivery-history-heading" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Delivery History
      </h2>
      <div className="overflow-hidden rounded-xl border border-border bg-white">
        {deliveries.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            No deliveries recorded yet.
          </p>
        ) : (
          <Table className="min-w-190 text-xs">
            <TableHeader className="bg-muted/40">
              <TableRow className="hover:bg-transparent">
                <TableHead className="px-4">Delivery ID</TableHead>
                <TableHead>Date &amp; Time</TableHead>
                <TableHead>Outlet</TableHead>
                <TableHead>Area</TableHead>
                <TableHead className="text-right">Products</TableHead>
                <TableHead className="text-right">Total Units</TableHead>
                <TableHead className="w-12"><span className="sr-only">Expand delivery</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveries.map((delivery) => {
                const expanded = expandedId === delivery.id;
                const detailsId = `delivery-details-${delivery.id}`;

                return (
                  <Fragment key={delivery.id}>
                    <TableRow
                      tabIndex={0}
                      aria-expanded={expanded}
                      aria-controls={detailsId}
                      onClick={() => toggle(delivery.id)}
                      onKeyDown={(event) => {
                        if (event.target !== event.currentTarget) return;
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          toggle(delivery.id);
                        }
                      }}
                      className="cursor-pointer bg-white focus-visible:bg-muted/50 focus-visible:outline-none"
                    >
                      <TableCell className="px-4 font-mono font-semibold text-[#e94713]">{delivery.id}</TableCell>
                      <TableCell className="text-muted-foreground">{delivery.dateTime}</TableCell>
                      <TableCell className="font-medium">{delivery.outlet}</TableCell>
                      <TableCell className="text-muted-foreground">{delivery.area}</TableCell>
                      <TableCell className="text-right">{delivery.products.length}</TableCell>
                      <TableCell className="text-right font-semibold tabular-nums">{delivery.totalUnits}</TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`${expanded ? "Collapse" : "Expand"} ${delivery.id}`}
                          aria-expanded={expanded}
                          aria-controls={detailsId}
                          onClick={(event) => {
                            event.stopPropagation();
                            toggle(delivery.id);
                          }}
                        >
                          {expanded ? <ChevronDown /> : <ChevronRight />}
                        </Button>
                      </TableCell>
                    </TableRow>
                    {expanded ? (
                      <TableRow id={detailsId} className="hover:bg-white">
                        <TableCell colSpan={7} className="whitespace-normal bg-white p-5">
                          <div className="grid gap-4 sm:grid-cols-3">
                            <div><p className="text-muted-foreground">Outlet</p><p className="font-medium">{delivery.outlet}</p></div>
                            <div><p className="text-muted-foreground">Area</p><p className="font-medium">{delivery.area}</p></div>
                            <div><p className="text-muted-foreground">Date &amp; Time</p><p className="font-medium">{delivery.dateTime}</p></div>
                          </div>
                          {delivery.note ? (
                            <div className="mt-4"><p className="text-muted-foreground">Delivery Note</p><p className="font-medium">{delivery.note}</p></div>
                          ) : null}
                          <Table className="mt-4 min-w-100 text-xs">
                            <TableHeader>
                              <TableRow className="hover:bg-transparent">
                                <TableHead className="px-0">Product</TableHead>
                                <TableHead className="text-right">Quantity Delivered</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {delivery.products.map((product) => (
                                <TableRow key={product.sku} className="hover:bg-white">
                                  <TableCell className="px-0 font-medium">{product.name}</TableCell>
                                  <TableCell className="text-right tabular-nums">{product.quantity}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </section>
  );
}

export default DeliveryHistoryTable;
