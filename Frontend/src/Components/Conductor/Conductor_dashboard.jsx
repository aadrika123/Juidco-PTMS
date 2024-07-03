import React, { useEffect, useState } from "react";
import background_image from "../../assets/background_image.png";
import RMC_logo from "../../assets/RMC_LOGO.png";
import bus from "../../assets/bus 1.png";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slice/slice";
import Cookies from "js-cookie";
import axios from "axios";

export default function Conductor_dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user_Details = Cookies.get("user_details");
  const token = Cookies.get("accesstoken");
  const [busData, set_busData] = useState(null);
  console.log(busData);

  /* const userDetailsObj = user_Details ? JSON.parse(user_Details) : null;
  console.log(userDetailsObj);
   */

  const userName = localStorage.getItem("conductorId");

  function handle_logout() {
    const confirm = window.confirm("Are you sure want to logout?");
    if (confirm) {
      dispatch(logout());
      window.location.replace("/mobile");
    }
  }

  useEffect(() => {
    if (userName === null) {
      return;
    } else {
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
      const formattedTime = currentDate
        .toTimeString()
        .split(" ")[0]
        .replace(/:/g, "")
        .slice(0, 4); // Format time as HHMM

      console.log(
        "Format Date >>> ",
        formattedDate,
        "Format Time >>>> ",
        formattedTime
      );

      try {
        axios
          .post(
            `${process.env.REACT_APP_BASE_URL}/getScheduledConductor`,
            {
              conductor_id: userName,
              date: formattedDate,
              from_time: formattedTime,
              to_time: formattedTime,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((e) => {
            console.log("Scheduled Conductor", e);
            localStorage.setItem("BusID", e.data?.data?.data[0].bus_id);
            set_busData(e.data?.data?.data[0]);
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (err) {
        console.log(err);
      }
    }
  }, []);
  console.log("bus data >>> ", busData?.bus_id);

  return (
    <div className="flex items-center justify-between h-screen w-screen">
      <div className="flex flex-1 flex-col justify-between bg-white h-screen ">
        <div
          onClick={() => navigate(-1)}
          className="absolute w-fit h-fit top-4 left-4 md:hidden"
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
        <div className="flex h-[300px] md:h-[100px] pb-8  justify-center items-center md:justify-start rounded-b-[30px] border-b-[3px] border-l-0 border-r-0 shadow-md border-t-0">
          <div className="flex flex-1 flex-col md:flex-row  justify-between  items-center">
            <div className="flex  flex-col md:flex-row justify-between items-center">
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
                  <div className="flex mt-2 flex-row ">
                    <h1 className="text-xl font-bold break-words text-[#1436C3]">
                      Urban Transport
                    </h1>
                    <img
                      src={bus}
                      alt="Bus"
                      className="ml-2 max-w-full h-full  md:h-5"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div
              onClick={handle_logout}
              className="flex cursor-pointer h-10 w-10 m-5 rounded-xl shadow-md justify-center items-center bg-[#5457D6] ml-4"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 17 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.59143 12.5274H3.75852C3.83821 12.5274 3.91291 12.5622 3.96272 12.6237C4.07893 12.7648 4.20344 12.9009 4.33459 13.0304C4.871 13.5673 5.50638 13.9952 6.20559 14.2905C6.92999 14.5964 7.70858 14.7534 8.49494 14.752C9.29016 14.752 10.0605 14.5959 10.7843 14.2905C11.4835 13.9952 12.1189 13.5673 12.6553 13.0304C13.1927 12.4953 13.6211 11.861 13.917 11.1627C14.2241 10.4389 14.3785 9.67024 14.3785 8.87503C14.3785 8.07981 14.2225 7.31116 13.917 6.58733C13.6215 5.8884 13.1965 5.2592 12.6553 4.71965C12.1141 4.1801 11.4849 3.7551 10.7843 3.4596C10.0605 3.15413 9.29016 2.99807 8.49494 2.99807C7.69973 2.99807 6.92942 3.15247 6.20559 3.4596C5.505 3.7551 4.8758 4.1801 4.33459 4.71965C4.20344 4.85081 4.08059 4.98694 3.96272 5.12639C3.91291 5.18782 3.83654 5.22268 3.75852 5.22268H2.59143C2.48684 5.22268 2.42209 5.10647 2.4802 5.01848C3.75354 3.03958 5.98147 1.72971 8.51321 1.73635C12.4909 1.74631 15.6801 4.97532 15.6403 8.94807C15.6004 12.8577 12.4162 16.0137 8.49494 16.0137C5.96984 16.0137 3.75188 14.7055 2.4802 12.7316C2.42375 12.6436 2.48684 12.5274 2.59143 12.5274ZM1.11555 8.77044L3.47131 6.91106C3.5593 6.84133 3.68713 6.90442 3.68713 7.01565V8.27737H8.90002C8.97307 8.27737 9.03283 8.33713 9.03283 8.41018V9.33987C9.03283 9.41292 8.97307 9.47268 8.90002 9.47268H3.68713V10.7344C3.68713 10.8456 3.55764 10.9087 3.47131 10.839L1.11555 8.97962C1.09967 8.96719 1.08684 8.95132 1.07801 8.9332C1.06918 8.91508 1.06459 8.89518 1.06459 8.87503C1.06459 8.85487 1.06918 8.83497 1.07801 8.81685C1.08684 8.79873 1.09967 8.78286 1.11555 8.77044Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="relative w-full flex-col overflow-y-auto">
          <div className="flex flex-col w-full h-fit justify-center ">
            <div className="flex flex-1 justify-center items-center">
              <div className="flex w-[70%] flex-col justify-center items-center">
                <div className="flex flex-1 justify-center items-center mt-2 mb-2 flex-row">
                  <div className="flex text-base md:text-sm lg:text-base xl:text-lg mr-4 font-bold">
                    Conductor ID:
                  </div>
                  <div className="flex text-md md:text-xs lg:text-lg xl:text-xl">
                    {userName}
                  </div>
                </div>
                <div className="flex justify-center items-center mt-2 mb-2 flex-row">
                  <div className="flex text-base md:text-sm lg:text-base xl:text-lg mr-4 font-bold">
                    Scheduled Bus ID:
                  </div>
                  <div className="flex text-md md:text-xs lg:text-lg xl:text-xl">
                    {busData?.bus_id}
                  </div>
                </div>
                <button
                  disabled={busData == undefined ? true : false}
                  onClick={() => {
                    navigate("/ticket_check");
                  }}
                  className={`flex m-4 flex-row w-[90%] text-lg md:text-xl lg:text-2xl xl:text-3xl border-2 ${
                    busData == undefined
                      ? "bg-slate-200 text-white"
                      : "border-[#4338CA] hover:bg-[#4338CA] hover:text-white text-black"
                  } font-md p-2 rounded-md justify-center items-center`}
                >
                  Ticket Booking
                  <svg
                    width="34"
                    className="ml-4 fill-current"
                    height="34"
                    viewBox="0 0 17 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.939 4.56246C11.6791 4.3024 11.5268 3.95379 11.5128 3.58634C11.4988 3.21889 11.624 2.8597 11.8634 2.58058C11.8832 2.55737 11.8935 2.52753 11.8922 2.49705C11.8909 2.46656 11.8782 2.43769 11.8565 2.41621L10.4775 1.03558C10.4547 1.0128 10.4238 1 10.3915 1C10.3593 1 10.3284 1.0128 10.3056 1.03558L8.10746 3.23371C8.02634 3.31478 7.96524 3.41364 7.92902 3.52246C7.89292 3.63152 7.8319 3.73066 7.7508 3.81202C7.66971 3.89339 7.57077 3.95474 7.46183 3.99121C7.35296 4.02749 7.254 4.08858 7.17277 4.16965L1.53558 9.80558C1.5128 9.82838 1.5 9.85929 1.5 9.89152C1.5 9.92375 1.5128 9.95466 1.53558 9.97746L2.91465 11.3565C2.93613 11.3782 2.965 11.3909 2.99549 11.3922C3.02597 11.3935 3.05581 11.3832 3.07902 11.3634C3.35808 11.1237 3.71735 10.9983 4.08493 11.0123C4.4525 11.0262 4.80125 11.1785 5.06135 11.4386C5.32145 11.6987 5.47371 12.0474 5.48765 12.415C5.50159 12.7826 5.37618 13.1418 5.13652 13.4209C5.11672 13.4441 5.10643 13.4739 5.1077 13.5044C5.10898 13.5349 5.12173 13.5638 5.1434 13.5853L6.52246 14.9643C6.54526 14.9871 6.57617 14.9999 6.6084 14.9999C6.64063 14.9999 6.67154 14.9871 6.69433 14.9643L12.3318 9.32715C12.4129 9.24592 12.474 9.14696 12.5103 9.03808C12.5464 8.92903 12.6074 8.82989 12.6885 8.74852C12.7696 8.66715 12.8685 8.6058 12.9775 8.56933C13.0863 8.53312 13.1851 8.47202 13.2662 8.3909L15.4643 6.19277C15.4871 6.16998 15.4999 6.13906 15.4999 6.10683C15.4999 6.0746 15.4871 6.04369 15.4643 6.0209L14.0853 4.64183C14.0638 4.62017 14.0349 4.60742 14.0044 4.60614C13.9739 4.60487 13.9441 4.61516 13.9209 4.63496C13.6422 4.87476 13.2832 5.00052 12.9158 4.98708C12.5483 4.97363 12.1995 4.82199 11.939 4.56246Z"
                      stroke="white"
                      stroke-miterlimit="10"
                    />
                    <path
                      d="M8.32844 4.38874L7.8125 3.8728M9.70406 5.76437L9.36 5.42062M11.0797 7.1403L10.7359 6.79624M12.6275 8.6878L12.1116 8.17187"
                      stroke="white"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                    />
                  </svg>
                </button>

                <button
                  onClick={() => {
                    navigate("/conductor_Report");
                  }}
                  className="flex m-4 flex-row w-[90%] text-lg md:text-xl lg:text-2xl xl:text-3xl  border-2 text-black hover:text-white font-md border-[#4338CA] hover:bg-[#4338CA] p-2 rounded-md justify-center items-center hover:fill-white"
                >
                  Report Generation
                  <svg
                    width="34"
                    height="34"
                    className="ml-4 fill-current"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 16.423C12.1747 16.423 12.321 16.364 12.439 16.246C12.5563 16.128 12.615 15.982 12.615 15.808C12.615 15.634 12.556 15.4877 12.438 15.369C12.32 15.2503 12.174 15.1913 12 15.192C11.826 15.1927 11.68 15.2517 11.562 15.369C11.444 15.4863 11.385 15.6327 11.385 15.808C11.385 15.9833 11.444 16.1293 11.562 16.246C11.68 16.3627 11.826 16.4217 12 16.423ZM11.5 13.462H12.5V7.384H11.5V13.462ZM8.673 20L4 15.336V8.673L8.664 4H15.327L20 8.664V15.327L15.336 20H8.673ZM9.1 19H14.9L19 14.9V9.1L14.9 5H9.1L5 9.1V14.9L9.1 19Z"
                      fill="#373030"
                    />
                  </svg>
                </button>
              </div>
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
