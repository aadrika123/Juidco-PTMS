import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Container, Box, Button } from "@mui/material";
import PasswordInput from "./PasswordInput"; 
import ApiHeader from "../api/ApiHeader";
import ProjectApiList from "../api/ProjectApiList";
import CryptoJS from "crypto-js";
import UseCaptchaGenerator from "./UseCaptchaGenerator";

const Login = () => {
  const [errorMsg, setErrorMsg] = useState();
  const [deviceType, setDeviceType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [captcha, setCaptcha] = useState("");
  const [captchaError, setCaptchaError] = useState  (null);

  const { getMenuByModule } = ProjectApiList();
  const {
    captchaInputField,
    captchaImage,
    verifyCaptcha,
    generateRandomCaptcha,
  } = UseCaptchaGenerator();

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

  function encryptPassword(plainPassword) {
  const secretKey = "c2ec6f788fb85720bf48c8cc7c2db572596c585a15df18583e1234f147b1c2897aad12e7bebbc4c03c765d0e878427ba6370439d38f39340d7e";

  const key = CryptoJS.enc.Latin1.parse(
    CryptoJS.SHA256(secretKey).toString(CryptoJS.enc.Latin1)
  );

  const ivString = CryptoJS.SHA256(secretKey).toString().substring(0, 16);
  const iv = CryptoJS.enc.Latin1.parse(ivString);

  const encrypted = CryptoJS.AES.encrypt(plainPassword, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
}

  const handleLogin = async (values) => {
    if (!verifyCaptcha(captcha)) {
      setCaptchaError("Captcha is incorrect");
      generateRandomCaptcha(); 
      return;
    } else {
      setCaptchaError(null); 
    }
    try {
      setLoading(true);
      const res = await axios({
        url: `${process.env.REACT_APP_AUTH_URL}/login`,
        method: "POST",
        data: {
          email: values.user_id,
          password: encryptPassword(values.password),
          type: window.ReactNativeWebView ? "mobile" : null,
          moduleId: 18,
          // type: 'mobile',
        },
      });

      if (res) {
        fetchMenuList();

        const userDetails = res?.data?.data?.userDetails;
        const { token } = res?.data?.data;
        Cookies.set("accesstoken", token, { expires: 1 });

        localStorage.setItem("ulbId", userDetails?.ulb_id);
        localStorage.setItem("token", token);
        localStorage.setItem("userType", userDetails?.user_type);
        localStorage.setItem("userName", userDetails?.user_name);

        localStorage.setItem("device", deviceType);
        localStorage.setItem("name", userDetails?.name);
        localStorage.setItem("userUlbName", userDetails?.ulbName);
        localStorage.setItem("roles", JSON.stringify(userDetails?.role));
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("userEmail", userDetails?.email);
        localStorage.setItem("ulbIduserMobile", userDetails?.mobile);
        localStorage.setItem("conductorId", userDetails?.user_name);

       
        if (userDetails?.user_type === "Admin") {
          window.location.replace("/ptms/dashboard");
        } else if (userDetails?.user_type === "TC") {
          window.location.replace("/ptms/conductor_dashboard");
        } else if (userDetails?.user_type === "Employee") {
          window.location.replace("/ptms/accountant-view");
          // window.location.replace("/ptms/dashboard");
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

  const fetchMenuList = async () => {
    let requestBody = {
      moduleId: 18,
    };

    try {
      // Make API request
      const res = await axios.post(getMenuByModule, requestBody, ApiHeader());

      let data = res?.data;

      localStorage.setItem("menuList", res?.data?.data?.permission);

      if (data?.data?.userDetails && data?.data?.permission) {
        let newdata = JSON.stringify(data?.data?.userDetails);
        if (newdata != undefined) {
          localStorage.setItem("userDetail", newdata);
        }

        let newPermission = JSON.stringify(data?.data?.permission);
        if (newPermission != undefined || newPermission == "") {
          localStorage.setItem("userPermission", newPermission);
        }
      } else {
        console.error("Missing required data in the API response.");
      }
    } catch (error) {
      console.error("Error fetching menu list", error);
    }
  };
  return (
    <>
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
                      autoComplete="off" 
                      onCopy={(e) => e.preventDefault()}
                      onPaste={(e) => e.preventDefault()}
                      onCut={(e) => e.preventDefault()}
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
                    autoComplete="off"
                    onCopy={(e) => e.preventDefault()}
                    onPaste={(e) => e.preventDefault()}
                    onCut={(e) => e.preventDefault()}
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
                <div className="my-4">
                  <div className="flex justify-between items-center mb-2">
                    <img src={captchaImage} className="border rounded w-44 h-14" />
                    <button
                      type="button"
                      onClick={generateRandomCaptcha}
                      className="text-xs text-blue-500"
                    >
                      Reload Captcha
                    </button>
                  </div>

                  <div className="mt-2">
                    {captchaInputField({
                      value: captcha,
                      onChange: (e) => setCaptcha(e.target.value),
                    })}
                    {captchaError && (
                      <p className="text-sm text-red-500 mt-1">{captchaError}</p>
                    )}
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
    </>
  );
};

export default Login;
