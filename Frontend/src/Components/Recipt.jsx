import React, { useState, useEffect } from "react";
import RMC_logo from "../assets/Recipt_RMC_LOGO.png";
import bus from "../assets/bus 1_recipt.png";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

export default function Recipt() {
  const location = useLocation();
  const receiptData = location.state;
  const [data, set_data] = useState();
  const token = Cookies.get("accesstoken");

  useEffect(() => {
    axios
      //.post("http://192.168.100.71:6001/api/ptms/v1/receipt/create", postData)
      .post(`${process.env.REACT_APP_BASE_URL}/receipt/create`, postData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        set_data(res.data.data);
      })
      .catch((error) => {
        console.error("Error making POST request:", error);
      });
  }, [receiptData.Amount]);
  console.log(data);

  return (
    <div className="flex flex-1 flex-col bg-[#F2F2FE] h-screen justify-center items-center">
      <div className="ml-4 mr-4 w-[80%] h-fit bg-white rounded-md shadow-md flex flex-col justify-start items-center">
        <div className="flex flex-col justify-center items-center">
          <div className="flex mt-5">
            <img
              src={RMC_logo}
              alt="RMC Logo"
              className="max-w-full h-auto md:h-1/2"
            />
          </div>
          <div className="flex mt-2 ">
            <h2 style={{ fontWeight: 500 }} className="font-md text-[#585858]">
              Ranchi Municipal Corporation
            </h2>
          </div>
          <div className="flex mt-2 flex-row ">
            <h1 className="text-md font-bold text-gradient-to-b  from-[#1436C3]  to-[#903BB8] bg-clip-text">
              Urban Transport
            </h1>
            <img src={bus} alt="Bus" className="ml-2 h-[20px] w-[20px]" />
          </div>
        </div>
        <div className="flex ">
          <div className="flex flex-1 justify-center items-center mt-5">
            <div
              style={{
                boxShadow: ` 0 1px 4px ${receiptData?.border_color}`,
                backgroundColor: `${receiptData?.color}`,
              }}
              className={`flex flex-row w-[60px] h-[60px] rounded-full justify-center items-center shadow-inner`}
            >
              <div className="flex ">
                <svg
                  width="14"
                  height="14"
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
                className="text-sm text-[#1F1A5D] font-bold ml-1"
              >
                {receiptData?.Amount}/-
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col mt-5 mb-5 w-[80%] justify-center items-center">
          <div className="flex flex-1 w-full  mt-2 mb-2 justify-between">
            <div className="flex flex-1 justify-start items-center text-[#444242] text-md font-semibold">
              Recipt No :{" "}
            </div>
            <div className="flex flex-1 justify-start items-center text-[#4D4B4B]">
              {data && data.id}{" "}
            </div>
          </div>
          <div className="flex flex-1 w-full mt-2 mb-2 justify-between">
            <div className="flex flex-1 justify-start items-center text-[#444242] text-md font-semibold ">
              Date :{" "}
            </div>
            <div className="flex flex-1 justify-start items-center text-[#4D4B4B] ">
              {data && new Date(data.date).toLocaleString()}
            </div>
          </div>
          {/* <div className='flex flex-1 w-full mt-2 mb-2 justify-between'>
            <div className='flex flex-1 justify-start items-center text-[#444242] text-md font-semibold'>Time : </div>
            <div className='flex flex-1 justify-start items-center text-[#4D4B4B] '>{data && new Date(data.date).toLocaleTimeString()}</div>
          </div> */}
          <div className="flex flex-1 w-full  mt-2 mb-2 justify-between">
            <div className="flex flex-1 justify-start items-center text-[#444242] text-md font-semibold">
              Amount :{" "}
            </div>
            <div className="flex flex-1 justify-start items-center text-[#4D4B4B]">
              {receiptData?.Amount} /-{" "}
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-[80%] h-10 mt-5 justify-center items-center  ">
        <div className="flex bg-[#1436C3] h-full w-1/2 justify-center items-center rounded-md shadow-lg">
          <div
            
            className="flex text-center font-bold text-white"
          >
            Print Recipt
          </div>
        </div>
      </div>
    </div>
  );
}
