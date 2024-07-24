// ProtectedApproute.js
import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedApproute = ({ element: Component }) => {
  const token = Cookies.get("accesstoken");

  return token ? <Component /> : <Navigate to="/" />;
};

export default ProtectedApproute;
