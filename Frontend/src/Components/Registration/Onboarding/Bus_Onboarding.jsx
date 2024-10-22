import React from "react";
import bus_reg_1 from "../../../assets/bus-reg-1.png";

import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Cookies from "js-cookie";
const token = Cookies.get("accesstoken");
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

const FILE_SIZE = 2 * 1024 * 1024; // 2MB

const initialValues = {
  registration_No: "",
  VIN_Number: "",
  Pollution_selectedFile: null,
  Tax_selectedFile: null,
  Registration_selectedFile: null,
};

const validationSchema = Yup.object({
  registration_No: Yup.string()
    .max(10, "Registration Number must be exactly 10 digits")
    .min(10, "Registration Number must be exactly 10 digits")
    .required("Registration Number is required"),
  VIN_Number: Yup.string()
    .max(17, "VIN Number must be exactly 17 digits")
    .min(17, "VIN Number must be exactly 17 digits")
    .required("VIN Number is required"),
  Pollution_selectedFile: Yup.mixed()
    .required("Pollution Certificate File is required")
    .test(
      "fileSize",
      "File too large, maximum size is 2MB",
      (value) => !value || (value && value.size <= FILE_SIZE)
    ),
  Tax_selectedFile: Yup.mixed()
    .required("Tax Certificate File is required")
    .test(
      "fileSize",
      "File too large, maximum size is 2MB",
      (value) => !value || (value && value.size <= FILE_SIZE)
    ),
  Registration_selectedFile: Yup.mixed()
    .required("Registration Certificate File is required")
    .test(
      "fileSize",
      "File too large, maximum size is 2MB",
      (value) => !value || (value && value.size <= FILE_SIZE)
    ),
});

const handle_Image_upload = async (
  file,
  type,
  setUploadedFiles,
  setUploading
) => {
  const formData = new FormData();
  const MAX_SIZE = 2 * 1024 * 1024;
  formData.append("img", file);
  console.log("File Size", file.size);
  if (file.size > MAX_SIZE) {
    console.error("Error: File size exceeds 2MB.");
    alert("Error: File size exceeds 2MB.");
    return;
  } else {
    try {
      setUploading((prev) => ({ ...prev, [type]: true }));
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/common/img-upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUploadedFiles((prev) => ({ ...prev, [type]: response.data.data }));
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
    }
  }
};

