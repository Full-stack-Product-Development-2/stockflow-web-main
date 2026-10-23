import React from "react";

import Topnav from "../components/top-nav/TopNav";
import Sidebar from "../components/sidebar/Sidebar";

import {
  sidebarNavFDO,
  sidebarHeaderFDO,
} from "@/data/sidebar/sidebar_nav_fdo";

function FDOLayout({ children }) {
  return (
    <div className="flex flex-row min-h-screen">
      <Sidebar nav={sidebarNavFDO} header={sidebarHeaderFDO} />

      <div className="flex-1 bg-gray-100">
        <Topnav />

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export default FDOLayout;
