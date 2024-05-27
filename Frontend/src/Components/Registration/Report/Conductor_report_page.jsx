import React, { useEffect } from "react";
import background_image from "../../../assets/background_image_2.png";
import RMC_logo from "../../../assets/RMC_LOGO.png";
import bus from "../../../assets/bus 1.png";
import bus1 from "../../../assets/bus-2.png";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import { useLocation } from "react-router-dom";
import bus_stop from "../../../assets/bus-stop.png";

export default function Conductor_report_page() {
  const location = useLocation();
  const navigate = useNavigate();

  

  /*
  useEffect(() => {
    axios.post(`${process.env.REACT_APP_BASE_URL}/report/bus-daywise`, {
      
    });
  })
*/

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
                  <h1 className="flex justify-center items-center text-2xl md:text-xl text-[#322F2F] font-semibold">
                    Generated Report
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
          <div className="flex flex-1 flex-wrap mt-5 w-full h-fit justify-center items-center ">
            {receiptData?.report?.map((receipt) => (
              <div
                key={receipt.bus_id}
                className="h-fit w-[200px] rounded-2xl border-4 border-blue-400 bg-white flex flex-col justify-start items-center m-4 p-4"
              >
                <img
                  src={bus_stop}
                  className="object-cover h-12 w-12"
                  alt="Bus Stop"
                />
                <div className="mt-4 text-center">
                  <p>Bus No : {receipt.bus_id}</p>
                  {/* <p className="font-semibold">
                    Receipt No: {receipt.receipt_no}
                  </p> */}
                  <p>Amount: Rs. {receipt.total_amount}</p>
                  {/* <div className="flex flex-row gap-8">
                    <div className="flex ">{receipt.time}</div>
                    <div className="flex">
                      {new Date(receipt.date).toLocaleDateString()}
                    </div>
                  </div> */}
                </div>
              </div>
            ))}
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
