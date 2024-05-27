import React, { useEffect, useRef, useState } from "react";
import ApexChart from "react-apexcharts";
import DatePicker from "react-datepicker";
import axios from "axios";
import Cookies from "js-cookie";

export default function Dashboard_data() {
  const token = Cookies.get("accesstoken");
  const [chartSeries, setChartSeries] = useState([0, 0]); // State for chart series
  const [selectedDate, setSelectedDate] = useState(new Date());
  const datePickerRef = useRef(null);
  //   const [series, setSeries] = useState([
  //     {
  //       data: [50, 30, 70],
  //     },
  //   ]);
  const date = new Date().toISOString().split("T")[0];

  // Real Time data Table
  const [realTimeData, setRealTimeData] = useState([]);
  const categories = realTimeData?.map((item) => item.to);
  const seriesData = realTimeData?.map((item) => item.sum);
  const totalValue = seriesData?.reduce((acc, val) => acc + val, 0);

  // Conductor Status Table
  const [conductorStatus, setConductorStatus] = useState([]);
  console.log(conductorStatus);
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
        console.log("Conductor Data >>> ", res.data?.data);
        setConductorStatus(res.data?.data);
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

  console.log("realTimeData >>> ", realTimeData);

  const handleDateChange = (date) => {
    if (date) {
      setSelectedDate(date);
    }
  };

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
      show: false,
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
    ],
    toolbar: {
      tools: {
        download: false,
      },
    },
    markers: {
      size: 5,
    },
    stroke: {
      curve: "smooth",
    },
  };

  const barchartOptions2 = {
    series: [passenger_details],
    chart: {
      type: "radialBar",
      offsetY: -20,
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,

        dataLabels: {
          name: {
            show: true,
          },
          value: {
            offsetY: -55,
            fontSize: "22px",
          },
          legend: {
            show: false,
          },
        },
      },
    },
    labels: ["Total Customers Count"],
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
  return (
    <div className="flex flex-1  overflow-x-auto ">
      <div className="flex flex-1 flex-col">
        <div className="flex flex-col md:flex-row w-full h-fit bg-[#F9FAFC]">
          <div
            className={` w-auto md:w-1/2 sm:w-full h-fit mx-5 my-5 flex flex-col relative bg-[#ffffff] p-5 shadow-lg`}
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
                Real-time Collection
              </div>
            </h2>

            <div className="w-full flex flex-col sm:flex-row justify-between">
              <div
                className={` md:w-[99.9%] m-1 flex flex-col relative p-5 max-w-[400px]`}
              >
                <ApexChart
                  options={barchartOptions}
                  series={barchartOptions.series}
                  type="line"
                  height={165} // Adjusted height for better visualization
                  width={350} // Adjusted width for better visualization
                />
              </div>
              <div className={`w-full md:w-[86.3%] self-end max-w-[800px]`}>
                <div className="w-full flex flex-col sm:flex-row justify-between ">
                  <div
                    className={`w-full md:w-full  mr-4  flex flex-col items-center justify-center relative`}
                  >
                    <span className="text-[#098DA4] text-3xl font-bold">
                      {totalValue}
                    </span>
                    <h4 className="text-center text-xs">
                      Total No. Current Collection
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* -----------------------Doughnut graph   ------------------- ---------------- */}
          <div
            className={`flex w-auto md:w-1/2 sm:w-full h-fit mx-5 my-5  flex-col relative bg-[#ffffff] p-5  shadow-lg`}
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
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="d MMMM , yyyy"
                  ref={datePickerRef}
                  className="w-[160px] outline-none bg-white"
                />

                <i
                  className="cursor-pointer "
                  onClick={() => {
                    if (datePickerRef.current) {
                      datePickerRef.current.setOpen(true);
                    }
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M3.48879 4.89772C3.69213 4.69244 4.02178 4.69103 4.22512 4.89913L8.76386 9.53237C8.9672 9.73977 8.9665 10.0748 8.76247 10.2808C8.66115 10.3831 8.5279 10.4353 8.39535 10.4353C8.2614 10.4353 8.12816 10.3831 8.02683 10.2794L3.4881 5.64618C3.28476 5.43878 3.28545 5.1037 3.48879 4.89772ZM12.565 4.8992C12.7684 4.6911 13.098 4.69251 13.3013 4.89779C13.5054 5.10378 13.5061 5.43885 13.3034 5.64625L10.2894 8.72332C10.1881 8.82702 10.0541 8.87922 9.92089 8.87922C9.78833 8.87922 9.65509 8.82702 9.55376 8.72473C9.34973 8.51875 9.34904 8.18367 9.55168 7.97627L12.565 4.8992Z"
                      fill="black"
                    />
                  </svg>
                </i>
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
                  height={200} // Adjusted height for better visualization
                  width={200} // Adjusted width for better visualization
                />
              </div>

              <div
                className={`w-full md:w-[56.3%] ml-4 self-end max-w-[800px]`}
              >
                <div className="w-full flex flex-col sm:flex-row justify-between ">
                  <div
                    className={`w-full  ml-8 pr-4 flex flex-col items-center justify-center relative border-r-2 border-[#C1C9EB] `}
                  >
                    <span className="text-[#574CDD] text-3xl font-bold">
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

        <div className="flex flex-row w-full h-fit bg-[#F9FAFC]">
          {/*-------------------------Pie chart--------------------------------------- */}
          <div
            className={` w-auto md:w-1/2 sm:w-full h-fit mx-5 my-5 flex flex-col relative bg-[#fff]  p-5 shadow-lg`}
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
                Passenger Status
              </div>
            </h2>

            <div className="w-full flex flex-col sm:flex-row justify-between ">
              <div className={`flex flex-col relative  max-w-[400px]`}>
                <ApexChart
                  options={barchartOptions2}
                  series={barchartOptions2.series}
                  type="radialBar"
                  height={400}
                  width={500}
                />
              </div>
            </div>
          </div>

          {/*-------------------------Speedo Meter--------------------------------------- */}
          <div
            className={` w-auto md:w-1/2 sm:w-full h-fit mx-5 my-5 flex flex-col relative bg-[#ffffff] p-5 shadow-lg`}
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
                  width={500}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
