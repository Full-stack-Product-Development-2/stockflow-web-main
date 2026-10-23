import {
  ClipboardList,
  History,
  Truck,
} from "lucide-react";

export const sidebarNavFDO = [
  {
    label: "Stock Requests",
    icon: ClipboardList,
    to: "/fdo/stock-requests",
    activePaths: ["/fdo", "/fdo/stock-requests"],
  },
  {
    label: "Distributions",
    icon: Truck,
    to: "/fdo/distributions",
  },
  {
    label: "Run History",
    icon: History,
    to: "/fdo/run-history",
  },
];

export const sidebarHeaderFDO = {
  title: "StockFlow",
  subtitle: "FDO Portal",
};
