// ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ element: Element, ...rest }) => {
  const token = Cookies.get("accesstoken");

  return token ? <Element {...rest} /> : <Navigate to="/" />;
};

export default ProtectedRoute;
