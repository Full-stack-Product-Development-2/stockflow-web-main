import { Badge } from "@/components/ui/badge";


const statusConfig = {
  pending: { label: "Pending", className: "border-amber-200 bg-amber-50 text-amber-700" },
  "allocation-ready": { label: "Allocation Ready", className: "border-blue-200 bg-blue-50 text-blue-700" },
  approved: { label: "Approved", className: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  rejected: { label: "Rejected", className: "border-red-200 bg-red-50 text-red-700" },
  "awaiting-collection": {
    label: "Awaiting Collection",
    className: "border-amber-300 bg-amber-50 text-amber-700",
  },
  "in-progress": {
    label: "In Progress",
    className: "border-amber-300 bg-amber-50 text-amber-700",
  },
  "return-submitted": {
    label: "Return Submitted",
    className: "border-violet-200 bg-violet-50 text-violet-700",
  },
  closed: { label: "Closed", className: "border-slate-200 bg-slate-50 text-slate-600" },
};

function StatusBadge({ status }) {
  if (!status) return <span className="text-muted-foreground">—</span>;

  const { label, className } = statusConfig[status];

  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  );
}

export default StatusBadge;
