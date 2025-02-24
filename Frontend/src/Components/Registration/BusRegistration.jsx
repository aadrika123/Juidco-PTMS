import React from "react";
import background_image from "../../assets/background_image.png";
import RMC_logo from "../../assets/RMC_LOGO.png";
import bus from "../../assets/bus 1.png";
import bus1 from "../../assets/bus-2.png";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import Cookies from "js-cookie";
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
    .matches(/^[0-9]{10}$/, "Registration Number must be exactly 10 digits")
    .max(10, "Adhar Number must be exactly 10 digits")
    .required("Registration Number is required"),
  VIN_Number: Yup.string()
    .matches(/^[0-9]{17}$/, "VIN Number must be exactly 17 digits")
    .max(17, "VIN Number must be exactly 17 digits")
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
  if (file.size > MAX_SIZE) {
    console.error("Error: File size exceeds 2MB.");
    alert("Error: File size exceeds 2MB.");
    return;
  } else {
    try {
      setUploading((prev) => ({ ...prev, [type]: true }));10
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

export default function BusRegistration() {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = React.useState(false); // State to control dialog
  const [opeen_error_dialog, set_opeen_error_dialog] = React.useState(false);
  const [uploadedFiles, setUploadedFiles] = React.useState({});
  const token = Cookies.get("accesstoken");
  const [uploading, setUploading] = React.useState({
    Pollution: false,
    Tax: false,
    Registration: false,
  });
  const [loading, set_loading] = React.useState(false);
  const [success, set_success] = React.useState({});
  const [error, set_error] = React.useState({});

  const onSubmit = async (values) => {
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
      set_loading(false);
      set_success(response.data?.data);
      setOpenDialog(true);
    } catch (error) {
      console.error("Error making POST request:", error);
      set_loading(false);
      set_error(error.response.data);
      set_opeen_error_dialog(true);
    }
  };
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
                  <h1 className="flex justify-center items-center text-xl md:text-xl text-[#322F2F] font-semibold  ">
                    Bus Onboarding
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
          <div className="flex flex-col mt-5 w-full h-fit justify-center ">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {({ values, setFieldValue, resetForm }) => (
                <Form className="flex flex-col flex-1 gap-4">
                  <div className="flex flex-1  flex-col md:flex-row">
                    <div className="flex flex-1 flex-col mt-4">
                      <label className="mb-2 ml-4" htmlFor="registration_No">
                        Registration Number
                      </label>
                      <Field
                        type="text"
                        id="registration_No"
                        name="registration_No"
                        className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                        style={{ boxShadow: "0 1px 4px #fff" }}
                        maxlength={10}
                        onFocus={(e) =>
                          (e.target.style.boxShadow = "0 1px 4px #000")
                        }
                        onBlur={(e) => (e.target.style.boxShadow = "none")}
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
                        VIN Number
                      </label>
                      <Field
                        type="text"
                        id="VIN_Number"
                        name="VIN_Number"
                        className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                        style={{ boxShadow: "0 1px 4px #fff" }}
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
                            {uploading.Pollution ? "Uploading..." : "Upload"}
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col mt-4">
                      <label className="mb-2 ml-4" htmlFor="Tax_selectedFile">
                        Tax Copy
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
                          setFieldValue("Tax_selectedFile", e.target.files[0])
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
                          {uploading.Registration ? "Uploading..." : "Upload"}
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
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
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
                {error?.message}
              </div>
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
    </div>
  );
}
