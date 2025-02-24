import React from "react";
import autoTable from "jspdf-autotable";
import { jsPDF } from "jspdf";

const DownloadReport = ({ reports, closePopup }) => {
  const handleDownload = () => {
    const doc = new jsPDF();

    const columns = [
      { header: "Date" },
      { header: "Conductor Id" },
      { header: "Conductor Name" },
      { header: "Conductor Bus Id" },
      { header: "No. of Bill Cut" },
      { header: "Amount" },
    ];

    const data = [];
    const table = document.getElementById("data-table");

    const rows = table?.querySelectorAll("tbody tr") || [];
    rows.forEach((row) => {
      const rowData = [];
      row.querySelectorAll("td").forEach((cell) => {
        const cellData = cell?.textContent?.trim() || "";
        rowData.push(cellData);
      });
      data.push(rowData);
    });

    autoTable(doc, {
      head: [columns.map((column) => column.header)],
      body: data,
    });

    doc.save("Conductor-Report.pdf");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg h-[60vh]">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold mb-4">Download Report</h2>
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
        <p className="mb-4">Your report is ready to download.</p>

        <table
          id="data-table"
          className="min-w-full bg-white border border-gray-200"
        >
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Conductor Id</th>
              <th className="py-2 px-4 border-b">Conductor Name</th>
              <th className="py-2 px-4 border-b">Conductor Bus Id</th>
              <th className="py-2 px-4 border-b">No. of Bill Cut</th>
              <th className="py-2 px-4 border-b">Amount</th>
            </tr>
          </thead>
          <tbody className=" overflow-auto">
            {reports?.map((report) => {
              return (
                <>
                  <tr className="bg-gray-50">
                    <td className="py-2 px-4 border-b">2024-05-26</td>
                    <td className="py-2 px-4 border-b">
                      {report?.conductor_id}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {report?.data?.first_name} {report?.data?.last_name}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {report?.data?.register_no}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {report?.data?.receipt_count}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {report?.data?.total_amount}
                    </td>{" "}
                  </tr>
                </>
              );
            })}
          </tbody>
        </table>
        <button
          onClick={handleDownload}
          className="bg-[#6366F1] text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
        >
          Download
        </button>
      </div>
    </div>
  );
};

export default DownloadReport;
