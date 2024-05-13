import React from "react";
import background_image from "../../assets/background_image.png";
import RMC_logo from "../../assets/RMC_LOGO.png";
import bus from "../../assets/bus 1.png";
import bus1 from "../../assets/bus-2.png";
import { Formik, Form, Field, ErrorMessage } from "formik";

import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import * as Yup from "yup";
const initialValues = {
  Bus_information: "",
  Conductor_Information: "",
  Date: "",
  Time: "",
};

const validationSchema = Yup.object({
  Bus_information: Yup.string().required("Bus information is required"),
  Conductor_Information: Yup.string().required(
    "Conductor Information is required"
  ),
  Date: Yup.string().required("Date is required"),
  Time: Yup.string().required("Time is required"),
});
export default function ChangeScheduling() {
  const [openDialog, setOpenDialog] = React.useState(false); // State to control success dialog
  const [openConfirmationDialog, setOpenConfirmationDialog] =
    React.useState(false); // State to control confirmation dialog
  const navigate = useNavigate();

  const onSubmit = (values, { setSubmitting }) => {
    // Handle form submission here
    console.log("Values function started ");
    console.log("Values >> ", values);
    setOpenConfirmationDialog(true);
    setSubmitting(false);
  };

  const handleConfirmation = () => {
    setOpenConfirmationDialog(false);
    setOpenDialog(true);
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <div className="flex flex-1 flex-col bg-white h-screen ">
        <div
          onClick={() => navigate(-1)}
          className="relative w-fit h-fit top-4 left-4"
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
                    Bus & Conductor Mapping
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
                    <div className="flex flex-col sm:flex-row mt-4">
                      {" "}
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
                          <option value="option1">Option 1</option>
                          <option value="option2">Option 2</option>
                          <option value="option3">Option 3</option>
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
                          <option value="option1">Option 1</option>
                          <option value="option2">Option 2</option>
                          <option value="option3">Option 3</option>
                        </Field>
                        <ErrorMessage
                          name="Conductor_Information"
                          component="div"
                          className="text-red-500 ml-4"
                        />
                      </div>
                      <div className="flex flex-1 flex-col mt-8">
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
                      <div className="flex flex-1 flex-col mt-8">
                        <label htmlFor="Time">Time </label>
                        <Field
                          as="input"
                          type="time"
                          id="Time"
                          name="Time"
                          className="border border-gray-300 rounded-md px-3 py-4 mt-1 w-[80vw] md:w-auto"
                          style={{ boxShadow: "0 1px 4px #fff" }}
                          onFocus={(e) =>
                            (e.target.style.boxShadow = "0 1px 4px #000")
                          }
                          onBlur={(e) => (e.target.style.boxShadow = "none")}
                        />

                        <ErrorMessage
                          name="Time"
                          component="div"
                          className="text-red-500 ml-4"
                        />
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
                              Enter
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
          <p>Are you sure you want to submit the form?</p>
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
                Your Conductor ID :
              </div>
              <div className="flex ml-2 text-[#4A4545]">003626565</div>
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
