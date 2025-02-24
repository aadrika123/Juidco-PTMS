import React from "react";
import autoTable from "jspdf-autotable";
import { jsPDF } from "jspdf";

const DownloadReportV2 = ({ reports, closePopup, report_type }) => {
  const currentDate = new Date()
  const handleDownload = () => {
    const doc = new jsPDF();

    const columns = report_type === 'conductor' ? [
      { header: "ID" },
      { header: "Name" },
      { header: "Mobile no" },
      { header: "Alternate mobile no" },
      { header: "Email" },
    ] : [
      { header: "ID" },
      { header: "VIN/Chessis" }
    ]

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

    doc.save(`${report_type}${currentDate.getDate()}${currentDate.getMonth()}${currentDate.getFullYear()}.pdf`);
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

        <div className="overflow-y-auto max-h-72">
          <table
            id="data-table"
            className="min-w-full bg-white border border-gray-200 table-fixed"
          >
            <thead className="sticky top-0">
              {report_type === 'conductor' ? (
                <tr className="bg-gray-200 text-left">
                  <th className="py-2 px-4 border-b">ID</th>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Mobile no</th>
                  <th className="py-2 px-4 border-b">Alternate mobile no</th>
                  <th className="py-2 px-4 border-b">Email</th>
                </tr>
              ) : (
                <tr className="bg-gray-200 text-left">
                  <th className="py-2 px-4 border-b">ID</th>
                  <th className="py-2 px-4 border-b">VIN/Chessis</th>
                </tr>
              )}
            </thead>
            <tbody className="overflow-auto">
              {reports?.map((report) => {
                if (report_type === 'conductor') {
                  return (
                    <>
                      <tr className="bg-gray-50">
                        <td className="py-2 px-4 border-b">
                          {report?.ID}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {report?.Name}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {report["Mobile no."] || 'N/A'}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {report["Alternate mobile no."] || 'N/A'}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {report["Email"] || 'N/A'}
                        </td>{" "}
                      </tr>
                    </>
                  )
                } else {
                  return (
                    <>
                      <tr className="bg-gray-50">
                        <td className="py-2 px-4 border-b">
                          {report?.ID}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {report["VIN/Chessis"] || 'N/A'}
                        </td>{" "}
                      </tr>
                    </>
                  )
                }
              })}
            </tbody>
          </table>
        </div>
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

export default DownloadReportV2;
