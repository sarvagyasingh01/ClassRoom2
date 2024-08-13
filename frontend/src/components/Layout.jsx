import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const Layout = ({authType}) => {
  return (
    <div className="flex">
      <Sidebar authType={authType} />
      <div className="content flex-1 p-8 bg-[#E4F0F1]">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
