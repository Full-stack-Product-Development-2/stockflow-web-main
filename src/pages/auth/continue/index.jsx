import { useUser } from "@clerk/react";
import { homeByRole } from "@/data/access";
import { Navigate } from "react-router-dom";

function Continue() {
  const { user } = useUser();

  const home = homeByRole[user?.publicMetadata?.role];

  return <Navigate to={home} replace />;
  //   return <Navigate to={home || "/access-pending"} replace />;
}

export default Continue;
