import { useContext, useEffect, useState } from "react";
import ApiHeader from "../api/ApiHeader";
import TitleBar from "../Others/TitleBar";
import { contextVar } from "../context/contextVar";
import ProjectApiList from "../api/ProjectApiList";

const ValidateTransaction = () => {
  const { titleBarVisibility } = useContext(contextVar);
  const { api_getValidationTrans } = ProjectApiList();
  const [conductorDetails, setConductorDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchConductorDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/Cash/validate/status?status=1`,
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

    fetchConductorDetails();

    return () => {
      isMounted = false; // Clean up on unmount
    };
  }, []);

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
        <div className="bg-white rounded font-sans mb-10 border border-[#4338ca] shadow-lg px-4 mt-1 font-bold">
          <div className="m-2">
            <div className="shadow-md rounded-md overflow-auto">
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
