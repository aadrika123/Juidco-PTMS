import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Conductor_CashValidation = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [amount, setAmount] = useState(null);
    const [conductorId, setConductorId] = useState('');
    const [ulbId, setulbId] = useState('');


    useEffect(() => {
        const storedConductorId = localStorage.getItem('conductorId');
        const storedUlbId = localStorage.getItem('ulbId');
        const token = localStorage.getItem('token'); 

        setConductorId(storedConductorId || '');
        setulbId(storedUlbId || '');

        const currentDate = new Date().toISOString().split('T')[0];

        const apiUrl = `${process.env.REACT_APP_BASE_URL}/report/total_amount?conductor_id=${storedConductorId}&date=${currentDate}`;

        if (isModalOpen) {
            axios.get(apiUrl, {
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
            })
                .then(response => {
                   
                    console.log("API Response:", response);

                   
                    setAmount(response.data.data.total_amount || 0);
                })
                .catch(error => {
                    console.error('Error fetching amount:', error);
                });
        }
    }, [isModalOpen]); 


    const handleCancel = () => {
        setIsModalOpen(false);
        navigate(-1);
    };

    const handleSubmit = () => {
       
        if (!conductorId || !ulbId) {
            console.error('Conductor ID  or Ulb Id is missing from local storage.');
            return;
        }

       
        const payload = {
            amount,
            conductorId,
            
            ulbId,
            date: new Date().toISOString().split('T')[0], 
        };

        axios.post(`${process.env.REACT_APP_BASE_URL}/report/daywise_data`, payload, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`, 
            },
        })
            .then(response => {
                window.alert('Cash validation successful!');
                setIsModalOpen(false);
            })
            .catch(error => {
                console.error('Error submitting cash validation:', error);
            });
    };

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });


    return (
        <>
            <div className="flex h-12 justify-between items-center">
                <div className="flex ml-4">
                    <div
                        onClick={() => navigate(-1)}
                        className="flex flex-row cursor-pointer"
                    >
                        {/* SVG Back Button */}
                        <svg
                            width="25"
                            height="25"
                            viewBox="0 0 25 25"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            {/* SVG content */}
                        </svg>
                        <div className="ml-2 mt-1 text-[#665DD9] text-sm text-center">
                            Back
                        </div>
                    </div>
                </div>
                <div className="flex text-xl font-normal mr-4">
                    Cash Validate Report
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 md:p-6 lg:p-8 rounded-lg w-11/12 max-w-md mx-auto">
                        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-4">
                            Are you sure you want to do the cash validation?
                        </h2>
                        <p className="text-sm md:text-base">Amount: {amount || 0}</p>
                        <p className="text-sm md:text-base">Date: {formattedDate}</p>
                        <p className="text-sm md:text-base">Conductor ID: {conductorId}</p> {/* Display Conductor ID */}
                        <p className="text-sm md:text-base">ULB ID: {ulbId}</p> {/* Display Bus ID */}


                        <div className="mt-4 flex flex-col md:flex-row justify-end space-y-2 md:space-y-0 md:space-x-2">
                            <button
                                onClick={handleCancel}
                                className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white py-2 px-4 rounded-lg w-full md:w-auto"
                            >
                                Cancel
                            </button>
                            <div>
                                <button
                                    onClick={handleSubmit}
                                    className="bg-indigo-700 text-white py-2 px-4 rounded-lg w-full md:w-auto"
                                >
                                    Submit
                                </button>
                            </div>
                          
                        </div>
                    </div>
                </div>
            )}

        </>
    );
};

export default Conductor_CashValidation;
