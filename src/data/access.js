export const UserRole = Object.freeze({
  STOCK_MANAGER: "stock-manager",
  FDO: "fdo",
});

export const RouteAccess = Object.freeze({
  PUBLIC: "public",
  PROTECTED: "protected",
});

export const homeByRole = Object.freeze({
  [UserRole.STOCK_MANAGER]: "/stock-summary",
  [UserRole.FDO]: "/fdo/stock-requests",
});

export function getRouteDecision({ access, allowedRole, isSignedIn, role }) {
  if (access === RouteAccess.PUBLIC) return "allow";
  if (!isSignedIn) return "sign-in";
  if (import.meta.env.VITE_BYPASS_ROLES === "true") return "allow";
  if (!allowedRole) return "allow";
  if (!homeByRole[role]) return "pending";
  return role === allowedRole ? "allow" : "denied";
}
