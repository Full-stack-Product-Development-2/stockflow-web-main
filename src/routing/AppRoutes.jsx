import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useUser } from "@clerk/react";

import { routes } from "@/data/routes";
import { getRouteDecision } from "@/data/access";

function RouteGate({ access, allowedRole, children }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const location = useLocation();

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center" role="status">
        Loading account...
      </div>
    );
  }

  const decision = getRouteDecision({
    access,
    allowedRole,
    isSignedIn,
    role: user?.publicMetadata?.role,
  });

  if (decision === "sign-in") {
    const requestedPath = `${location.pathname}${location.search}${location.hash}`;
    return (
      <Navigate
        to={`/login?redirect_url=${encodeURIComponent(requestedPath)}`}
        replace
      />
    );
  }

  if (decision === "pending") {
    return <Navigate to="/access-pending" replace />;
  }

  if (decision === "denied") {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {routes.map(({ page, route, access, allowedRole }) => (
        <Route
          key={route}
          path={route}
          element={
            <RouteGate access={access} allowedRole={allowedRole}>
              {page}
            </RouteGate>
          }
        />
      ))}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
