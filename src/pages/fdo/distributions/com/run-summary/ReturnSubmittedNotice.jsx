function ReturnSubmittedNotice({ submittedAt }) {
  return (
    <div className="rounded-xl border border-violet-200 bg-white px-4 py-4 text-sm text-violet-800">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-md border border-violet-200 bg-white px-2 py-1 text-xs font-medium text-violet-700">
          Return Submitted
        </span>
        <span className="text-xs text-muted-foreground">Submitted {submittedAt}</span>
      </div>
      <p className="mt-2">Your return is awaiting verification by a Warehouse Manager.</p>
    </div>
  );
}

export default ReturnSubmittedNotice;
