import { useContext, useEffect, useState } from "react";
import ApiHeader from "../api/ApiHeader";
import TitleBar from "../Others/TitleBar";
import { contextVar } from "../context/contextVar";
import ProjectApiList from "../api/ProjectApiList";
import { FaArrowRightLong } from "react-icons/fa6";
import { CSVLink } from "react-csv";
import { usePDF } from "react-to-pdf";

const ValidateTransaction = () => {
  const { titleBarVisibility } = useContext(contextVar);
  const { api_getValidationTrans } = ProjectApiList();
  const [conductorDetails, setConductorDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [conductorId, setConductorId] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const handleDateFilter = () => {
    const start = startDate?.target?.value;
    const end = endDate?.target?.value;

    console.log(start, end, conductorId);
    fetchConductorDetails(start, end, conductorId);

    // setCurrentPage(1); // Reset to first page after filtering
  };
  useEffect(() => {
    fetchConductorDetails();
  }, []);

  // useEffect(() => {
  
    const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });


  const fetchConductorDetails = async (start, end, conductorId) => {
    let isMounted = true;

    let queryParams = "";

    if (start && end) {
      queryParams = `startDate=${start}&endDate=${end}`;
    }

    if (conductorId) {
      if (queryParams) {
        queryParams += `&conductor_id=${conductorId}`;
      } else {
        queryParams += `conductor_id=${conductorId}`;
      }
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/Cash/validate/status?status=1&${queryParams}`,
        ApiHeader()
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (isMounted) {
        setConductorDetails(data);
        setIsLoading(false);
      }
    } catch (err) {
      if (isMounted) {
        setError(err.message);
        setIsLoading(false);
      }
    }
  };

  //   fetchConductorDetails();

  //   return () => {
  //     isMounted = false; // Clean up on unmount
  //   };
  // }, []);

  const COLUMNS = [
    { header: "Sr.No" },
    { header: "Transaction ID" },
    { header: "Validated Amount" },
    { header: "Conductor ID" },
    { header: "Conductor Name" },
    { header: "Date" },
    { header: "Time" },
    // { header: "Description" },
    { header: "Transaction Type" },
    { header: "Bus ID" },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="flex flex-col w-full m-5">
        <div>
          <TitleBar
            titleBarVisibility={titleBarVisibility}
            titleText={"Transaction validated View Details"}
          />
        </div>

        <div className="border border-gray-300 rounded-xl bg-slate-100 m-3 cursor-pointer hover:border hover:border-blue-500 flex justify-between">
          <div className="flex m-4 justify-start">
            <div className="form-group flex-shrink max-w-full px-4 mb-4">
              <label className="inline-block mb-2 flex flex-row">
                Start Date
                <span className="text-xl text-red-500 pl-1">*</span>
              </label>
              {/* <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                className="inline-block w-full relative border-2 p-2 rounded-md"
                dateFormat="dd-MM-yyyy"
                placeholderText="Select start date"
              /> */}
              <input
                type="date"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                className="inline-block w-full relative border-2 p-2 rounded-md"
                dateFormat="dd-MM-yyyy"
                placeholderText="Select start date"
              />
            </div>

            <div className="form-group flex-shrink max-w-full px-4 mb-4">
              <label className="inline-block mb-2 flex flex-row">
                End Date
                <span className="text-xl text-red-500 pl-1">*</span>
              </label>
              {/* <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                className="inline-block w-full relative border-2 p-2 rounded-md"
                dateFormat="dd/MM/yyyy"
                placeholderText="Select end date"
              /> */}

              <input
                type="date"
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                className="inline-block w-full relative border-2 p-2 rounded-md"
                dateFormat="dd/MM/yyyy"
                placeholderText="Select end date"
              />
            </div>

            <div className="pt-9">
              <input
                type="text"
                placeholder="Enter the Incharge Id"
                className="inline-block w-full relative border-2 p-2 rounded-md"
                value={conductorId}
                onChange={(e) => setConductorId(e.target.value)}
              />
            </div>
            <div className="pt-9">
              <button
                className="bg-[#4338CA] hover:bg-[#5f54df] px-7 ml-4 py-2 text-white font-semibold rounded shadow-lg"
                onClick={handleDateFilter}
              >
                Search
              </button>
            </div>
          </div>

          <div className="flex mr-8 mt-4 justify-end ml-20">
            <div className="flex items-center ">
              {/* Export Functionality */}
              <div
                className="flex justify-between gap-4 py-2"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <button className="text-red bg-[#4338CA] hover:before:bg-redborder-red-500 relative overflow-hidden border px-7 py-2 text-white shadow-2xl transition-all before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-[#4338CA] before:transition-all before:duration-500 hover:text-white hover:before:left-0 hover:before:w-full rounded-md">
                  <span className="relative z-10 flex">
                    Export{" "}
                    <FaArrowRightLong
                      color="white"
                      size={15}
                      className="mt-1 ml-3"
                    />
                  </span>
                </button>

                <div
                  className={`flex gap-2 transition-opacity duration-300 ${
                    isHovered ? "opacity-100 visible" : "opacity-0 invisible"
                  }`}
                >
                  <button
                    onClick={() => toPDF()} // Trigger PDF download
                    className="bg-[#4338CA] text-white px-2 rounded-md flex items-center gap-1 hover:bg-[#4338CA] font-semibold text-xs"
                  >
                    PDF
                  </button>

                  {/* <CSVLink
                    data={csvData}
                    headers={headers}
                    filename={`AccountantView-${activeTab}-${new Date().toISOString()}.csv`}
                    className="text-white"
                  >
                    <button className="bg-[#4338CA] text-white px-2  rounded-md flex items-center gap-1 hover:bg-[#4338CA] font-semibold text-xs py-4">
                      CSV
                    </button>
                  </CSVLink> */}
                  {/* <CSVLink
                    data={csvData}
                    headers={headers}
                    filename={`AccountantView-${activeTab}-${new Date().toISOString()}.csv`}
                    className="text-white"
                  >
                    <button className="bg-[#4338CA] text-white px-2 rounded-md flex items-center gap-1 hover:bg-[#4338CA] font-semibold text-xs py-4">
                      XLV
                    </button>
                  </CSVLink> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded font-sans mb-10 border border-[#4338ca] shadow-lg px-4 mt-1 font-bold">
          <div className="m-2">
            <div className="shadow-md rounded-md overflow-auto" ref={targetRef}>
              <table className="min-w-full bg-white border-collapse border border-gray-200 rounded-md">
                <thead className="bg-indigo-100 text-black rounded-md">
                  <tr>
                    {COLUMNS.map((heading, index) => (
                      <th
                        key={index}
                        className="border border-gray-200 px-4 py-2"
                      >
                        {heading.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="font-normal text-center">
                  {conductorDetails?.data?.length > 0 ? (
                    conductorDetails.data.map((transaction, index) => (
                      <tr key={transaction.transaction_id}>
                        <td className="border border-gray-200 px-4 py-2">
                          {index + 1}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          {transaction?.transaction_id}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          {transaction?.total_amount}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          {transaction?.conductor_id}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          {transaction?.conductor_name
                            .replace("null", "")
                            .trim()}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          {transaction.time}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          {transaction?.transaction_type}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          {transaction?.bus_id}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={COLUMNS.length} className="text-center py-4">
                        No Transactions Available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ValidateTransaction;
