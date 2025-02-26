import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import bus from "../../assets/bus 1.png";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slice/slice";
import { motion } from "framer-motion";
import axios from "axios";

const Header = ({ heading, set_hide, hide }) => {
  const dispatch = useDispatch();
  const token = Cookies.get("accesstoken");

  const [ulbData, setUlbData] = useState({})

  function handle_logout() {
    const confirm = window.confirm("Are you sure want to logout?");
    if (confirm) {
      dispatch(logout());
      window.location.replace("/ptms");
    }
  }

  const fetchUlbData = async () => {
    await axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/report/get-ulb`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setUlbData(response.data)
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    if (!ulbData || Object.keys(ulbData).length === 0) {
      fetchUlbData()
    }
  }, [ulbData])

  return (
    <div className="flex flex-1 flex-row justify-between px-4 h-[80px] bg-white border-b-[2px]  border-r-0 shadow-md border-t-0">
      <div
        style={{ flex: 2 }}
        className="flex justify-center md:justify-start items-center"
      >
        <div>
          <div className="flex flex-row justify-start items-center md:ml-10">
            <motion.div
              className="flex ml-2 cursor-pointer"
              onClick={() => {
                set_hide(!hide);
              }}
              whileHover={{ rotate: 180 }}
            >
              <svg
                width="28"
                height="19"
                viewBox="0 0 28 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.79957 3.82265V0.0581055H27.6723V3.82265H6.79957ZM6.79957 11.3517V7.5872H27.6723V11.3517H6.79957ZM6.79957 18.8808V15.1163H27.6723V18.8808H6.79957ZM2.32685 3.82265C1.90442 3.82265 1.55058 3.64195 1.26532 3.28056C0.980059 2.91916 0.836931 2.47243 0.835938 1.94038C0.835938 1.40707 0.979065 0.960342 1.26532 0.6002C1.55157 0.240059 1.90542 0.0593603 2.32685 0.0581055C2.74927 0.0581055 3.10361 0.238804 3.38986 0.6002C3.67612 0.961597 3.81875 1.40832 3.81776 1.94038C3.81776 2.47369 3.67463 2.92104 3.38837 3.28244C3.10212 3.64384 2.74828 3.82391 2.32685 3.82265ZM2.32685 11.3517C1.90442 11.3517 1.55058 11.171 1.26532 10.8096C0.980059 10.4483 0.836931 10.0015 0.835938 9.46947C0.835938 8.93616 0.979065 8.48943 1.26532 8.12929C1.55157 7.76915 1.90542 7.58845 2.32685 7.5872C2.74927 7.5872 3.10361 7.76789 3.38986 8.12929C3.67612 8.49069 3.81875 8.93741 3.81776 9.46947C3.81776 10.0028 3.67463 10.4501 3.38837 10.8115C3.10212 11.1729 2.74828 11.353 2.32685 11.3517ZM2.32685 18.8808C1.90442 18.8808 1.55058 18.7001 1.26532 18.3387C0.980059 17.9773 0.836931 17.5306 0.835938 16.9986C0.835938 16.4653 0.979065 16.0185 1.26532 15.6584C1.55157 15.2982 1.90542 15.1175 2.32685 15.1163C2.74927 15.1163 3.10361 15.297 3.38986 15.6584C3.67612 16.0198 3.81875 16.4665 3.81776 16.9986C3.81776 17.5319 3.67463 17.9792 3.38837 18.3406C3.10212 18.702 2.74828 18.8821 2.32685 18.8808Z"
                  fill="#555555"
                />
              </svg>
            </motion.div>
            <div className="flex text-xl text-[#555555] ml-4 font-bold">
              UD & HD
            </div>
          </div>
          <div className="flex flex-row justify-start items-center md:ml-24">
            <p>
              {ulbData?.ulb_name || ''}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-1 justify-center md:justify-end items-center ">
        <div className="flex md:mr-10">
          <div className="flex flex-col md:flex-row flex-1 justify-center items-end">
            <div className="flex flex-row ">
              <h1 className="flex justify-center items-center text-xl md:text-xl text-[#322F2F] font-semibold  ">
                {heading}
              </h1>
              <img
                src={bus}
                alt="Bus"
                className="ml-2 max-w-full h-auto md:h-8"
              />
            </div>
            <div
              onClick={handle_logout}
              className="flex cursor-pointer h-10 w-10 rounded-xl shadow-md justify-center items-center bg-[#5457D6] hover:bg-red-400 ml-4"
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
      </div>
    </div>
  );
};

export default Header;
