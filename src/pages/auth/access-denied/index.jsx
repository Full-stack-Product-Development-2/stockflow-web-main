import { useUser } from "@clerk/react";
import { Link } from "react-router-dom";

import { buttonVariants } from "@/components/ui/button";
import { homeByRole } from "@/data/access";
import AccessMessage from "../com/AccessMessage";

function AccessDenied() {
  const { user } = useUser();
  const home = homeByRole[user?.publicMetadata?.role];

  return (
    <AccessMessage title="Access denied">
      <p className="text-sm text-muted-foreground">
        Your account does not have permission to view that page.
      </p>
      {home ? (
        <Link to={home} className={buttonVariants({ variant: "default" })}>
          Go to your section
        </Link>
      ) : null}
    </AccessMessage>
  );
}

export default AccessDenied;
