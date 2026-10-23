import React from "react";

import { SidebarHeader, SidebarNav, SidebarProfile } from "./com";

function Sidebar({ nav, header }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex w-full border-t border-border bg-background md:sticky md:inset-x-auto md:top-0 md:bottom-auto md:h-screen md:w-60 md:flex-col md:border-t-0 md:border-r">
      <SidebarHeader header={header} />
      <SidebarNav items={nav} />
      <SidebarProfile />
    </div>
  );
}

export default Sidebar;
