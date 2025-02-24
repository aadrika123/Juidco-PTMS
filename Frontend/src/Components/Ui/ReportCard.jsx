import React from "react";
import busstop from "../../assets/bus-stop.png";

const ReportCard = ({
  card_type,
  first_name,
  middle_name,
  last_name,
  age,
  conductor_id,
  mobile_no,
  aadhar_no,
  bus_id,
  register_no,
  vin_no,
  total_bus_collection,
}) => {
  return (
    <>
      {card_type == "conductor" ? (
        <div className="flex flex-1 flex-col ">
          <div className="flex mt-5  flex-row">
            <div className="flex font-bold">Name:</div>
            <div className="flex ml-4 flex-row">
              <div className="flex">{first_name}</div>
              <div className="flex ml-2">
                {middle_name == "null" ? "" : middle_name}
              </div>
              <div className="flex ml-2">{last_name}</div>
            </div>
          </div>
          <div className="flex mt-5 flex-row">
            <div className="flex font-bold">Age:</div>
            <div className="flex ml-4">{age}</div>
          </div>
          <div className="flex mt-5 flex-row  ">
            <div className="flex font-bold">Conductor ID:</div>
            <div className="flex ml-4">{conductor_id}</div>
          </div>
          <div className="flex mt-5 flex-row  ">
            <div className="flex font-bold">Contact Number:</div>
            <div className="flex ml-4">+91 {mobile_no}</div>
          </div>
          <div className="flex mt-5 flex-row  ">
            <div className="flex font-bold">Adhar Card/Pan Number :</div>
            <div className="flex ml-4">{aadhar_no}</div>
          </div>
        </div>
      ) : card_type === "bus" ? (
        <div className="flex flex-1 flex-col ">
          <div className="flex mt-5 flex-row">
            <div className="flex font-bold">Id:</div>
            <div className="flex ml-4">{bus_id}</div>
          </div>
          <div className="flex mt-5 flex-row">
            <div className="flex font-bold">Registration Number :</div>
            <div className="flex ml-4">{register_no}</div>
          </div>
          <div className="flex mt-5 flex-row">
            <div className="flex font-bold">VIN Number:</div>
            <div className="flex ml-4">{vin_no}</div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-10 bg-white p-8 shadow-lg">
          <div className="flex flex-1 flex-col ">
            <div className="flex mt-5  flex-row">
              <div className="flex font-bold">Name:</div>
              <div className="flex ml-4 flex-row">
                <div className="flex">{first_name}</div>
                <div className="flex ml-2">
                  {middle_name == "null" ? "" : middle_name}
                </div>
                <div className="flex ml-2">{last_name}</div>
              </div>
            </div>
            <div className="flex mt-5 flex-row">
              <div className="flex font-bold">Age:</div>
              <div className="flex ml-4">{age}</div>
            </div>
            <div className="flex mt-5 flex-row  ">
              <div className="flex font-bold">Conductor ID:</div>
              <div className="flex ml-4">{conductor_id}</div>
            </div>
            <div className="flex mt-5 flex-row  ">
              <div className="flex font-bold">Contact Number:</div>
              <div className="flex ml-4">+91 {mobile_no}</div>
            </div>
            <div className="flex mt-5 flex-row  ">
              <div className="flex font-bold">Adhar Card/Pan Number :</div>
              <div className="flex ml-4">{aadhar_no}</div>
            </div>
          </div>

          <div className="flex flex-1 justify-center items-center border  bg-white border p-8 rounded-lg m-4 ">
            <div className="flex flex-1 flex-row ">
              <div className="flex flex-1">
                <div className="flex flex-col flex-1">
                  <div className="flex flex-1 text-4xl font-bold text-[#12CA46] justify-center items-centers text-center">
                    {/* {total_collection.data[0].total_bus_collection}/- */}
                    {total_bus_collection}
                    /-
                  </div>
                  <div className="flex flex-1 text-lg font-bold text-gray-500 mt-2 justify-center items-centers text-center">
                    Total Amount of the Bus Collection
                  </div>
                </div>
              </div>
              <div className="flex flex-1">
                <img src={busstop} className="flex ml-4 w-24 h-24" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const BusCard = ({ bus_id, total_bus_collection, date, status }) => {
  return (
    <div className="flex flex-1 flex-col">
      <div
        key={bus_id}
        className="flex flex-col h-[180px] w-[180px] m-4 rounded-md border-2 justify-center items-center border-blue-400 bg-white"
      >
        {/*
         */}{" "}
        <div className="flex flex-1 flex-col justify-center items-center m-4">
          <img
            src={busstop}
            style={{ translate: "transform(-50%,-50%)" }}
            className="flex ml-4 w-14 h-14"
          />
          <div className="text-[#6D63E8]">Bus: {bus_id}</div>
          <div className="flex flex-col text-black">
            <div className="flex">
              Amount:{" "}
              <span className="ml-2 text-[#2CA70D]">
                {total_bus_collection}
              </span>
            </div>
          </div>
          <div className="flex flex-1 text-xs text-gray-400 justify-start items-start">
            Date: {date?.split("T")[0]}
          </div>
        </div>
        {/* </Link> */}
      </div>
    </div>
  );
};

export { BusCard, ReportCard };
