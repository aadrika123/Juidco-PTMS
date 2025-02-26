import React from "react";
import { Pagination } from "@mui/material";


export default function Paginator({ page, setPage, totalCount }) {

    const handlePageChange = (e, value) => {
        setPage(value)
    }

    return (
        <div className="flex flex-row w-full justify-center py-4">
            <Pagination count={totalCount} onChange={handlePageChange} />
        </div>
    );
}

