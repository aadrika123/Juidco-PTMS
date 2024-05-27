import React, { useEffect, useState } from "react";
import bus from "../../../assets/bus 1.png";
import busstop from "../../../assets/bus-stop.png";
import Avatar from "@mui/material/Avatar";
import sample_profile from "../../../assets/sample_profile.png";

import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field } from "formik";
import Scheduled_Table from "../../Tables/Scheduled_Table";
import Cookies from "js-cookie";

export default function ChaneScheduling_main() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  console.log(location);
  const token = Cookies.get("accesstoken");

  const [allScheduled, setAllScheduled] = useState([]);
  const [busoptions, set_busoptions] = useState([]);
  const [selectedBus, setSelectedBus] = useState([]); // Added state for selected bus
  console.log(allScheduled);

  const [passengers_status, setPassengers_status] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/getAllBusList?limit=100&page=1`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }) // Replace with your actual API endpoint
      .then((response) => {
        set_busoptions(response.data.data.data);
      })
      .catch((error) => console.error("Error fetching bus data:", error));

    

    axios
      .get(`${process.env.REACT_APP_BASE_URL}/passenger/day-wise`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data?.data?.data);
        setPassengers_status(res.data?.data?.data);
      });
  }, []);
  console.log(passengers_status);

  return (
    <div className="flex flex-1 ">
      <div className="flex flex-col flex-1 bg-[#F9FAFC]">
        <div className="flex h-10 justify-between items-center">
          <div className="flex ml-4 ">
            <div
              onClick={() => navigate(-1)}
              className="flex flex-row cursor-pointer"
            >
              <svg
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_3837_9887)">
                  <path
                    d="M10.6736 7.20512L4 13.9135L10.6736 20.6218C10.7339 20.7009 10.8105 20.7662 10.8981 20.8132C10.9858 20.8602 11.0826 20.8878 11.1819 20.8941C11.2812 20.9004 11.3806 20.8854 11.4736 20.8499C11.5666 20.8144 11.6508 20.7594 11.7206 20.6886C11.7905 20.6177 11.8443 20.5327 11.8784 20.4393C11.9125 20.3458 11.9262 20.2461 11.9184 20.147C11.9107 20.0478 11.8817 19.9514 11.8335 19.8644C11.7853 19.7774 11.7189 19.7018 11.6389 19.6426L6.64583 14.6079H19.9306C20.1147 14.6079 20.2914 14.5347 20.4216 14.4045C20.5518 14.2743 20.625 14.0976 20.625 13.9135C20.625 13.7293 20.5518 13.5526 20.4216 13.4224C20.2914 13.2922 20.1147 13.219 19.9306 13.219H6.64583L11.6389 8.18429C11.7687 8.05352 11.8413 7.87653 11.8407 7.69225C11.84 7.50797 11.7662 7.33149 11.6354 7.20165C11.5047 7.0718 11.3277 6.99922 11.1434 6.99987C10.9591 7.00052 10.7826 7.07435 10.6528 7.20512H10.6736Z"
                    fill="#665DD9"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_3837_9887">
                    <rect
                      width="25"
                      height="25"
                      fill="white"
                      transform="matrix(0 -1 1 0 0 25)"
                    />
                  </clipPath>
                </defs>
              </svg>
              <div className="ml-2 mt-1 text-[#665DD9]  text-sm text-center">
                {" "}
                Back
              </div>
            </div>
          </div>
          <div className="flex text-xl font-normal  mr-4">
            Change Scheduling
          </div>
        </div>
        <div className="flex p-4 mt-5 ml-4 mr-4 rounded-md justify-start items-start shadow-md h-fit bg-white">
          <div className="flex ">
            <img src={busstop} className="ml-4 w-14 h-14" />
          </div>
          <div className="flex flex-1 ml-4 h-fit flex-col">
            <div className="flex mb-4 ml-2 text-xl font-semibold">
              Search Filter
            </div>
            <div className="flex justofy-between flex-1">
              <Formik
                initialValues={{ busNumber: "", vinNumber: "", status: "" }}
                onSubmit={(values) => {
                  console.log(values);
                }}
              >
                {({ values, handleChange, handleSubmit }) => (
                  <Form
                    onSubmit={handleSubmit}
                    className="flex flex-1 flex-row space-x-2"
                  >
                    <Field
                      as="select"
                      name="busNumber"
                      className="flex flex-1 border h-12 border-gray-300 rounded-md "
                      value={values.busNumber}
                      onChange={(e) => {
                        handleChange(e);
                        const selectedBus = busoptions.find(
                          (bus) => bus.register_no === e.target.value
                        );
                        setSelectedBus(selectedBus); // Update selected bus state
                      }}
                    >
                      <option value="" label="Select bus number" />
                      {busoptions.map((bus) => (
                        <option
                          key={bus.id}
                          value={bus.register_no}
                        >{`Bus No: -  ${bus.register_no}`}</option>
                      ))}
                    </Field>
                    <div className="flex flex-1 justify-start ml-4 items-center flex-row">
                      <div className="flex font-bold ">VIN Number:</div>
                      <div className="flex ml-2">
                        {selectedBus?.vin_no || "N/A"}
                      </div>{" "}
                      {/* Display VIN number */}
                    </div>

                    <Field
                      as="input"
                      type="date"
                      id="Date"
                      name="Date"
                      className="flex h-12 border border-gray-300 rounded-md px-3 "
                      style={{ boxShadow: "0 1px 4px #fff" }}
                      onFocus={(e) =>
                        (e.target.style.boxShadow = "0 1px 4px #000")
                      }
                      onBlur={(e) => (e.target.style.boxShadow = "none")}
                    />
                    <button
                      type="submit"
                      className="bg-[#6366F1] text-white px-4 py-2 rounded-md"
                    >
                      <div className="flex w-fit flex-row justify-center items-center">
                        <div className="flex">
                          {" "}
                          <svg
                            width="20"
                            height="24"
                            viewBox="0 0 20 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12.4996 19.4344C12.533 19.7136 12.4496 20.0114 12.258 20.2068C12.1809 20.2931 12.0893 20.3615 11.9885 20.4082C11.8877 20.4549 11.7796 20.479 11.6705 20.479C11.5613 20.479 11.4532 20.4549 11.3524 20.4082C11.2516 20.3615 11.16 20.2931 11.083 20.2068L7.74129 16.475C7.6504 16.3758 7.58129 16.2545 7.53937 16.1205C7.49745 15.9865 7.48384 15.8435 7.49962 15.7026V10.9379L3.50795 5.23319C3.37263 5.03918 3.31157 4.79324 3.33811 4.54912C3.36466 4.30499 3.47665 4.08252 3.64962 3.93032C3.80795 3.80004 3.98295 3.72559 4.16629 3.72559H15.833C16.0163 3.72559 16.1913 3.80004 16.3496 3.93032C16.5226 4.08252 16.6346 4.30499 16.6611 4.54912C16.6877 4.79324 16.6266 5.03918 16.4913 5.23319L12.4996 10.9379V19.4344ZM5.86629 5.58682L9.16629 10.2957V15.4328L10.833 17.294V10.2864L14.133 5.58682H5.86629Z"
                              fill="white"
                            />
                          </svg>
                        </div>
                        <div className="flex flex-1 text-white text-md">
                          Search Result
                        </div>
                      </div>
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
        <div className="flex flex-1 m-4 p-2 bg-white rounded-lg shadow-lg">
          <Scheduled_Table />
        </div>
      </div>
    </div>
  );
}
