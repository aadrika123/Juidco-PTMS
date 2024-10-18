import { useEffect, useState } from "react";
import busstop from "../../../assets/bus-stop.png";
import axios from "axios";
import Cookies from "js-cookie";



function EditModal({
  confirmationHandler,
  handleCancel,
  loadingState,
  page,
  dataId,
}) {
  const token = Cookies.get("accesstoken");

  const [firstInput, setFirstInput] = useState("");
  const [secondInput, setSecondInput] = useState("");

  console.log(dataId, "dataId");

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/passenger/day-wise`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data?.data?.data);
        // setPassengers_status(res.data?.data?.data);
      });
  }, []);

  let loading =
    "h-6 w-6 rounded-full animate-spin border-4 border-solid border-t-transparent";

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/getAllConductorsList?limit=100&page=1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ) // Replace with your actual API endpoint
      .then((response) => {
        set_busoptions(response?.data?.data?.data);
      })
      .catch((error) => console.error("Error fetching bus data:", error));
  }, []);

  return (
    <>
      <div></div>
      <div className="fixed inset-0 flex items-center justify-start z-[5000]">
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
        <div className="bg-white w-1/2 mx-auto flex flex-col max-sm:w-full z-10  rounded">
          <div className="mt-10 flex justify-start items-start ">
            <img
              className="h-[2rem] ml-5 animate-wiggle mb-5 "
              src={busstop}
              alt="alt title"
            />
            <h1 className="pl-3 font-bold text-xl">JH01EL7764</h1>
          </div>
          <div className="flex mt-10">
            <div className="flex flex-col">
              <label className="mb-2 ml-4">
                {page == "bus" ? "Pollution Certificate" : "Enter Phone Number"}
                <span className="text-red-500">*</span>
              </label>
              <input
                type={page == "bus" ? "file" : "text"}
                className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                onChange={(e) => setFirstInput(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-2 ml-4">
                {page == "bus" ? "Tax Copy" : "Enter Emergency Phone Number"}
                <span className="text-red-500">*</span>
              </label>
              <input
                type={page == "bus" ? "file" : "text"}
                className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                onChange={(e) => setSecondInput(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col m-8">
            <div className="flex  space-x-5">
              <div>
                <button
                  className={`bg-white border-blue-900 border text-blue-950 text-sm px-8 py-2 hover:bg-[#4338CA] hover:text-white  rounded leading-5 shadow-lg`}
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>

              <div className="">
                <button
                  className={`bg-[rgb(67,56,202)] text-sm px-8 py-2 text-white  rounded leading-5 shadow-lg`}
                  onClick={confirmationHandler}
                  disabled={loadingState}
                >
                  {loadingState ? <div className={`${loading}`}></div> : "Save"}
                </button>
              </div>
            </div>

            <div>
              {/* <h1 className='text-center pt-5'>
                <span className='text-red-600 text-xl'>*</span> By Clicking
                Continue your data will be Processed
              </h1> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditModal;
