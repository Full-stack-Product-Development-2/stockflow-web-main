import { UserButton } from "@clerk/react";
import { useLocation } from "react-router-dom";

import { routes } from "@/data/routes";

function TopNav() {
  const { pathname } = useLocation();
  const pageTitle = routes.find(({ route }) => route === pathname)?.title;

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center gap-2 border-b bg-background px-3 sm:px-6">
      <h1 className="min-w-0 truncate font-semibold text-foreground">{pageTitle}</h1>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <UserButton />
      </div>
    </header>
  );
}

export default TopNav;
