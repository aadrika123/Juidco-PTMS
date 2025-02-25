import React from 'react';
  
  const BusRegistration = () =>  {
	return (
	  <div>
	  </div>
	);
  }
  
  export default BusRegistration;
  import React from "react";
import background_image from "../../assets/background_image.png";
import RMC_logo from "../../assets/RMC_LOGO.png";
import bus from "../../assets/bus 1.png";
import bus1 from "../../assets/bus-2.png";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const initialValues = {
  registration_No: "",
  VIN_Number: "",

  Pollution_selectedFile: null,
  Tax_selectedFile: null,
  Registration_selectedFile: null,
};

const validationSchema = Yup.object({
  registration_No: Yup.string().required("Registration Number is required"),
  VIN_Number: Yup.string().required("VIN Number is required"),
  Pollution_selectedFile: Yup.mixed().required(
    "Pollution Certificate File is required"
  ),
  Tax_selectedFile: Yup.mixed().required("Tax Certificate File is required"),
  Registration_selectedFile: Yup.mixed().required(
    "Registration Certificate File is required"
  ),
});

export default function BusRegistration() {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = React.useState(false); // State to control dialog

  const onSubmit = (values) => {
    console.log(values); // Handle form submission here
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
              {({ values, setFieldValue }) => (
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
                        onFocus={(e) =>
                          (e.target.style.boxShadow = "0 1px 4px #000")
                        }
                        onBlur={(e) => (e.target.style.boxShadow = "none")}
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
                      <Field
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
                      />
                      <ErrorMessage
                        name="selectedFile"
                        component="div"
                        className="text-red-500 ml-4"
                      />
                    </div>

                    <div className="flex flex-1 flex-col mt-4">
                      <label className="mb-2 ml-4" htmlFor="Tax_selectedFile">
                        Tax Copy
                      </label>
                      <Field
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
                      />
                      <ErrorMessage
                        name="selectedFile"
                        component="div"
                        className="text-red-500 ml-4"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col mt-4">
                    <label
                      className="mb-2 ml-4"
                      htmlFor="Registration_selectedFile"
                    >
                      Registration Certificate
                    </label>
                    <Field
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
                    />
                    <ErrorMessage
                      name="selectedFile"
                      component="div"
                      className="text-red-500 ml-4"
                    />
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
                            Save
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
    </div>
  );
}
