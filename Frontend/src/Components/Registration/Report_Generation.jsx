import React, { useEffect } from "react";
import background_image from "../../assets/background_image_2.png";
import RMC_logo from "../../assets/RMC_LOGO.png";
import bus from "../../assets/bus 1.png";
import bus1 from "../../assets/bus-2.png";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import Cookies from "js-cookie";

export default function Report_Generation() {
  const token = Cookies.get("accesstoken");
  const initialValues = {
    Conductor_Information: "",
    Date: "",
    Month: "",
  };

  const validationSchema = Yup.object({
    Conductor_Information: Yup.string().required(
      "Conductor Information is required"
    ),
    Date: Yup.string(),
    Month: Yup.string(),
  });
  const navigate = useNavigate();
  const [loading, set_loading] = React.useState(false);
  const [success, set_success] = React.useState({});
  const [OpenError, set_openError] = React.useState(false);
  const [Error, set_Error] = React.useState({});
  const [report, set_report] = React.useState({});
  const [openDialog, setOpenDialog] = React.useState(false); // State to control dialog

  const onSubmit = async (values, { setSubmitting }) => {
    // Handle form submission here
    console.log("Values function started ");
    console.log("Values >> ", values);
    set_loading(true);

    if (!values.Date && !values.Month) {
      window.alert("Please select Date and Month");
      set_loading(false);
      window.location.reload();
      return;
    } else if (values.Date && values.Month) {
      window.alert("Both Date and Month cannot be selected");
      set_loading(false);
      window.location.reload();
      return;
    } else if (values.Date) {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/report/conductor-daywise`,
          {
            currentDate: values?.Date,
            conductor_id: values?.Conductor_Information,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        set_loading(false);
        console.log(response.data.data);
        set_report(response.data.data);
        setOpenDialog(true);
      } catch (error) {
        set_loading(false);
        set_Error(error.response.data);
        set_openError(true);
      }
    } else if (values.Month) {
      window.alert("Please Wait... Under Development");
      set_loading(false);
      window.location.reload();
      return;
    }
  };

  console.log("Daily Report", report);
  const [ConductorOptions, setConductorOptions] = React.useState([]);
  const [conductor_details, set_conductor_details] = React.useState({
    name: "",
    Age: "",
    Contact_Number: "",
  });
  useEffect(() => {
    // Fetch conductor information
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/getAllConductorsList?limit=10&page=1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ) // Replace with your actual API endpoint
      .then((response) => setConductorOptions(response.data?.data?.data))
      .catch((error) => console.error("Error fetching conductor data:", error));
  }, []);

  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <div className="flex flex-1 flex-col bg-white h-screen ">
        <div
          onClick={() => navigate(-1)}
          className="relative w-fit h-fit top-4 left-4 md:hidden"
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 96 96"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M54 15.1515L45.8098 8L0 48L45.8098 88L54 80.8485L16.3805 48L54 15.1515Z"
              fill="#414141"
            />
          </svg>
        </div>
        <div className="flex h-[350px] md:h-[100px] pb-8 bg-white justify-center items-center md:justify-start rounded-b-[30px] border-b-[3px] border-l-0 border-r-0 shadow-md border-t-0">
          <div className="flex flex-1 flex-col md:flex-row  justify-center  items-center">
            <div className="flex flex-1 flex-col md:flex-row justify-between items-center">
              <div className="flex flex-col md:flex-row">
                <div className="flex  justify-center items-center">
                  <img
                    src={RMC_logo}
                    alt="RMC Logo"
                    className=" flex max-w-full mt-5 ml-5 mr-5 h-auto md:h-1/2"
                  />
                </div>
                <div className="flex flex-col justify-center items-center">
                  <div className="flex mt-5 ">
                    <h2
                      style={{ fontWeight: 500, fontSize: 20 }}
                      className="text-[#585858]"
                    >
                      Ranchi Municipal Corporation
                    </h2>
                  </div>
                  <div className="flex mt-2 mb-2 flex-row ">
                    <h1 className="text-md font-bold text-gradient-to-b text-[#1436C3] bg-clip-text">
                      Urban Transport
                    </h1>
                    <img
                      src={bus}
                      alt="Bus"
                      className="ml-2 max-w-full h-auto md:h-5"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col flex-1  justify-center items-end">
                <div className="flex flex-row mt-2 md:mt-8 md:mr-8">
                  <h1 className="flex justify-center items-center text-2xl md:text-xl text-[#322F2F] font-semibold">
                    Report Generation
                  </h1>
                  <img
                    src={bus1}
                    alt="Bus"
                    className="ml-2 max-w-full h-auto md:h-8"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative w-full flex-col overflow-y-auto">
          <div className="flex flex-col mt-5 w-full h-fit justify-center items-center ">
            <div className="flex flex-1 h-20 w-[80%] ">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {({ values, setFieldValue, isSubmitting }) => (
                  <Form className="flex flex-col flex-1 gap-4">
                    <div className="flex flex-col sm:flex-row mt-4 justify-around">
                      {" "}
                      <div className="flex flex-col flex-1 gap-3 ml-4 mr-4">
                        <div className="flex flex-1 flex-col mt-8">
                          <label htmlFor="Conductor_Information">
                            Conductor ID{" "}
                          </label>
                          <Field
                            as="select"
                            id="Conductor_Information"
                            name="Conductor_Information"
                            style={{ boxShadow: "0 1px 4px #fff" }}
                            onFocus={(e) =>
                              (e.target.style.boxShadow = "0 1px 4px #000")
                            }
                            onBlur={(e) => (e.target.style.boxShadow = "none")}
                            className="border border-gray-300 rounded-md px-3 py-4 mt-1  w-[80vw] md:w-auto"
                            onChange={(e) => {
                              const selectedValue = e.target.value;
                              setFieldValue(
                                "Conductor_Information",
                                selectedValue
                              );
                              if (selectedValue !== null) {
                                const selectedConductor = ConductorOptions.find(
                                  (conductor) =>
                                    conductor.cunique_id == selectedValue
                                );
                                set_conductor_details({
                                  name: `${selectedConductor.first_name} ${selectedConductor.last_name}`,
                                  Age: selectedConductor.age,
                                  Contact_Number: selectedConductor.mobile_no,
                                });
                              } else {
                                set_conductor_details({
                                  name: "",
                                  Age: "",
                                  Contact_Number: "",
                                });
                              }
                            }}
                          >
                            <option className="flex flex-1" value="">
                              -Please Select-
                            </option>
                            {ConductorOptions.map((conductor) => (
                              <option
                                key={conductor.id}
                                value={conductor.cunique_id}
                              >
                                {`${conductor.first_name} - ${conductor.cunique_id}`}
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage
                            name="Conductor_Information"
                            component="div"
                            className="text-red-500 ml-4"
                          />
                        </div>
                        <div className="flex ">
                          <div className="flex flex-1 mt-4 mb-4 flex-col">
                            <div className="flex flex-1 mt-2 flex-row">
                              <div className="flex font-bold mr-5"> Name: </div>
                              <div className="flex">
                                {" "}
                                {conductor_details.name}{" "}
                              </div>
                            </div>
                            <div className="flex flex-1 mt-2 flex-row">
                              <div className="flex font-bold mr-5"> Age: </div>
                              <div className="flex">
                                {conductor_details.Age}
                              </div>
                            </div>
                            <div className="flex flex-1 mt-2 flex-row">
                              <div className="flex font-bold mr-5">
                                {" "}
                                Contact Number:{" "}
                              </div>
                              <div className="flex">
                                {conductor_details.Contact_Number}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col flex-1 ml-4 mr-4 mb-4">
                        <div className="flex flex-1 flex-col mt-8">
                          <label htmlFor="Date">Day Collection </label>
                          <Field
                            as="input"
                            type="date"
                            id="Date"
                            name="Date"
                            className="border border-gray-300 rounded-md px-3 py-4 mt-1 w-[80vw] md:w-auto"
                            style={{ boxShadow: "0 1px 4px #fff" }}
                            onFocus={(e) =>
                              (e.target.style.boxShadow = "0 1px 4px #000")
                            }
                            onBlur={(e) => (e.target.style.boxShadow = "none")}
                          />

                          <ErrorMessage
                            name="Date"
                            component="div"
                            className="text-red-500 ml-4"
                          />
                        </div>
                        <div className="flex flex-1 flex-col mt-8">
                          <label htmlFor="Month">Month Collection </label>
                          <Field
                            as="input"
                            type="month"
                            id="Month"
                            name="Month"
                            className="border border-gray-300 rounded-md px-3 py-4 mt-1 w-[80vw] md:w-auto"
                            style={{ boxShadow: "0 1px 4px #fff" }}
                            onFocus={(e) =>
                              (e.target.style.boxShadow = "0 1px 4px #000")
                            }
                            onBlur={(e) => (e.target.style.boxShadow = "none")}
                          />

                          <ErrorMessage
                            name="Month"
                            component="div"
                            className="text-red-500 ml-4"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-row mt-5">
                      <div className="flex flex-1 justify-center items-center ">
                        <div className="flex flex-1 justify-center items-center ">
                          <button
                            type="submit"
                            className="flex flex-1 h-10 md:w-[80%] border bg-[#4245D9] rounded-md shadow-md justify-center items-center"
                          >
                            <div className="flex text-xl text-white font-normal">
                              {loading ? "Loading..." : "Generate Report"}
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
          <div className="flex flex-1 justify-center items-center">
            <div className="flex mt-10 mb-5 w-fit justify-center items-center bg-white">
              <img
                src={background_image}
                className="flex flex-1 max-w-full h-auto md:w-fit md:h-[50vh] object-cover"
                alt="Background"
              />
            </div>
          </div>
        </div>
      </div>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogContent>
          {/* <p>Your form has been submitted successfully.</p> */}
          <div className="flex flex-1 flex-col justify-center items-center">
            <div className="flex rounded-full bg-[#4338CA] h-20 w-20 justify-center items-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.39648 10.8436L7.70685 15.154L16.3276 5.91748"
                  stroke="white"
                  stroke-width="1.39091"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="flex mt-5 text-xl font-semibold ml-10 mr-10">
              <h2>Congratulation!! Report Generated</h2>
            </div>
            <button
              onClick={() => {
                navigate("/Conductor_report_page", {
                  state: {
                    report: report.data,
                  },
                });
              }}
              className="flex mt-5 flex-row justify-around"
            >
              <div className="flex flex-1 p-2 px-8 bg-[#4338CA] rounded-md shadow-lg text-white font-semibold">
                View
              </div>
            </button>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={OpenError} onClose={() => set_openError(false)}>
        <DialogContent className="bg-red-100">
          {/* <p>Your form has been submitted successfully.</p> */}
          <div className="flex flex-1 flex-col justify-center items-center bg-red-100">
            <div className="flex rounded-full bg-red-500 h-20 w-20 justify-center items-center">
              <svg
                width="40"
                height="40"
                viewBox="0 0 61 61"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M47.7261 13.0517L12.726 48.0517M12.7261 13.0517L47.7261 48.0517"
                  stroke="white"
                  stroke-width="3.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="flex mt-5 text-xl font-semibold ml-10 mr-10">
              <h2>Something went wrong</h2>
            </div>
            <div className="flex mt-5 flex-row justify-around">
              <div className="flex w-fit ml-2 text-[#4A4545]">
                {Error?.message}
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions className="bg-red-100">
          <Button
            variant="contained"
            color="error"
            onClick={() => set_openError(false)}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
