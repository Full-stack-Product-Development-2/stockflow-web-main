import React from "react";

import Topnav from "../components/top-nav/TopNav";
import Sidebar from "../components/sidebar/Sidebar";

import { sidebarNavSM, sidebarHeaderSM } from "@/data/sidebar/sidebar_nav_sm";

function SMLayout({ children }) {
  return (
    <div className="flex flex-row min-h-screen">
      <Sidebar nav={sidebarNavSM} header={sidebarHeaderSM} />

      <div className="flex-1 bg-gray-100">
        <Topnav />

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export default SMLayout;
