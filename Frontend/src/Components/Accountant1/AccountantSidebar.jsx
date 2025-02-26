import React from "react";
import Avatar from "@mui/material/Avatar";
import sample_profile from "../../assets/jhant.png";
import { useNavigate, useLocation, Link } from "react-router-dom";

export default function AccountantSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const name = localStorage.getItem('name') || 'Accountant';
  return (
    <div className="flex h-[90vh] justify-center items-start ">
      <div className="flex flex-1 ">
        <div className="flex flex-1 flex-col justify-center items-center">
          <div className="flex flex-1 mt-8 justify-center">
            <Avatar src={sample_profile} sx={{ width: 100, height: 100 }} />
          </div>
          <div className="flex flex-1 text-2xl text-[#555555] font-bold">
            {name}
          </div>

          <div className="flex flex-col  w-[90%] m-10 justify-start items-start">
            <div
              className={`flex h-[50px] justify-center items-center rounded-md  ${
                path == "/accountant-view" ? "bg-[#5457D6] text-white" : "bg-white "
              } hover:text-white hover:bg-[#5457D6] cursor-pointer w-full mt-4 mb-4 `}
            >
              <Link className="flex flex-1" to="/accountant-view">
                <div className="flex w-full justify-between">
                  <div className="flex w-fit">
                    <div className="h-10 w-10 bg-[#5457D6] flex rounded-md justify-center items-center">
                      <div className="flex">
                        <svg
                          width="26"
                          height="26"
                          viewBox="0 0 15 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-white group-hover:text-[#5457D6]"
                        >
                          <path
                            d="M13.75 12.125V5.00625C13.75 4.18 13.75 3.76625 13.535 3.44625C13.32 3.12625 12.9394 2.9725 12.1787 2.665L8.42875 1.1525C7.97 0.9675 7.74125 0.875 7.5 0.875C7.25875 0.875 7.03 0.9675 6.57125 1.1525L2.82125 2.665C2.06062 2.9725 1.68 3.12625 1.465 3.44625C1.25 3.76625 1.25 4.18 1.25 5.00625V12.125M10 10.875V12.125M5 10.875V12.125"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M4.6875 7.75L4.83938 7.14375C5.06625 6.23437 5.18 5.77937 5.51938 5.515C5.85813 5.25 6.32688 5.25 7.26438 5.25H7.73562C8.67312 5.25 9.14187 5.25 9.48062 5.515C9.82 5.77937 9.93375 6.23375 10.1606 7.14375L10.3125 7.75M5.3125 9.30625V9.3125M9.6875 9.30625V9.3125M10.625 7.75H4.375C4.20924 7.75 4.05027 7.81585 3.93306 7.93306C3.81585 8.05027 3.75 8.20924 3.75 8.375V10.25C3.75 10.4158 3.81585 10.5747 3.93306 10.6919C4.05027 10.8092 4.20924 10.875 4.375 10.875H10.625C10.7908 10.875 10.9497 10.8092 11.0669 10.6919C11.1842 10.5747 11.25 10.4158 11.25 10.25V8.375C11.25 8.20924 11.1842 8.05027 11.0669 7.93306C10.9497 7.81585 10.7908 7.75 10.625 7.75Z"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-1 ml-4 justify-start items-center text-[#555555] font-semibold text-inherit">
                    Home
                  </div>
                </div>
              </Link>
            </div>

            <div
              className={`flex h-[50px] justify-center items-center rounded-md  ${
                path == "/ValidationListView"
                  ? "bg-[#5457D6] text-white"
                  : "bg-white "
              } hover:text-white hover:bg-[#5457D6] cursor-pointer w-full mt-4 mb-4 `}
            >
              <Link className="flex flex-1" to="/ValidationListView">
                {" "}
                <div className="flex w-full justify-between">
                  <div className="flex w-fit">
                    <div className="h-10 w-10 bg-[#5457D6] flex rounded-md justify-center items-center">
                      <div className="flex">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 13 16"
                          fill="none"
                        >
                          <path
                            d="M6.5013 14.6668C6.5013 14.6668 11.8346 10.6668 11.8346 6.3335C11.8346 3.57216 9.44697 1.3335 6.5013 1.3335C3.55564 1.3335 1.16797 3.57216 1.16797 6.3335C1.16797 10.6668 6.5013 14.6668 6.5013 14.6668Z"
                            stroke="white"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M5.5 4.66699V10.0003"
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M5.5 4.66699H7.5C7.85362 4.66699 8.19276 4.80747 8.44281 5.05752C8.69286 5.30756 8.83333 5.6467 8.83333 6.00033C8.83333 6.35395 8.69286 6.69309 8.44281 6.94313C8.19276 7.19318 7.85362 7.33366 7.5 7.33366H5.5V4.66699Z"
                            stroke="white"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-1 ml-4 justify-start items-center text-[#555555] font-semibold text-inherit">
                    Transaction Validation
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
