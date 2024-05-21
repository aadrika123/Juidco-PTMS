import React from "react";
// import background_image from "background_image.png";
import RMC_logo from "../assets/RMC_LOGO.png";
import bus from "../assets/bus 1.png";
import { useNavigate } from "react-router-dom";
import moment from "moment";
// import { OverLayLoader } from "../Common/loaders";
// import Confirm from "../Common/confirm-box/CreateConfirmation";
import axios from "axios";
import Cookies from "js-cookie";

export default function Main() {
  const navigate = useNavigate();

  const getFormatDate = () => {
    const date = new Date();
    const options = { day: "2-digit", month: "long", year: "2-digit" };
    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      date
    );
    //const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    return formattedDate;
  };

  const getFormatTime = () => {
    const date = new Date();
    const formattedTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    return formattedTime;
  };

  const token = Cookies.get("accesstoken");

  const printTextData = (data) => {
    const date = moment(data?.date).format("DD-MM-YYYY");
    // const time = moment(data?.date).format('hh:mm'); am pm formate
    const time = moment(data?.date).format("HH:mm");
    const printTxt =
      "[C]" +
      "Ranchi Municipal Corporation" +
      "\n" +
      "[C]" +
      "Urban Transport-City Bus" +
      "\n \n" +
      "Date Time: " +
      date +
      "-" +
      time +
      "\n \n" +
      "Bus No: " +
      data?.bus_recipt_id +
      "\n \n" +
      "Amount: " +
      data?.amount +
      " /-" +
      "\n \n" +
      "Receipt: " +
      data?.receipt_no +
      "\n" +
      "\n \n" +
      "*******************************";

    return printTxt;
  };

  const printToBTPrinter = (data) => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          Key: "PRINT_FOR_BT_PRINTER",
          keyData: {
            charPerLine: 32,
            printTxt: printTextData(data),
          },
        })
      );
    }
  };

  const handle_Click = async (Amount, color, border_color) => {
    const postData = {
      data: {
        amount: Amount,
        bus_id: "1BNC",
        conductor_id: "PTM06292529",
        date: "2024-05-16",
        time: "04:00",
        receipt_no: "15815487",
      },
    };
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/receipt/create`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res?.data?.data);
      if (res?.data?.status) {
        printToBTPrinter(res?.data?.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {/* {isLoading && <OverLayLoader />} */}
      <div className="flex items-center justify-center h-screen w-screen">
        <div className="flex flex-1 flex-col bg-[#F2F2FE] h-screen ">
          <div className="flex h-[250px] bg-white justify-center items-center rounded-b-[30px] border-[3px] shadow-md border-t-0">
            <div className="flex flex-col justify-center items-center">
              <div className="flex justify-center items-center">
                <img
                  src={RMC_logo}
                  alt="RMC Logo"
                  className="max-w-full h-auto md:h-1/2"
                />
              </div>
              <div className="flex mt-2 ">
                <h2
                  style={{ fontWeight: 500, fontSize: 20 }}
                  className="text-[#585858]"
                >
                  Ranchi Municipal Corporation
                </h2>
              </div>
              <div className="flex mt-2 flex-row ">
                <h1 className="text-md font-bold text-gradient-to-b  from-[#1436C3]  to-[#903BB8] bg-clip-text">
                  Urban Transport
                </h1>
                <img
                  src={bus}
                  alt="Bus"
                  className="ml-2 max-w-full h-auto md:h-1/2"
                />
              </div>
            </div>
          </div>
          <div style={{ flex: 2 }} className="flex flex-col mt-5">
            <div className="flex justify-between flex-row mt-2 mb-2">
              <div className="flex flex-1 justify-center items-center">
                <div
                  onClick={() => handle_Click(5, "#FFE7E7", "#FF8B8B")}
                  className="flex flex-row w-[95px] h-[95px] rounded-full justify-center items-center shadow-inner bg-[#FFE7E7] "
                  style={{ boxShadow: " 0 1px 4px #FF8B8B" }}
                >
                  <div className="flex ">
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 17 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.66602 1.61914H14.5708M5.66602 5.44189H14.5708M11.9736 15.381L5.66602 9.26464H7.89221C12.8395 9.26464 12.8395 1.61914 7.89221 1.61914"
                        stroke="#585858"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div
                    style={{ fontWeight: 700 }}
                    className="text-2xl text-[#631111] ml-1"
                  >
                    5/-
                  </div>
                </div>
              </div>
              <div className="flex flex-1 justify-center items-center">
                <div
                  onClick={() => handle_Click(10, "#D9D5FF", "#564CD4")}
                  style={{ boxShadow: " 0 1px 4px #564CD4" }}
                  className="flex flex-row w-[95px] h-[95px] rounded-full justify-center items-center shadow-inner bg-[#D9D5FF]"
                >
                  <div className="flex ">
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 17 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.66602 1.61914H14.5708M5.66602 5.44189H14.5708M11.9736 15.381L5.66602 9.26464H7.89221C12.8395 9.26464 12.8395 1.61914 7.89221 1.61914"
                        stroke="#585858"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div
                    style={{ fontWeight: 700 }}
                    className="text-2xl text-[#1F1A5D] font-bold ml-1"
                  >
                    10/-
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-1 justify-center items-center mt-2 mb-4">
              <div className="flex flex-1 justify-center items-center">
                <div
                  onClick={() => handle_Click(15, "#C5FFCB", "#4CD451")}
                  style={{ boxShadow: " 0 1px 4px #4CD451" }}
                  className="flex flex-row w-[95px] h-[95px] rounded-full justify-center items-center shadow-inner bg-[#C5FFCB]"
                >
                  <div className="flex ">
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 17 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.66602 1.61914H14.5708M5.66602 5.44189H14.5708M11.9736 15.381L5.66602 9.26464H7.89221C12.8395 9.26464 12.8395 1.61914 7.89221 1.61914"
                        stroke="#585858"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div
                    style={{ fontWeight: 700 }}
                    className="text-2xl text-[#123A11] font-bold ml-1"
                  >
                    15/-
                  </div>
                </div>
              </div>
              <div className="flex flex-1 justify-center items-center">
                <div
                  onClick={() => handle_Click(20, "#FCF29B", "#ADA943")}
                  style={{ boxShadow: " 0 1px 4px #ADA943" }}
                  className="flex flex-row w-[95px] h-[95px] rounded-full justify-center items-center shadow-inner bg-[#FCF29B]"
                >
                  <div className="flex ">
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 17 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.66602 1.61914H14.5708M5.66602 5.44189H14.5708M11.9736 15.381L5.66602 9.26464H7.89221C12.8395 9.26464 12.8395 1.61914 7.89221 1.61914"
                        stroke="#585858"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div
                    style={{ fontWeight: 700 }}
                    className="text-2xl text-[#493C0D] font-bold ml-1"
                  >
                    20/-
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-1 justify-center items-center">
              <div className="flex flex-1 justify-center items-center">
                <div
                  onClick={() => handle_Click(25, "#FFD7B2", "#E58B39")}
                  style={{ boxShadow: " 0 1px 4px #E58B39" }}
                  className="flex flex-row w-[95px] h-[95px] rounded-full justify-center items-center shadow-inner bg-[#FFD7B2]"
                >
                  <div className="flex ">
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 17 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.66602 1.61914H14.5708M5.66602 5.44189H14.5708M11.9736 15.381L5.66602 9.26464H7.89221C12.8395 9.26464 12.8395 1.61914 7.89221 1.61914"
                        stroke="#585858"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div
                    style={{ fontWeight: 700 }}
                    className="text-2xl text-[#5B2B17] font-bold ml-1"
                  >
                    25/-
                  </div>
                </div>
              </div>
              <div className="flex flex-1 justify-center items-center">
                <div
                  onClick={() => handle_Click(30, "#B0BDFF", "#C14CD4")}
                  style={{ boxShadow: " 0 1px 4px #C14CD4" }}
                  className="flex flex-row w-[95px] h-[95px] rounded-full justify-center items-center shadow-inner bg-[#B0BDFF]"
                >
                  <div className="flex ">
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 17 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.66602 1.61914H14.5708M5.66602 5.44189H14.5708M11.9736 15.381L5.66602 9.26464H7.89221C12.8395 9.26464 12.8395 1.61914 7.89221 1.61914"
                        stroke="#585858"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div
                    style={{ fontWeight: 700 }}
                    className="text-2xl text-[#631111] font-bold ml-1"
                  >
                    30/-
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-1 overflow-hidden justify-center items-center">
            {/* <img
              src="/background_image.png"
              alt="Background Image"
              className="h-fit justify-center items-center object-scale-down"
            /> */}
          </div>
        </div>
      </div>
    </>
  );
}
