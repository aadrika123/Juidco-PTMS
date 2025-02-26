import React from "react";

const CustomButton = ({ children, variant, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`${
        variant === "contained"
          ? "bg-[#665DD9] text-white"
          : "bg-red-600 text-white"
      } px-8 py-2 rounded-sm`}
    >
      {children}
    </button>
  );
};

const ConductorCollectionDetails = ({ closePopup }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="bg-white p-8 rounded-lg shadow-lg h-[60vh] w-[60vw]">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold mb-4">
            Conductor Collection Details
          </h2>
          <button onClick={() => closePopup(false)}>
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              version="1.1"
              viewBox="0 0 17 17"
              height="1.5em"
              width="1.5em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g></g>
              <path d="M9.207 8.5l6.646 6.646-0.707 0.707-6.646-6.646-6.646 6.646-0.707-0.707 6.646-6.646-6.647-6.646 0.707-0.707 6.647 6.646 6.646-6.646 0.707 0.707-6.646 6.646z"></path>
            </svg>
          </button>
        </div>

        <section className="flex gap-5 ">
          <div className="bg-white shadow-md p-3 w-[20rem]">
            <h4 className="text-sm font-bold">Accountant ID</h4>
            <div>
              <div className="text-sm mt-4 flex items-center gap-2">
                <h4 className="font-semibold text-gray-700">
                  Transaction Date:{" "}
                </h4>
                <p className="text-sm text-gray-600 font-semibold">
                  15-07-2024
                </p>
              </div>
              <div className="text-sm mt-4 flex items-center gap-2">
                <h4 className="font-semibold text-gray-700">Total Amount: </h4>
                <p className="text-sm text-gray-600 font-semibold">₹ 12,000</p>
              </div>
              <div className="text-sm mt-4 flex items-center gap-2">
                <h4 className="font-semibold text-gray-700">
                  Number of Transaction:
                </h4>
                <p className="text-sm text-gray-600 font-semibold">121</p>
              </div>
            </div>
          </div>
          <div className="bg-white shadow-md w-[12rem] flex flex-col items-start pl-8 justify-center">
            <h4 className="text-2xl font-bold">₹ 12,000.00</h4>
            <p className=" font-semibold text-gray-600">Cash</p>
          </div>
          <div className="bg-white shadow-md w-[12rem] flex flex-col items-start pl-8 justify-center">
            <h4 className="text-2xl font-bold">₹ 0.00</h4>
            <p className=" font-semibold text-gray-600">QR Code</p>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-md font-bold mb-1">Self Advertisement Payment</h2>
          <table
            id="data-table"
            className="min-w-full bg-white border border-gray-200"
          >
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="py-2 px-4 border-b">Transaction No.</th>
                <th className="py-2 px-4 border-b">Payment Mode</th>
                <th className="py-2 px-4 border-b">Conductor ID</th>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Schedule Time Range</th>
                <th className="py-2 px-4 border-b">Bus No. for the Day</th>
              </tr>
            </thead>
            <tbody className=" overflow-auto">
              {[1, 2, 3, 4]?.map((report) => {
                return (
                  <>
                    <tr className="bg-gray-50">
                      <td className="py-2 px-4 border-b">2024-05-26</td>
                      <td className="py-2 px-4 border-b"></td>
                      <td className="py-2 px-4 border-b"></td>
                      <td className="py-2 px-4 border-b"></td>
                      <td className="py-2 px-4 border-b"></td>
                      <td className="py-2 px-4 border-b"></td>{" "}
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </section>

        <section className="flex items-end justify-end mt-4">
          <div className="flex items-center gap-5">
            <CustomButton variant="contained">Verify</CustomButton>
            <CustomButton variant="outlined" onClick={() => closePopup(false)}>
              Close
            </CustomButton>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ConductorCollectionDetails;
