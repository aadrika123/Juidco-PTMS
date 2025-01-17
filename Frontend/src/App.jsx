import React, { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Cookies from "js-cookie";
import AppRoutes from "./Routes/AppRoutes";
import img from "./assets/loader.json";
import Lottie from "lottie-react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import Jhar from "./assets/jhant.png";
import { Image } from "@mui/icons-material";
import useModulePermission from "./Components/common/Hooks/useModulePermission";
import { UseServiceCheck } from "./Components/common/Hooks/UseServiceCheck";
import ServiceRestrictionLayout from "./Components/pages/error/ServiceRestrictionLayout";

function App() {
  UseServiceCheck();
  useModulePermission();
  const [access_token, set_access_token] = useState("");
  const [userType, set_userType] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  // console.log("123");

  const token = localStorage.getItem("token");

  useEffect(() => {
    //const token = Cookies.get("accesstoken");
    if (token && token !== "undefined") {
      const userDetails = Cookies.get("user_details");
      const userType = localStorage.getItem("userType");
      if (userType) {
        set_userType(userType);
      }
      set_access_token(token);
    } else if (token && token == "undefined") {
      setOpen(true);
      localStorage.clear();
      //Cookies.remove("accesstoken");
      //Cookies.remove("user_details");
    }

    setLoading(false);
  }, []);

  const handleClose = () => {
    setOpen(false);
    window.location.href = "/ptms"; // Assuming there's a login route
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen  bg-opacity-50 ">
        <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-[#007335]"></div>
        <img src={Jhar} alt="jhar" className="rounded-full h-28 w-28" />
      </div>
    );
  }

  return (
    <>
      {/* <Routes> */}

      <AppRoutes access_token={access_token} userType={userType} />
      {/* </Routes> */}

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Session Expired"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Your session has expired. Please log in again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default App;
