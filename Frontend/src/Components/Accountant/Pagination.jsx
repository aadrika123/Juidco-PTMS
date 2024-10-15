// Pagination.js
import React, { useState } from "react";

const Pagination = ({
  initialPage = 1,
  initialLimit = 10,
  totalResults,
  onPageChange,
  onLimitChange,
}) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  // Handle page number change
  const handlePageChange = newPage => {
    setPage(newPage);
    if (onPageChange) onPageChange(newPage);
  };

  // Handle limit change
  const handleLimitChange = event => {
    const newLimit = Number(event.target.value);
    setLimit(newLimit);
    if (onLimitChange) onLimitChange(newLimit);
  };

  // Reset pagination
  // const handleReset = () => {
  //     setPage(initialPage);
  //     setLimit(initialLimit);
  //     if (onReset) onReset();
  // };

  return (
    <div className="flex mt-6 items-center gap-4">
      <div className="flex gap-2">
        <input
          type="number"
          className="p-2 m-4"
          placeholder="Go to Page"
          style={{
            border: "1px solid #cccc",
            height: "40px",
            width: "150px",
            padding: "10px",
            borderRadius: "10px",
            backgroundColor: "#ffffff",
          }}
          value={page}
          onChange={event => handlePageChange(Number(event.target.value))}
        />

        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= Math.ceil(totalResults / limit)}
          className="cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="37"
            height="37"
            viewBox="0 0 37 37"
            fill="none"
          >
            <circle cx="18.155" cy="18.155" r="18.155" fill="#4338CA" />
            <path
              d="M27.0277 19.3248C27.3705 18.982 27.3705 18.4262 27.0277 18.0834L21.4418 12.4976C21.099 12.1548 20.5433 12.1548 20.2005 12.4976C19.8577 12.8403 19.8577 13.3961 20.2005 13.7389L25.1658 18.7041L20.2005 23.6693C19.8577 24.0121 19.8577 24.5679 20.2005 24.9107C20.5433 25.2534 21.099 25.2534 21.4418 24.9107L27.0277 19.3248ZM11.0028 19.5818H26.4071V17.8264H11.0028V19.5818Z"
              fill="white"
            />
          </svg>
        </button>
      </div>

      <div>
        <select
          style={{
            border: "1px solid #cccc",
            height: "40px",
            width: "150px",
            padding: "0px",
            borderRadius: "10px",
            backgroundColor: "#ffffff",
          }}
          value={limit}
          onChange={handleLimitChange}
        >
          <option value="5">Show 5</option>
          <option value="10">Show 10</option>
          <option value="20">Show 20</option>
          <option value="30">Show 30</option>
        </select>
      </div>
    </div>
  );
};

export default Pagination;
