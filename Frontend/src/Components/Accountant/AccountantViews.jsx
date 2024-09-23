import { useContext, useEffect, useState } from "react";
import TitleBar from "../../Components/Others/TitleBar"; // Adjust path if necessary
import { contextVar } from "../context/contextVar";
import { useNavigate, useParams } from "react-router-dom";
import ProjectApiList from "../../Components/api/ProjectApiList";
import ApiHeader from "../../Components/api/ApiHeader";
import AccountantDashboard from "../Accountant1/AccountantDashboard";

const AccountantViews = () => {
  const { titleBarVisibility } = useContext(contextVar);
  const { api_fetchTransactionDetails, api_postUpdateStatus } = ProjectApiList();

  const { id } = useParams(); // Get transaction_id from URL
  const [transactionDetails, setTransactionDetails] = useState(null); // State to hold transaction data
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [showTextarea, setShowTextarea] = useState(false);

  // Fetch data by transaction ID
  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        // const response = await fetch(`${api_fetchTransactionDetails}/${id}`, ApiHeader());

        const response = await fetch(
          `${api_fetchTransactionDetails}/${id}`
          , ApiHeader());
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setTransactionDetails(data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchTransactionDetails();
  }, [id]);

  // Toggle the textarea visibility when the comment button is clicked
  const handleCommentClick = () => {
    setShowTextarea(!showTextarea);
  };


  
  const updateStatus = async (status) => {
    try {
      const token = localStorage.getItem('token'); // Replace with your actual token key
      const response = await fetch(
        `${api_postUpdateStatus}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : '',
          },
          body: JSON.stringify({
            transaction_id: id, // Ensure id is defined
            status,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const data = await response.json();
      alert(`Status updated successfully: ${data.message}`);
    } catch (error) {
      alert(`Error updating status: ${error.message}`);
    }
  };


  const navigate = useNavigate();
  // Event handlers for the buttons


  const handleVerifyClick = () => {

    const userConfirmed = window.confirm('Are you sure you want to verify?');
    if (userConfirmed) {
      updateStatus(1); // Set status to 1 for Verify

      // If the user clicks "OK", redirect to /ValidationListView
      navigate('/ValidationListView');
    }
  };
  // const handleVerifyClick = () => {
  // };

  // const handleDisputeClick = () => {
  //   updateStatus(2); // Set status to 2 for Disputed
  // };


  const handleClose = () => {
    navigate("/accountant-view"); // Navigate to the desired route
  };

  const COLUMNS = [
    { header: "Sr.No" },
    { header: "Transaction ID" },
    { header: "Amount" },
    { header: "Transaction Date" },
    { header: "Payment Type" },
    { header: "Conductor ID" },
    { header: "Bus ID" },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <AccountantDashboard>
      <div>
        <TitleBar
          titleBarVisibility={titleBarVisibility}
          titleText={"Transaction View Details"}
        />
      </div>
      <div className="bg-white rounded font-sans mb-10 border border-[#4338ca] shadow-lg px-4 mt-1 font-bold">
        <div className="m-4 font-bold text-lg">
          Conductor Collection Details
        </div>

        {transactionDetails && (
          <div className="flex items-center justify-start bg-gray-100 m-2 flex-row gap-4">
            <div className="p-6 w-64 h-48 border border-gray-300 rounded-lg bg-white shadow-md flex flex-col">
              <p className="text-sm font-medium mb-1">
                <strong>Conductor Name:</strong>{" "}
                {transactionDetails.data.conductor_name}
              </p>
              <p className="text-sm font-medium mb-1">
                <strong>Total Amount:</strong> ₹
                {transactionDetails.data.total_amount}
              </p>
              <p className="text-sm font-medium">
                <strong>Total Transactions:</strong>
                {transactionDetails.data.total_receipts}
              </p>
            </div>
            <div className=" p-6 w-64 h-48 border border-gray-300 rounded-lg bg-white  shadow-md flex flex-col justify-center ">
              <p className="text-sm font-medium mb-1">
                <strong>Total Cash Amount:</strong> ₹
                {transactionDetails.data.total_amount}
              </p>
            </div>
            <div className=" p-6 w-64 h-48 border border-gray-300 rounded-lg bg-white  shadow-md flex flex-col justify-center ">
              <p className="text-sm font-medium mb-1">
                <strong>QR Code:</strong> ₹ 000.00
              </p>
            </div>
          </div>
        )}

        <div className="m-2 h-[20rem] overflow-y-auto">
          <div className="shadow-md rounded-md overflow-auto">
            <table className="min-w-full bg-white border-collapse border border-gray-200 rounded-md">
              <thead className="bg-indigo-100 text-black rounded-md">
                {COLUMNS.map((heading, index) => (
                  <th key={index} className="border border-gray-200 px-4 py-2">
                    {heading.header}
                  </th>
                ))}
              </thead>
              <tbody className="font-normal text-center overflow-y-auto">
                {transactionDetails?.data?.receipts?.length > 0 ? (
                  transactionDetails.data.receipts.map((receipt, index) => (
                    <tr key={receipt.receipt_no}>
                      <td className="border border-gray-200 px-4 py-2">
                        {index + 1}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {receipt?.receipt_no}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {receipt?.amount}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {receipt?.date}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {receipt?.payment_type}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {receipt?.conductor_id}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {receipt.bus_id}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={COLUMNS.length} className="text-center py-4">
                      No Receipts Available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="m-2 shadow-md rounded-md overflow-auto p-8">
          {/* Row with Comments button and other buttons */}
          <div className="flex justify-between items-start">
            <div>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleCommentClick}
              >
                {showTextarea ? "Hide Comment" : "Comments"}
              </button>
            </div>

            {/* Three buttons on the right */}
            <div className="flex space-x-2">
              {/* <button
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                onClick={handleDisputeClick}
              >
                Disputed
              </button> */}
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={handleVerifyClick}
              >
                Verify
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={handleClose}
              >
                Close
              </button>
            </div>
          </div>

          {/* Textarea for comments (shown when the button is clicked) */}
          {showTextarea && (
            <div className="mt-4">
              <textarea
                rows="4"
                className="w-full border border-gray-300 p-2 rounded shadow-md"
                placeholder="Enter your comment here..."
              ></textarea>
            </div>
          )}
        </div>
      </div>
    </AccountantDashboard>
  );
};
export default AccountantViews;
