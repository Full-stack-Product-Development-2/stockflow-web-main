import { DetailField, RequestProductTable } from "../shared/RequestDetailParts";

function HistoryRequestDetails({ request }) {
  const isRejected = request.status === "rejected";

  return (
    <div className="space-y-4 border-b bg-background px-6 py-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DetailField label="FDO">{request.fdo}</DetailField>
        <DetailField label="Warehouse">{request.warehouse}</DetailField>
        <DetailField label="Route">{request.route}</DetailField>
        <DetailField label="Decision Date">{request.decisionDate}</DetailField>
        {isRejected ? (
          <>
            <DetailField label="Rejected By">{request.rejectedBy}</DetailField>
            <DetailField label="Rejection Reason" className="sm:col-span-2 lg:col-span-3">
              <span className="text-red-600">{request.rejectionReason}</span>
            </DetailField>
          </>
        ) : (
          <DetailField label="Distribution Run">
            <span className="text-[#e94713]">{request.distributionRun}</span>
          </DetailField>
        )}
      </div>

      <RequestProductTable products={request.products} />

      {isRejected ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-700">
          <p className="font-semibold">This request was rejected and cannot be reopened.</p>
          <p className="mt-1">
            The Field Distribution Officer must submit a completely new request.
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default HistoryRequestDetails;
