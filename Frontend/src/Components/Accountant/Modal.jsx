import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa'; // To use a close icon
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import ProjectApiList from "../../Components/api/ProjectApiList";
import ApiHeader from "../../Components/api/ApiHeader";

const Modal = ({ isOpen, onClose }) => {
    const [data, setData] = useState([]);
    const { api_fetchByScheduledconductor } = ProjectApiList();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch data from the API for the current date
                // const response = await fetch(`${api_fetchByScheduledconductor}/current-date`, ApiHeader());

                const response = await fetch(`${process.env.REACT_APP_BASE_URL}/scheduled/receipts/current-date`, ApiHeader());
                if (!response.ok) throw new Error('Network response was not ok');
                const result = await response.json();

                // Check if status is true and set data
                if (result.status) {
                    setData(result.data.results); // Use the results array from the response
                } else {
                    throw new Error(result.message);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.text('Conductor Schedule Details', 10, 10);

        // Add table data
        data.forEach((item, index) => {
            doc.text(`${item.conductor_id} ${item.full_name} ${item.bus_id} ${item.mobile_no} ${item.from_time}-${item.to_time}`, 10, 20 + (index * 10));
        });

        doc.save('conductor-schedule.pdf');
    };

    const handleDownloadCSV = () => {
        const ws = XLSX.utils.json_to_sheet(data.map(item => ({
            Conductor_ID: item.conductor_id,
            Name: item.full_name,
            Bus_ID: item.bus_id,
            Mobile_No: item.mobile_no,
            From_Time: item.from_time,
            To_Time: item.to_time,
            Total_Amount: item.total_amount,
            Total_Receipts: item.total_receipts,
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Conductor Schedule');
        XLSX.writeFile(wb, 'conductor-schedule.csv');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-4xl relative">
                <button
                    className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
                    onClick={onClose}
                >
                    <FaTimes size={20} />
                </button>
                <h2 className="text-xl font-semibold mb-4">Conductor Schedule Details</h2>

                {loading && <p>Loading...</p>}
                {error && <p className="text-red-600">Error: {error}</p>}
                {!loading && !error && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 bg-gray-100 font-medium text-gray-900">Conductor ID</th>
                                    <th className="py-2 px-4 bg-gray-100 font-medium text-gray-900">Name</th>
                                    <th className="py-2 px-4 bg-gray-100 font-medium text-gray-900">Bus ID</th>
                                    <th className="py-2 px-4 bg-gray-100 font-medium text-gray-900">Mobile No</th>
                                    <th className="py-2 px-4 bg-gray-100 font-medium text-gray-900">From Time</th>
                                    <th className="py-2 px-4 bg-gray-100 font-medium text-gray-900">To Time</th>
                                    <th className="py-2 px-4 bg-gray-100 font-medium text-gray-900">Total Amount</th>
                                    <th className="py-2 px-4 bg-gray-100 font-medium text-gray-900">Total Receipts</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item, index) => (
                                    <tr key={index}>
                                        <td className="py-2 px-4 text-gray-700">{item?.conductor_id}</td>
                                        <td className="py-2 px-4 text-gray-700">{item?.full_name}</td>
                                        <td className="py-2 px-4 text-gray-700">{item?.bus_id}</td>
                                        <td className="py-2 px-4 text-gray-700">{item?.mobile_no}</td>
                                        <td className="py-2 px-4 text-gray-700">{item?.from_time}</td>
                                        <td className="py-2 px-4 text-gray-700">{item?.to_time}</td>
                                        <td className="py-2 px-4 text-gray-700">{item?.total_amount}</td>
                                        <td className="py-2 px-4 text-gray-700">{item?.total_receipts}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="mt-4 flex justify-end gap-2">
                    <button
                        onClick={handleDownloadPDF}
                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                    >
                        Download PDF
                    </button>
                    <button
                        onClick={handleDownloadCSV}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                        Download CSV
                    </button>
                    <button
                        onClick={handleDownloadCSV}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                        Download XLV
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
