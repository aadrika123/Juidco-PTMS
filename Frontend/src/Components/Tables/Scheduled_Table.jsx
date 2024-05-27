import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  TextField,
  TablePagination,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import Button from "@mui/material/Button";
import Cookies from "js-cookie";

const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const formatTime = (time) => {
  const timeString = time.toString().padStart(4, "0");
  const hours = timeString.slice(0, 2);
  const minutes = timeString.slice(2, 4);
  return `${hours}:${minutes}`;
};

const ScheduledTable = () => {
  const token = Cookies.get("accesstoken");
  const [openDialog, setOpenDialog] = useState(false); // State to control dialog
  const [deleteDialog, setDeleteDialog] = useState(false); // State to control delete confirmation dialog
  const [deleteItemId, setDeleteItemId] = useState(null); // State to track the item to be deleted

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [allScheduled, setAllScheduled] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    fetchScheduledData();
  }, [page, rowsPerPage]);

  const fetchScheduledData = async () => {
    try {
      await axios
        .get(
          `${
            process.env.REACT_APP_BASE_URL
          }/schedule/getAll?limit=${rowsPerPage}&page=${page + 1}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          setAllScheduled(response.data?.data?.data);
          setTotalRecords(response.data?.data?.count);
        });
    } catch (error) {
      console.error("Failed to fetch scheduled data:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDelete = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_BASE_URL}/schedule/delete`,
        {
          id: deleteItemId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDeleteDialog(false);
      fetchScheduledData();
    } catch (error) {
      console.error("Failed to delete scheduled data:", error);
    }
  };

  const filteredData = allScheduled?.filter((row) => {
    const conductorName =
      `${row.conductor.first_name} ${row.conductor.middle_name} ${row.conductor.last_name}`.toLowerCase();
    const busNo = row.bus.register_no.toLowerCase();
    const conductorId = row.conductor.cunique_id.toLowerCase();
    const mobileNo = row.conductor.mobile_no.toLowerCase();
    const search = searchQuery.toLowerCase();

    return (
      conductorName.includes(search) ||
      busNo.includes(search) ||
      conductorId.includes(search) ||
      mobileNo.includes(search)
    );
  });

  return (
    <div className="flex relative flex-1 flex-col">
      <div className="flex flex-1 flex-row justify-center items-center">
        <div style={{ flex: 2 }} className="flex justify-center items-center">
          <div style={{ flex: 2 }} className="flex mr-4">
            <TextField
              variant="outlined"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              fullWidth
              margin="dense"
            />
          </div>
          <div className="flex flex-1 mr-4">
            <Button variant="contained" sx={{ width: "100%" }} disabled>
              <div className="flex flex-1 justify-center items-center flex-row">
                <div className="flex ">
                  <svg
                    width="23"
                    height="23"
                    viewBox="0 0 23 23"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.4987 7.1875H6.70703C6.32578 7.1875 5.96015 7.33895 5.69057 7.60853C5.42098 7.87812 5.26953 8.24375 5.26953 8.625V16.2917C5.26953 16.6729 5.42098 17.0385 5.69057 17.3081C5.96015 17.5777 6.32578 17.7292 6.70703 17.7292H14.3737C14.7549 17.7292 15.1206 17.5777 15.3902 17.3081C15.6597 17.0385 15.8112 16.6729 15.8112 16.2917V11.5"
                      stroke="#7A7A7A"
                      stroke-linecap="round"
                    />
                    <path
                      d="M11.9766 11.0208L18.0754 4.922M13.8932 4.3125H18.6849V9.10417"
                      stroke="#7A7A7A"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                <div className="flex ">Export</div>
              </div>
            </Button>
          </div>
          <div className="flex flex-1 mr-4">
            <Link to="/chagneScheduling" className="flex flex-1">
              <Button
                variant="contained"
                sx={{ width: "100%", background: "#6366F1" }}
              >
                + Add New Scheduling
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <TableContainer component={Paper} className="shadow-lg rounded-lg">
        <Table stickyHeader>
          <TableHead>
            <TableRow className="bg-blue-600">
              <TableCell className="text-white font-bold">ID</TableCell>
              <TableCell className="text-white font-bold">Bus No.</TableCell>
              <TableCell className="text-white font-bold">
                Conductor Id
              </TableCell>
              <TableCell className="text-white font-bold">
                Conductor Name
              </TableCell>
              <TableCell className="text-white font-bold">Mobile No.</TableCell>
              <TableCell className="text-white font-bold">Date</TableCell>
              <TableCell className="text-white font-bold">From Time</TableCell>
              <TableCell className="text-white font-bold">To Time</TableCell>
              <TableCell className="text-white font-bold">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData?.map((row, index) => (
              <TableRow
                key={index}
                className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
              >
                <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                <TableCell>{row.bus.register_no}</TableCell>
                <TableCell>{row.conductor.cunique_id}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Avatar>{row.conductor.first_name.charAt(0)}</Avatar>
                    <div className="ml-4">
                      <div>{`${row.conductor.first_name} ${row.conductor.middle_name} ${row.conductor.last_name}`}</div>
                      <div className="text-gray-500 text-sm">
                        {row.conductor.email_id}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{row.conductor.mobile_no}</TableCell>
                <TableCell>{formatDate(row.date)}</TableCell>
                <TableCell>{formatTime(row.from_time)}</TableCell>
                <TableCell>{formatTime(row.to_time)}</TableCell>
                <TableCell>
                  <div className="flex flex-row items-center">
                    <Button
                      onClick={() => {
                        setDeleteItemId(row.id);
                        setDeleteDialog(true);
                      }}
                    >
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.95455 4H13.0455C13.0455 3.50272 12.83 3.02581 12.4464 2.67417C12.0628 2.32254 11.5425 2.125 11 2.125C10.4575 2.125 9.93724 2.32254 9.55365 2.67417C9.17005 3.02581 8.95455 3.50272 8.95455 4ZM7.72727 4C7.72727 3.20435 8.07208 2.44129 8.68583 1.87868C9.29959 1.31607 10.132 1 11 1C11.868 1 12.7004 1.31607 13.3142 1.87868C13.9279 2.44129 14.2727 3.20435 14.2727 4H19.3864C19.5491 4 19.7052 4.05926 19.8203 4.16475C19.9354 4.27024 20 4.41332 20 4.5625C20 4.71168 19.9354 4.85476 19.8203 4.96025C19.7052 5.06574 19.5491 5.125 19.3864 5.125H18.3145L17.3188 16.0773C17.2464 16.874 16.8499 17.6167 16.2081 18.1581C15.5663 18.6994 14.726 18.9999 13.8538 19H8.14618C7.27399 18.9999 6.43368 18.6994 5.79187 18.1581C5.15006 17.6167 4.75362 16.874 4.68118 16.0773L3.68545 5.125H2.61364C2.45089 5.125 2.29481 5.06574 2.17973 4.96025C2.06465 4.85476 2 4.71168 2 4.5625C2 4.41332 2.06465 4.27024 2.17973 4.16475C2.29481 4.05926 2.45089 4 2.61364 4H7.72727ZM5.90436 15.9835C5.95115 16.4991 6.2076 16.9797 6.62285 17.33C7.03809 17.6804 7.58181 17.8749 8.14618 17.875H13.8538C14.4182 17.8749 14.9619 17.6804 15.3772 17.33C15.7924 16.9797 16.0488 16.4991 16.0956 15.9835L17.084 5.125H4.91682L5.90436 15.9835ZM9.15909 7.75C9.32184 7.75 9.47792 7.80926 9.593 7.91475C9.70808 8.02024 9.77273 8.16332 9.77273 8.3125V14.6875C9.77273 14.8367 9.70808 14.9798 9.593 15.0852C9.47792 15.1907 9.32184 15.25 9.15909 15.25C8.99634 15.25 8.84026 15.1907 8.72518 15.0852C8.61011 14.9798 8.54545 14.8367 8.54545 14.6875V8.3125C8.54545 8.16332 8.61011 8.02024 8.72518 7.91475C8.84026 7.80926 8.99634 7.75 9.15909 7.75ZM13.4545 8.3125C13.4545 8.16332 13.3899 8.02024 13.2748 7.91475C13.1597 7.80926 13.0037 7.75 12.8409 7.75C12.6782 7.75 12.5221 7.80926 12.407 7.91475C12.2919 8.02024 12.2273 8.16332 12.2273 8.3125V14.6875C12.2273 14.8367 12.2919 14.9798 12.407 15.0852C12.5221 15.1907 12.6782 15.25 12.8409 15.25C13.0037 15.25 13.1597 15.1907 13.2748 15.0852C13.3899 14.9798 13.4545 14.8367 13.4545 14.6875V8.3125Z"
                          fill="#333333"
                        />
                      </svg>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalRecords}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Dialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        aria-labelledby="delete-confirmation-dialog"
      >
        <DialogContent>
          <div className="flex flex-1 flex-row justify-center items-center">
            Are you sure you want to delete this scheduling?
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDialog}
        fullWidth={true}
        maxWidth={"lg"}
        onClose={() => setOpenDialog(false)}
      >
        <DialogContent>
          <div className="flex flex-1 flex-row justify-center items-center"></div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ScheduledTable;
