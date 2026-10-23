import {
  BarChart3,
  ClipboardList,
  PackageCheck,
  RotateCcw,
} from "lucide-react";

export const sidebarNavSM = [
  {
    label: "Stock Summary",
    icon: BarChart3,
    to: "/stock-summary",
    activePaths: ["/", "/stock-summary"],
  },
  {
    label: "Stock Requests",
    icon: ClipboardList,
    badge: 3,
    to: "/stock-requests",
  },
  { label: "Distribution Runs", icon: PackageCheck, to: "/distribution-runs" },
  {
    label: "Return Approvals",
    icon: RotateCcw,
    badge: 2,
    to: "/return-approvals",
  },
];

export const sidebarHeaderSM = {
  title: "StockFlow",
  subtitle: "Distribution System",
};

