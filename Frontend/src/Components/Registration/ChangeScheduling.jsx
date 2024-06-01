import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import background_image from "../../assets/background_image_2.png";
import RMC_logo from "../../assets/RMC_LOGO.png";
import bus from "../../assets/bus 1.png";
import bus1 from "../../assets/bus-2.png";
import { Formik, Form, Field, ErrorMessage } from "formik";
//import { TimePicker } from "@material-ui/pickers";

import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import * as Yup from "yup";
import Scheduled_Table from "../Tables/Scheduled_Table";
const initialValues = {
  Bus_information: "",
  Conductor_Information: "",
  Date: "",
  In_Time: "",
  Out_Time: "",
};
import Cookies from "js-cookie";

const validationSchema = Yup.object({
  Bus_information: Yup.string().required("Bus information is required"),
  Conductor_Information: Yup.string().required(
    "Conductor Information is required"
  ),
  Date: Yup.string().required("Date is required"),
  In_Time: Yup.string().required("In Time is required"),
  Out_Time: Yup.string().required("Out Time is required"),
});
export default function ChangeScheduling() {
  const token = Cookies.get("accesstoken");

  const [openDialog, setOpenDialog] = React.useState(false); // State to control success dialog
  const [openConfirmationDialog, setOpenConfirmationDialog] =
    React.useState(false); // State to control confirmation dialog
  const [BusOptions, setBusOptions] = React.useState([]);
  const [Form_values, set_Form_Values] = React.useState({});
  const [ConductorOptions, setConductorOptions] = React.useState([]);

  const [loading, set_loading] = React.useState(false);
  const [success, set_success] = React.useState({});
  const [OpenError, set_openError] = React.useState(false);
  const [Error, set_Error] = React.useState({});
  const [scheID, setScheID] = useState(null);

  const navigate = useNavigate();

  const onSubmit = (values, { setSubmitting }) => {
    set_Form_Values(values);
    setOpenConfirmationDialog(true);
    setSubmitting(false);
  };
  useEffect(() => {
    const id = sessionStorage.getItem("id");
    setScheID(id);
  }, [Error]);

  console.log(scheID, "<======== ID")

  function generateTimeOptions(intervalMinutes) {
    const timeOptions = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += intervalMinutes) {
        const hourString = hour.toString().padStart(2, "0");
        const minuteString = minute.toString().padStart(2, "0");
        timeOptions.push(`${hourString}:${minuteString}`);
      }
    }
    return timeOptions;
  }

  const timeOptions = generateTimeOptions(15);

  const handleConfirmation = async () => {
    set_loading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/schedule/create-new-schedule`,
        {
          bus_no: Form_values?.Bus_information,
          conductor_id: Form_values?.Conductor_Information,
          date: Form_values?.Date,
          from_time: Form_values?.In_Time,
          to_time: Form_values?.Out_Time,
          is_scheduled: "Scheduled",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.message === false) {
        if (scheID === null || scheID === "undefined") {
          sessionStorage.setItem("id", response?.data?.data?.data?.id);
        }
        set_Error(response.data?.data?.data);
        set_openError(true);
      } else {
        setOpenDialog(true);
        set_success(response.data?.data);
        sessionStorage.clear("id");
        setScheID(null);
      }
      set_loading(false);
    } catch (error) {
      set_loading(false);
    }
    setOpenConfirmationDialog(false);
  };

  const Update_Schedule = async (id) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/schedule/update-schedule`,
        {
          bus_no: Form_values?.Bus_information,
          conductor_id: Form_values?.Conductor_Information,
          date: Form_values?.Date,
          from_time: Form_values?.In_Time,
          to_time: Form_values?.Out_Time,
          id: scheID,
          is_scheduled: "Scheduled",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      set_openError(false);
      set_success(response.data?.data);
      setOpenDialog(true);

      sessionStorage.clear("id");
      setScheID(null);
    } catch (error) {
      set_loading(false);
      set_Error(error.response.data);
      set_openError(true);
    }
    setOpenConfirmationDialog(false);
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/getAllBusList?limit=100&page=1`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }) // Replace with your actual API endpoint
      .then((response) => {
        setBusOptions(response.data.data.data);
      })
      .catch((error) => console.error("Error fetching bus data:", error));

    // Fetch conductor information
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/getAllConductorsList?limit=100&page=1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ) // Replace with your actual API endpoint
      .then((response) => setConductorOptions(response.data.data.data))
      .catch((error) => console.error("Error fetching conductor data:", error));
  }, []);

  return (
    <>
      <div className="flex flex-1 flex-col bg-white h-screen ">
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
                    <div className="flex flex-col sm:flex-row mt-4">
                      {" "}
                      <div className="flex flex-col flex-1 ml-4 mr-4 ">
                        <div className="flex flex-1 flex-col mt-4">
                          <label htmlFor="Bus_information">
                            Bus Information{" "}
                          </label>
                          <Field
                            as="select"
                            id="Bus_information"
                            name="Bus_information"
                            className="border border-gray-300 rounded-md px-3 py-4 mt-1 w-[80vw] md:w-auto"
                            style={{ boxShadow: "0 1px 4px #fff" }}
                            onFocus={(e) =>
                              (e.target.style.boxShadow = "0 1px 4px #000")
                            }
                            onBlur={(e) => (e.target.style.boxShadow = "none")}
                          >
                            <option className="flex flex-1" value=" ">
                              -Please Select-
                            </option>
                            {BusOptions.map((bus) => (
                              <option
                                key={bus.id}
                                value={bus.register_no}
                              >{`Bus No: -  ${bus.register_no}`}</option>
                            ))}
                          </Field>
                          <ErrorMessage
                            name="Bus_information"
                            component="div"
                            className="text-red-500 ml-4"
                          />
                        </div>
                        <div className="flex flex-1 flex-col mt-8">
                          <label htmlFor="Conductor_Information">
                            Conductor Information{" "}
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
                          >
                            <option className="flex flex-1" value=" ">
                              -Please Select-
                            </option>
                            {ConductorOptions?.map((conductor) => (
                              <option
                                key={conductor.id}
                                value={conductor.cunique_id}
                              >{`${conductor.first_name}- ${conductor.cunique_id}`}</option>
                            ))}
                          </Field>
                          <ErrorMessage
                            name="Conductor_Information"
                            component="div"
                            className="text-red-500 ml-4"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col flex-1 ml-4 mr-4">
                        <div className="flex flex-1 flex-col mt-4">
                          <label htmlFor="Date">Date </label>
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
                        <div className="flex flex-1 flex-col md:flex-row gap-4">
                          <div className="flex flex-1 flex-col mt-8">
                            <label htmlFor="In_Time">In Time </label>
                            <Field
                              as="select"
                              //type="select"
                              id="In_Time"
                              name="In_Time"
                              // format="HH:mm"
                              className="border border-gray-300 rounded-md px-3 py-4 mt-1 w-[80vw] md:w-auto"
                              style={{ boxShadow: "0 1px 4px #fff" }}
                              onFocus={(e) =>
                                (e.target.style.boxShadow = "0 1px 4px #000")
                              }
                              onBlur={(e) =>
                                (e.target.style.boxShadow = "none")
                              }
                            >
                              <option value="">-Please Select-</option>
                              {timeOptions.map((time, index) => (
                                <option key={index} value={time}>
                                  {time}
                                </option>
                              ))}
                            </Field>

                            <ErrorMessage
                              name="In_Time"
                              component="div"
                              className="text-red-500 ml-4"
                            />
                          </div>
                          <div className="flex flex-1 flex-col mt-8">
                            <label htmlFor="Out_Time">Out Time </label>
                            <Field
                              as="select"
                              type="time"
                              id="Out_Time"
                              name="Out_Time"
                              className="border border-gray-300 rounded-md px-3 py-4 mt-1 w-[80vw] md:w-auto"
                              style={{ boxShadow: "0 1px 4px #fff" }}
                              onFocus={(e) =>
                                (e.target.style.boxShadow = "0 1px 4px #000")
                              }
                              onBlur={(e) =>
                                (e.target.style.boxShadow = "none")
                              }
                            >
                              <option value="">-Please Select-</option>
                              {timeOptions.map((time, index) => (
                                <option key={index} value={time}>
                                  {time}
                                </option>
                              ))}
                            </Field>

                            <ErrorMessage
                              name="Out_Time"
                              component="div"
                              className="text-red-500 ml-4"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-row mt-5">
                      <div className="flex flex-1 justify-center items-center ">
                        <div className="flex w-20 h-10 md:w-[80%] border border-[#4245D9] rounded-md shadow-md justify-center items-center">
                          <h2 className="flex text-[#4245D9] font-semibold">
                            Cancel
                          </h2>
                        </div>
                      </div>
                      <div className="flex flex-1 justify-center items-center ">
                        <div className="flex flex-1 justify-center items-center ">
                          <div className="flex w-20 h-10 md:w-[80%] border border-[#4245D9] rounded-md shadow-md justify-center items-center">
                            <h2 className="flex text-[#4245D9] font-semibold">
                              Reset
                            </h2>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-1 justify-center items-center ">
                        <div className="flex flex-1 justify-center items-center ">
                          <button
                            type="submit"
                            className="flex w-20 h-10 md:w-[80%] border bg-[#4245D9] rounded-md shadow-md justify-center items-center"
                          >
                            <h2 className="flex text-white font-semibold">
                              {loading ? "Loading..." : "Save"}
                            </h2>
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
      <Dialog
        open={openConfirmationDialog}
        onClose={() => setOpenConfirmationDialog(false)}
      >
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <p>Are you sure want to submit the form?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmationDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirmation}>Confirm</Button>
        </DialogActions>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogContent>
          <div className="flex flex-1 flex-col justify-center items-center">
            <div className="flex rounded-full bg-green-600 h-20 w-20 justify-center items-center">
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
                  strokeWidth="1.39091"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="flex mt-5 text-xl font-semibold ml-10 mr-10">
              <h2>Congratulation!!</h2>
            </div>
            <div className="flex mt-5 flex-row justify-around">
              <div className="flex text-black font-semibold">
                schedule created successfully
              </div>
            </div>
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
                  strokeWidth="3.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="flex mt-5 text-xl font-semibold ml-10 mr-10">
              <h2>Something went wrong</h2>
            </div>
            <div className="flex mt-5 flex-row justify-around">
              <div className="flex ml-2 text-[#4A4545]">
                {Error?.validation_error}
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions className="bg-red-100">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              Update_Schedule(Error?.data?.id);
            }}
          >
            Update
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={() => set_openError(false)}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
