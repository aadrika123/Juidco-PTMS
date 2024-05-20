import React, { useEffect, useState } from "react";
import bus from "../../../assets/bus 1.png";
import busstop from "../../../assets/bus-stop.png";
import Avatar from "@mui/material/Avatar";
import sample_profile from "../../../assets/sample_profile.png";

import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Scheduled_Table from "../../Tables/Scheduled_Table";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  FormControlLabel,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
//import { DatePicker } from "@material-ui/pickers";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

export default function ReportGeneration_main() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  console.log(location);

  const initialValues = {
    reportType: "",
    id: "",
    fromDate: "",
    toDate: "",
  };

  const validationSchema = Yup.object({
    reportType: Yup.string().required("Report type is required"),
    id: Yup.string().required("ID is required"),
    fromDate: Yup.string(),
    toDate: Yup.string(),
  });

  const [report, set_report] = useState({});
  const [bus_report, set_bus_report] = useState({});
  const [filterValues, set_filterValues] = useState({});
  const [report_type, set_report_type] = useState("");
  const [total_collection, set_total_collection] = useState();
  const [bus_total_collection, set_bus_total_collection] = useState();

  const [conductor_details, set_conductor_details] = useState();
  const [bus_details, set_bus_details] = useState();
  const [openDialog, setOpenDialog] = React.useState(false); // State to control dialog

  console.log("report state >>> ", report);
  console.log("Total state >>", total_collection);
  console.log(conductor_details);

  const handle_logOut = () => {
    console.log("Log out");
    Cookies.remove("accesstoken", { path: "/" });
    sessionStorage.clear();
    navigate("/");
    window.location.reload();
  };

  const onSubmit = async (values) => {
    set_filterValues(values);
    set_report_type(values.reportType);
    if (values.reportType === "conductor") {
      await axios
        .get(
          `${process.env.REACT_APP_BASE_URL}/getAllConductorsList?id=${values.id}&limit=10&page=1`
        )
        .then((response) => {
          console.log(response.data.data);
          set_conductor_details(response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });

      await axios
        .post(`${process.env.REACT_APP_BASE_URL}/report/bus-daywise/total`, {
          conductor_id: values.id,
        })
        .then((response) => {
          console.log("Total >>>>>>  ", response.data.data);
          set_total_collection(response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });

      await axios
        .post(`${process.env.REACT_APP_BASE_URL}/report/bus-daywise`, {
          conductor_id: values.id,
          from_date: values.fromDate,
          to_date: values.toDate,
        })
        .then((response) => {
          console.log("Report data >>>", response.data);
          set_report(response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (values.reportType === "bus") {
      await axios
        .post(`${process.env.REACT_APP_BASE_URL}/report/bus-daywise/total`, {
          bus_id: values.id,
        })
        .then((response) => {
          console.log("Bus Total >>>>>>  ", response.data.data);
          set_bus_total_collection(response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });

      await axios
        .get(
          `${process.env.REACT_APP_BASE_URL}/getAllBusList?id=${values.id}&limit=10&page=1`
        )
        .then((response) => {
          console.log("Bus details", response.data.data);
          set_bus_details(response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });

      await axios
        .post(`${process.env.REACT_APP_BASE_URL}/report/bus-daywise`, {
          bus_id: values.id,
          from_date: values.fromDate,
          to_date: values.toDate,
        })
        .then((response) => {
          console.log(response.data);
          set_bus_report(response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      return window.alert("Please select the Report Type");
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex flex-1 flex-col justify-between bg-white">
      <div className="flex flex-col md:flex-row justify-between h-[350px] md:h-20 bg-white rounded-b-[30px] md:border-0 md:rounded-none border-b-[3px] md:border-l-0 border-r-0 shadow-md border-t-0">
        <div
          style={{ flex: 2 }}
          className="flex justify-center md:justify-start items-center"
        >
          <div className="flex flex-row justify-start items-center md:ml-10">
            <div className="flex text-xl text-[#555555] font-bold">UD & HD</div>
            <div className="flex ml-2">
              <svg
                width="28"
                height="19"
                viewBox="0 0 28 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.79957 3.82265V0.0581055H27.6723V3.82265H6.79957ZM6.79957 11.3517V7.5872H27.6723V11.3517H6.79957ZM6.79957 18.8808V15.1163H27.6723V18.8808H6.79957ZM2.32685 3.82265C1.90442 3.82265 1.55058 3.64195 1.26532 3.28056C0.980059 2.91916 0.836931 2.47243 0.835938 1.94038C0.835938 1.40707 0.979065 0.960342 1.26532 0.6002C1.55157 0.240059 1.90542 0.0593603 2.32685 0.0581055C2.74927 0.0581055 3.10361 0.238804 3.38986 0.6002C3.67612 0.961597 3.81875 1.40832 3.81776 1.94038C3.81776 2.47369 3.67463 2.92104 3.38837 3.28244C3.10212 3.64384 2.74828 3.82391 2.32685 3.82265ZM2.32685 11.3517C1.90442 11.3517 1.55058 11.171 1.26532 10.8096C0.980059 10.4483 0.836931 10.0015 0.835938 9.46947C0.835938 8.93616 0.979065 8.48943 1.26532 8.12929C1.55157 7.76915 1.90542 7.58845 2.32685 7.5872C2.74927 7.5872 3.10361 7.76789 3.38986 8.12929C3.67612 8.49069 3.81875 8.93741 3.81776 9.46947C3.81776 10.0028 3.67463 10.4501 3.38837 10.8115C3.10212 11.1729 2.74828 11.353 2.32685 11.3517ZM2.32685 18.8808C1.90442 18.8808 1.55058 18.7001 1.26532 18.3387C0.980059 17.9773 0.836931 17.5306 0.835938 16.9986C0.835938 16.4653 0.979065 16.0185 1.26532 15.6584C1.55157 15.2982 1.90542 15.1175 2.32685 15.1163C2.74927 15.1163 3.10361 15.297 3.38986 15.6584C3.67612 16.0198 3.81875 16.4665 3.81776 16.9986C3.81776 17.5319 3.67463 17.9792 3.38837 18.3406C3.10212 18.702 2.74828 18.8821 2.32685 18.8808Z"
                  fill="#555555"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex flex-1 justify-center md:justify-end items-center ">
          <div className="flex md:mr-10">
            <div className="flex flex-col md:flex-row flex-1 justify-center items-end">
              <div className="flex flex-row ">
                <h1 className="flex justify-center items-center text-xl md:text-xl text-[#322F2F] font-semibold  ">
                  Change Scheduling
                </h1>
                <img
                  src={bus}
                  alt="Bus"
                  className="ml-2 max-w-full h-auto md:h-8"
                />
              </div>
              <div
                onClick={handle_logOut}
                className="flex cursor-pointer h-10 w-10 rounded-xl shadow-md justify-center items-center bg-[#5457D6] ml-4"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 17 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.59143 12.5274H3.75852C3.83821 12.5274 3.91291 12.5622 3.96272 12.6237C4.07893 12.7648 4.20344 12.9009 4.33459 13.0304C4.871 13.5673 5.50638 13.9952 6.20559 14.2905C6.92999 14.5964 7.70858 14.7534 8.49494 14.752C9.29016 14.752 10.0605 14.5959 10.7843 14.2905C11.4835 13.9952 12.1189 13.5673 12.6553 13.0304C13.1927 12.4953 13.6211 11.861 13.917 11.1627C14.2241 10.4389 14.3785 9.67024 14.3785 8.87503C14.3785 8.07981 14.2225 7.31116 13.917 6.58733C13.6215 5.8884 13.1965 5.2592 12.6553 4.71965C12.1141 4.1801 11.4849 3.7551 10.7843 3.4596C10.0605 3.15413 9.29016 2.99807 8.49494 2.99807C7.69973 2.99807 6.92942 3.15247 6.20559 3.4596C5.505 3.7551 4.8758 4.1801 4.33459 4.71965C4.20344 4.85081 4.08059 4.98694 3.96272 5.12639C3.91291 5.18782 3.83654 5.22268 3.75852 5.22268H2.59143C2.48684 5.22268 2.42209 5.10647 2.4802 5.01848C3.75354 3.03958 5.98147 1.72971 8.51321 1.73635C12.4909 1.74631 15.6801 4.97532 15.6403 8.94807C15.6004 12.8577 12.4162 16.0137 8.49494 16.0137C5.96984 16.0137 3.75188 14.7055 2.4802 12.7316C2.42375 12.6436 2.48684 12.5274 2.59143 12.5274ZM1.11555 8.77044L3.47131 6.91106C3.5593 6.84133 3.68713 6.90442 3.68713 7.01565V8.27737H8.90002C8.97307 8.27737 9.03283 8.33713 9.03283 8.41018V9.33987C9.03283 9.41292 8.97307 9.47268 8.90002 9.47268H3.68713V10.7344C3.68713 10.8456 3.55764 10.9087 3.47131 10.839L1.11555 8.97962C1.09967 8.96719 1.08684 8.95132 1.07801 8.9332C1.06918 8.91508 1.06459 8.89518 1.06459 8.87503C1.06459 8.85487 1.06918 8.83497 1.07801 8.81685C1.08684 8.79873 1.09967 8.78286 1.11555 8.77044Z"
                    fill="white"
                  />
                </svg>
              </div>
              <div className="flex h-10 w-10 justify-center items-center  rounded-xl shadow-md bg-[#5457D6] ml-4">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 12 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 15.8909C6.825 15.8909 7.5 15.1814 7.5 14.3142H4.5C4.5 15.1814 5.1675 15.8909 6 15.8909ZM10.5 11.1607V7.21877C10.5 4.79846 9.27 2.77233 7.125 2.23624V1.70014C7.125 1.04579 6.6225 0.517578 6 0.517578C5.3775 0.517578 4.875 1.04579 4.875 1.70014V2.23624C2.7225 2.77233 1.5 4.79058 1.5 7.21877V11.1607L0 12.7374V13.5258H12V12.7374L10.5 11.1607Z"
                    fill="white"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-1 ">
        <div className="hidden md:flex w-[20%] justify-center items-start bg-white">
          <div className="flex flex-1 ">
            <div className="flex flex-1 flex-col justify-center items-center">
              <div className="flex flex-1 mt-8 justify-center">
                <Avatar src={sample_profile} sx={{ width: 100, height: 100 }} />
              </div>
              <div className="flex flex-1 text-2xl text-[#555555] font-bold">
                RMC Admin
              </div>
              <div className="flex flex-col w-[80%] m-10 justify-start items-start">
                <div
                  className={`flex h-[50px] justify-center items-center rounded-md  ${
                    path == "/Bus-onboarding"
                      ? "bg-[#5457D6] text-white"
                      : "bg-white "
                  } hover:text-white hover:bg-[#5457D6] cursor-pointer w-[80%] mt-4 mb-4 `}
                >
                  <Link className="flex flex-1" to="/Bus-onboarding">
                    <div className="flex w-full justify-between">
                      <div className="flex w-fit">
                        <div className="h-10 w-10 bg-[#5457D6] flex rounded-md justify-center items-center">
                          <div className="flex">
                            <svg
                              width="26"
                              height="26"
                              viewBox="0 0 15 13"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="text-white group-hover:text-[#5457D6]"
                            >
                              <path
                                d="M13.75 12.125V5.00625C13.75 4.18 13.75 3.76625 13.535 3.44625C13.32 3.12625 12.9394 2.9725 12.1787 2.665L8.42875 1.1525C7.97 0.9675 7.74125 0.875 7.5 0.875C7.25875 0.875 7.03 0.9675 6.57125 1.1525L2.82125 2.665C2.06062 2.9725 1.68 3.12625 1.465 3.44625C1.25 3.76625 1.25 4.18 1.25 5.00625V12.125M10 10.875V12.125M5 10.875V12.125"
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M4.6875 7.75L4.83938 7.14375C5.06625 6.23437 5.18 5.77937 5.51938 5.515C5.85813 5.25 6.32688 5.25 7.26438 5.25H7.73562C8.67312 5.25 9.14187 5.25 9.48062 5.515C9.82 5.77937 9.93375 6.23375 10.1606 7.14375L10.3125 7.75M5.3125 9.30625V9.3125M9.6875 9.30625V9.3125M10.625 7.75H4.375C4.20924 7.75 4.05027 7.81585 3.93306 7.93306C3.81585 8.05027 3.75 8.20924 3.75 8.375V10.25C3.75 10.4158 3.81585 10.5747 3.93306 10.6919C4.05027 10.8092 4.20924 10.875 4.375 10.875H10.625C10.7908 10.875 10.9497 10.8092 11.0669 10.6919C11.1842 10.5747 11.25 10.4158 11.25 10.25V8.375C11.25 8.20924 11.1842 8.05027 11.0669 7.93306C10.9497 7.81585 10.7908 7.75 10.625 7.75Z"
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-1 ml-4 justify-start items-center text-[#555555] font-semibold text-inherit">
                        Bus Onboarding
                      </div>
                    </div>
                  </Link>
                </div>
                <div
                  className={`flex h-[50px] justify-center items-center rounded-md  ${
                    path == "/Conductor-onboarding"
                      ? "bg-[#5457D6] text-white"
                      : "bg-white "
                  } hover:text-white hover:bg-[#5457D6] cursor-pointer w-[95%] mt-4 mb-4 `}
                >
                  <Link className="flex flex-1" to="/Conductor-onboarding">
                    {" "}
                    <div className="flex w-full justify-between">
                      <div className="flex w-fit">
                        <div className="h-10 w-10 bg-[#5457D6] flex rounded-md justify-center items-center">
                          <div className="flex">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 13 16"
                              fill="none"
                            >
                              <path
                                d="M6.5013 14.6668C6.5013 14.6668 11.8346 10.6668 11.8346 6.3335C11.8346 3.57216 9.44697 1.3335 6.5013 1.3335C3.55564 1.3335 1.16797 3.57216 1.16797 6.3335C1.16797 10.6668 6.5013 14.6668 6.5013 14.6668Z"
                                stroke="white"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M5.5 4.66699V10.0003"
                                stroke="white"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M5.5 4.66699H7.5C7.85362 4.66699 8.19276 4.80747 8.44281 5.05752C8.69286 5.30756 8.83333 5.6467 8.83333 6.00033C8.83333 6.35395 8.69286 6.69309 8.44281 6.94313C8.19276 7.19318 7.85362 7.33366 7.5 7.33366H5.5V4.66699Z"
                                stroke="white"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-1 ml-4 justify-start items-center text-[#555555] font-semibold text-inherit">
                        Conductor Onboarding
                      </div>
                    </div>
                  </Link>
                </div>
                <div
                  className={`flex h-[50px] justify-center items-center rounded-md  ${
                    path == "/ChangeScheduling-Main"
                      ? "bg-[#5457D6] text-white"
                      : "bg-white "
                  } hover:text-white hover:bg-[#5457D6] cursor-pointer w-[95%] mt-4 mb-4 `}
                >
                  <Link to={"/ChangeScheduling-Main"} className="flex flex-1">
                    <div className="flex w-full justify-between">
                      <div className="flex w-fit">
                        <div className="h-10 w-10 bg-[#5457D6] flex rounded-md justify-center items-center">
                          <div className="flex">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 13 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M9.1587 1.39204C9.1587 1.16323 9.2496 0.943785 9.41139 0.781989C9.57319 0.620193 9.79263 0.529297 10.0214 0.529297H11.7469C11.9758 0.529297 12.1952 0.620193 12.357 0.781989C12.5188 0.943785 12.6097 1.16323 12.6097 1.39204V3.98028C12.6097 4.20909 12.5188 4.42853 12.357 4.59033C12.1952 4.75213 11.9758 4.84302 11.7469 4.84302H11.3156V13.0391C11.3156 13.1535 11.2701 13.2632 11.1892 13.3441C11.1083 13.425 10.9986 13.4705 10.8842 13.4705C10.7698 13.4705 10.6601 13.425 10.5792 13.3441C10.4983 13.2632 10.4528 13.1535 10.4528 13.0391V4.84302H10.0214C9.79263 4.84302 9.57319 4.75213 9.41139 4.59033C9.2496 4.42853 9.1587 4.20909 9.1587 3.98028V1.39204ZM8.51164 1.39204H3.72643C3.33383 1.39201 2.95296 1.52586 2.64671 1.7715C2.34045 2.01713 2.12711 2.35986 2.04192 2.7431L1.7667 3.98028H1.394C1.27959 3.98028 1.16987 4.02573 1.08897 4.10662C1.00807 4.18752 0.962623 4.29724 0.962623 4.41165C0.962623 4.52606 1.00807 4.63578 1.08897 4.71668C1.16987 4.79757 1.27959 4.84302 1.394 4.84302H1.57517L1.43282 5.48361C1.16003 5.63186 0.932293 5.85097 0.773619 6.11783C0.614946 6.38469 0.531213 6.68941 0.53125 6.99989V11.3136C0.53125 11.6568 0.667594 11.986 0.910288 12.2287C1.15298 12.4714 1.48215 12.6077 1.82537 12.6077H2.25674C2.59996 12.6077 2.92913 12.4714 3.17182 12.2287C3.41451 11.986 3.55086 11.6568 3.55086 11.3136V10.8822H8.72733V11.3136C8.72723 11.6195 8.83549 11.9156 9.03291 12.1492C9.23033 12.3829 9.50414 12.5391 9.80576 12.59V11.6872C9.74018 11.6493 9.68573 11.5949 9.64787 11.5293C9.61001 11.4637 9.59008 11.3893 9.59007 11.3136V10.8822H9.80576V10.0195H1.394V6.99989C1.394 6.77107 1.48489 6.55163 1.64669 6.38983C1.80848 6.22804 2.02793 6.13714 2.25674 6.13714H9.80576V5.47498C9.60677 5.44624 9.41553 5.37804 9.24325 5.27439H2.36286L2.88396 2.93032C2.92654 2.73873 3.03318 2.5674 3.18627 2.44458C3.33935 2.32177 3.52973 2.25482 3.726 2.25479H8.51164V1.39204ZM1.394 11.3136V10.8822H2.68811V11.3136C2.68811 11.428 2.64266 11.5377 2.56177 11.6186C2.48087 11.6995 2.37115 11.745 2.25674 11.745H1.82537C1.71096 11.745 1.60124 11.6995 1.52034 11.6186C1.43944 11.5377 1.394 11.428 1.394 11.3136ZM4.62929 8.72538C4.62929 8.61097 4.67474 8.50125 4.75564 8.42035C4.83653 8.33945 4.94625 8.294 5.06066 8.294H7.21752C7.33193 8.294 7.44165 8.33945 7.52255 8.42035C7.60345 8.50125 7.6489 8.61097 7.6489 8.72538C7.6489 8.83978 7.60345 8.9495 7.52255 9.0304C7.44165 9.1113 7.33193 9.15675 7.21752 9.15675H5.06066C4.94625 9.15675 4.83653 9.1113 4.75564 9.0304C4.67474 8.9495 4.62929 8.83978 4.62929 8.72538ZM3.33517 8.294C3.50678 8.294 3.67136 8.22583 3.79271 8.10448C3.91406 7.98314 3.98223 7.81855 3.98223 7.64694C3.98223 7.47533 3.91406 7.31075 3.79271 7.1894C3.67136 7.06806 3.50678 6.99989 3.33517 6.99989C3.16356 6.99989 2.99898 7.06806 2.87763 7.1894C2.75628 7.31075 2.68811 7.47533 2.68811 7.64694C2.68811 7.81855 2.75628 7.98314 2.87763 8.10448C2.99898 8.22583 3.16356 8.294 3.33517 8.294ZM9.59007 7.64694C9.59007 7.81855 9.5219 7.98314 9.40055 8.10448C9.27921 8.22583 9.11463 8.294 8.94302 8.294C8.7714 8.294 8.60682 8.22583 8.48548 8.10448C8.36413 7.98314 8.29596 7.81855 8.29596 7.64694C8.29596 7.47533 8.36413 7.31075 8.48548 7.1894C8.60682 7.06806 8.7714 6.99989 8.94302 6.99989C9.11463 6.99989 9.27921 7.06806 9.40055 7.1894C9.5219 7.31075 9.59007 7.47533 9.59007 7.64694Z"
                                fill="white"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-1 ml-4 justify-start items-center text-[#555555] font-semibold text-inherit">
                        Change Scheduling
                      </div>
                    </div>
                  </Link>
                </div>

                <div
                  className={`flex h-[50px] justify-center items-center rounded-md  ${
                    path == "/ReportGeneration-main"
                      ? "bg-[#5457D6] text-white"
                      : "bg-white "
                  } hover:text-white hover:bg-[#5457D6] cursor-pointer w-[95%] mt-4 mb-4 `}
                >
                  <Link to="/ReportGeneration-main" className="flex flex-1">
                    <div className="flex w-full justify-between">
                      <div className="flex w-fit">
                        <div className="h-10 w-10 bg-[#5457D6] flex rounded-md justify-center items-center">
                          <div className="flex">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 13 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M9.1587 1.39204C9.1587 1.16323 9.2496 0.943785 9.41139 0.781989C9.57319 0.620193 9.79263 0.529297 10.0214 0.529297H11.7469C11.9758 0.529297 12.1952 0.620193 12.357 0.781989C12.5188 0.943785 12.6097 1.16323 12.6097 1.39204V3.98028C12.6097 4.20909 12.5188 4.42853 12.357 4.59033C12.1952 4.75213 11.9758 4.84302 11.7469 4.84302H11.3156V13.0391C11.3156 13.1535 11.2701 13.2632 11.1892 13.3441C11.1083 13.425 10.9986 13.4705 10.8842 13.4705C10.7698 13.4705 10.6601 13.425 10.5792 13.3441C10.4983 13.2632 10.4528 13.1535 10.4528 13.0391V4.84302H10.0214C9.79263 4.84302 9.57319 4.75213 9.41139 4.59033C9.2496 4.42853 9.1587 4.20909 9.1587 3.98028V1.39204ZM8.51164 1.39204H3.72643C3.33383 1.39201 2.95296 1.52586 2.64671 1.7715C2.34045 2.01713 2.12711 2.35986 2.04192 2.7431L1.7667 3.98028H1.394C1.27959 3.98028 1.16987 4.02573 1.08897 4.10662C1.00807 4.18752 0.962623 4.29724 0.962623 4.41165C0.962623 4.52606 1.00807 4.63578 1.08897 4.71668C1.16987 4.79757 1.27959 4.84302 1.394 4.84302H1.57517L1.43282 5.48361C1.16003 5.63186 0.932293 5.85097 0.773619 6.11783C0.614946 6.38469 0.531213 6.68941 0.53125 6.99989V11.3136C0.53125 11.6568 0.667594 11.986 0.910288 12.2287C1.15298 12.4714 1.48215 12.6077 1.82537 12.6077H2.25674C2.59996 12.6077 2.92913 12.4714 3.17182 12.2287C3.41451 11.986 3.55086 11.6568 3.55086 11.3136V10.8822H8.72733V11.3136C8.72723 11.6195 8.83549 11.9156 9.03291 12.1492C9.23033 12.3829 9.50414 12.5391 9.80576 12.59V11.6872C9.74018 11.6493 9.68573 11.5949 9.64787 11.5293C9.61001 11.4637 9.59008 11.3893 9.59007 11.3136V10.8822H9.80576V10.0195H1.394V6.99989C1.394 6.77107 1.48489 6.55163 1.64669 6.38983C1.80848 6.22804 2.02793 6.13714 2.25674 6.13714H9.80576V5.47498C9.60677 5.44624 9.41553 5.37804 9.24325 5.27439H2.36286L2.88396 2.93032C2.92654 2.73873 3.03318 2.5674 3.18627 2.44458C3.33935 2.32177 3.52973 2.25482 3.726 2.25479H8.51164V1.39204ZM1.394 11.3136V10.8822H2.68811V11.3136C2.68811 11.428 2.64266 11.5377 2.56177 11.6186C2.48087 11.6995 2.37115 11.745 2.25674 11.745H1.82537C1.71096 11.745 1.60124 11.6995 1.52034 11.6186C1.43944 11.5377 1.394 11.428 1.394 11.3136ZM4.62929 8.72538C4.62929 8.61097 4.67474 8.50125 4.75564 8.42035C4.83653 8.33945 4.94625 8.294 5.06066 8.294H7.21752C7.33193 8.294 7.44165 8.33945 7.52255 8.42035C7.60345 8.50125 7.6489 8.61097 7.6489 8.72538C7.6489 8.83978 7.60345 8.9495 7.52255 9.0304C7.44165 9.1113 7.33193 9.15675 7.21752 9.15675H5.06066C4.94625 9.15675 4.83653 9.1113 4.75564 9.0304C4.67474 8.9495 4.62929 8.83978 4.62929 8.72538ZM3.33517 8.294C3.50678 8.294 3.67136 8.22583 3.79271 8.10448C3.91406 7.98314 3.98223 7.81855 3.98223 7.64694C3.98223 7.47533 3.91406 7.31075 3.79271 7.1894C3.67136 7.06806 3.50678 6.99989 3.33517 6.99989C3.16356 6.99989 2.99898 7.06806 2.87763 7.1894C2.75628 7.31075 2.68811 7.47533 2.68811 7.64694C2.68811 7.81855 2.75628 7.98314 2.87763 8.10448C2.99898 8.22583 3.16356 8.294 3.33517 8.294ZM9.59007 7.64694C9.59007 7.81855 9.5219 7.98314 9.40055 8.10448C9.27921 8.22583 9.11463 8.294 8.94302 8.294C8.7714 8.294 8.60682 8.22583 8.48548 8.10448C8.36413 7.98314 8.29596 7.81855 8.29596 7.64694C8.29596 7.47533 8.36413 7.31075 8.48548 7.1894C8.60682 7.06806 8.7714 6.99989 8.94302 6.99989C9.11463 6.99989 9.27921 7.06806 9.40055 7.1894C9.5219 7.31075 9.59007 7.47533 9.59007 7.64694Z"
                                fill="white"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-1 ml-4 justify-start items-center text-[#555555] font-semibold text-inherit">
                        Report Generation
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 bg-[#F9FAFC]">
          <div className="flex h-10 justify-between items-center">
            <div className="flex ml-4 ">
              <div
                onClick={() => navigate(-1)}
                className="flex flex-row cursor-pointer"
              >
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 25 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_3837_9887)">
                    <path
                      d="M10.6736 7.20512L4 13.9135L10.6736 20.6218C10.7339 20.7009 10.8105 20.7662 10.8981 20.8132C10.9858 20.8602 11.0826 20.8878 11.1819 20.8941C11.2812 20.9004 11.3806 20.8854 11.4736 20.8499C11.5666 20.8144 11.6508 20.7594 11.7206 20.6886C11.7905 20.6177 11.8443 20.5327 11.8784 20.4393C11.9125 20.3458 11.9262 20.2461 11.9184 20.147C11.9107 20.0478 11.8817 19.9514 11.8335 19.8644C11.7853 19.7774 11.7189 19.7018 11.6389 19.6426L6.64583 14.6079H19.9306C20.1147 14.6079 20.2914 14.5347 20.4216 14.4045C20.5518 14.2743 20.625 14.0976 20.625 13.9135C20.625 13.7293 20.5518 13.5526 20.4216 13.4224C20.2914 13.2922 20.1147 13.219 19.9306 13.219H6.64583L11.6389 8.18429C11.7687 8.05352 11.8413 7.87653 11.8407 7.69225C11.84 7.50797 11.7662 7.33149 11.6354 7.20165C11.5047 7.0718 11.3277 6.99922 11.1434 6.99987C10.9591 7.00052 10.7826 7.07435 10.6528 7.20512H10.6736Z"
                      fill="#665DD9"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_3837_9887">
                      <rect
                        width="25"
                        height="25"
                        fill="white"
                        transform="matrix(0 -1 1 0 0 25)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                <div className="ml-2 mt-1 text-[#665DD9]  text-sm text-center">
                  {" "}
                  Back
                </div>
              </div>
            </div>
            <div className="flex text-xl font-normal  mr-4">
              Generate Report
            </div>
          </div>
          <div className="flex p-4 mt-5 ml-4 mr-4 rounded-md justify-start items-start shadow-md h-fit bg-white">
            <div className="flex ">
              <img src={busstop} className="ml-4 w-14 h-14" />
            </div>
            <div className="flex flex-1 ml-4 h-fit flex-col">
              <div className="flex mb-4 ml-2 text-xl font-semibold">
                Search Filter
              </div>
              <div className="flex justofy-between flex-1">
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                >
                  {({ values, setFieldValue }) => (
                    <Form className="flex  flex-1 flex-row space-x-4">
                      <div className="flex flex-1  flex-col">
                        <RadioGroup
                          row
                          className="flex "
                          aria-label="reportType"
                          name="reportType"
                          value={values.reportType}
                          onChange={(e) =>
                            setFieldValue("reportType", e.target.value)
                          }
                        >
                          <FormControlLabel
                            className="flex "
                            value="conductor"
                            control={<Radio />}
                            label="Conductor Wise Report"
                          />
                          <FormControlLabel
                            className="flex"
                            value="bus"
                            control={<Radio />}
                            label="Bus Wise Report"
                          />
                        </RadioGroup>
                        <div className="flex flex-1">
                          {values.reportType && (
                            <>
                              <div className="flex flex-1 flex-col ml-4 mr-4">
                                <label htmlFor="fromDate">
                                  {values.reportType === "conductor"
                                    ? "Conductor ID"
                                    : "Bus ID"}
                                </label>

                                <Field
                                  type="text"
                                  className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-[80vw] md:w-auto"
                                  style={{ boxShadow: "0 1px 4px #fff" }}
                                  onFocus={(e) =>
                                    (e.target.style.boxShadow =
                                      "0 1px 4px #000")
                                  }
                                  onBlur={(e) =>
                                    (e.target.style.boxShadow = "none")
                                  }
                                  name="id"
                                />
                                <ErrorMessage
                                  name="id"
                                  component="div"
                                  className="text-red-500 ml-4"
                                />
                              </div>

                              <div className="flex flex-1 flex-col ml-20 mr-4 ">
                                <label htmlFor="fromDate">From Date </label>
                                <Field
                                  as="input"
                                  type="date"
                                  placeholder="Select Date"
                                  id="fromDate"
                                  name="fromDate"
                                  className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-[80vw] md:w-auto"
                                  style={{ boxShadow: "0 1px 4px #fff" }}
                                  onFocus={(e) =>
                                    (e.target.style.boxShadow =
                                      "0 1px 4px #000")
                                  }
                                  onBlur={(e) =>
                                    (e.target.style.boxShadow = "none")
                                  }
                                />

                                <ErrorMessage
                                  name="fromDate"
                                  component="div"
                                  className="text-red-500 ml-4"
                                />
                              </div>
                              <div className="flex flex-1 flex-col ml-4 mr-4 ">
                                <label htmlFor="toDate">To Date </label>
                                <Field
                                  as="input"
                                  type="date"
                                  placeholder="Select Date"
                                  id="toDate"
                                  name="toDate"
                                  className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-[80vw] md:w-auto"
                                  style={{ boxShadow: "0 1px 4px #fff" }}
                                  onFocus={(e) =>
                                    (e.target.style.boxShadow =
                                      "0 1px 4px #000")
                                  }
                                  onBlur={(e) =>
                                    (e.target.style.boxShadow = "none")
                                  }
                                />

                                <ErrorMessage
                                  name="toDate"
                                  component="div"
                                  className="text-red-500 ml-4"
                                />
                              </div>

                              <button
                                type="submit"
                                className="bg-[#6366F1] h-10 text-white mt-8 px-4 py-2 rounded-md"
                              >
                                <div className="flex flex-1 flex-row justify-center items-center">
                                  <div className="flex">
                                    {" "}
                                    <svg
                                      width="20"
                                      height="24"
                                      viewBox="0 0 20 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M12.4996 19.4344C12.533 19.7136 12.4496 20.0114 12.258 20.2068C12.1809 20.2931 12.0893 20.3615 11.9885 20.4082C11.8877 20.4549 11.7796 20.479 11.6705 20.479C11.5613 20.479 11.4532 20.4549 11.3524 20.4082C11.2516 20.3615 11.16 20.2931 11.083 20.2068L7.74129 16.475C7.6504 16.3758 7.58129 16.2545 7.53937 16.1205C7.49745 15.9865 7.48384 15.8435 7.49962 15.7026V10.9379L3.50795 5.23319C3.37263 5.03918 3.31157 4.79324 3.33811 4.54912C3.36466 4.30499 3.47665 4.08252 3.64962 3.93032C3.80795 3.80004 3.98295 3.72559 4.16629 3.72559H15.833C16.0163 3.72559 16.1913 3.80004 16.3496 3.93032C16.5226 4.08252 16.6346 4.30499 16.6611 4.54912C16.6877 4.79324 16.6266 5.03918 16.4913 5.23319L12.4996 10.9379V19.4344ZM5.86629 5.58682L9.16629 10.2957V15.4328L10.833 17.294V10.2864L14.133 5.58682H5.86629Z"
                                        fill="white"
                                      />
                                    </svg>
                                  </div>
                                  <div className="flex flex-1 text-white text-md">
                                    Search Result
                                  </div>
                                </div>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
          <div className="flex flex-1 flex-row   ml-4 mr-4 mt-4 ">
            <div className="flex flex-1 m-4  bg-white shadow-lg p-8 rounded-lg ">
              {conductor_details?.data ? (
                <div className="flex flex-1 flex-col ">
                  <div className="flex mt-5  flex-row">
                    <div className="flex font-bold">Name:</div>
                    <div className="flex ml-4 flex-row">
                      <div className="flex">
                        {conductor_details.data[0].first_name}
                      </div>
                      <div className="flex ml-2">
                        {conductor_details.data[0].middle_name}
                      </div>
                      <div className="flex ml-2">
                        {conductor_details.data[0].last_name}
                      </div>
                    </div>
                  </div>
                  <div className="flex mt-5 flex-row">
                    <div className="flex font-bold">Age:</div>
                    <div className="flex ml-4">
                      {conductor_details.data[0].age}
                    </div>
                  </div>
                  <div className="flex mt-5 flex-row  ">
                    <div className="flex font-bold">Conductor ID:</div>
                    <div className="flex ml-4">
                      {conductor_details.data[0].cunique_id}
                    </div>
                  </div>
                  <div className="flex mt-5 flex-row  ">
                    <div className="flex font-bold">Contact Number:</div>
                    <div className="flex ml-4">
                      +91 {conductor_details.data[0].mobile_no}
                    </div>
                  </div>
                  <div className="flex mt-5 flex-row  ">
                    <div className="flex font-bold">
                      Adhar Card/Pan Number :
                    </div>
                    <div className="flex ml-4">
                      {conductor_details.data[0].adhar_no}
                    </div>
                  </div>
                </div>
              ) : (
                <></>
              )}

              {bus_details?.data ? (
                <div className="flex flex-1 flex-col ">
                  <div className="flex mt-5 flex-row">
                    <div className="flex font-bold">Id:</div>
                    <div className="flex ml-4">{bus_details.data[0].id}</div>
                  </div>
                  <div className="flex mt-5 flex-row">
                    <div className="flex font-bold">Registration Number :</div>
                    <div className="flex ml-4">
                      {bus_details.data[0].register_no}
                    </div>
                  </div>
                  <div className="flex mt-5 flex-row">
                    <div className="flex font-bold">VIN Number:</div>
                    <div className="flex ml-4">
                      {bus_details.data[0].vin_no}
                    </div>
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
            {conductor_details?.data ? (
              <div className="flex flex-1 justify-center items-center border  bg-white shadow-lg p-8 rounded-lg m-4 ">
                <div className="flex flex-1 flex-row ">
                  <div className="flex flex-1">
                    <div className="flex flex-col flex-1">
                      <div className="flex flex-1 text-4xl font-bold text-[#12CA46] justify-center items-centers text-center">
                        {/* {total_collection.data[0].total_bus_collection}/- */}
                        {total_collection?.data &&
                          total_collection.data[0].total_bus_collection}
                        /-
                      </div>
                      <div className="flex flex-1 text-lg font-bold text-gray-500 mt-2 justify-center items-centers text-center">
                        Total Amount of the Bus Collection
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-1">
                    <img src={busstop} className="flex ml-4 w-24 h-24" />
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}

            {bus_details?.data ? (
              <div className="flex flex-1 justify-center items-center border  bg-white shadow-lg p-8 rounded-lg m-4 ">
                <div className="flex flex-1 flex-row ">
                  <div className="flex flex-1">
                    <div className="flex flex-col flex-1">
                      <div className="flex flex-1 text-4xl font-bold text-[#12CA46] justify-center items-centers text-center">
                        {/* {total_collection.data[0].total_bus_collection}/- */}
                        {bus_total_collection?.data &&
                          bus_total_collection.data[0].total_bus_collection}
                        /-
                      </div>
                      <div className="flex flex-1 text-lg font-bold text-gray-500 mt-2 justify-center items-centers text-center">
                        Total Amount of the Bus Collection
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-1">
                    <img src={busstop} className="flex ml-4 w-24 h-24" />
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="flex flex-1 bg-white rounded-lg ml-4 mr-4 mt-4 shadow-xl">
            {report_type === "" ? (
              <div className="flex flex-1 justify-center items-center text-gray-500 font-bold">
                No data Found, please select the id
              </div>
            ) : report_type === "conductor" ? (
              <div className="flex flex-1 flex-wrap m-4">
                {filterValues?.reportType === "conductor" &&
                report?.result?.data.length !== 0 ? (
                  report?.result?.data.map((bus) => (
                    <div
                      key={bus.bus_id}
                      onClick={() => {
                        setOpenDialog(true);
                      }}
                      className="flex cursor-pointer flex-col h-[180px] w-[180px] m-4 rounded-md border-2 justify-center items-center border-blue-400 bg-white"
                    >
                      <div className="flex flex-1 flex-col justify-center items-center m-4">
                        <img
                          src={busstop}
                          style={{ translate: "transform(-50%,-50%)" }}
                          className="flex ml-4 w-14 h-14"
                        />
                        <div className="text-[#6D63E8]">Bus: {bus.bus_id}</div>
                        <div className="flex flex-col text-black">
                          <div className="flex">
                            Amount:{" "}
                            <span className="ml-2 text-[#2CA70D]">
                              {bus.total_collection}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-1 text-xs text-gray-400 justify-start items-start">
                          Date: {formatDate(bus.date)}
                        </div>
                        <div className="flex flex-1 text-xs text-gray-400 justify-start items-start">
                          Status: {bus.status}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-1 justify-center items-center text-gray-500 font-bold">
                    No data Found
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-1 flex-wrap m-4">
                {filterValues?.reportType === "bus" &&
                bus_report?.result?.data.length !== 0 ? (
                  bus_report?.result?.data.map((bus) => (
                    <div
                      key={bus.id}
                      className="flex flex-col h-[180px] w-[180px] m-4 rounded-md border-2 justify-center items-center border-blue-400 bg-white"
                    >
                      <div className="flex flex-1 flex-col justify-center items-center m-4">
                        <img
                          src={busstop}
                          style={{ translate: "transform(-50%,-50%)" }}
                          className="flex ml-4 w-14 h-14"
                        />
                        <div className="text-[#6D63E8]">Bus: {bus.bus_id}</div>
                        <div className="flex flex-col text-black">
                          <div className="flex">
                            Amount:{" "}
                            <span className="ml-2 text-[#2CA70D]">
                              {bus.total_collection}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-1 text-xs text-gray-400 justify-start items-start">
                          Date: {formatDate(bus.date)}
                        </div>
                        <div className="flex flex-1 text-xs text-gray-400 justify-start items-start">
                          Status: {bus.status}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-1 justify-center items-center text-gray-500 font-bold">
                    No data Found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog
        open={openDialog}
        fullWidth={true}
        maxWidth={"lg"}
        onClose={() => setOpenDialog(false)}
      >
        <DialogContent>
          <div className="flex flex-1 flex-row justify-center items-center">
            <div className="flex flex-1 flex-col mr-4 ml-4">
              <img src={busstop} width={50} height={50} />
              <div className="flex mt-2 text-[#6D63E8]">Bus: {1}</div>
              <div className="flex flex-1 flex-col">
                <div className="felx mt-1 ">Total Collection</div>
                <div className="flex">{20325}</div>
              </div>
            </div>
            <div className="flex flex-1 mr-4 ml-4 ">
              <div className="flex flex-1 flex-col justify-center items-center  mr-4 ml-4 ">
                <div
                  style={{ boxShadow: " 0 1px 4px #FF8B8B" }}
                  className="flex flex-row w-[95px] h-[95px] rounded-full justify-center items-center shadow-inner bg-[#FFE7E7]"
                >
                  <div className="flex ">
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 17 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.66602 1.61914H14.5708M5.66602 5.44189H14.5708M11.9736 15.381L5.66602 9.26464H7.89221C12.8395 9.26464 12.8395 1.61914 7.89221 1.61914"
                        stroke="#585858"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div
                    style={{ fontWeight: 700 }}
                    className="text-2xl text-[#5B2B17] font-bold ml-1"
                  >
                    5/-
                  </div>
                </div>
                <div className="flex flex-col mt-4">
                  <div className="flex text-[#887FEC] font-bold text-xl border-b-2 border-[#887FEC]">
                    10
                  </div>
                  <div className="flex text-green-500 font-bold text-xl">
                    50
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-1 flex-col justify-center items-center  mr-4 ml-4 ">
              <div
                style={{ boxShadow: " 0 1px 4px #564CD4" }}
                className="flex flex-row w-[95px] h-[95px] rounded-full justify-center items-center shadow-inner bg-[#D9D5FF]"
              >
                <div className="flex ">
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 17 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.66602 1.61914H14.5708M5.66602 5.44189H14.5708M11.9736 15.381L5.66602 9.26464H7.89221C12.8395 9.26464 12.8395 1.61914 7.89221 1.61914"
                      stroke="#585858"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div
                  style={{ fontWeight: 700 }}
                  className="text-2xl text-[#5B2B17] font-bold ml-1"
                >
                  10/-
                </div>
              </div>
              <div className="flex flex-col mt-4">
                <div className="flex text-[#887FEC] font-bold text-xl border-b-2 border-[#887FEC]">
                  10
                </div>
                <div className="flex text-green-500 font-bold text-xl">50</div>
              </div>
            </div>
            <div className="flex flex-1 flex-col justify-center items-center  mr-4 ml-4 ">
              <div
                style={{ boxShadow: " 0 1px 4px #4CD451" }}
                className="flex flex-row w-[95px] h-[95px] rounded-full justify-center items-center shadow-inner bg-[#C5FFCB]"
              >
                <div className="flex ">
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 17 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.66602 1.61914H14.5708M5.66602 5.44189H14.5708M11.9736 15.381L5.66602 9.26464H7.89221C12.8395 9.26464 12.8395 1.61914 7.89221 1.61914"
                      stroke="#585858"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div
                  style={{ fontWeight: 700 }}
                  className="text-2xl text-[#5B2B17] font-bold ml-1"
                >
                  15/-
                </div>
              </div>
              <div className="flex flex-col mt-4">
                <div className="flex text-[#887FEC] font-bold text-xl border-b-2 border-[#887FEC]">
                  10
                </div>
                <div className="flex text-green-500 font-bold text-xl">50</div>
              </div>
            </div>
            <div className="flex flex-1 flex-col justify-center items-center  mr-4 ml-4 ">
              <div
                style={{ boxShadow: " 0 1px 4px #E58B39" }}
                className="flex flex-row w-[95px] h-[95px] rounded-full justify-center items-center shadow-inner bg-[#FFD7B2]"
              >
                <div className="flex ">
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 17 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.66602 1.61914H14.5708M5.66602 5.44189H14.5708M11.9736 15.381L5.66602 9.26464H7.89221C12.8395 9.26464 12.8395 1.61914 7.89221 1.61914"
                      stroke="#585858"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div
                  style={{ fontWeight: 700 }}
                  className="text-2xl text-[#5B2B17] font-bold ml-1"
                >
                  20/-
                </div>
              </div>
              <div className="flex flex-col mt-4">
                <div className="flex text-[#887FEC] font-bold text-xl border-b-2 border-[#887FEC]">
                  10
                </div>
                <div className="flex text-green-500 font-bold text-xl">50</div>
              </div>
            </div>
            <div className="flex flex-1 flex-col justify-center items-center  mr-4 ml-4 ">
              <div
                style={{ boxShadow: " 0 1px 4px #ADA943" }}
                className="flex flex-row w-[95px] h-[95px] rounded-full justify-center items-center shadow-inner bg-[#FCF29B]"
              >
                <div className="flex ">
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 17 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.66602 1.61914H14.5708M5.66602 5.44189H14.5708M11.9736 15.381L5.66602 9.26464H7.89221C12.8395 9.26464 12.8395 1.61914 7.89221 1.61914"
                      stroke="#585858"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div
                  style={{ fontWeight: 700 }}
                  className="text-2xl text-[#5B2B17] font-bold ml-1"
                >
                  25/-
                </div>
              </div>
              <div className="flex flex-col mt-4">
                <div className="flex text-[#887FEC] font-bold text-xl border-b-2 border-[#887FEC]">
                  10
                </div>
                <div className="flex text-green-500 font-bold text-xl">50</div>
              </div>
            </div>
            <div className="flex flex-1 flex-col justify-center items-center  mr-4 ml-4 ">
              <div
                style={{ boxShadow: " 0 1px 4px #C14CD4" }}
                className="flex flex-row w-[95px] h-[95px] rounded-full justify-center items-center shadow-inner bg-[#F2CDFF]"
              >
                <div className="flex ">
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 17 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.66602 1.61914H14.5708M5.66602 5.44189H14.5708M11.9736 15.381L5.66602 9.26464H7.89221C12.8395 9.26464 12.8395 1.61914 7.89221 1.61914"
                      stroke="#585858"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div
                  style={{ fontWeight: 700 }}
                  className=" text-2xl text-[#5B2B17] font-bold ml-1"
                >
                  30/-
                </div>
              </div>
              <div className="flex flex-col mt-4">
                <div className="flex text-[#887FEC] font-bold text-xl border-b-2 border-[#887FEC]">
                  10
                </div>
                <div className="flex text-green-500 font-bold text-xl">50</div>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
/**
 * 

           
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                >
                  {({ values, setFieldValue }) => (
                    <Form className="flex flex-1 flex-row space-x-4">
                      <FormControl
                        className="flex flex-1 flex-row"
                        component="fieldset"
                      >
                        <div className="flex flex-row">
                          <FormLabel component="legend">
                            Select Report Type
                          </FormLabel>
                          <RadioGroup
                            className="flex "
                            aria-label="reportType"
                            name="reportType"
                            value={values.reportType}
                            onChange={(e) =>
                              setFieldValue("reportType", e.target.value)
                            }
                          >
                            <FormControlLabel
                              className="flex "
                              value="conductor"
                              control={<Radio />}
                              label="Conductor Wise Report"
                            />
                            <FormControlLabel
                              className="flex"
                              value="bus"
                              control={<Radio />}
                              label="Bus Wise Report"
                            />
                          </RadioGroup>
                        </div>
                      </FormControl>
                      {values.reportType && (
                        <>
                          <Field
                            as={TextField}
                            name="id"
                            label={
                              values.reportType === "conductor"
                                ? "Conductor ID"
                                : "Bus ID"
                            }
                            fullWidth
                          />
                          <ErrorMessage name="id" component="div" />

                          <Field
                            as="input"
                            type="date"
                            name="fromDate"
                            value={values.fromDate}
                            onChange={(date) => setFieldValue("fromDate", date)}
                            fullWidth
                          />
                          <ErrorMessage name="fromDate" component="div" />

                          <Field
                            as="input"
                            type="date"
                            label="To Date"
                            name="toDate"
                            value={values.toDate}
                            onChange={(date) => setFieldValue("toDate", date)}
                            fullWidth
                          />
                          <ErrorMessage name="toDate" component="div" />

                          <Button
                            type="submit"
                            color="primary"
                            variant="contained"
                          >
                            Submit
                          </Button>
                        </>
                      )}
                    </Form>
                  )}
                </Formik>
 * 
 */
