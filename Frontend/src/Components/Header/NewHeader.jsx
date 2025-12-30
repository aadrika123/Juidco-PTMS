import React, { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slice/slice";
import axios from "axios";
import { MdDashboard } from "react-icons/md";
import Modal from "react-modal";
import PermittedModuleCard from "./PermittedModuleCard";

const NewHeader = ({ heading, set_hide, hide }) => {
  const dispatch = useDispatch();
  const token = Cookies.get("accesstoken");
  const [ulbData, setUlbData] = useState({});
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const userDropdownRef = useRef(null);
  const userData = JSON.parse(localStorage.getItem("userDetail"));
  const [modalIsOpen2, setIsOpen2] = useState(false);

  function handle_logout() {
    setShowLogoutModal(true);
  }

  const closeModal2 = () => setIsOpen2(false);

  function confirmLogout() {
    dispatch(logout());
    window.location.replace("/public-transport");
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
        setUlbData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (!ulbData || Object.keys(ulbData).length === 0) {
      fetchUlbData();
    }
  }, [ulbData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  console.log("user", userData);

  const getUserInitials = () => {
    if (!userData?.userName) return "U";
    const names = userData.userName.split(" ");
    if (names.length > 1) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return userData.userName[0].toUpperCase();
  };

  return (
    <div className="flex flex-1 flex-row justify-between px-4 h-[80px] bg-white border-b-[2px] border-r-0 shadow-md border-t-0">
      <div
        style={{ flex: 2 }}
        className="flex justify-center md:justify-start items-center"
      >
        <div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="bg-[#1a4d8c] w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">UD</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  UD&HD
                </h1>
                <p className="text-xs text-gray-500 font-medium">
                  Urban Development
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                set_hide(!hide);
              }}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

        </div>
        <div className="flex flex-row justify-start items-center md:ml-16 mt-2">
          <button
            onClick={() => setIsOpen2(true)}
            className="ml-4 px-4 py-2 bg-[#1a4d8c] text-white rounded-lg font-medium hover:bg-[#07075b] transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2 mr-4"
          >
            <MdDashboard className="w-4 h-4" />
            <span>Modules</span>
          </button>
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800">
            <svg
              className="w-4 h-4 text-[#1a4d8c]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            </svg>
            <span className="relative">
              {userData?.ulb || ""}
              <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#1a4d8c] rounded"></span>
            </span>
          </h2>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative" ref={userDropdownRef}>
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
          >
            <div className="relative">
              <div className="w-10 h-10 bg-[#1a4d8c] rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                {getUserInitials()}
              </div>
            </div>
            <div className="hidden md:block text-left">
              <div className="text-sm font-semibold text-gray-800">
                {userData?.userName || "User"}
              </div>
            </div>
            <svg
              className="w-4 h-4 text-gray-600 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fadeIn">
              <div className="py-2">
                {/* My Profile */}
                <button
                  onClick={() =>
                    window.open("/settings/dashboard/home", "_blank")
                  }
                  className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-blue-50 transition-colors duration-150 text-left"
                >
                  <svg
                    className="w-5 h-5 text-blue-600"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v1h20v-1c0-3.3-6.7-5-10-5z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-800">
                      My Profile
                    </p>
                    <p className="text-sm text-gray-500">
                      View your profile
                    </p>
                  </div>
                </button>

                {/* Change Password */}
                <button
                  onClick={() => window.open("/settings/dashboard/change-password", "_blank")}
                  className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-blue-50 transition-colors duration-150 text-left border-t border-gray-100"
                >
                  <svg
                    className="w-5 h-5 text-green-600"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 1a5 5 0 00-5 5v3H6a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2v-9a2 2 0 00-2-2h-1V6a5 5 0 00-5-5zm-3 8V6a3 3 0 016 0v3H9z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-800">
                      Change Password
                    </p>
                    <p className="text-sm text-gray-500">
                      Update your password
                    </p>
                  </div>
                </button>

                {/* Notifications */}
                <button
                  onClick={() =>
                    window.open(
                      "/settings/dashboard/notification",
                      "_blank"
                    )
                  }
                  className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-blue-50 transition-colors duration-150 text-left border-t border-gray-100"
                >
                  <svg
                    className="w-5 h-5 text-orange-600"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 22a2 2 0 002-2h-4a2 2 0 002 2zm6-6V11c0-3.1-1.6-5.6-4.5-6.3V4a1.5 1.5 0 00-3 0v.7C7.6 5.4 6 7.9 6 11v5l-2 2v1h16v-1l-2-2z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-800">
                      Notifications
                    </p>
                    <p className="text-sm text-gray-500">
                      Read notifications
                    </p>
                  </div>
                </button>

                {/* Logout */}
                <button
                  onClick={handle_logout}
                  className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-red-50 transition-colors duration-150 text-left border-t border-gray-100"
                >
                  <svg
                    className="w-5 h-5 text-red-600"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M16 13v-2H7V8l-5 4 5 4v-3h9zm4-10H10a2 2 0 00-2 2v4h2V5h10v14H10v-4H8v4a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-800">Logout</p>
                    <p className="text-sm text-gray-500">
                      Sign out from system
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen2}
        onRequestClose={closeModal2}
        className="z-20 h-screen w-screen backdrop-blur-sm flex items-center justify-center overflow-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        contentLabel="Modules"
      >
        <PermittedModuleCard
          isOpen={modalIsOpen2}
          onClose={closeModal2}
        />
      </Modal>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewHeader;