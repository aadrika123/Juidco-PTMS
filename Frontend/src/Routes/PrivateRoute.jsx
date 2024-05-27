import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import Header from "../Components/Header/Header";
import Sidebar from "../Components/Dashboard/Sidebar";

const PrivateRoute = ({ element: Component }) => {
  const token = Cookies.get("accesstoken");
  const [hide, setHide] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Event listener to detect window resize
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return token ? (
    <>
      {isMobile ? (
        <div className="fixed inset-0 flex items-center justify-center bg-[#665DD9]  text-white text-center p-4">
          <div>
            <h1 className="text-2xl font-bold">Not Supported</h1>
            <p className="mt-2">
              This website is not optimized for mobile phones. Please open it on
              a desktop.
            </p>
          </div>
        </div>
      ) : (
        <>
          <Header hide={hide} set_hide={setHide} heading={"Urban Transport"} />
          <div className="flex flex-1 flex-row h-[90vh] mt-2">
            <div className={`${hide ? "hidden" : "flex"} w-3/12`}>
              <Sidebar />
            </div>
            <Component />
          </div>
        </>
      )}
    </>
  ) : (
    <Navigate to="/" />
  );
};

export default PrivateRoute;
