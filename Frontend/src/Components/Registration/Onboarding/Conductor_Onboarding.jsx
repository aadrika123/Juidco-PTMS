import React from "react";
import bus from "../../../assets/bus 1.png";
import busstop from "../../../assets/bus-stop.png";
import Avatar from "@mui/material/Avatar";

import sample_profile from "../../../assets/sample_profile.png";
import bus_reg_1 from "../../../assets/conductor-icon.png";

import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import toast, { Toaster } from "react-hot-toast";

import Cookies from "js-cookie";
const token = Cookies.get("accesstoken");

const FILE_SIZE = 2 * 1024 * 1024; // 2MB

const initialValues = {
  Aadhaar_NO: "",
  Name: "",
  last_Name: "",
  Middle_Name: "",
  Age: "",
  Blood_Group: "",
  Fitness_Certificate_selectedFile: null,
  Aadhaar_card_selectedFile: null,
  Contact_Number: "",
  Emergency_Contact_Number: "",
  EmailId: "",
};

const validationSchema = Yup.object({
  Aadhaar_NO: Yup.string()
    .required("Aadhaar Number is required")
    .max(12, "Aadhaar Number must be exactly 12 digits")
    .min(12, "Aadhaar Number must be exactly 12 digits")
    .matches(/^[0-9]{12}$/, "Aadhaar Number must be 12 digits"),
  Name: Yup.string()
    //.max(3, "Minimum 3 characters")
    .min(3, "Minimum 3 characters")
    .required("Name is required"),
  Age: Yup.string()
    // .required("Age is required")
    .test(
      "is-over-18",
      "Age must be more than 18 years and less than 60 years",
      (value) => {
        const age = parseInt(value, 10); // Convert age to a number
        return age >= 18 && age < 60; // Check if age is greater than or equal to 18
      }
    ),
  Middle_Name: Yup.string().min(3, "Minimum 3 characters"),
  last_Name: Yup.string()
    //.max(3, "Minimum 3 characters")
    .min(3, "Minimum 3 characters")
    .required("Last Name is required"),
  Blood_Group: Yup.string().required("Blood Group is required"),
  Fitness_Certificate_selectedFile: Yup.mixed()
    .required("Fitness Certificate File is required")
    .test(
      "fileSize",
      "File too large, maximum size is 2MB",
      (value) => !value || (value && value.size <= FILE_SIZE)
    ),
  Aadhaar_card_selectedFile: Yup.mixed()
    .required("Aadhaar Card is required")
    .test(
      "fileSize",
      "File too large, maximum size is 2MB",
      (value) => !value || (value && value.size <= FILE_SIZE)
    ),
  Contact_Number: Yup.string()
    .required("Contact Number is required")
    .max(10, "Contact Number must be exactly 10 digits")
    .min(10, "Contact Number must be exactly 10 digits")
    .matches(/^[0-9]{10}$/, "Must be 10 digits"),
  Emergency_Contact_Number: Yup.string()
    .matches(/^[0-9]{10}$/, "Must be 10 digits")
    .max(10, "Contact Number must be exactly 10 digits")
    .min(10, "Contact Number must be exactly 10 digits")
    .notRequired(),
  EmailId: Yup.string()
    .email("Email is invalid")
    .required("Email is required and Must be Unique"),
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

export default function Conductor_Onboarding() {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = React.useState(false); // State to control dialog
  const [opeen_error_dialog, set_opeen_error_dialog] = React.useState(false);
  const [uploadedFiles, setUploadedFiles] = React.useState({});
  const location = useLocation();
  const path = location.pathname;
  const [isAdult, setIsAdult] = React.useState(false);

  const [uploading, setUploading] = React.useState({
    Fitness_Certificate: false,
    Adhar_card: false,
    //Registration: false,
  });
  const [loading, set_loading] = React.useState(false);
  const [success, set_success] = React.useState({});
  const [error, set_error] = React.useState({});


  const onSubmit = async (values, reset) => {
    if (!uploadedFiles?.Fitness_Certificate && !uploadedFiles?.Aadhaar_card) {
      toast.error("Certificats were not Uploaded");
    } else if (!uploadedFiles?.Fitness_Certificate) {
      toast.error("Fitness Certificate is not Uploaded");
    } else if (!uploadedFiles?.Aadhaar_card) {
      toast.error("Aadhaar Card is not Uploaded");
    } else {
      set_loading(true);
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/onBoardingConductor`,
          {
            firstName: values.Name,
            middleName: values?.Middle_Name || "null",
            lastName: values?.last_Name,
            bloodGrp: values.Blood_Group,
            mobileNo: values.Contact_Number,
            emailId: values.EmailId,
            emergencyMobNo: values.Emergency_Contact_Number,
            age: values.Age,
            adhar_no: values.Aadhaar_NO,
            adhar_doc: uploadedFiles?.Aadhaar_card,
            fitness_doc: uploadedFiles?.Fitness_Certificate,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        set_loading(false);
     
        if (response.data?.data) {
         
          setOpenDialog(true);
          set_success(response?.data?.data?.cunique_id);
         
        } else {
          set_loading(false);
          
          set_error(response?.data);
          set_opeen_error_dialog(true);
        }
      } catch (error) {
        console.error("Error making POST request:", error);
        set_loading(false);
        const errorMessage = error?.response?.data?.message;
        set_error(errorMessage);
       

        if (
          typeof errorMessage === "string" &&
          errorMessage.includes("Conductor Already Registered")
        ) {
          console.log("Conductor Already Registered");
        }
        set_opeen_error_dialog(true);
      }
      reset.resetForm();
    }
  };

  const validateDob = (e) => {
    const dob = new Date(e.target.value);
    const isAtLeast18 =
      new Date(dob.getFullYear() + 18, dob.getMonth() - 1, dob.getDate()) <=
      new Date();
    if (isAtLeast18) {
      setIsAdult(false);
    } else {
      setIsAdult(true);
    }
    console.log(isAtLeast18);
  };

  return (
    <>
      <Toaster />
      <div className="flex flex-1 ">
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
              Conductor Registration
            </div>
          </div>

          <div className="flex flex-1 flex-col bg-white m-4">
            <div className="flex  h-fit justify-between items-start">
              <div className="flex flex-row ml-10 mt-6">
                <img src={bus_reg_1} />
                <div className="flex text-xl font-semibold justify-center items-center ml-4 ">
                  Add New Conductor
                </div>
              </div>
            </div>
            <div className="flex flex-1 justify-center items-center">
              <div className="flex flex-col w-full  justify-center ">
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                >
                  {({ values, setFieldValue, resetForm }) => (
                    <Form className="flex flex-col flex-1 gap-4">
                      <div className="flex flex-col sm:flex-row mt-4">
                        <div className="flex flex-1 flex-col mt-4">
                          <label className="mb-2 ml-4" htmlFor="Aadhaar_NO">
                            Aadhaar Number
                            <span className="text-red-500">*</span>
                          </label>
                          <Field
                            type="text"
                            id="Aadhaar_NO"
                            name="Aadhaar_NO"
                            className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                            style={{ boxShadow: "0 1px 4px #fff" }}
                            onFocus={(e) =>
                              (e.target.style.boxShadow = "0 1px 4px #000")
                            }
                            onBlur={(e) => (e.target.style.boxShadow = "none")}
                            maxLength={12}
                            onKeyPress={(e) => {
                              if (!(e.key >= "0" && e.key <= "9")) {
                                e.preventDefault();
                              }
                            }}
                          />
                          <ErrorMessage
                            name="Aadhaar_NO"
                            component="div"
                            className="text-red-500 ml-4"
                          />
                        </div>
                        <div className="flex flex-1 flex-col mt-4">
                          <label className="mb-2 ml-4" htmlFor="Name">
                            First Name
                            <span className="text-red-500">*</span>
                          </label>
                          <Field
                            type="text"
                            id="Name"
                            name="Name"
                            className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                            style={{ boxShadow: "0 1px 4px #fff" }}
                            maxLength={30}
                            onKeyPress={(e) => {
                              if (
                                !(
                                  (e.key >= "a" && e.key <= "z") ||
                                  (e.key >= "A" && e.key <= "Z")
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
                            name="Name"
                            component="div"
                            className="text-red-500 ml-4"
                          />
                        </div>
                        <div className="flex flex-1 flex-col mt-4">
                          <label className="mb-2 ml-4" htmlFor="Middle_Name">
                            Middle Name
                            {/* <span className="text-red-500">*</span> */}
                          </label>
                          <Field
                            type="text"
                            name="Middle_Name"
                            className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                            style={{ boxShadow: "0 1px 4px #fff" }}
                            maxLength={30}
                            onKeyPress={(e) => {
                              if (
                                !(
                                  (e.key >= "a" && e.key <= "z") ||
                                  (e.key >= "A" && e.key <= "Z")
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
                            name="Middle_Name"
                            component="div"
                            className="text-red-500 ml-4"
                          />
                        </div>
                        <div className="flex flex-1 flex-col mt-4">
                          <label className="mb-2 ml-4" htmlFor="last_Name">
                            Last Name
                            <span className="text-red-500">*</span>
                          </label>
                          <Field
                            type="text"
                            id="last_Name"
                            name="last_Name"
                            className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                            style={{ boxShadow: "0 1px 4px #fff" }}
                            maxLength={30}
                            onFocus={(e) =>
                              (e.target.style.boxShadow = "0 1px 4px #000")
                            }
                            onBlur={(e) => (e.target.style.boxShadow = "none")}
                          />
                          <ErrorMessage
                            name="last_Name"
                            component="div"
                            className="text-red-500 ml-4"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row mt-4">
                        <div className="flex flex-1 flex-col mt-4">
                          <label className="mb-2 ml-4" htmlFor="Age">
                            Age
                            <span className="text-red-500">*</span>
                          </label>
                          <Field
                            type="text"
                            id="Age"
                            name="Age"
                            className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                            style={{ boxShadow: "0 1px 4px #fff" }}
                            onFocus={(e) =>
                              (e.target.style.boxShadow = "0 1px 4px #000")
                            }
                            onBlur={(e) => (e.target.style.boxShadow = "none")}
                            maxLength={2}
                            onKeyPress={(e) => {
                              if (!(e.key >= "0" && e.key <= "9")) {
                                e.preventDefault();
                              }
                            }}
                          />
                          <ErrorMessage
                            name="Age"
                            component="div"
                            className="text-red-500 ml-4"
                          />
                        </div>
                        <div className="flex flex-1 flex-col mt-4">
                          <label className="mb-2 ml-4" htmlFor="Blood_Group">
                            Blood Group
                            <span className="text-red-500">*</span>
                          </label>
                          <Field
                            as="select"
                            type="input"
                            id="Blood_Group"
                            name="Blood_Group"
                            className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                            style={{ boxShadow: "0 1px 4px #fff" }}
                            onFocus={(e) =>
                              (e.target.style.boxShadow = "0 1px 4px #000")
                            }
                            onBlur={(e) => (e.target.style.boxShadow = "none")}
                          >
                            <option className="flex flex-1" value=" ">
                              -Please Select-
                            </option>
                            <option value={"A+"}>A+</option>
                            <option value={"A-"}>A-</option>
                            <option value={"B+"}>B+</option>
                            <option value={"B-"}>B-</option>
                            <option value={"AB+"}>AB+</option>
                            <option value={"AB-"}>AB-</option>
                            <option value={"O+"}>O+</option>
                            <option value={"O-"}>O-</option>
                          </Field>
                          <ErrorMessage
                            name="Blood_Group"
                            component="div"
                            className="text-red-500 ml-4"
                          />
                        </div>
                        <div className="flex flex-1 flex-col mt-4">
                          <label
                            className="mb-2 ml-4"
                            htmlFor="Fitness_Certificate_selectedFile"
                          >
                            Fitness Certificate
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="file"
                            id="Fitness_Certificate_selectedFile"
                            name="Fitness_Certificate_selectedFile"
                            accept="image/*"
                            className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                            style={{ boxShadow: "0 1px 4px #fff" }}
                            onFocus={(e) =>
                              (e.target.style.boxShadow = "0 1px 4px #000")
                            }
                            onBlur={(e) => (e.target.style.boxShadow = "none")}
                            onChange={(e) =>
                              setFieldValue(
                                "Fitness_Certificate_selectedFile",
                                e.target.files[0]
                              )
                            }
                          />
                          <ErrorMessage
                            name="Fitness_Certificate_selectedFile"
                            component="div"
                            className="text-red-500 ml-4"
                          />
                          {values.Fitness_Certificate_selectedFile && (
                            <div className="flex flex-1 justify-end mr-8 ml-8 mt-2">
                              {uploadedFiles.Fitness_Certificate && (
                                <div className="text-green-500 ml-4 mt-2">
                                  Fitness Certificate Uploaded
                                </div>
                              )}
                              <button
                                type="button"
                                className="flex flex- justify-end items-end ml-4 px-4  w-fit h-[40px] py-2 bg-[#4245D9] text-white rounded"
                                onClick={() =>
                                  handle_Image_upload(
                                    values.Fitness_Certificate_selectedFile,
                                    "Fitness_Certificate",
                                    setUploadedFiles,
                                    setUploading
                                  )
                                }
                                disabled={uploading.Fitness_Certificate}
                              >
                                {uploading.Fitness_Certificate
                                  ? "Uploading..."
                                  : "Upload"}
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col mt-4">
                          <label
                            className="mb-2 ml-4"
                            htmlFor="Aadhaar_card_selectedFile"
                          >
                            Aadhaar card
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="file"
                            id="Aadhaar_card_selectedFile"
                            name="Aadhaar_card_selectedFile"
                            accept="image/*"
                            className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                            style={{ boxShadow: "0 1px 4px #fff" }}
                            onFocus={(e) =>
                              (e.target.style.boxShadow = "0 1px 4px #000")
                            }
                            onBlur={(e) => (e.target.style.boxShadow = "none")}
                            onChange={(e) =>
                              setFieldValue(
                                "Aadhaar_card_selectedFile",
                                e.target.files[0]
                              )
                            }
                          />
                          <ErrorMessage
                            name="Aadhaar_card_selectedFile"
                            component="div"
                            className="text-red-500 ml-4"
                          />
                          {values.Aadhaar_card_selectedFile && (
                            <div className="flex flex-1 justify-end mr-8 ml-8 mt-2">
                              {uploadedFiles.Aadhaar_card && (
                                <div className="text-green-500 ml-4 mt-2 ">
                                  Aadhaar Card Uploaded
                                </div>
                              )}
                              <button
                                type="button"
                                className="flex justify-end items-end ml-4 px-4 w-fit h-[40px] py-2 bg-[#4245D9] text-white rounded"
                                onClick={() =>
                                  handle_Image_upload(
                                    values.Aadhaar_card_selectedFile,
                                    "Aadhaar_card",
                                    setUploadedFiles,
                                    setUploading
                                  )
                                }
                                disabled={uploading.Aadhaar_card}
                              >
                                {uploading.Aadhaar_card
                                  ? "Uploading..."
                                  : "Upload"}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row">
                        <div className="flex flex-1 flex-col mt-4">
                          <label className="mb-2 ml-4" htmlFor="Contact_Number">
                            Contact Number
                            <span className="text-red-500">*</span>
                          </label>
                          <Field
                            type="text"
                            id="Contact_Number"
                            name="Contact_Number"
                            placeholder="+91 "
                            className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                            style={{ boxShadow: "0 1px 4px #fff" }}
                            maxLength={10}
                            onKeyPress={(e) => {
                              if (!(e.key >= "0" && e.key <= "9")) {
                                e.preventDefault();
                              }
                            }}
                            onFocus={(e) =>
                              (e.target.style.boxShadow = "0 1px 4px #000")
                            }
                            onBlur={(e) => (e.target.style.boxShadow = "none")}
                          />
                          <ErrorMessage
                            name="Contact_Number"
                            component="div"
                            className="text-red-500 ml-4"
                          />
                        </div>
                        <div className="flex flex-1 flex-col mt-4">
                          <label
                            className="mb-2 ml-4"
                            htmlFor="Emergency_Contact_Number"
                          >
                            Emergency Contact Number
                          </label>
                          <Field
                            type="text"
                            id="Emergency_Contact_Number"
                            name="Emergency_Contact_Number"
                            placeholder="+91 "
                            className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                            style={{ boxShadow: "0 1px 4px #fff" }}
                            onFocus={(e) =>
                              (e.target.style.boxShadow = "0 1px 4px #000")
                            }
                            maxLength={10}
                            onKeyPress={(e) => {
                              if (!(e.key >= "0" && e.key <= "9")) {
                                e.preventDefault();
                              }
                            }}
                            onBlur={(e) => (e.target.style.boxShadow = "none")}
                          />
                          <ErrorMessage
                            name="Emergency_Contact_Number"
                            component="div"
                            className="text-red-500 ml-4"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col mt-4">
                        <label className="mb-2 ml-4" htmlFor="EmailId">
                          Email Id
                          <span className="text-red-500">*</span>
                        </label>
                        <Field
                          type="email"
                          id="EmailId"
                          name="EmailId"
                          placeholder="sample_email@gmail.com"
                          className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                          style={{ boxShadow: "0 1px 4px #fff" }}
                          maxLength={80}
                          onFocus={(e) =>
                            (e.target.style.boxShadow = "0 1px 4px #000")
                          }
                          onBlur={(e) => (e.target.style.boxShadow = "none")}
                        />
                        <ErrorMessage
                          name="EmailId"
                          component="div"
                          className="text-red-500 ml-4"
                        />
                      </div>
                      <div className="flex flex-1 flex-row mt-5">
                        <div className="flex flex-1 justify-center items-center ">
                          <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="flex w-20 h-10 md:w-[80%] border border-[#4245D9] rounded-md shadow-md justify-center items-center"
                          >
                            <h2 className="flex text-[#4245D9] font-semibold">
                              Cancel
                            </h2>
                          </button>
                        </div>
                        <div className="flex flex-1 justify-center items-center ">
                          <button
                            type="button"
                            onClick={() => {
                              resetForm();
                              setUploadedFiles({});
                            }}
                            className="flex w-20 h-10 md:w-[80%] border border-[#4245D9] rounded-md shadow-md justify-center items-center"
                          >
                            <h2 className="flex text-[#4245D9] font-semibold">
                              Reset
                            </h2>
                          </button>
                        </div>
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
            <div className="flex rounded-full bg-green-500 h-20 w-20 justify-center items-center">
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
              <h2>Congratulation!! Conductor Added Successfully</h2>
            </div>
            <div className="flex mt-5 flex-row justify-around">
              <div className="flex text-black font-semibold">
                Conductor ID :
              </div>
              <div className="flex ml-2 text-[#4A4545]">{success}</div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Link to="/Conductor-onboarding-view" className="flex flex-1">
            <Button onClick={() => setOpenDialog(false)}>Close</Button>
          </Link>
        </DialogActions>
      </Dialog>

      <Dialog
        open={opeen_error_dialog}
        fullWidth={true}
        maxWidth={"xs"}
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
              <div className="flex w-fit h-fit ml-2 text-[#4A4545]">
                {"Something Went Wrong Please Fill the Form Properly."}
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
    </>
  );
}
