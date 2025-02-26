import React, { useState } from "react";
import AccountantDashboard from "./AccountantDashboard";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ConductorCollectionDetails from "./ConductorCollectionDetails";

const CustomButton = ({ children, variant }) => {
  return (
    <button
      className={`${
        variant === "contained"
          ? "bg-[#665DD9] text-white"
          : "bg-gray-200 text-gray-600"
      } px-4 py-2 rounded-md`}
    >
      {children}
    </button>
  );
};

const ConductorDetails = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate();

  return (
    <AccountantDashboard>
      <div className="flex h-16 justify-between items-center border-b-2 border-gray-300">
        <div className="flex ml-4 ">
          <div
            onClick={() => navigate(-1)}
            className="flex flex-row cursor-pointer"
          >
            <svg
              width="25"
              height="25"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_3837_9887)">
                <path
                  d="M10.6736 7.20512L4 13.9135L10.6736 20.6218C10.7339 20.7009 10.8105 20.7662 10.8981 20.8132C10.9858 20.8602 11.0826 20.8878 11.1819 20.8941C11.2812 20.9004 11.3806 20.8854 11.4736 20.8499C11.5666 20.8144 11.6508 20.7594 11.7206 20.6886C11.7905 20.6177 11.8443 20.5327 11.8784 20.4393C11.9125 20.3458 11.9262 20.2461 11.9184 20.147C11.9107 20.0478 11.8817 19.9514 11.8335 19.8644C11.7853 19.7774 11.7189 19.7018 11.6389 19.6426L6.64583 14.6079H19.9306C20.1147 14.6079 20.2914 14.5347 20.4216 14.4045C20.5518 14.2743 20.625 14.0976 20.625 13.9135C20.625 13.7293 20.5518 13.5526 20.4216 13.4224C20.2914 13.2922 20.1147 13.219 19.9306 13.219H6.64583L11.6389 8.18429C11.7687 8.05352 11.8413 7.87653 11.8407 7.69225C11.84 7.50797 11.7662 7.33149 11.6354 7.20165C11.5047 7.0718 11.3277 6.99922 11.1434 6.99987C10.9591 7.00052 10.7826 7.07435 10.6528 7.20512H10.6736Z"
                  fill="#665DD9"
                />
              </g>
              <defs>
                <clipPath id="clip0_3837_9887">
                  <rect
                    width="25"
                    height="25"
                    fill="white"
                    transform="matrix(0 -1 1 0 0 25)"
                  />
                </clipPath>
              </defs>
            </svg>
            <div className="ml-2 mt-1 text-[#665DD9]  text-sm text-center">
              {" "}
              Back
            </div>
          </div>
        </div>
        <div className="flex text-xl mr-14 font-bold">Conductor Details</div>
      </div>

      <section className="p-5 flex items-center gap-5">
        <CustomButton variant="contained">Submitted Cash</CustomButton>
        <CustomButton variant="outlined">Disbuted List</CustomButton>
        <CustomButton variant="outlined">Suspense Account</CustomButton>
      </section>

      <section className="bg-gray-100 p-5">
        <div className=" flex items-end gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">Select Date Range</label>
            <input
              type="date"
              className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-[80vw] md:w-auto"
              style={{ boxShadow: "0 1px 4px #fff" }}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div>
            <input
              type="date"
              className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-[80vw] md:w-auto"
              style={{ boxShadow: "0 1px 4px #fff" }}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold ml-2">Conductor Id</label>
            <input
              type="text"
              placeholder="Eg. PTM32301364"
              className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-[80vw] md:w-auto ml-2"
              style={{ boxShadow: "0 1px 4px #fff" }}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="bg-[#6366F1] h-10 text-white px-4 rounded-md"
          >
            <div className="flex flex-row justify-center items-center">
              <div className="flex">
                {" "}
                <svg
                  width="20"
                  height="24"
                  viewBox="0 0 20 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.4996 19.4344C12.533 19.7136 12.4496 20.0114 12.258 20.2068C12.1809 20.2931 12.0893 20.3615 11.9885 20.4082C11.8877 20.4549 11.7796 20.479 11.6705 20.479C11.5613 20.479 11.4532 20.4549 11.3524 20.4082C11.2516 20.3615 11.16 20.2931 11.083 20.2068L7.74129 16.475C7.6504 16.3758 7.58129 16.2545 7.53937 16.1205C7.49745 15.9865 7.48384 15.8435 7.49962 15.7026V10.9379L3.50795 5.23319C3.37263 5.03918 3.31157 4.79324 3.33811 4.54912C3.36466 4.30499 3.47665 4.08252 3.64962 3.93032C3.80795 3.80004 3.98295 3.72559 4.16629 3.72559H15.833C16.0163 3.72559 16.1913 3.80004 16.3496 3.93032C16.5226 4.08252 16.6346 4.30499 16.6611 4.54912C16.6877 4.79324 16.6266 5.03918 16.4913 5.23319L12.4996 10.9379V19.4344ZM5.86629 5.58682L9.16629 10.2957V15.4328L10.833 17.294V10.2864L14.133 5.58682H5.86629Z"
                    fill="white"
                  />
                </svg>
              </div>
              <div className="flex flex-1 text-white text-md whitespace-nowrap">
                Search Result
              </div>
            </div>
          </button>
        </div>
      </section>

      <section className="p-5 relative">
        <TableContainer component={Paper} className="shadow-lg rounded-lg">
          {/* {filteredData?.length > 0 ? ( */}
          <Table id="data-table" stickyHeader>
            <TableHead>
              <TableRow className="bg-blue-600">
                <TableCell className="text-white font-bold">Date</TableCell>
                <TableCell className="text-white font-bold">Amount</TableCell>
                <TableCell className="text-white font-bold">
                  Payee/Payer Name
                </TableCell>
                <TableCell className="text-white font-bold">
                  Description
                </TableCell>
                <TableCell className="text-white font-bold">
                  Reference Number
                </TableCell>

                <TableCell className="text-white font-bold">View</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[1, 2, 3, 4]?.map((row, index) => (
                <TableRow
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                >
                  <TableCell>2024-07-23</TableCell>
                  <TableCell>
                    <span>₹</span>12,000
                  </TableCell>
                  <TableCell>Jaideep Choudhary</TableCell>
                  <TableCell>Pass</TableCell>

                  <TableCell>TL9889L</TableCell>

                  <TableCell>
                    <div className="flex flex-row items-center">
                      <button
                        onClick={() => setShowPopup(true)}
                        className="bg-[#665DD9] py-1 px-3 rounded-lg text-white"
                      >
                        View
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* ) : ( */}
          {/* <div className="flex flex-1 m-4 flex-col justify-center items-center font-bold text-2xl text-slate-700">
            No Data Found
            <svg
              width="200px"
              height="200px"
              viewBox="0 0 512 512"
              id="Layer_1"
              version="1.1"
            >
              <g>
                <path
                  fill="#333333"
                  d="M378.8,87.3H133.2c-17.4,0-31.5,14.1-31.5,31.5v272.1c0,17.4,14.1,31.5,31.5,31.5h245.6   c17.4,0,31.5-14.1,31.5-31.5V118.8C410.3,101.4,396.2,87.3,378.8,87.3z M139.5,176h101.1v150H139.5V176z M174.2,391.3   c-9.8,0-17.8-8-17.8-17.8c0-9.8,8-17.8,17.8-17.8c9.8,0,17.8,8,17.8,17.8C192,383.4,184,391.3,174.2,391.3z M228,386.7   c-7.3,0-13.1-5.9-13.1-13.1s5.9-13.1,13.1-13.1s13.1,5.9,13.1,13.1S235.3,386.7,228,386.7z M284,386.7c-7.3,0-13.1-5.9-13.1-13.1   s5.9-13.1,13.1-13.1s13.1,5.9,13.1,13.1S291.3,386.7,284,386.7z M337.8,391.3c-9.8,0-17.8-8-17.8-17.8c0-9.8,8-17.8,17.8-17.8   c9.8,0,17.8,8,17.8,17.8C355.7,383.4,347.7,391.3,337.8,391.3z M372.5,326.1H271.5V176h101.1V326.1z M372.5,147H139.5v-30.4h233.1   V147z"
                />
                <polygon
                  fill="#333333"
                  points="318.3,53 193.7,53 188.3,73.3 323.7,73.3  "
                />
                <path
                  fill="#333333"
                  d="M158.5,452.3c0,3.7,3,6.7,6.7,6.7H198c3.7,0,6.7-3,6.7-6.7v-15.9h-46.1V452.3z"
                />
                <path
                  fill="#333333"
                  d="M307.4,452.3c0,3.7,3,6.7,6.7,6.7h32.8c3.7,0,6.7-3,6.7-6.7v-15.9h-46.1V452.3z"
                />
                <path
                  fill="#333333"
                  d="M37.8,167.8v70.7v0H22.2V297h44.6v-58.4h-15v0v-63.7h35.9v-14H44.8C40.9,160.8,37.8,164,37.8,167.8z"
                />
                <path
                  fill="#333333"
                  d="M474.2,238.6L474.2,238.6v-70.7c0-3.9-3.1-7-7-7h-42.9v14h35.9v63.7v0h-15V297h44.6v-58.4H474.2z"
                />
              </g>
            </svg>
          </div> */}
          {/* )} */}
          {/* <TablePagination
            rowsPerPageOptions={[10]}
            component="div"
            count={totalRecords}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          /> */}
        </TableContainer>
        {showPopup && <ConductorCollectionDetails closePopup={setShowPopup} />}
      </section>
    </AccountantDashboard>
  );
};

export default ConductorDetails;
