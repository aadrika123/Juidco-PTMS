import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Dialog,
  DialogContent,
  DialogActions,
  Avatar,
} from '@mui/material';
import * as Yup from 'yup';

import { Link } from 'react-router-dom';
import axios from 'axios';
import Button from '@mui/material/Button';
import Cookies from 'js-cookie';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import busstop from '../../assets/bus-stop.png';

import autoTable from 'jspdf-autotable';
import { jsPDF } from 'jspdf';
import ListLoader from '../../assets/common/loader/ListLoader';

const formatDate = (dateString) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const formatTime = (time) => {
  const timeString = time.toString().padStart(4, '0');
  const hours = timeString.slice(0, 2);
  const minutes = timeString.slice(2, 4);
  return `${hours}:${minutes}`;
};

const validationSchema = Yup.object({
  fromDate: Yup.string().required('From Date is required'),
  toDate: Yup.string()
    .required('To Date is required')
    .test(
      'is-greater',
      'To Date should be greater than From Date',
      function (value) {
        const { fromDate } = this.parent;
        return fromDate && value ? new Date(value) > new Date(fromDate) : true;
      }
    ),
});

const ScheduledTable = () => {
  const token = Cookies.get('accesstoken');
  const [openDialog, setOpenDialog] = useState(false); // State to control dialog
  const [deleteDialog, setDeleteDialog] = useState(false); // State to control delete confirmation dialog
  const [deleteItemId, setDeleteItemId] = useState(null); // State to track the item to be deleted
  const [busoptions, set_busoptions] = useState([]);
  const [selectedBus, setSelectedBus] = useState([]); // Added state for selected bus

  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [allScheduled, setAllScheduled] = useState([]);
  const [length, setLength] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [fromDate, setFromDate] = useState(''); // Added state for date
  const [toDate, settoDate] = useState(''); // Added state for date
  const [vi_number, set_vi_number] = useState('');
  const [loading, set_loading] = useState(false);

  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 1200);

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/getAllBusList?limit=100&page=1`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }) // Replace with your actual API endpoint
      .then((response) => {
        set_busoptions(response?.data?.data?.data);
      })
      .catch((error) => console.error('Error fetching bus data:', error));

    fetchScheduledData();
  }, [page, rowsPerPage, debouncedSearchQuery]);

  const fetchScheduledData = async () => {
    set_loading(true);
    try {
      await axios
        .get(
          `${
            process.env.REACT_APP_BASE_URL
          }/schedule/getAll?search=${searchQuery}&limit=${rowsPerPage}&page=${
            page + 1
          }&bus_no=${selectedBus}&from_date=${fromDate}&to_date=${toDate}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          set_loading(false);
          setLength(response.data?.data?.data?.length);
          setAllScheduled(response.data?.data?.data);
          setTotalRecords(response.data?.data?.count);
        });
    } catch (error) {
      console.error('Failed to fetch scheduled data:', error);
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
      console.error('Failed to delete scheduled data:', error);
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

  const handleDownload = () => {
    const doc = new jsPDF();

    const columns = [
      { header: 'ID' },
      { header: 'Bus No.' },
      { header: 'Conductor Id' },
      { header: 'Conductor Name' },
      { header: 'Mobile No.' },
      { header: 'Date' },
      { header: 'From Time' },
      { header: 'To Time' },
    ];

    const data = [];
    const table = document.getElementById('data-table');

    const rows = table?.querySelectorAll('tbody tr') || [];
    rows.forEach((row) => {
      const rowData = [];
      row.querySelectorAll('td').forEach((cell) => {
        const cellData = cell?.textContent?.trim() || '';
        rowData.push(cellData);
      });
      data.push(rowData);
    });

    autoTable(doc, {
      head: [columns.map((column) => column.header)],
      body: data,
    });

    doc.save('Scheduling.pdf');
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex p-2 mt-5 ml-4 mr-4  justify-start items-start  h-fit">
        <div className="flex ">
          <img src={busstop} className="ml-4 w-16 h-16" />
        </div>
        <div className="flex flex-1 ml-4 h-fit flex-col">
          <div className="flex text-xl font-semibold">Search Filter</div>
          <div className="flex justify-between flex-1">
            <Formik
              initialValues={{
                busNumber: '',
                vinNumber: '',
                status: '',
                fromDate: '',
                toDate: '',
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                setSelectedBus(values.busNumber);
                setFromDate(values.fromDate);
                fetchScheduledData();
              }}
            >
              {({ values, handleChange, handleSubmit }) => (
                <Form
                  onSubmit={handleSubmit}
                  className="flex flex-1 flex-row space-x-2"
                >
                  <Field
                    as="select"
                    name="busNumber"
                    className="flex flex-1 border mt-4 justify-center items-center h-12 border-gray-300 rounded-md "
                    value={values.busNumber}
                    onChange={(e) => {
                      handleChange(e);
                      const selectedBus = busoptions.find(
                        (bus) => bus.register_no === e.target.value
                      );
                      setSelectedBus(selectedBus);
                      set_vi_number(selectedBus?.vin_no); // Update selected bus state
                    }}
                  >
                    <option value="" label="Select bus number" />
                    {busoptions?.map((bus) => (
                      <option
                        key={bus.id}
                        value={bus.register_no}
                      >{`Bus No: -  ${bus.register_no}`}</option>
                    ))}
                  </Field>
                  <div className="flex flex-1 justify-start ml-2 items-center flex-row">
                    <div className="flex font-bold ">VIN Number:</div>
                    <div className="flex ml-2">{vi_number}</div>{' '}
                    {/* Display VIN number */}
                  </div>
                  <div className="flex   justify-center  items-start flex-col">
                    <label className="flex" htmlFor="fromDate">
                      From Date
                      <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="input"
                      type="date"
                      id="fromDate"
                      name="fromDate"
                      className="flex  h-12 border border-gray-300 rounded-md px-3 "
                      style={{ boxShadow: '0 1px 4px #fff' }}
                      onFocus={(e) =>
                        (e.target.style.boxShadow = '0 1px 4px #000')
                      }
                      onKeyPress={(e) => {
                        if (
                          (e.key >= '0' || e.key >= 'A') &&
                          (e.key <= '9' || e.key <= 'Z')
                        ) {
                          e.preventDefault();
                        }
                      }}
                      onBlur={(e) => (e.target.style.boxShadow = 'none')}
                    />
                    <ErrorMessage
                      name="fromDate"
                      component="div"
                      className="text-red-500 ml-4"
                    />
                  </div>
                  <div className="flex  justify-center items-start flex-col">
                    <label className="" htmlFor="fromDate">
                      To Date
                      <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="input"
                      type="date"
                      id="toDate"
                      name="toDate"
                      className="flex h-12 border border-gray-300 rounded-md px-3 "
                      style={{ boxShadow: '0 1px 4px #fff' }}
                      onFocus={(e) =>
                        (e.target.style.boxShadow = '0 1px 4px #000')
                      }
                      onKeyPress={(e) => {
                        if (
                          (e.key >= '0' || e.key >= 'A') &&
                          (e.key <= '9' || e.key <= 'Z')
                        ) {
                          e.preventDefault();
                        }
                      }}
                      onBlur={(e) => (e.target.style.boxShadow = 'none')}
                    />
                    <ErrorMessage
                      name="toDate"
                      component="div"
                      className="text-red-500 ml-4"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex flex-1  justify-center items-center  bg-[#6366F1] text-white px-4 h-12 mt-6 rounded-md"
                  >
                    <div className="flex w-fit  flex-row justify-center items-center">
                      <div className="flex">
                        {' '}
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
                      <div className="flex flex-1 text-white text-md font-bold">
                        {`${loading ? 'loading... ' : 'Search Result'}`}
                      </div>
                    </div>
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-row justify-end items-end mt-4 mb-4">
        <div style={{ flex: 2 }} className="flex justify-center items-center">
          <div style={{ flex: 2 }} className="flex mr-4">
            <input
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="mr-4 p-2 border-2 flex-1 rounded-md "
            />
          </div>
          <div className="flex flex-1 mr-4">
            <Button
              variant="contained"
              sx={{ width: '100%', background: '#6366F1' }}
              onClick={handleDownload}
            >
              <div className="flex flex-1 justify-center items-center flex-row">
                <div className="flex mr-2">
                  <svg
                    width="23"
                    height="23"
                    viewBox="0 0 23 23"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.4987 7.1875H6.70703C6.32578 7.1875 5.96015 7.33895 5.69057 7.60853C5.42098 7.87812 5.26953 8.24375 5.26953 8.625V16.2917C5.26953 16.6729 5.42098 17.0385 5.69057 17.3081C5.96015 17.5777 6.32578 17.7292 6.70703 17.7292H14.3737C14.7549 17.7292 15.1206 17.5777 15.3902 17.3081C15.6597 17.0385 15.8112 16.6729 15.8112 16.2917V11.5"
                      stroke="#fff"
                      strokeLinecap="round"
                    />
                    <path
                      d="M11.9766 11.0208L18.0754 4.922M13.8932 4.3125H18.6849V9.10417"
                      stroke="#fff"
                      strokeLinecap="round"
                      strokeLinejoin="round"
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
                sx={{ width: '100%', background: '#6366F1' }}
              >
                + Add New Scheduling
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <TableContainer component={Paper} className="shadow-lg rounded-lg">
        {loading ? ( // Check if the data is loading
          <ListLoader /> // Render the ListLoader while loading
        ) : length > 0 && loading == false ? ( // Check if there's filtered data
          <Table id="data-table" stickyHeader>
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
                <TableCell className="text-white font-bold">
                  Mobile No.
                </TableCell>
                <TableCell className="text-white font-bold">Date</TableCell>
                <TableCell className="text-white font-bold">
                  From Time
                </TableCell>
                <TableCell className="text-white font-bold">To Time</TableCell>
                <TableCell className="text-white font-bold">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row, index) => (
                <TableRow
                  key={index}
                  className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}
                >
                  <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                  <TableCell>{row.bus.register_no}</TableCell>
                  <TableCell>{row.conductor.cunique_id}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Avatar>{row.conductor.first_name.charAt(0)}</Avatar>
                      <div className="ml-4">
                        <div>{`${row.conductor.first_name} ${
                          row.conductor.middle_name === 'null'
                            ? ''
                            : row.conductor.middle_name
                        } ${row.conductor.last_name}`}</div>
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
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="red"
                          stroke-width="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          class="lucide lucide-trash-2"
                        >
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          <line x1="10" x2="10" y1="11" y2="17" />
                          <line x1="14" x2="14" y1="11" y2="17" />
                        </svg>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-1 m-4 flex-col justify-center items-center font-bold text-2xl text-slate-700">
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
          </div>
        )}

        <TablePagination
          rowsPerPageOptions={[10]}
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
        maxWidth={'lg'}
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
