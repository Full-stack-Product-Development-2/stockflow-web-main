import * as Pages from "@/pages";
import { RouteAccess, UserRole } from "@/data/access";

export const routes = [
  // Auth
  {
    title: "Login",
    route: "/login",
    page: <Pages.Login />,
    access: RouteAccess.PUBLIC,
  },
  {
    title: "Sign up",
    route: "/sign-up",
    page: <Pages.SignUp />,
    access: RouteAccess.PUBLIC,
  },
  {
    title: "Home",
    route: "/",
    page: <Pages.AuthContinue />,
    access: RouteAccess.PROTECTED,
  },
  {
    title: "Access pending",
    route: "/access-pending",
    page: <Pages.AccessPending />,
    access: RouteAccess.PROTECTED,
  },
  {
    title: "Access denied",
    route: "/access-denied",
    page: <Pages.AccessDenied />,
    access: RouteAccess.PROTECTED,
  },

  // Stock Manager
  {
    title: "Stock Summary",
    route: "/stock-summary",
    page: <Pages.StockSummary />,
    access: RouteAccess.PROTECTED,
    allowedRole: UserRole.STOCK_MANAGER,
  },
  {
    title: "Stock Requests",
    route: "/stock-requests",
    page: <Pages.StockRequests />,
    access: RouteAccess.PROTECTED,
    allowedRole: UserRole.STOCK_MANAGER,
  },
  {
    title: "Distribution Runs",
    route: "/distribution-runs",
    page: <Pages.DistributionRuns />,
    access: RouteAccess.PROTECTED,
    allowedRole: UserRole.STOCK_MANAGER,
  },
  {
    title: "Return Approvals",
    route: "/return-approvals",
    page: <Pages.ReturnApprovals />,
    access: RouteAccess.PROTECTED,
    allowedRole: UserRole.STOCK_MANAGER,
  },

  // FDO
  {
    title: "Stock Requests",
    route: "/fdo",
    page: <Pages.FDOStockRequests />,
    access: RouteAccess.PROTECTED,
    allowedRole: UserRole.FDO,
  },
  {
    title: "Stock Requests",
    route: "/fdo/stock-requests",
    page: <Pages.FDOStockRequests />,
    access: RouteAccess.PROTECTED,
    allowedRole: UserRole.FDO,
  },
  {
    title: "Distributions",
    route: "/fdo/distributions",
    page: <Pages.FDODistributions />,
    access: RouteAccess.PROTECTED,
    allowedRole: UserRole.FDO,
  },
  {
    title: "Run History",
    route: "/fdo/run-history",
    page: <Pages.FDORunHistory />,
    access: RouteAccess.PROTECTED,
    allowedRole: UserRole.FDO,
  },
];
