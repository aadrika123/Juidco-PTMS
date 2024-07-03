import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../../redux/slice/slice";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Container, Box, Button } from "@mui/material";
import PasswordInput from "./PasswordInput"; // Import the PasswordInput component

const Login = () => {
  const dispatch = useDispatch();
  const [errorMsg, setErrorMsg] = useState();
  const [deviceType, setDeviceType] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/mobi|android|touch|mini/.test(userAgent)) {
      setDeviceType("mobile");
    } else {
      setDeviceType(null);
    }
  }, []);

  const LoginSchema = Yup.object().shape({
    user_id: Yup.string().required("User Id is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleLogin = async (values) => {
    try {
      setLoading(true);
      const res = await axios({
        url: `${process.env.REACT_APP_AUTH_URL}/login`,
        method: "POST",
        data: {
          email: values.user_id,
          password: values.password,
          type: window.ReactNativeWebView ? "mobile" : null,
          //type: "mobile",
        },
      });

      if (res) {
        console.log(res);
        const { token, userDetails } = res.data.data;
        Cookies.set("accesstoken", token, { expires: 1 });

        localStorage.setItem("ulbId", userDetails.ulb_id);
        localStorage.setItem("token", token);
        localStorage.setItem("userType", userDetails.user_type);
        localStorage.setItem("userName", userDetails.user_name);
        localStorage.setItem("device", deviceType);
        // localStorage.setItem("ulbId", userDetails.ulb_id);
        localStorage.setItem("userUlbName", userDetails.ulbName);
        localStorage.setItem("roles", JSON.stringify(userDetails.role));
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("userEmail", userDetails.email);
        localStorage.setItem("ulbIduserMobile", userDetails.mobile);
        localStorage.setItem("conductorId", userDetails.user_name);

        /* Cookies.set("user_details", JSON.stringify(userDetails), {
          expires: 1,
        }); */

        //dispatch(login({ token, userDetails }));

        if (userDetails.user_type === "Admin") {
          window.location.replace("/ptms/dashboard");
        } else if (userDetails.user_type === "TC") {
          window.location.replace("/ptms/conductor_dashboard");
        } else {
          window.location.replace("/");
        }
      }
    } catch (error) {
      setErrorMsg("Something Went Wrong!!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Box mt={2}>
        <Formik
          initialValues={{ user_id: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          {({ errors, touched }) => (
            <Form className="bg-white p-4 md:p-16 rounded-md shadow-md">
              <div className="text-center">
                <h1 className="text-2xl leading-normal mb-3 font-bold text-gray-800 darks:text-gray-300 text-center">
                  Welcome Back
                </h1>
              </div>
              <div className="flex flex-col mt-4 text-center">
                <span className="text-center text-red-400">{errorMsg}</span>
              </div>
              <hr className="block w-12 h-0.5 mx-auto my-5 bg-gray-700 border-gray-700" />
              <div className="mb-6 flex flex-1 flex-col">
                <div className="mt-1 flex flex-1 mb-6">
                  <Field
                    name="user_id"
                    as={"input"}
                    label="Username"
                    placeholder="Username"
                    className="flex flex-1  border rounded-md px-3 py-4 w-full focus:outline-none focus:border-blue-500"
                    error={touched.user_id && !!errors.user_id}
                    helperText={touched.user_id && errors.user_id}
                  />
                </div>
                <Field
                  name="password"
                  as={PasswordInput} // Call the PasswordInput component
                  label="Password"
                  placeholder="Password"
                  fullWidth
                  error={touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                />
              </div>
              <div className="my-4">
                <div className="flex flex-col items-center justify-center flex-wrap gap-x-2 gap-y-2 w-full poppins ">
                  <span
                    className="text-gray-700 text-sm font-semibold cursor-pointer w-full text-center"
                    onClick={() => {
                      // Handle forgot password
                    }}
                  >
                    Forgot Password
                  </span>
                </div>
              </div>
              <Button
                type="submit"
                variant="contained"
                sx={{ backgroundColor: "#665DD9" }}
                fullWidth
                disabled={loading}
              >
                {loading ? "Loading..." : "Log in"}
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default Login;
