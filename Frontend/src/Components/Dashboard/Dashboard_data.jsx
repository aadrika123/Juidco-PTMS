import React, { useEffect, useRef, useState } from "react";
import ApexChart from "react-apexcharts";
import DatePicker from "react-datepicker";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt } from "react-icons/fa";

export default function Dashboard_data() {
  const Navigate = useNavigate();
  const token = Cookies.get("accesstoken");
  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", { dateStyle: "full" }).format(date);
  };
  const date = new Date().toISOString().split("T")[0];

  // Real Time data Table
  const [realTimeData, setRealTimeData] = useState([]);
  const categories = realTimeData?.map((item) => item.day);
  const seriesData = realTimeData?.map((item) => item.sum);
  const totalValue = seriesData?.reduce((acc, val) => acc + val, 0);
  console.log('the nan data is..', realTimeData)
  const receiptTotalCount = realTimeData?.reduce(
    (acc, val) => acc + val.receipts,
    0
  );
  const realTimeReceipt = realTimeData?.map((item) => item.receipts);

  const realTimeReceiptSum = realTimeReceipt.reduce((sum, item) => (sum + item), 0)


  //hourly real time data
  const [hourlyRealTimeData, setHourlyRealTimeData] = useState([]);
  const [timeIntervalTrigger, setTimeIntervalTrigger] = useState(false);

  const hourlyReceipts = hourlyRealTimeData.map(item => item?.customer_count)
  let buffer = 0
  const cumulativeReceipts = hourlyReceipts.map(item => {
    buffer = buffer + item
    return buffer
  })

  const hourlyAmounts = hourlyRealTimeData.map(item => item?.total_amount)
  let amountBuffer = 0
  const cumulativeAmounts = hourlyAmounts.map(item => {
    amountBuffer = amountBuffer + item
    return amountBuffer
  })


  // Conductor Status Table
  const [conductorStatus, setConductorStatus] = useState([]);
  // Check if conductorStatus has the expected structure
  const totalConductorData = conductorStatus.total_conductor?.[0];
  const conductorStatusData = conductorStatus.conductor_status?.[0];

  // Provide fallback values if the expected structure is missing
  const totalConductors = totalConductorData ? totalConductorData.count : 0;
  const scheduledConductors = conductorStatusData
    ? conductorStatusData.scheduled_conductor
    : 0;
  const absentConductors = conductorStatusData
    ? conductorStatusData.absent_conductor
    : 0;

  //passenger details
  const [passenger_details, set_passenger_details] = useState([]);
  console.log("Passengers details >>>> ", passenger_details);

  // Schedule data Table
  const [scheduled_bus, set_scheduled_bus] = useState([]);
  console.log("Bus Data >>> ", scheduled_bus);

  // demographic count
  const [demographicCounts, setDemographicCounts] = useState([]);
  const [fromDates, setFromDates] = useState(new Date());
  const [toDates, setToDates] = useState(new Date());

  const datess = demographicCounts?.map((item) => item.date?.split("T")[0]);

  const uniqueDatess = [...new Set(datess)];

  console.log(demographicCounts, "demographicCounts");

  useEffect(() => {
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/report/demographic`,
        {
          fromDates,
          toDates,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setDemographicCounts(res.data?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [fromDates, toDates]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/report/real-time`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data?.data.data);
        setRealTimeData(res.data?.data.data);
      })
      .catch((err) => {
        console.log(err);
      });


    axios
      .get(`${process.env.REACT_APP_BASE_URL}/getConductorStatus`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res, "demographic");
        if (res.data?.data) {
          setConductorStatus(res.data?.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/schedule/present`,

        {
          curr_date: date,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log("Scheduled Bus >>>>>> ", res.data?.data.data);
        set_scheduled_bus(res.data?.data.data[0]);
      })
      .catch((err) => {
        console.log(err);
      });


    axios
      .get(`${process.env.REACT_APP_BASE_URL}/passenger/day-wise`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("Passenger Data >>> ", res.data);
        set_passenger_details(res.data?.data?.data[0].count);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);



  useEffect(() => {
    //hourly real time data
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/report/hourly-real-time`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log("hourly real time data", res.data?.data);
        if (res.data?.data) {
          setHourlyRealTimeData(res.data?.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [timeIntervalTrigger])


  const chartOptions = {
    chart: {
      type: "donut",
    },

    labels: ["Present", "Absent"],
    colors: ["#665DD9", "#3592FF"],
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: true,
    },
  };

  // const chartOptions = {
  //   series: [
  //     {
  //       name: "Total Customer",
  //       data: counts?.two_wheeler?.map((item) => item?.customer_count),
  //     },
  //     {
  //       name: "Total Amount",
  //       data: counts?.three_wheeler?.map((item) => item?.total_amount),
  //     },
  //   ],
  //   options: {
  //     chart: {
  //       height: 350,
  //       type: "bar",
  //       zoom: {
  //         enabled: true,
  //       },
  //     },
  //     colors: ["#4A3AFF", "#C893FD"],
  //     dataLabels: {
  //       enabled: true,
  //     },
  //     stroke: {
  //       curve: "smooth",
  //     },
  //     grid: {
  //       row: {
  //         colors: ["transparent"],
  //         opacity: 0.5,
  //       },
  //     },
  //     xaxis: {
  //       categories: uniqueDatess,
  //     },
  //   },
  // };

  const reaclTimeCollectionOptions = {
    chart: {
      type: "line",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "90%",
        endingShape: "rounded",
      },
    },
    colors: ["#00599C", "#1A91C1", "#01D8FF", "#00599C"],
    xaxis: {
      categories: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22],
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    series: [
      {
        name: "Total Amount",
        data: cumulativeAmounts,
      },
      {
        name: "Total Receipts",
        data: cumulativeReceipts,
      },
    ],
    toolbar: {
      tools: {
        download: true,
      },
    },
    markers: {
      size: 0,
    },
    stroke: {
      curve: "smooth",
    },
  };

  const barchartOptions = {
    chart: {
      type: "line",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "90%",
        endingShape: "rounded",
      },
    },
    colors: ["#00599C", "#1A91C1", "#01D8FF", "#00599C"],
    xaxis: {
      categories: categories,
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    series: [
      {
        name: "Real Time Collection",
        data: seriesData,
      },
      {
        name: "Real Time Receipt",
        data: realTimeReceipt,
      },
    ],
    toolbar: {
      tools: {
        download: true,
      },
    },
    markers: {
      size: 5,
    },
    stroke: {
      curve: "smooth",
    },
  };

  const chartOptions2 = {
    chart: {
      type: "pie",
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
      },
    },
    series: [absentConductors, scheduledConductors],
    labels: [
      "Total Number of Conductor",
      "Total Number of scheduled Conductor",
    ],
    colors: ["#665DD9", "#3592FF"],
    dataLabels: {
      enabled: true,
    },
    legend: {
      show: true,
    },
  };

  // --------------- demographic chart option -----------------//
  const bar = {
    series: [
      {
        name: "Total Customer",
        data: demographicCounts?.map((item) => item?.customer_count),
      },
      {
        name: "Total Amount",
        data: demographicCounts?.map((item) => item?.total_amount),
      },
    ],
    options: {
      chart: {
        height: 350,

        type: "bar",
        zoom: {
          enabled: true,
        },
      },
      colors: ["#4A3AFF", "#C893FD"],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },
      grid: {
        row: {
          colors: ["transparent"],
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: uniqueDatess,
      },
    },
  };

  const value = passenger_details || 0;
  const determineMaxProgress = (value) => {
    if (value < 1000) return 1000;
    if (value < 10000) return 10000;
    if (value < 50000) return 50000;
    if (value < 100000) return 100000;
    if (value < 1000000) return 1000000;
    return Math.ceil(value / 1000000) * 1000000; // Adjust as needed
  };

  const [maxProgress, setMaxProgress] = useState(determineMaxProgress(value));

  useEffect(() => {
    setMaxProgress(determineMaxProgress(value));
  }, [value]);

  const offset = 100 - (value % maxProgress) / (maxProgress / 100);
  const currentDate = formatDate(new Date());

  return (
    <div className="flex h-screen  w-full  overflow-x-auto ">
      <div className="flex flex-1 h-full flex-col ">
        <div className="flex flex-1 justify-end items-center bg-[#F9FAFC]">
          <div
            onClick={() => Navigate("/Collection-report")}
            className="flex m-4 bg-[#5457D6] p-4 text-white rounded-lg shadow-md cursor-pointer font-bold"
          >
            Collection Report
          </div>
        </div>
        <div className="flex flex-col flex-1 md:flex-row  bg-[#F9FAFC]">
          <div
            className={` w-auto md:w-1/2 sm:w-full h-auto mx-5 my-5 flex flex-col overflow-auto relative bg-[#fff] p-5 shadow-lg rounded-md`}
          >
            <div className="flex items-center justify-between text-xl">
              <div className="flex items-center">
                <i className="mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <rect width="32" height="32" rx="9" fill="#665DD9" />
                    <path
                      d="M19.6367 6C23.4494 6 25.84 8.37312 25.84 12.2033V14.5066L25.8331 14.6096C25.7828 14.9801 25.4652 15.2656 25.0809 15.2656H25.0722L24.9524 15.256C24.7948 15.2306 24.6484 15.1554 24.5354 15.0397C24.3942 14.8952 24.3172 14.6999 24.3219 14.4979V12.2033C24.3219 9.18452 22.6555 7.5181 19.6367 7.5181H12.2033C9.1758 7.5181 7.5181 9.18452 7.5181 12.2033V19.6455C7.5181 22.6642 9.18452 24.3219 12.2033 24.3219H19.6367C22.6642 24.3219 24.3219 22.6555 24.3219 19.6455C24.3219 19.2262 24.6617 18.8864 25.0809 18.8864C25.5002 18.8864 25.84 19.2262 25.84 19.6455C25.84 23.4669 23.4669 25.84 19.6455 25.84H12.2033C8.37312 25.84 6 23.4669 6 19.6455V12.2033C6 8.37312 8.37312 6 12.2033 6H19.6367ZM11.706 13.4945C11.9073 13.5014 12.0977 13.5879 12.2352 13.7352C12.3726 13.8825 12.4459 14.0784 12.4388 14.2798V20.6226C12.4244 21.0418 12.0728 21.37 11.6536 21.3555C11.2344 21.341 10.9063 20.9895 10.9207 20.5703V14.2187L10.9343 14.1C10.9647 13.9444 11.0439 13.8013 11.162 13.6924C11.3095 13.5564 11.5055 13.4851 11.706 13.4945ZM15.9549 10.5194C16.3741 10.5194 16.7139 10.8592 16.7139 11.2785V20.579C16.7139 20.9982 16.3741 21.338 15.9549 21.338C15.5357 21.338 15.1958 20.9982 15.1958 20.579V11.2785C15.1958 10.8592 15.5357 10.5194 15.9549 10.5194ZM20.1602 16.8448C20.5794 16.8448 20.9193 17.1847 20.9193 17.6039V20.5703C20.9193 20.9895 20.5794 21.3293 20.1602 21.3293C19.741 21.3293 19.4012 20.9895 19.4012 20.5703V17.6039C19.4012 17.1847 19.741 16.8448 20.1602 16.8448Z"
                      fill="white"
                      fillOpacity="0.92"
                    />
                  </svg>
                </i>
                Statistics
              </div>
              <div className={`flex`}>
                <div className="w-full flex flex-col sm:flex-row justify-between ">
                  <div
                    className={`w-full md:w-full  mr-4  flex flex-col items-center justify-center relative`}
                  >
                    <span className="text-[#095ea4] text-2xl font-bold">
                      ₹{formatNumber(totalValue)}
                    </span>
                    <h4 className="text-center text-xs whitespace-nowrap">
                      Total Amount
                    </h4>
                  </div>
                </div>
                <div className="w-full flex flex-col sm:flex-row justify-between ">
                  <div
                    className={`w-full md:w-full  mr-4  flex flex-col items-center justify-center relative`}
                  >
                    <span className="text-[#1dafc9] text-2xl font-bold">
                      {realTimeReceiptSum}
                    </span>
                    <h4 className="text-center text-xs whitespace-nowrap">
                      Total Customer Count
                    </h4>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col sm:flex-row justify-between">
              <div className={` m-1 flex flex-col relative p-5 w-full`}>
                <ApexChart
                  options={barchartOptions}
                  series={barchartOptions.series}
                  type="line"
                  height={265}
                  width={"100%"}
                />
              </div>
            </div>
          </div>
          {/* -----------------------Doughnut graph   ------------------- ---------------- */}
          <div
            className={`flex w-auto md:w-1/2 sm:w-full h-auto mx-5 my-5  flex-col relative bg-[#ffffff] p-5  shadow-lg`}
          >
            <h2 className="text-xl flex items-center justify-between">
              <div className="flex items-center">
                <i className="mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <rect width="32" height="32" rx="9" fill="#665DD9" />
                    <path
                      d="M19.6367 6C23.4494 6 25.84 8.37312 25.84 12.2033V14.5066L25.8331 14.6096C25.7828 14.9801 25.4652 15.2656 25.0809 15.2656H25.0722L24.9524 15.256C24.7948 15.2306 24.6484 15.1554 24.5354 15.0397C24.3942 14.8952 24.3172 14.6999 24.3219 14.4979V12.2033C24.3219 9.18452 22.6555 7.5181 19.6367 7.5181H12.2033C9.1758 7.5181 7.5181 9.18452 7.5181 12.2033V19.6455C7.5181 22.6642 9.18452 24.3219 12.2033 24.3219H19.6367C22.6642 24.3219 24.3219 22.6555 24.3219 19.6455C24.3219 19.2262 24.6617 18.8864 25.0809 18.8864C25.5002 18.8864 25.84 19.2262 25.84 19.6455C25.84 23.4669 23.4669 25.84 19.6455 25.84H12.2033C8.37312 25.84 6 23.4669 6 19.6455V12.2033C6 8.37312 8.37312 6 12.2033 6H19.6367ZM11.706 13.4945C11.9073 13.5014 12.0977 13.5879 12.2352 13.7352C12.3726 13.8825 12.4459 14.0784 12.4388 14.2798V20.6226C12.4244 21.0418 12.0728 21.37 11.6536 21.3555C11.2344 21.341 10.9063 20.9895 10.9207 20.5703V14.2187L10.9343 14.1C10.9647 13.9444 11.0439 13.8013 11.162 13.6924C11.3095 13.5564 11.5055 13.4851 11.706 13.4945ZM15.9549 10.5194C16.3741 10.5194 16.7139 10.8592 16.7139 11.2785V20.579C16.7139 20.9982 16.3741 21.338 15.9549 21.338C15.5357 21.338 15.1958 20.9982 15.1958 20.579V11.2785C15.1958 10.8592 15.5357 10.5194 15.9549 10.5194ZM20.1602 16.8448C20.5794 16.8448 20.9193 17.1847 20.9193 17.6039V20.5703C20.9193 20.9895 20.5794 21.3293 20.1602 21.3293C19.741 21.3293 19.4012 20.9895 19.4012 20.5703V17.6039C19.4012 17.1847 19.741 16.8448 20.1602 16.8448Z"
                      fill="white"
                      fillOpacity="0.92"
                    />
                  </svg>
                </i>
                Today’s Scheduling
              </div>

              <div className="flex items-center">
                <div>{currentDate}</div>
              </div>
            </h2>

            <div className="w-full flex flex-col sm:flex-row justify-between">
              <div
                className={`w-full md:w-[44.3%] m-1 flex flex-col relative p-5 max-w-[400px]`}
              >
                <ApexChart
                  options={chartOptions}
                  series={[
                    scheduled_bus.scheduled_buses || 0,
                    scheduled_bus.absent_buses || 0,
                  ]}
                  type="donut"
                  height={400} // Adjusted height for better visualization
                  width={400} // Adjusted width for better visualization
                />
              </div>

              <div
                className={`w-full md:w-[56.3%] ml-4 self-end max-w-[800px]`}
              >
                <div className="w-full flex flex-col sm:flex-row justify-between ">
                  <div
                    className={`w-full  ml-8 pr-4 flex flex-col items-center justify-center relative border-r-2 border-[#C1C9EB] `}
                  >
                    <span className="text-[#574CDD] text-3xl font-bold rounded-md">
                      {scheduled_bus.scheduled_buses}
                    </span>
                    <h4 className="text-center text-xs">
                      Total No. of Scheduled bus
                    </h4>
                  </div>

                  <div
                    className={`w-full ml-4 mr-4  flex flex-col items-center justify-center relative`}
                  >
                    <span className="text-[#098DA4] text-3xl font-bold">
                      {scheduled_bus.absent_buses}
                    </span>
                    <h4 className="text-center text-xs">
                      Total No. of Not-Scheduled bus
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row w-full flex-1 bg-[#F9FAFC] ">
          {/*-------------------------Speedo Meter--------------------------------------- */}
          <div
            className={` w-auto md:w-1/2 sm:w-full h-auto mx-5 my-5 flex flex-col relative bg-[#fff] shadow-lg `}
          >
            <div className="w-full flex flex-col sm:flex-row justify-between">
              <div
                className={` w-auto  sm:w-full h-auto mx-5 my-5 flex flex-col overflow-auto relative bg-[#fff] p-5 shadow-lg rounded-md`}
              >
                <div className="flex items-center justify-between text-xl">
                  <div className="flex items-center">
                    <i className="mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                      >
                        <rect width="32" height="32" rx="9" fill="#665DD9" />
                        <path
                          d="M19.6367 6C23.4494 6 25.84 8.37312 25.84 12.2033V14.5066L25.8331 14.6096C25.7828 14.9801 25.4652 15.2656 25.0809 15.2656H25.0722L24.9524 15.256C24.7948 15.2306 24.6484 15.1554 24.5354 15.0397C24.3942 14.8952 24.3172 14.6999 24.3219 14.4979V12.2033C24.3219 9.18452 22.6555 7.5181 19.6367 7.5181H12.2033C9.1758 7.5181 7.5181 9.18452 7.5181 12.2033V19.6455C7.5181 22.6642 9.18452 24.3219 12.2033 24.3219H19.6367C22.6642 24.3219 24.3219 22.6555 24.3219 19.6455C24.3219 19.2262 24.6617 18.8864 25.0809 18.8864C25.5002 18.8864 25.84 19.2262 25.84 19.6455C25.84 23.4669 23.4669 25.84 19.6455 25.84H12.2033C8.37312 25.84 6 23.4669 6 19.6455V12.2033C6 8.37312 8.37312 6 12.2033 6H19.6367ZM11.706 13.4945C11.9073 13.5014 12.0977 13.5879 12.2352 13.7352C12.3726 13.8825 12.4459 14.0784 12.4388 14.2798V20.6226C12.4244 21.0418 12.0728 21.37 11.6536 21.3555C11.2344 21.341 10.9063 20.9895 10.9207 20.5703V14.2187L10.9343 14.1C10.9647 13.9444 11.0439 13.8013 11.162 13.6924C11.3095 13.5564 11.5055 13.4851 11.706 13.4945ZM15.9549 10.5194C16.3741 10.5194 16.7139 10.8592 16.7139 11.2785V20.579C16.7139 20.9982 16.3741 21.338 15.9549 21.338C15.5357 21.338 15.1958 20.9982 15.1958 20.579V11.2785C15.1958 10.8592 15.5357 10.5194 15.9549 10.5194ZM20.1602 16.8448C20.5794 16.8448 20.9193 17.1847 20.9193 17.6039V20.5703C20.9193 20.9895 20.5794 21.3293 20.1602 21.3293C19.741 21.3293 19.4012 20.9895 19.4012 20.5703V17.6039C19.4012 17.1847 19.741 16.8448 20.1602 16.8448Z"
                          fill="white"
                          fillOpacity="0.92"
                        />
                      </svg>
                    </i>
                    Real time collection
                  </div>
                  <div className={`flex`}>
                    {/* <div className="w-full flex flex-col sm:flex-row justify-between ">
                      <div
                        className={`w-full md:w-full  mr-4  flex flex-col items-center justify-center relative`}
                      >
                        <span className="text-[#095ea4] text-2xl font-bold">
                          ₹{formatNumber(totalValue)}
                        </span>
                        <h4 className="text-center text-xs whitespace-nowrap">
                          Total Amount
                        </h4>
                      </div>
                    </div> */}
                    <div className="w-full flex flex-col sm:flex-row justify-between ">
                      <div
                        className={`w-full md:w-full  mr-4  flex flex-col items-center justify-center relative`}
                      >
                        <span>
                          {currentDate}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full flex flex-col sm:flex-row justify-between">
                  <div className={` m-1 flex flex-col relative p-5 w-full`}>
                    <ApexChart
                      options={reaclTimeCollectionOptions}
                      series={reaclTimeCollectionOptions.series}
                      type="line"
                      height={265}
                      width={"100%"}
                    />
                  </div>
                </div>
              </div>

              {/* <div
                className={`flex flex-1 flex-col justify-center items-center mt-10 `}
              >
                <div className="flex w-[15rem] h-[15rem]">
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 36 36"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      className="stroke-current text-gray-200 dark:text-neutral-700"
                      strokeWidth="4"
                    ></circle>
                    <g className="origin-center transform -rotate-90">
                      <circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        className="stroke-current text-blue-600 dark:text-blue-500"
                        strokeWidth="2"
                        strokeDasharray="100"
                        strokeDashoffset={offset}
                      ></circle>
                    </g>
                  </svg>
                  <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 ">
                    <span className="flex flex-col flex-1 justify-center items-center text-center text-2xl font-bold text-gray-800 dark:text-white">
                      <div className="flex">{formatNumber(value)}</div>
                      <div className="flex text-sm ">Total Passenger Count</div>
                    </span>
                  </div>
                </div>
              </div> */}
            </div>
          </div>

          {/*-------------------------Pie chart--------------------------------------- */}
          <div
            className={` w-auto md:w-1/2 sm:w-full h-auto mx-5 my-5 flex flex-col relative bg-[#ffffff] p-5 shadow-lg`}
          >
            <h2 className="text-xl flex items-center justify-between">
              <div className="flex items-center">
                <i className="mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <rect width="32" height="32" rx="9" fill="#665DD9" />
                    <path
                      d="M19.6367 6C23.4494 6 25.84 8.37312 25.84 12.2033V14.5066L25.8331 14.6096C25.7828 14.9801 25.4652 15.2656 25.0809 15.2656H25.0722L24.9524 15.256C24.7948 15.2306 24.6484 15.1554 24.5354 15.0397C24.3942 14.8952 24.3172 14.6999 24.3219 14.4979V12.2033C24.3219 9.18452 22.6555 7.5181 19.6367 7.5181H12.2033C9.1758 7.5181 7.5181 9.18452 7.5181 12.2033V19.6455C7.5181 22.6642 9.18452 24.3219 12.2033 24.3219H19.6367C22.6642 24.3219 24.3219 22.6555 24.3219 19.6455C24.3219 19.2262 24.6617 18.8864 25.0809 18.8864C25.5002 18.8864 25.84 19.2262 25.84 19.6455C25.84 23.4669 23.4669 25.84 19.6455 25.84H12.2033C8.37312 25.84 6 23.4669 6 19.6455V12.2033C6 8.37312 8.37312 6 12.2033 6H19.6367ZM11.706 13.4945C11.9073 13.5014 12.0977 13.5879 12.2352 13.7352C12.3726 13.8825 12.4459 14.0784 12.4388 14.2798V20.6226C12.4244 21.0418 12.0728 21.37 11.6536 21.3555C11.2344 21.341 10.9063 20.9895 10.9207 20.5703V14.2187L10.9343 14.1C10.9647 13.9444 11.0439 13.8013 11.162 13.6924C11.3095 13.5564 11.5055 13.4851 11.706 13.4945ZM15.9549 10.5194C16.3741 10.5194 16.7139 10.8592 16.7139 11.2785V20.579C16.7139 20.9982 16.3741 21.338 15.9549 21.338C15.5357 21.338 15.1958 20.9982 15.1958 20.579V11.2785C15.1958 10.8592 15.5357 10.5194 15.9549 10.5194ZM20.1602 16.8448C20.5794 16.8448 20.9193 17.1847 20.9193 17.6039V20.5703C20.9193 20.9895 20.5794 21.3293 20.1602 21.3293C19.741 21.3293 19.4012 20.9895 19.4012 20.5703V17.6039C19.4012 17.1847 19.741 16.8448 20.1602 16.8448Z"
                      fill="white"
                      fillOpacity="0.92"
                    />
                  </svg>
                </i>
                Conductor Status
              </div>
            </h2>

            <div className="w-full flex flex-col sm:flex-row justify-between">
              <div
                className={` md:w-full m-1 flex flex-col relative  max-w-[400px]`}
              >
                <ApexChart
                  options={chartOptions2}
                  series={chartOptions2.series}
                  type="pie"
                  height={450}
                  width={600}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
