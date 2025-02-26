import React, { useRef, useState } from "react";
import Header from "../Header/Header";
import AccountantSidebar from "./AccountantSidebar";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";

import "react-datepicker/dist/react-datepicker.css";

export default function AccountantDashboard({ children }) {
  const [hide, setHide] = useState(false);

  return (
    <>
      <Header hide={hide} set_hide={setHide} heading={"Urban Transport"} />
      <div className="flex flex-1 flex-row h-[90vh]">
        <div className={`${hide ? "hidden" : "flex"}`}>
          <AccountantSidebar />
        </div>
        <div className="bg-gray-50 w-screen">{children}</div>
      </div>
    </>
  );
}
