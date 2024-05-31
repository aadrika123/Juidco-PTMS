import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
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

function App() {
  const [access_token, set_access_token] = useState("");
  const [userType, set_userType] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    //const token = Cookies.get("accesstoken");
    const token = localStorage.getItem("token");
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
      Cookies.remove("accesstoken");
      Cookies.remove("user_details");
    }

    setLoading(false);
  }, []);

  const handleClose = () => {
    setOpen(false);
    localStorage.clear();
    window.location.href = "/ptms"; // Assuming there's a login route
  };

  if (loading) {
    return (
      <div className="flex flex-1 justify-center items-center h-screen">
        <Lottie animationData={img} loop={true} className="w-60 h-60" />
      </div>
    );
  }

  return (
    <>
      <Router basename="/ptms">
        <AppRoutes access_token={access_token} userType={userType} />
      </Router>
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
