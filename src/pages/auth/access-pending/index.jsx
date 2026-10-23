import { useState } from "react";
import { useUser } from "@clerk/react";
import { Navigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { homeByRole } from "@/data/access";
import AccessMessage from "../com/AccessMessage";

function AccessPending() {
  const { user } = useUser();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const home = homeByRole[user?.publicMetadata?.role];

  if (home) return <Navigate to={home} replace />;

  async function refreshAccess() {
    setIsRefreshing(true);
    setError("");
    try {
      await user.reload();
    } catch {
      setError("Could not refresh your access. Please try again.");
    } finally {
      setIsRefreshing(false);
    }
  }

  return (
    <AccessMessage title="Access pending">
      <p className="text-sm text-muted-foreground">
        Your account is ready. A StockFlow administrator needs to assign your
        role before you can use the app.
      </p>
      <Button onClick={refreshAccess} disabled={isRefreshing}>
        {isRefreshing ? "Checking..." : "Check access again"}
      </Button>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </AccessMessage>
  );
}

export default AccessPending;
