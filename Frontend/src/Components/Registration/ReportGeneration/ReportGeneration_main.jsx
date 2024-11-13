import React, { useEffect, useState, useRef } from "react";
import busstop from "../../../assets/bus-stop.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button, FormControlLabel, Radio, RadioGroup, CircularProgress, Box, Menu, MenuItem } from "@mui/material";
import { Dialog, DialogContent, DialogActions } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import Cookies from "js-cookie";
// import { ReportCard, BusCard } from "../../Ui/ReportCard";
import { ReportCard, BusCard } from "../../Ui/ReportCardV2";
import DownloadReport from "../../Ui/DownloadReport";
import Paginator from "../../Ui/Paginator";
import csvGenerator from "../../../utils/csvGenerator";
import DownloadReportV2 from "../../Ui/DownloadReportV2";

export default function ReportGeneration_main() {
  const token = Cookies.get("accesstoken");
  const navigate = useNavigate();

  const formikRef = useRef(null)
  const topRef = useRef(null);

  const scrollToTop = () => {
    topRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const initialValues = {
    reportType: "",
    id: "",
    fromDate: "",
    toDate: "",
  };
  const validationSchema = Yup.object({
    reportType: Yup.string().required("Report type is required"),
    // id: Yup.string().required("ID is required"),
    fromDate: Yup.date().required("From Date is required"),
    toDate: Yup.date().required("To Date is required"),
  });

  const [report, set_report] = useState({});
  const [report_all, set_report_all] = useState([]);
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

  const [filterAllReport, set_filterAllReport] = useState([]);
  const [downloadReportPopup, setDownloadReportPopup] = useState(false);
  const [exportData, setExportData] = useState([]);

  const [page, setPage] = useState(1);
  const [totalCount, setToalCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const currentDate = new Date()

  function filterAllReportData() {
    set_filterAllReport(!filterAllReport);
  }

  // const abc = () => {
  //   console.log(report_all)
  // }


  // console.log(conductor_details?.data, "==============>");
  
  conductor_details?.data.sort((a, b) => {
    const collectionA = a.receipt_data.total_bus_collection ?? 0; // Use 0 if null
    const collectionB = b.receipt_data.total_bus_collection ?? 0; // Use 0 if null
    return collectionB - collectionA; // Sort in descending order
  });



  const onSubmit = async (values, rest) => {
    set_filterValues(values);
    setFromDate(values.fromDate);
    setToDate(values.toDate ? values.toDate : values.fromDate);
    set_report_type(values.reportType);
    if (values.reportType === "conductor") {
      set_conductor_id(values.id);
      setIsLoading(true)
      scrollToTop()
      await axios
        .get(
          `${process.env.REACT_APP_BASE_URL}/getAllConductorsList?id=${values.id}&limit=10&page=${page}&from_date=${values.fromDate}&to_date=${values.toDate}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          // console.log(response.data.data);
          set_conductor_details(response.data.data);
          setToalCount(Math.ceil(response?.data?.data?.count / 10))
          setIsLoading(false)
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setIsLoading(false)
        });

      await axios
        .post(
          `${process.env.REACT_APP_BASE_URL}/report/bus-daywise/total`,
          {
            conductor_id: values.id,
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
          // console.log("Total >>>>>>  ", response.data.data);
          set_total_collection(response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });

      await axios
        .post(
          `${process.env.REACT_APP_BASE_URL}/report/bus-daywise`,
          {
            conductor_id: values.id,
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
          set_report(response.data.data);
          console.log(response?.data?.data?.amounts);
          set_total_amount(response.data.data.result.amounts);
        })
        .catch((error) => {
          console.log(error);
        });
      /* rest.resetForm(); */
    } else if (values.reportType === "bus") {
      set_bus_id(values.id);
      await axios
        .post(
          `${process.env.REACT_APP_BASE_URL}/report/bus-daywise/total`,
          {
            bus_id: values.id,
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
          console.log("Bus Total >>>>>>  ", response.data.data);
          set_bus_total_collection(response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });

      await axios
        .get(
          `${process.env.REACT_APP_BASE_URL}/getAllBusList?id=${values.id}&limit=10&page=1&from_date=${values.fromDate}&to_date=${values.toDate}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log("Bus details", response.data.data);
          set_bus_details(response.data.data);
          setToalCount(Math.ceil(response?.data?.data?.count / 10))
          setIsLoading(false)
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setIsLoading(false)
        });

      await axios
        .post(
          `${process.env.REACT_APP_BASE_URL}/report/bus-daywise`,
          {
            bus_id: values.id,
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
          console.log(response.data);
          set_bus_report(response.data.data);
          set_total_amount(response.data.data.result.amounts);
        })
        .catch((error) => {
          console.log(error);
        });
      /* rest.resetForm(); */
    } else {
      return window.alert("Please select the Report Type");
    }
  };

  useEffect(() => {
    if (conductor_details || bus_details) {
      formikRef.current.submitForm()
    }
  }, [page])

  // fetch all report data
  // useEffect(() => {
  //   const fetchReport = async () => {
  //     await axios
  //       .post(
  //         `${process.env.REACT_APP_BASE_URL}/report/all?limit=10&page=1`,
  //         {
  //           from_date: fromDate,
  //           to_date: toDate,
  //         },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       )
  //       .then((response) => {
  //         set_report_all(response?.data?.data?.data);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   };
  //   fetchReport();
  // }, [filterAllReport]);

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

  const handleExport = async (exportType) => {
    if (report_type) {
      await axios
        .get(
          `${process.env.REACT_APP_BASE_URL}/common/export${report_type === 'conductor' ? '?type=conductor' : '?type=bus'}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          if (exportType === 'csv') {
            const exportData = csvGenerator(response?.data?.data)
            const url = window.URL.createObjectURL(new Blob([exportData]));
            const a = document.createElement("a");
            a.href = url;
            a.download = `${report_type}${currentDate.getDate()}${currentDate.getMonth()}${currentDate.getFullYear()}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
          } else {
            setDownloadReportPopup(true)
            setExportData(response?.data?.data)
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setIsLoading(false)
        });
    }
  }

  return (
    <>
      <div ref={topRef} className="flex flex-1 overflow-auto">
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
            <div className="flex text-xl font-bold  mr-4">
              Generate Report
            </div>
          </div>
          <div className="flex p-4 mt-5 ml-4 mr-4 rounded-md justify-start items-start shadow-md h-fit bg-white">
            <div className="flex ">
              <img src={busstop} className="ml-4 w-14 h-14" />
            </div>
            <div className="flex flex-1 ml-4 h-fit flex-col">
              <div className="flex flex-row justify-between 2 mb-4 ml-2 text-xl font-semibold">
                Search Filter
                {report_type && (
                  // <button
                  //   className="bg-[#6366F1] text-white p-2 rounded-md"
                  //   onClick={() => handleExport('pdf')}
                  // >
                  //   Export {report_type === 'bus' ? 'bus list' : 'conductor list'} {' '}
                  //   <DownloadIcon />
                  // </button>
                  <>
                    <Button
                      id="basic-button"
                      aria-controls={open ? 'basic-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? 'true' : undefined}
                      onClick={handleClick}
                      variant="outlined"
                    >
                      Export {report_type}
                    </Button>
                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      MenuListProps={{
                        'aria-labelledby': 'basic-button',
                      }}
                    >
                      <MenuItem onClick={() => { handleClose(); handleExport('csv') }}>CSV</MenuItem>
                      <MenuItem onClick={() => { handleClose(); handleExport('pdf') }}>PDF</MenuItem>
                    </Menu>
                  </>
                )}
              </div>
              <div className="flex justofy-between flex-1">
                <Formik
                  innerRef={formikRef}
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                >
                  {({ values, setFieldValue }) => {
                    // useEffect to reload the page when id changes
                    /*   useEffect(() => {
                      if (values.id) {
                        window.location.reload();
                      }
                    }, [values.id]); */

                    return (
                      <Form className="flex  flex-1 flex-row space-x-4">
                        <div className="flex flex-1  flex-col">
                          <RadioGroup
                            row
                            className="flex "
                            aria-label="reportType"
                            name="reportType"
                            value={values.reportType}
                            onChange={(e) => {
                              setFieldValue("reportType", e.target.value);
                              set_report_type(e.target.value)
                            }}
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
                          <div className="flex md:flex-row flex-col flex-1 gap-8 p-4">
                            {values.reportType && (
                              <>
                                <div className="flex flex-1 flex-col">
                                  <label htmlFor="fromDate">
                                    {values.reportType === "conductor"
                                      ? "Conductor ID"
                                      : "Bus ID"}
                                  </label>

                                  <Field
                                    type="text"
                                    className="border border-gray-300 rounded-md px-3 py-2 mt-1"
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

                                <div className="flex flex-1 flex-col ">
                                  <label htmlFor="fromDate">From Date </label>
                                  <Field
                                    as="input"
                                    type="date"
                                    placeholder="Select Date"
                                    id="fromDate"
                                    name="fromDate"
                                    className="border border-gray-300 rounded-md px-3 py-2 mt-1"
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
                                <div className="flex flex-1 flex-col ">
                                  <label htmlFor="toDate">To Date </label>
                                  <Field
                                    as="input"
                                    type="date"
                                    placeholder="Select Date"
                                    id="toDate"
                                    name="toDate"
                                    className="border border-gray-300 rounded-md px-3 py-2 mt-1"
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
                    );
                  }}
                </Formik>
              </div>
            </div>
          </div>
          <div className="flex flex-1 flex-col md:flex-row   ml-4 mr-4 mt-4 ">
            <div
              className={`flex flex-col gap-4 flex-1 m-4  p-8 `}
            >
              {/* <button onClick={() => {
                console.log('totaaaaa', conductor_details)
              }}>abc</button> */}
              {isLoading && (
                <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                  <CircularProgress />
                </Box>
              )}

              {((report_type === 'conductor' && (conductor_details?.data?.length === 0 || !conductor_details)) || (report_type === 'bus' && (bus_details?.data?.length === 0 || !bus_details))) && (
                <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                  <h1>No Data</h1>
                </Box>
              )}

              {(conductor_details?.data && report_type === 'conductor' && !isLoading) &&
                conductor_details.data[0]?.first_name ? (
                <>
                  {conductor_details?.data.map((item, index) => (
                    <ReportCard
                      key={index}
                      card_type={"conductor"}
                      first_name={item?.first_name}
                      middle_name={item?.middle_name}
                      last_name={item?.last_name}
                      age={item?.age}
                      conductor_id={item?.cunique_id}
                      mobile_no={item?.mobile_no}
                      aadhar_no={item?.adhar_no}
                      details={item?.bus_data}
                      fromDate={fromDate}
                      toDate={toDate}
                      total_bus_collection={item?.receipt_data?.total_bus_collection}
                    />
                  ))}
                </>
              ) : (
                <></>
              )}

              {(bus_details?.data && bus_details.data[0]?.register_no && report_type === 'bus' && !isLoading) ? (
                <>
                  {bus_details?.data.map((item, index) => (
                    <ReportCard
                      key={index}
                      card_type={"bus"}
                      bus_id={item?.id}
                      register_no={item?.register_no}
                      vin_no={item?.vin_no}
                      details={item?.bus_data}
                      fromDate={fromDate}
                      toDate={toDate}
                      total_bus_collection={item?.receipt_data?.total_bus_collection}
                    />
                  ))}
                </>
              ) : null}
            </div>
            {conductor_details?.data ? (
              // <div className="flex flex-1 justify-center items-center border  bg-white shadow-lg p-8 rounded-lg m-4 ">
              //   <div className="flex flex-1 flex-row ">
              //     <div className="flex flex-1">
              //       <div className="flex flex-col flex-1">
              //         <div className="flex flex-1 text-4xl font-bold text-[#12CA46] justify-center items-centers text-center">
              //           {/* {total_collection.data[0].total_bus_collection}/- */}
              //           {total_collection?.data &&
              //             total_collection.data[0].total_bus_collection}
              //           /-
              //         </div>
              //         <div className="flex flex-1 text-lg font-bold text-gray-500 mt-2 justify-center items-centers text-center">
              //           Total Amount of the Bus Collection
              //         </div>
              //       </div>
              //     </div>
              //     <div className="flex flex-1">
              //       <img src={busstop} className="flex ml-4 w-24 h-24" />
              //     </div>
              //   </div>
              // </div>
              <></>
            ) : (
              <></>
            )}

            {bus_details?.data ? (
              // <div
              //   className={`flex flex-1 justify-center items-center  ${bus_total_collection?.data &&
              //     bus_total_collection.data[0].total_bus_collection
              //     ? "border bg-white shadow-lg rounded-lg"
              //     : ""
              //     } p-8  m-4`}
              // >
              //   <div className="flex flex-1 flex-row ">
              //     <div className="flex flex-1">
              //       <div className="flex flex-col flex-1">
              //         <div className="flex flex-1 text-4xl font-bold text-[#12CA46] justify-center items-centers text-center">
              //           {/* {total_collection.data[0].total_bus_collection}/- */}
              //           {bus_total_collection?.data &&
              //             bus_total_collection.data[0].total_bus_collection}
              //           /-
              //         </div>
              //         <div className="flex flex-1 text-lg font-bold text-gray-500 mt-2 justify-center items-centers text-center">
              //           Total Amount of the Bus Collection
              //         </div>
              //       </div>
              //     </div>
              //     <div className="flex flex-1">
              //       <img src={busstop} className="flex ml-4 w-24 h-24" />
              //     </div>
              //   </div>
              // </div>
              <></>
            ) : (
              <></>
            )}
          </div>
          <div className="flex flex-1 flex-col  rounded-lg ml-4 mr-4 shadow-xl relative">
            {/* <div className="absolute right-[10rem] -top-[5rem] flex items-center gap-5">
              <div>
                <label htmlFor="fromDate">From Date </label>
                <input
                  type="date"
                  className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-[80vw] md:w-auto"
                  style={{ boxShadow: "0 1px 4px #fff" }}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="toDate">To Date </label>
                <input
                  type="date"
                  className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-[80vw] md:w-auto"
                  style={{ boxShadow: "0 1px 4px #fff" }}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="bg-[#6366F1] h-10 text-white px-4 rounded-md"
                onClick={filterAllReportData}
              >
                <div className="flex flex-row justify-center items-center">
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
                  <div className="flex flex-1 text-white text-md whitespace-nowrap">
                    Search Result
                  </div>
                </div>
              </button>
              <button
                type="button"
                className="bg-[#6366F1] h-10 text-white px-4 rounded-md"
                onClick={() => setDownloadReportPopup(true)}
              >
                <div className="flex flex-row gap-1 justify-center items-center">
                  <div className="flex gap-5">
                    {" "}
                    <svg
                      width="23"
                      height="23"
                      viewBox="0 0 23 23"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.4987 7.1875H6.70703C6.32578 7.1875 5.96015 7.33895 5.69057 7.60853C5.42098 7.87812 5.26953 8.24375 5.26953 8.625V16.2917C5.26953 16.6729 5.42098 17.0385 5.69057 17.3081C5.96015 17.5777 6.32578 17.7292 6.70703 17.7292H14.3737C14.7549 17.7292 15.1206 17.5777 15.3902 17.3081C15.6597 17.0385 15.8112 16.6729 15.8112 16.2917V11.5"
                        stroke="#fff"
                        stroke-linecap="round"
                      />
                      <path
                        d="M11.9766 11.0208L18.0754 4.922M13.8932 4.3125H18.6849V9.10417"
                        stroke="#fff"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="flex flex-1 text-white text-md whitespace-nowrap">
                    Export
                  </div>
                </div>
              </button>
            </div> */}
            {downloadReportPopup && (
              <DownloadReportV2
                reports={exportData}
                closePopup={setDownloadReportPopup}
                report_type={report_type}
              />
            )}
            {report_type === "" ? (
              <div className="flex  justify-center items-center text-gray-500 font-bold">
                <div className="flex flex-col gap-5 w-full p-4">
                  {report_all?.map((report) => (
                    <div className="flex" key={report?.conductor_id}>
                      {/* <ReportCard
                        first_name={report?.data?.first_name}
                        middle_name={report?.data?.middle_name}
                        last_name={report?.data?.last_name}
                        age={report?.data?.age}
                        conductor_id={report?.data?.conductor_id}
                        mobile_no={report?.data?.mobile_no}
                        aadhar_no={report?.data?.adhar_no}
                        total_bus_collection={report?.data?.total_amount}
                        fromDate={fromDate}
                        toDate={toDate}
                      /> */}
                      {/* <button onClick={abc}>abc</button> */}
                      {/* <ReportCard
                        first_name={report?.data?.first_name}
                        middle_name={report?.data?.middle_name}
                        last_name={report?.data?.last_name}
                        age={report?.data?.age}
                        conductor_id={report?.conductor_id}
                        mobile_no={report?.data?.mobile_no}
                        aadhar_no={report?.data?.adhar_no}
                        total_bus_collection={report?.data?.total_amount}
                        fromDate={fromDate}
                        toDate={toDate}
                        details={report?.data?.details}
                      /> */}

                      {/* <div className="grid grid-cols-2">
                        {report?.data?.details
                          ?.map((bus) => (
                            <BusCard
                              bus_id={bus.bus_id}
                              total_bus_collection={bus.amount}
                              date={bus.date}
                              status={"True"}
                            />
                          ))
                          .slice(0, 4)}
                      </div> */}

                      {/* <div className="flex h-full justify-end  items-center mb-12">
                        <Link
                          to={`/ReportConductor_recipt/${report?.conductor_id}/${fromDate}/${toDate}`}
                          className="font-bold"
                        >
                          See All Recipts{" "}
                        </Link>
                      </div> */}
                    </div>
                  ))}
                </div>
              </div>
            ) : report_type === "conductor" ? (
              // <div className="flex flex-1 flex-wrap m-4">
              //   {filterValues?.reportType === "conductor" &&
              //     report?.result?.data.length !== 0 ? (
              //     report?.result?.data.map((bus) => (
              //       <div className="flex flex-1 flex-col">
              //         <div
              //           onClick={() => {
              //             handle_dialog_busUid(
              //               bus.bus_id,
              //               formatDate(bus.date),
              //               bus.total_collection
              //             );
              //           }}
              //           key={bus.bus_id}
              //           className="flex cursor-pointer flex-col h-[180px] w-[180px] m-4 rounded-md border-2 justify-center items-center border-blue-400 bg-white"
              //         >
              //           <div className="flex flex-1 flex-col justify-center items-center m-4">
              //             <img
              //               src={busstop}
              //               style={{ translate: "transform(-50%,-50%)" }}
              //               className="flex ml-4 w-14 h-14"
              //             />
              //             <div className="text-[#6D63E8]">
              //               Bus: {bus.bus_id}
              //             </div>
              //             <div className="flex flex-col text-black">
              //               <div className="flex">
              //                 Amount:{" "}
              //                 <span className="ml-2 text-[#2CA70D]">
              //                   {bus.total_collection}
              //                 </span>
              //               </div>
              //             </div>
              //             <div className="flex flex-1 text-xs text-gray-400 justify-start items-start">
              //               Date: {formatDate(bus.date)}
              //             </div>
              //             <div className="flex flex-1 text-xs text-gray-400 justify-start items-start">
              //               Status: {bus.status}
              //             </div>
              //           </div>
              //         </div>
              //       </div>
              //     ))
              //   ) : (
              //     <div className="flex flex-1 justify-center items-center text-gray-500 font-bold">
              //       No data Found
              //     </div>
              //   )}
              // </div>
              <></>
            ) : (
              // <div className="flex flex-1 flex-wrap m-4">
              //   {filterValues?.reportType === "bus" &&
              //     bus_report?.result?.data.length !== 0 ? (
              //     bus_report?.result?.data.map((bus) => (
              //       <div className="flex flex-1 flex-col">
              //         <div
              //           key={bus.id}
              //           onClick={() =>
              //             handle_dialog_busUid(
              //               bus.bus_id,
              //               formatDate(bus.date),
              //               bus.total_collection
              //             )
              //           }
              //           className="flex flex-col h-[180px] w-[180px] m-4 rounded-md border-2 justify-center items-center border-blue-400 bg-white"
              //         >
              //           {/*
              //            */}{" "}
              //           <div className="flex flex-1 flex-col justify-center items-center m-4">
              //             <img
              //               src={busstop}
              //               style={{ translate: "transform(-50%,-50%)" }}
              //               className="flex ml-4 w-14 h-14"
              //             />
              //             <div className="text-[#6D63E8]">
              //               Bus: {bus.bus_id}
              //             </div>
              //             <div className="flex flex-col text-black">
              //               <div className="flex">
              //                 Amount:{" "}
              //                 <span className="ml-2 text-[#2CA70D]">
              //                   {bus.total_collection}
              //                 </span>
              //               </div>
              //             </div>
              //             <div className="flex flex-1 text-xs text-gray-400 justify-start items-start">
              //               Date: {formatDate(bus.date)}
              //             </div>
              //             <div className="flex flex-1 text-xs text-gray-400 justify-start items-start">
              //               Status: {bus.status}
              //             </div>
              //           </div>
              //           {/* </Link> */}
              //         </div>
              //       </div>
              //     ))
              //   ) : (
              //     <div className="flex flex-1 justify-center items-center text-gray-500 font-bold">
              //       No data Found
              //     </div>
              //   )}
              // </div>
              <></>
            )}
            {/* {report_type === "" ? (
              <></>
            ) : report_type === "conductor" ? (
              <Link
                to={`/ReportConductor_recipt/${conductor_id}/${fromDate}/${toDate}`}
              >
                <div className="flex justify-end items-center mb-4 mr-4 font-bold">
                  {`See All Recipts `}
                </div>
              </Link>
            ) : (
              <Link to={`/ReportBus_recipt/${bus_id}/${fromDate}/${toDate}`}>
                <div className="flex justify-end items-center mb-4 mr-4 font-bold">
                  {`See All Recipts `}
                </div>
              </Link>
            )} */}
          </div>
          {/* <Pagination count={10} /> */}
          <Paginator page={page} setPage={setPage} totalCount={totalCount} />
        </div>
      </div >

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
            {/* <div className="flex flex-1 overflow-auto">
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
            </div> */}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

/**
 *   <div className="flex flex-1 flex-row justify-center items-center">
            <div className="flex flex-1 flex-col mr-4 ml-4">
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
 * 
 * 
 * 
 * 
 */
