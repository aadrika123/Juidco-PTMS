import React from "react";
import background_image from "../../assets/background_image.png";
import RMC_logo from "../../assets/RMC_LOGO.png";
import bus from "../../assets/bus 1.png";
import bus1 from "../../assets/bus-2.png";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import * as Yup from "yup";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

const FILE_SIZE = 2 * 1024 * 1024; // 2MB

const initialValues = {
  Name: "",
  Middle_Name: "",
  Adhar_NO: "",
  last_Name: "",
  Age: "",
  Blood_Group: "",
  Fitness_Certificate_selectedFile: null,
  Adhar_card_selectedFile: null,
  Contact_Number: "",
  Emergency_Contact_Number: "",
  EmailId: "",
};
import Cookies from "js-cookie";

const validationSchema = Yup.object({
  Name: Yup.string().required("Name is required"),
  Age: Yup.string()
    .required("Age is required")
    .transform((value) => (value ? Number(value) : 0)) // Transform string to number
    .test(
      "is-older-than-18",
      "Age must be more than 18",
      (value) => value > 18
    ),
  Blood_Group: Yup.string().required("Blood Group is required"),
  Adhar_NO: Yup.string()
    .required("Adhar Number is required")
    .matches(/^[0-9]{12}$/, "Adhar Number must be exactly 12 digits")
    .max(12, "Adhar Number must be exactly 12 digits"),
  Contact_Number: Yup.string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .max(10, "Must be 10 digits")
    .required("Contact Number is required"),
  Emergency_Contact_Number: Yup.string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .max(10, "Must be 10 digits"),
  Fitness_Certificate_selectedFile: Yup.mixed()
    .required("Fitness Certificate File is required")
    .test(
      "fileSize",
      "File too large, maximum size is 2MB",
      (value) => !value || (value && value.size <= FILE_SIZE)
    ),
  Adhar_card_selectedFile: Yup.mixed()
    .required("Adhar Card is required")
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

export default function ConductorRegistration() {
  const [openDialog, setOpenDialog] = React.useState(false); // State to control dialog
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = React.useState({});
  const [uploading, setUploading] = React.useState(false);
  const [loading, set_loading] = React.useState(false);
  const [error, set_error] = React.useState({});
  const [success, set_success] = React.useState({});
  const [opeen_error_dialog, set_open_error_dialog] = React.useState(false);

  console.log(uploadedFiles);
  const onSubmit = async (values) => {
    console.log(values);
    set_loading(true);
    const token = Cookies.get("accesstoken");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/onBoardingConductor`,
        {
          firstName: values.Name,
          middleName: values?.Middle_Name,
          lastName: values?.last_Name,
          bloodGrp: values.Blood_Group,
          mobileNo: values.Contact_Number.toString(),
          emailId: values.EmailId,
          emergencyMobNo: values.Emergency_Contact_Number.toString(),
          age: values.Age.toString(),
          adhar_no: values.Adhar_NO.toString(),
          adhar_doc: uploadedFiles?.Adhar_card,
          fitness_doc: uploadedFiles?.Fitness_Certificate,
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
      set_open_error_dialog(true);
    }
  };
  return (
    <div className="flex flex-1 items-center justify-center h-screen w-screen">
      <div className="flex flex-1 flex-col bg-white h-screen ">
        <div
          onClick={() => navigate(-1)}
          className="relative w-fit h-fit top-4 left-4 md:hidden"
        >
          <svg width="40" height="40" viewBox="0 0 96 96" fill="none">
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
                  <div className="flex mt-2 flex-row ">
                    <h1 className="text-md font-bold text-gradient-to-b text-[#1436C3]">
                      Urban Transport
                    </h1>
                    <img
                      src={bus1}
                      alt="Bus"
                      className="ml-2 max-w-full h-auto md:h-5"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col flex-1  justify-center items-end">
                <div className="flex flex-row mt-2 md:mt-8 md:mr-8">
                  <h1 className="flex justify-center items-center text-xl md:text-xl text-[#322F2F] font-semibold  ">
                    Conductor Registration
                  </h1>
                  <img
                    src={bus}
                    alt="Bus"
                    className="ml-2 max-w-full h-auto md:h-8"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative w-full flex-col overflow-y-auto">
          <div className="flex flex-col w-full  justify-center ">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {({ values, setFieldValue, resetForm }) => (
                <Form className="flex flex-col flex-1 gap-4">
                  <div className="flex flex-col sm:flex-row mt-4">
                    {" "}
                    <div className="flex flex-1 flex-col mt-4">
                      <label className="mb-2 ml-4" htmlFor="Adhar_NO">
                        Aadhaar Number
                      </label>
                      <Field
                        type="number"
                        id="Adhar_NO"
                        name="Adhar_NO"
                        className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                        style={{ boxShadow: "0 1px 4px #fff" }}
                        onFocus={(e) =>
                          (e.target.style.boxShadow = "0 1px 4px #000")
                        }
                        onBlur={(e) => (e.target.style.boxShadow = "none")}
                      />
                      <ErrorMessage
                        name="Adhar_NO"
                        component="div"
                        className="text-red-500 ml-4"
                      />
                    </div>
                    <div className="flex flex-1 flex-col mt-4">
                      <label className="mb-2 ml-4" htmlFor="Name">
                        Name
                      </label>
                      <Field
                        type="text"
                        id="Name"
                        name="Name"
                        className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                        style={{ boxShadow: "0 1px 4px #fff" }}
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
                      </label>
                      <Field
                        type="text"
                        id="Middle_Name"
                        name="Middle_Name"
                        className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                        style={{ boxShadow: "0 1px 4px #fff" }}
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
                      </label>
                      <Field
                        type="text"
                        id="last_Name"
                        name="last_Name"
                        className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                        style={{ boxShadow: "0 1px 4px #fff" }}
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
                      </label>
                      <Field
                        type="text"
                        id="Blood_Group"
                        name="Blood_Group"
                        className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                        style={{ boxShadow: "0 1px 4px #fff" }}
                        onFocus={(e) =>
                          (e.target.style.boxShadow = "0 1px 4px #000")
                        }
                        onBlur={(e) => (e.target.style.boxShadow = "none")}
                      />
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
                          <button
                            type="button"
                            className="flex justify-end items-end  ml-4 px-4 w-fit py-2 bg-[#4245D9] text-white rounded"
                            onClick={() =>
                              handle_Image_upload(
                                values.Fitness_Certificate_selectedFile,
                                "Fitness_Certificate",
                                setUploadedFiles,
                                setUploading
                              )
                            }
                            disabled={uploading}
                          >
                            {uploading ? "Uploading..." : "Upload"}
                          </button>
                        </div>
                      )}
                      {uploadedFiles.Fitness_Certificate && (
                        <div className="text-green-500 ml-4 mt-2">
                          Fitness Certificate Uploaded
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col mt-4">
                      <label
                        className="mb-2 ml-4"
                        htmlFor="Adhar_card_selectedFile"
                      >
                        Adhar card
                      </label>
                      <input
                        type="file"
                        id="Adhar_card_selectedFile"
                        name="Adhar_card_selectedFile"
                        accept="image/*"
                        className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                        style={{ boxShadow: "0 1px 4px #fff" }}
                        onFocus={(e) =>
                          (e.target.style.boxShadow = "0 1px 4px #000")
                        }
                        onBlur={(e) => (e.target.style.boxShadow = "none")}
                        onChange={(e) =>
                          setFieldValue(
                            "Adhar_card_selectedFile",
                            e.target.files[0]
                          )
                        }
                      />
                      <ErrorMessage
                        name="Adhar_card_selectedFile"
                        component="div"
                        className="text-red-500 ml-4"
                      />
                      {values.Adhar_card_selectedFile && (
                        <div className="flex flex-1 justify-end mr-8 ml-8 mt-2">
                          <button
                            type="button"
                            className="flex justify-end items-end  ml-4 px-4 w-fit py-2 bg-[#4245D9] text-white rounded"
                            onClick={() =>
                              handle_Image_upload(
                                values.Adhar_card_selectedFile,
                                "Adhar_card",
                                setUploadedFiles,
                                setUploading
                              )
                            }
                            disabled={uploading}
                          >
                            {uploading ? "Uploading..." : "Upload"}
                          </button>
                        </div>
                      )}
                      {uploadedFiles.Adhar_card && (
                        <div className="text-green-500 ml-4 mt-2">
                          Aadhaar Card Uploaded
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row">
                    <div className="flex flex-1 flex-col mt-4">
                      <label className="mb-2 ml-4" htmlFor="Contact_Number">
                        Contact Number
                      </label>
                      <Field
                        type="Number"
                        placeholder="+91 "
                        id="Contact_Number"
                        name="Contact_Number"
                        accept="image/*"
                        className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                        style={{ boxShadow: "0 1px 4px #fff" }}
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
                        type="Number"
                        id="Emergency_Contact_Number"
                        placeholder="+91 "
                        name="Emergency_Contact_Number"
                        accept="image/*"
                        className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                        style={{ boxShadow: "0 1px 4px #fff" }}
                        onFocus={(e) =>
                          (e.target.style.boxShadow = "0 1px 4px #000")
                        }
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
                    </label>
                    <Field
                      type="Email"
                      id="EmailId"
                      placeholder="sample_email@gmail.com"
                      name="EmailId"
                      accept="image/*"
                      className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                      style={{ boxShadow: "0 1px 4px #fff" }}
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
      {/* Dialog */}
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
              <h2>Congratulation!!</h2>
            </div>
            <div className="flex mt-5 flex-row justify-around">
              <div className="flex text-black font-semibold">
                Your Conductor ID :
              </div>
              <div className="flex ml-2 text-[#4A4545]">
                {success?.cunique_id}
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
        onClose={() => set_open_error_dialog(false)}
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
              <div className="flex ml-2 text-[#4A4545]">{error?.message}</div>
            </div>
          </div>
        </DialogContent>
        <DialogActions className="bg-red-100">
          <Button
            variant="contained"
            color="error"
            onClick={() => set_open_error_dialog(false)}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
