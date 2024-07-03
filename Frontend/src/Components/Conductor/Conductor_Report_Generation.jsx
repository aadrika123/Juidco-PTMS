import React, { useState } from "react";
import busstop from "../../assets/bus-stop.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { Dialog, DialogContent, DialogActions } from "@mui/material";
import Cookies from "js-cookie";
export default function Conductor_Report_Generation() {
  const token = Cookies.get("accesstoken");
  const navigate = useNavigate();

  const initialValues = {
    fromDate: "",
    toDate: "",
  };

  const validationSchema = Yup.object({
    fromDate: Yup.string().required("From Date is required"),
    toDate: Yup.string()
      .required("To Date is required")
      .test(
        "is-greater",
        "To Date should be greater than From Date",
        function (value) {
          const { fromDate } = this.parent;
          return fromDate && value
            ? new Date(value) > new Date(fromDate)
            : true;
        }
      ),
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
  const [total_amount, set_total_amount] = useState([]);
  const [conductor_id, set_conductor_id] = useState("");
  const [bus_id, set_bus_id] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const userName = localStorage.getItem("conductorId");

  console.log("Total Amount Array >>> ", total_amount);
  console.log("report state >>> ", report);
  console.log("Total state >>", total_collection);
  console.log(conductor_details);

  /* const handle_logOut = () => {
    console.log("Log out");
    Cookies.remove("accesstoken", { path: "/" });
    sessionStorage.clear();
    navigate("/");
    window.location.reload();
  }; */

  const onSubmit = async (values) => {
    set_filterValues(values);
    setFromDate(values.fromDate);
    setToDate(values.toDate);
    set_report_type(values.reportType);
    await axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/getAllConductorsList?id=${userName}&limit=10&page=1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data.data);
        set_conductor_details(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });

    await axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/report/bus-daywise/total`,
        {
          conductor_id: userName,
          from_date: values.fromDate,
          to_date: values.toDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log("Total >>>>>>  ", response.data.data);
        set_total_collection(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });

    await axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/report/bus-daywise`,
        {
          conductor_id: userName,
          from_date: values.fromDate,
          to_date: values.toDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log("Report data >>>", response.data);
        console.log("report data state >>>", response.data.data);
        set_report(response?.data?.data);
        console.log(response?.data?.data?.amounts);
        set_total_amount(response.data.data.result.amounts);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const [dialog_busUid, set_dialog_busUid] = useState("");
  const [Dialogdate, set_dateDialog] = useState("");
  const [DialogAmount, set_DialogAmount] = useState("");

  const handle_dialog_busUid = (id, date, amount) => {
    set_dialog_busUid(id);
    set_dateDialog(date);
    set_DialogAmount(amount);
    setOpenDialog(true);
  };

  console.log("Dialog Data >>>>>>   ", dialog_busUid, Dialogdate, DialogAmount);

  return (
    <>
      <div className="flex flex-1 h-screen">
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
              <img src={busstop} className="ml-4 w-14 h-14 hidden md:flex" />
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
                        <div className="flex md:flex-row flex-col flex-1">
                          {
                            <>
                              <div className="flex flex-1 flex-col md:ml-20 ml-5 mr-4">
                                <div className="flex flex-row mt-2">
                                  <div className="flex mr-2">Conductor ID:</div>
                                  <div className="flex ">{userName}</div>
                                </div>
                              </div>
                              <div className="flex flex-1 flex-col md:ml-20 ml-5 mr-4 ">
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
                                  <div className="flex flex-1 justify-center items-center text-white text-md">
                                    <div className="flex ">
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
                                    Search Result
                                  </div>
                                </div>
                              </button>
                            </>
                          }
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
          <div className="flex flex-1 flex-col md:flex-row   ml-4 mr-4 mt-4 ">
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
                        {conductor_details.data[0].middle_name == "null"
                          ? ""
                          : conductor_details.data[0].middle_name}
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
          </div>
          <div className="flex flex-1 flex-col bg-white rounded-lg ml-4 mr-4 mt-4 shadow-xl">
            {report?.result?.data.length == 0 ? (
              <div className="flex flex-1 justify-center items-center text-gray-500 font-bold">
                No data Found, please select the id
              </div>
            ) : (
              <div className="flex flex-1 flex-wrap m-4">
                {true && report?.result?.data.length !== 0 ? (
                  report?.result?.data.map((bus) => (
                    <div className="flex flex-1 flex-col">
                      <div
                        onClick={() => {
                          handle_dialog_busUid(
                            bus.bus_id,
                            formatDate(bus.date),
                            bus.total_collection
                          );
                        }}
                        key={bus.bus_id}
                        className="flex cursor-pointer flex-col h-[180px] w-[180px] m-4 rounded-md border-2 justify-center items-center border-blue-400 bg-white"
                      >
                        <div className="flex flex-1 flex-col justify-center items-center m-4">
                          <img
                            src={busstop}
                            style={{ translate: "transform(-50%,-50%)" }}
                            className="flex ml-4 w-14 h-14"
                          />
                          <div className="text-[#6D63E8]">
                            Bus: {bus.bus_id}
                          </div>
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
                    </div>
                  ))
                ) : (
                  <div className="flex flex-1 justify-center items-center text-gray-500 font-bold">
                    No data Found
                  </div>
                )}
              </div>
            )}
            {report?.result?.data && report.result.data.length > 0 && (
              <div
                onClick={() => {
                  navigate("/ReportConductor_recipt", {
                    state: {
                      conductor_uid: userName,
                      from_date: fromDate,
                      to_date: toDate,
                    },
                  });
                }}
                className="flex justify-end items-center mb-4 mr-4 font-bold"
              >
                {`See All Recipts `}
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
          <div className="flex  flex-row justify-start items-start">
            <div className="flex flex-col mr-4 ml-4">
              <img src={busstop} width={50} height={50} />
              <div className="flex mt-2 text-[#6D63E8]">Bus: {1}</div>
              <div className="flex flex-1 flex-row ">
                <div className="felx  text-md font-bold">
                  Total Collection :
                </div>
                <div className="flex text-green-400 ml-2 font-bold">
                  {DialogAmount}
                </div>
              </div>
            </div>
            <div className="flex flex-1 overflow-auto">
              {total_amount.map((amounts) => (
                <div className="flex justify-center items-center flex-1 mr-4 ml-4 ">
                  {amounts.bus_id == dialog_busUid &&
                    formatDate(amounts.date) == Dialogdate && (
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
                            className="flex justify-center items-center text-2xl text-[#5B2B17] font-bold ml-1"
                          >
                            {amounts?.amount}
                          </div>
                        </div>
                        <div className="flex flex-col mt-4">
                          <div className="flex text-[#887FEC] font-bold text-xl border-b-2 border-[#887FEC]">
                            {amounts?.count}
                          </div>
                          <div className="flex text-green-500 font-bold text-xl">
                            {amounts?.sum}
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
