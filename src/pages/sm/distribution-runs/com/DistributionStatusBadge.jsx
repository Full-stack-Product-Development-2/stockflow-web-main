import { Badge } from "@/components/ui/badge";

const statusConfig = {
  "awaiting-collection": {
    label: "Awaiting Collection",
    className: "border-amber-300 bg-amber-50 text-amber-700",
  },
  "stock-received": {
    label: "Stock Received",
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },
  "in-progress": {
    label: "In Progress",
    className: "border-cyan-200 bg-cyan-50 text-cyan-700",
  },
  "return-submitted": {
    label: "Return Submitted",
    className: "border-purple-200 bg-purple-50 text-purple-700",
  },
  closed: {
    label: "Closed",
    className: "border-slate-200 bg-slate-100 text-slate-700",
  },
};

function DistributionStatusBadge({ status }) {
  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}

export default DistributionStatusBadge;
