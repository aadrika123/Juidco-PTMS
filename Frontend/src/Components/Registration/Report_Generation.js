import React from 'react';
  
  const Report_Generation = () =>  {
	return (
	  <div>
	  </div>
	);
  }
  
  export default Report_Generation;
  import React from "react";
import background_image from "../../assets/background_image.png";
import RMC_logo from "../../assets/RMC_LOGO.png";
import bus from "../../assets/bus 1.png";
import bus1 from "../../assets/bus-2.png";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";

export default function Report_Generation() {
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
  const navigate = useNavigate();
  const onSubmit = (values, { setSubmitting }) => {
    // Handle form submission here
    console.log("Values function started ");
    console.log("Values >> ", values);
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
                    <div className="flex flex-col sm:flex-row mt-4">
                      {" "}
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
                      <div className="flex flex-1 mt-4 mb-4 flex-col">
                        <div className="flex flex-1 mt-2 flex-row">
                          <div className="flex mr-5"> Name: </div>
                          <div className="flex"> Rohan Goswami </div>
                        </div>
                        <div className="flex flex-1 mt-2 flex-row">
                          <div className="flex mr-5"> Age: </div>
                          <div className="flex"> 20</div>
                        </div>
                        <div className="flex flex-1 mt-2 flex-row">
                          <div className="flex mr-5"> Contact Number: </div>
                          <div className="flex"> +91 7209665468 </div>
                        </div>
                      </div>
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
                        <label htmlFor="Time">Month Collection </label>
                        <Field
                          as="input"
                          type="month"
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
                        <div className="flex flex-1 justify-center items-center ">
                          <button
                            type="submit"
                            className="flex flex-1 h-10 md:w-[80%] border bg-[#4245D9] rounded-md shadow-md justify-center items-center"
                          >
                            <div className="flex text-xl text-white font-normal">
                              Generate Report
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
    </div>
  );
}
