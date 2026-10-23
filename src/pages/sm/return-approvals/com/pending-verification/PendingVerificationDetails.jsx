import { useMemo, useState } from "react";
import { CircleCheck, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

import ReturnDetailField from "../shared/ReturnDetailField";
import RevisionRequestForm from "./RevisionRequestForm";

function PendingVerificationDetails({ approval }) {
  const [verifiedReturns, setVerifiedReturns] = useState(() =>
    Object.fromEntries(
      approval.products.map((product) => [product.name, product.declaredReturn]),
    ),
  );
  const [verificationNote, setVerificationNote] = useState("");
  const [isRequestingRevision, setIsRequestingRevision] = useState(false);

  const totals = useMemo(
    () =>
      approval.products.reduce(
        (result, product) => {
          const verified = Number(verifiedReturns[product.name] ?? 0);

          return {
            expected: result.expected + product.expectedReturn,
            verified: result.verified + verified,
            variance: result.variance + Math.abs(product.expectedReturn - verified),
          };
        },
        { expected: 0, verified: 0, variance: 0 },
      ),
    [approval.products, verifiedReturns],
  );

  function updateVerifiedReturn(productName, value) {
    setVerifiedReturns((currentValues) => ({
      ...currentValues,
      [productName]: value,
    }));
  }

  return (
    <div className="space-y-4 border-b bg-background px-6 py-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ReturnDetailField label="FDO">{approval.fdo}</ReturnDetailField>
        <ReturnDetailField label="Warehouse">{approval.warehouse}</ReturnDetailField>
        <ReturnDetailField label="Route">{approval.route}</ReturnDetailField>
        <ReturnDetailField label="Return Submitted">{approval.submittedAt}</ReturnDetailField>
        <ReturnDetailField label="FDO Note" className="sm:col-span-2 lg:col-span-4">
          <span className="italic">{approval.note}</span>
        </ReturnDetailField>
      </div>

      <div>
        <p className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground">
          RETURN VERIFICATION
        </p>
        <Table className="table-fixed text-xs [&_td]:whitespace-normal [&_th]:whitespace-normal">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[23%] px-0">Product</TableHead>
              <TableHead className="w-[10%] text-right">Issued</TableHead>
              <TableHead className="w-[11%] text-right">Delivered</TableHead>
              <TableHead className="w-[14%] text-right leading-tight">Expected Return</TableHead>
              <TableHead className="w-[14%] text-right leading-tight">FDO Declared</TableHead>
              <TableHead className="w-[17%] text-right leading-tight">Manager Verified</TableHead>
              <TableHead className="w-[11%] pr-0 text-right">Variance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {approval.products.map((product) => {
              const verified = Number(verifiedReturns[product.name] ?? 0);
              const variance = Math.abs(product.expectedReturn - verified);

              return (
                <TableRow key={product.name} className="hover:bg-transparent">
                  <TableCell className="px-0 font-medium">{product.name}</TableCell>
                  <TableCell className="text-right tabular-nums">{product.issued}</TableCell>
                  <TableCell className="text-right tabular-nums">{product.delivered}</TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">
                    {product.expectedReturn}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground tabular-nums">
                    {product.declaredReturn}
                  </TableCell>
                  <TableCell className="text-right">
                    <Input
                      type="number"
                      min="0"
                      max={product.expectedReturn}
                      value={verifiedReturns[product.name]}
                      aria-label={`Manager verified return for ${product.name}`}
                      className="ml-auto h-8 w-20 text-center tabular-nums"
                      onChange={(event) =>
                        updateVerifiedReturn(product.name, event.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell
                    className={`pr-0 text-right font-medium tabular-nums ${
                      variance > 0 ? "text-red-600" : "text-emerald-600"
                    }`}
                  >
                    {variance}
                  </TableCell>
                </TableRow>
              );
            })}
            <TableRow className="border-t-2 hover:bg-transparent">
              <TableCell className="px-0 font-semibold">Totals</TableCell>
              <TableCell colSpan={2} />
              <TableCell className="text-right font-semibold tabular-nums">
                {totals.expected}
              </TableCell>
              <TableCell />
              <TableCell className="text-right font-semibold tabular-nums">
                {totals.verified}
              </TableCell>
              <TableCell
                className={`pr-0 text-right font-semibold tabular-nums ${
                  totals.variance > 0 ? "text-red-600" : "text-emerald-600"
                }`}
              >
                {totals.variance}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {totals.variance > 0 ? (
        <>
          <div className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-3 text-xs text-amber-800">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" />
            <div>
              <p className="font-semibold">Variance of {totals.variance} units detected</p>
              <p className="mt-0.5">A verification note is required before accepting this return.</p>
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor={`verification-note-${approval.id}`}>
              Verification Note <span className="text-red-600">*</span>
            </Label>
            <Textarea
              id={`verification-note-${approval.id}`}
              value={verificationNote}
              onChange={(event) => setVerificationNote(event.target.value)}
              placeholder="Describe the variance or add any observations..."
              rows={3}
              required
            />
          </div>
        </>
      ) : null}

      {isRequestingRevision ? (
        <RevisionRequestForm
          approvalId={approval.id}
          onCancel={() => setIsRequestingRevision(false)}
          onSubmit={() => setIsRequestingRevision(false)}
        />
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          Receiving <strong className="text-foreground">{totals.verified} units</strong> back
          to <strong className="text-foreground">{approval.warehouse}</strong>
          {totals.variance > 0 ? (
            <span className="text-red-600"> with a variance of {totals.variance} units</span>
          ) : null}
        </p>
        <div className="flex flex-wrap gap-2">
          {!isRequestingRevision ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsRequestingRevision(true)}
            >
              Request Revision
            </Button>
          ) : null}
          <Button
            type="button"
            size="sm"
            disabled={totals.variance > 0 && !verificationNote.trim()}
            className="bg-[#f25522] text-white hover:bg-[#dd4617]"
          >
            <CircleCheck />
            Accept Return and Close Run
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PendingVerificationDetails;
