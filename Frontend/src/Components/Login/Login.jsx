/***
 * Author: Jaideep
 * Status: Closed
 * Description: Designed to manage login form design.
 */

// demo login -> vishal.bhaskar@sparrowsoftech.com,  pass -> $2y$10$8HVjnR2QQfsl2I5c8HwTKOaP9./IKc2e3ghUC4kwI.uF72.1h//eq

/* import Button from "@/components/global/atoms/Button";
import Input from "@/components/global/atoms/Input";*/
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../../redux/slice/slice";
import Cookies from "js-cookie";
//import { HRMS_URL } from "@/utils/api/urls";
//import { useWorkingAnimation } from "@/components/Helpers/Widgets/useWorkingAnimation";

const Login = () => {
  const dispatch = useDispatch();
  const [errorMsg, setErrorMsg] = useState();
  /*  const [workingAnimation, activateWorkingAnimation, hideWorkingAnimation] =
    useWorkingAnimation();
  */
  // const [hide, setHide] = useState(true);

  const LoginSchema = Yup.object().shape({
    user_id: Yup.string().required("User Id is required"),
    password: Yup.string().required("Password is required"),
  });

  const [data, SetData] = useState();
  ///////////////// Handling Login Logics /////////////

  const handleLogin = async (values) => {
    try {
      //activateWorkingAnimation();
      const res = await axios({
        url: `${process.env.REACT_APP_AUTH_URL}/login`,
        method: "POST",
        data: {
          email: values.user_id,
          password: values.password,
        },
      })
        .then((response) => {
          console.log(response);
          SetData(response?.data?.data);
        })
        .catch((e) => {
          console.log(e);
        });

      console.log("user data", data);
      sessionStorage.setItem("user_details", JSON.stringify(data?.userDetails));

      //! EMPLOYEE ID WILL COME FROM USER TABLE
      if (data) {
        Cookies.set("accesstoken", data?.token);
        /*         alert("Login Successful");
         */ window.location.reload();

        /* 
        if (typeof window !== "undefined") {
          const storedData = sessionStorage.getItem("user_details");
          const data = storedData && JSON.parse(storedData);
          if (data?.user_type === "Employee") {
            dispatch(login(data)), "a";
            if (typeof window !== "undefined")
              window.location.replace("/hrms/employee/attendance-management");
          } else if (data?.user_type === "TL") {
            dispatch(login(data)), "a";
            if (typeof window !== "undefined")
              window.location.replace("/hrms/employee/attendance-management");
          } else {
            dispatch(login(data));
            if (typeof window !== "undefined")
              window.location.replace("/hrms/ems/dashboard");
          }
        } */
      } else {
        //hideWorkingAnimation();
        setErrorMsg("You have entered wrong credentials !!");
      }
    } catch (error) {
      //hideWorkingAnimation();
      setErrorMsg("Something Went Wrong!!");
      console.log(error);
    }
  };

  // const handleHideShowPass = () => {
  //   setHide(!hide);
  // };

  return (
    <>
      {/*       {workingAnimation}
       */}{" "}
      <div className="max-w-full w-full px-2 sm:px-12 lg:pr-20 mb-12 lg:mb-0">
        <div className="relative">
          <div className="p-6 sm:py-8 sm:px-12 rounded-lg bg-white darks:bg-gray-800 shadow-xl">
            <Formik
              initialValues={{
                user_id: "",
                password: "",
              }}
              validationSchema={LoginSchema}
              onSubmit={(values) => {
                handleLogin(values);
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
              }) => (
                <Form className="flex flex-1 flex-col" onSubmit={handleSubmit}>
                  <div className="text-center">
                    <h1 className="text-2xl leading-normal mb-3 font-bold text-gray-800 darks:text-gray-300 text-center">
                      Welcome Back
                    </h1>
                  </div>
                  <div className="flex flex-col mt-4 text-center">
                    <span className="text-center text-red-400">{errorMsg}</span>
                  </div>
                  <hr className="block w-12 h-0.5 mx-auto my-5 bg-gray-700 border-gray-700" />
                  <div className="mb-6">
                    <div className="mt-1 mb-6">
                      <Field
                        label="Username"
                        placeholder="Username"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.user_id}
                        error={errors.user_id}
                        touched={touched.user_id}
                        name="user_id"
                        className="border w-full border-gray-300 px-3 py-4 rounded-md focus:outline-none  transition duration-300"
                      />
                    </div>
                    <Field
                      label="Password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                      error={errors.password}
                      touched={touched.password}
                      name="password"
                      type="password"
                      placeholder="Password"
                      className="border w-full border-gray-300 px-3 py-4 rounded-md focus:outline-none  transition duration-300"
                    />
                  </div>

                  <div className="grid p-2 rounded-md bg-[#4338CA] mt-6">
                    <button
                      className="w-[100%] flex justify-center"
                      variant="primary"
                      type="submit"
                    >
                      <svg
                        xmlnsXlink="http://www.w3.org/2000/svg"
                        fill="white"
                        className="inline-block w-8 mr-4 h-8 ltr:mr-2 rtl:ml-2 bi bi-box-arrow-in-right"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z"
                        />
                        <path
                          fillRule="evenodd"
                          d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"
                        />
                      </svg>
                      <div className="text-white text-xl font-bold">Log in</div>
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
            <div className="my-2">
              <div className="flex flex-col items-center justify-center flex-wrap gapx-x-2 gap-y-2 w-full poppins ">
                <span
                  className="text-gray-700 text-sm font-semibold cursor-pointer w-full text-center"
                  onClick={() => {
                    // setmobileCardStatus(true)
                  }}
                >
                  Forgot Password
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