export default function Bus_Onboarding() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  // console.log(location);
  const [openDialog, setOpenDialog] = React.useState(false); // State to control dialog
  const [opeen_error_dialog, set_opeen_error_dialog] = React.useState(false);
  const [uploadedFiles, setUploadedFiles] = React.useState({});

  const [uploading, setUploading] = React.useState({
    Pollution: false,
    Tax: false,
    Registration: false,
  });
  const [loading, set_loading] = React.useState(false);
  const [success, set_success] = React.useState({});
  const [error, set_error] = React.useState({});

  // console.log(uploading, "uploading------------------>");

  const handle_logOut = () => {
    console.log("Log out");
    Cookies.remove("accesstoken", { path: "/" });
    sessionStorage.clear();
    navigate("/");
    window.location.reload();
  };

  const onSubmit = async (values) => {
    // console.log(values);
    set_loading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/onBoardingBus`,
        {
          registration_no: values.registration_No,
          pollution_cert: uploadedFiles?.Pollution,
          taxCopy_cert: uploadedFiles?.Tax,
          vin_no: values.VIN_Number,
          registration_cert: uploadedFiles?.Registration,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response >>>>>> ", response);

      //
      if (response?.data?.status == "Error") {
        console.log("Error Occured");
        console.log("Client error occurred");
        const responseData = response?.data?.message;
        set_loading(false);
        set_error(responseData);
        set_opeen_error_dialog(true);
      } else {
        const responseData = response?.data?.data;
        set_loading(false);
        set_success(responseData);
        setOpenDialog(true);
      }

      /* if (typeof responseData === "string") {
        if (responseData.includes("Client error")) {
          console.log("Client error occurred");
          set_loading(false);
          set_error(responseData);
          set_opeen_error_dialog(true);
        } else {
         
        }
      } else {
        // Handle other types of response data here if needed
        set_loading(false);
        set_success(responseData?.data || responseData);
        setOpenDialog(true);
      } */
    } catch (error) {
      console.error("Error making POST request:", error);
      set_loading(false);
      set_error(error.response?.data || "An error occurred");
      set_opeen_error_dialog(true);
    }
  };

  return (
    <>
      <div className="flex flex-1 ">
        <div className="flex flex-col flex-1 bg-[#F9FAFC]">
          <div className="flex h-10 justify-between items-center">
            <div className="flex ml-4 ">
              <div className="flex flex-row">
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
              Bus Registration
            </div>
          </div>

          <div className="flex flex-1 flex-col bg-white m-2 rounded-md shadow-lg border-2 ">
            <div className="flex  h-fit justify-start items-start">
              <div className="flex flex-row ml-10 ">
                <img src={bus_reg_1} />
                <div className="flex text-xl font-semibold justify-center items-center ml-4 ">
                  Add New Bus
                </div>
              </div>
            </div>
            <div className="flex flex-1 justify-center items-center">
              <div className="flex flex-col w-full h-fit justify-center ">
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                >
                  {({ values, setFieldValue, resetForm }) => (
                    <Form className="flex flex-col flex-1 gap-4">
                      <div className="flex flex-1  flex-col md:flex-row">
                        <div className="flex flex-1 flex-col mt-4">
                          <label
                            className="mb-2 ml-4"
                            htmlFor="registration_No"
                          >
                            Registration Number
                            <span className="text-red-500">*</span>
                          </label>
                          <Field
                            type="text"
                            id="registration_No"
                            placeholder="Enter the value in Capital letters"
                            name="registration_No"
                            className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                            style={{ boxShadow: "0 1px 4px #fff" }}
                            onFocus={(e) =>
                              (e.target.style.boxShadow = "0 1px 4px #000")
                            }
                            onBlur={(e) => (e.target.style.boxShadow = "none")}
                            maxlength={10}
                            onKeyPress={(e) => {
                              if (
                                !(
                                  (e.key >= "0" || e.key >= "A") &&
                                  (e.key <= "9" || e.key <= "Z")
                                )
                              ) {
                                e.preventDefault();
                              }
                            }}
                          />
                          <ErrorMessage
                            name="registration_No"
                            component="div"
                            className="text-red-500 ml-4"
                          />
                        </div>
                        <div className="flex flex-1 flex-col mt-4">
                          <label className="mb-2 ml-4" htmlFor="VIN_Number">
                            {`VIN / Chassis  Number`}
                            <span className="text-red-500">*</span>
                          </label>
                          <Field
                            type="text"
                            id="VIN_Number"
                            name="VIN_Number"
                            placeholder="Enter the value in Capital letters"
                            className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                            style={{ boxShadow: "0 1px 4px #fff" }}
                            maxlength={17}
                            onKeyPress={(e) => {
                              if (
                                !(
                                  (e.key >= "0" || e.key >= "A") &&
                                  (e.key <= "9" || e.key <= "Z")
                                )
                              ) {
                                e.preventDefault();
                              }
                            }}
                            onFocus={(e) =>
                              (e.target.style.boxShadow = "0 1px 4px #000")
                            }
                            onBlur={(e) => (e.target.style.boxShadow = "none")}
                          />
                          <ErrorMessage
                            name="VIN_Number"
                            component="div"
                            className="text-red-500 ml-4"
                          />
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col md:flex-row">
                        <div className="flex flex-1 flex-col mt-4">
                          <label
                            className="mb-2 ml-4"
                            htmlFor="Pollution_selectedFile"
                          >
                            Pollution Certificate
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="file"
                            id="Pollution_selectedFile"
                            name="Pollution_selectedFile"
                            accept="image/*"
                            className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                            style={{ boxShadow: "0 1px 4px #fff" }}
                            onFocus={(e) =>
                              (e.target.style.boxShadow = "0 1px 4px #000")
                            }
                            onBlur={(e) => (e.target.style.boxShadow = "none")}
                            onChange={(e) =>
                              setFieldValue(
                                "Pollution_selectedFile",
                                e.target.files[0]
                              )
                            }
                          />
                          <ErrorMessage
                            name="Pollution_selectedFile"
                            component="div"
                            className="text-red-500 ml-4"
                          />
                          {values.Pollution_selectedFile && (
                            <div className="flex flex-1 justify-end mr-8 ml-8 mt-2">
                              {uploadedFiles.Pollution && (
                                <div className="text-green-500 ml-4 mt-2">
                                  Pollution Certificate Uploaded
                                </div>
                              )}
                              <button
                                type="button"
                                className="flex justify-end items-end  ml-4 px-4 w-fit h-[40px] py-2 bg-[#4245D9] text-white rounded"
                                onClick={() =>
                                  handle_Image_upload(
                                    values.Pollution_selectedFile,
                                    "Pollution",
                                    setUploadedFiles,
                                    setUploading
                                  )
                                }
                                disabled={uploading.Pollution}
                              >
                                {uploading.Pollution
                                  ? "Uploading..."
                                  : "Upload"}
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-1 flex-col mt-4">
                          <label
                            className="mb-2 ml-4"
                            htmlFor="Tax_selectedFile"
                          >
                            Tax Copy
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="file"
                            id="Tax_selectedFile"
                            name="Tax_selectedFile"
                            accept="image/*"
                            className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                            style={{ boxShadow: "0 1px 4px #fff" }}
                            onFocus={(e) =>
                              (e.target.style.boxShadow = "0 1px 4px #000")
                            }
                            onBlur={(e) => (e.target.style.boxShadow = "none")}
                            onChange={(e) =>
                              setFieldValue(
                                "Tax_selectedFile",
                                e.target.files[0]
                              )
                            }
                          />
                          <ErrorMessage
                            name="Tax_selectedFile"
                            component="div"
                            className="text-red-500 ml-4"
                          />
                          {values.Tax_selectedFile && (
                            <div className="flex  justify-end mr-8 ml-8 mt-2">
                              {uploadedFiles.Tax && (
                                <div className="text-green-500 ml-4 mt-2">
                                  Tax Certificate Uploaded
                                </div>
                              )}
                              <button
                                type="button"
                                className="flex justify-center items-center  ml-4 px-4 w-fit h-[40px] py-2 bg-[#4245D9] text-white rounded"
                                onClick={() =>
                                  handle_Image_upload(
                                    values.Tax_selectedFile,
                                    "Tax",
                                    setUploadedFiles,
                                    setUploading
                                  )
                                }
                                disabled={uploading.Tax}
                              >
                                {uploading.Tax ? "Uploading..." : "Upload"}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col mt-4">
                        <label
                          className="mb-2 ml-4"
                          htmlFor="Registration_selectedFile"
                        >
                          Registration Certificate
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="file"
                          id="Registration_selectedFile"
                          name="Registration_selectedFile"
                          accept="image/*"
                          className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                          style={{ boxShadow: "0 1px 4px #fff" }}
                          onFocus={(e) =>
                            (e.target.style.boxShadow = "0 1px 4px #000")
                          }
                          onBlur={(e) => (e.target.style.boxShadow = "none")}
                          onChange={(e) =>
                            setFieldValue(
                              "Registration_selectedFile",
                              e.target.files[0]
                            )
                          }
                        />
                        <ErrorMessage
                          name="Registration_selectedFile"
                          component="div"
                          className="text-red-500 ml-4"
                        />
                        {values.Registration_selectedFile && (
                          <div className="flex flex-1 justify-end mr-8 ml-8 mt-2">
                            {uploadedFiles.Registration && (
                              <div className="text-green-500 ml-4 mt-2">
                                Registration Certificate Uploaded
                              </div>
                            )}
                            <button
                              type="button"
                              className="flex justify-end items-end  ml-4 px-4 w-fit h-[40px] py-2 bg-[#4245D9] text-white rounded"
                              onClick={() =>
                                handle_Image_upload(
                                  values.Registration_selectedFile,
                                  "Registration",
                                  setUploadedFiles,
                                  setUploading
                                )
                              }
                              disabled={uploading.Registration}
                            >
                              {uploading.Registration
                                ? "Uploading..."
                                : "Upload"}
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-1 flex-row mt-5">
                        <div className="flex flex-1 justify-center items-center ">
                          <button
                            onClick={() => navigate(-1)}
                            className="flex w-20 h-10 md:w-[80%] border border-[#4245D9] rounded-md shadow-md justify-center items-center"
                          >
                            <h2 className="flex text-[#4245D9] font-semibold">
                              Cancel
                            </h2>
                          </button>
                        </div>
                        <div className="flex flex-1 justify-center items-center ">
                          <div className="flex flex-1 justify-center items-center ">
                            <button
                              onClick={() => {
                                resetForm();
                                setUploadedFiles({});
                                window.location.reload();
                              }}
                              className="flex w-20 h-10 md:w-[80%] border border-[#4245D9] rounded-md shadow-md justify-center items-center"
                            >
                              <h2 className="flex text-[#4245D9] font-semibold">
                                Reset
                              </h2>
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-1 justify-center items-center ">
                          <div className="flex flex-1 justify-center items-center ">
                            <button
                              type="submit"
                              disabled={loading}
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
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <div className="flex mt-5 text-xl font-semibold ml-10 mr-10">
              <h2>Congratulation!! Bus Added Successfully</h2>
            </div>
            <div className="flex mt-5 flex-row justify-around">
              <div className="flex text-black font-semibold">RC Number :</div>
              <div className="flex ml-2 text-[#4A4545]">
                {success?.register_no}
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Link to="/Bus-onboarding-view" className="flex flex-1">
            <Button onClick={() => setOpenDialog(false)}>Close</Button>
          </Link>
        </DialogActions>
      </Dialog>

      <Dialog
        open={opeen_error_dialog}
        onClose={() => set_opeen_error_dialog(false)}
      >
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
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <div className="flex mt-5 text-xl font-semibold ml-10 mr-10">
              <h2>Something went wrong</h2>
            </div>
            <div className="flex mt-5 flex-row justify-around">
              <div className="flex w-fit ml-2 text-[#4A4545]">{error}</div>
            </div>
          </div>
        </DialogContent>
        <DialogActions className="bg-red-100">
          <Button
            variant="contained"
            color="error"
            onClick={() => set_opeen_error_dialog(false)}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
