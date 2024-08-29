import React from "react";
import busstop from "../../assets/bus-stop.png";
import { Link } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  useMediaQuery,
  Grid
} from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';

import { useTheme } from '@mui/material/styles';

const ReportCard = ({
  card_type,
  first_name,
  middle_name,
  last_name,
  age,
  conductor_id,
  mobile_no,
  aadhar_no,
  bus_id,
  register_no,
  vin_no,
  total_bus_collection,
  fromDate,
  toDate,
  details
}) => {

  const [open, setOpen] = React.useState(false);

  return (
    <>
      {details && <BusDialog open={open} setOpen={setOpen} data={details} />}
      {card_type == "conductor" ? (

        <div className="flex flex-col items-center bg-white p-0 shadow-sm rounded-md w-full">
          <div className="flex flex-row justify-end item-center bg-[#6366F1] w-full h-[20%]" >
            <p className="text-2xl pr-4 text-white">₹{total_bus_collection}</p>
          </div>
          <div className="flex flex items-center gap-10 p-4 rounded-md w-full">
            <div className="flex flex-1 flex-col justify-between h-full ">
              <p><b>Conductor Name </b>: <span className="font-normal">{`${first_name} ${last_name}`}</span></p>
              <p><b>Conductor ID</b> : <span className="font-normal">{conductor_id}</span></p>
              <p><b>Contact Number </b>: <span className="font-normal">{mobile_no}</span></p>
              <p><b>Aadhar Card / Pan Card </b>: <span className="font-normal">{aadhar_no}</span></p>
              <p><b>Age</b> : <span className="font-normal">{age}</span></p>
            </div>

            <div className="flex flex-1 justify-end gap-8 items-center ">
              {details?.slice(0, 2).map((item, index) => (
                <div key={index} className="flex flex-1 flex-col ">
                  <h5 className="text-xl">{item?.bus_id}</h5>
                  <div>
                    <p>Date : <span className="font-normal">{new Date(item?.date).toLocaleDateString()}</span></p>
                    {/* <p>Status : <span className="font-normal">{'Scheduled'}</span></p> */}
                  </div>
                  <button
                    disabled
                    className="bg-[#6366F1] h-10 text-white mt-8 px-4 py-2 rounded-sm"
                  >
                    <p>₹{item?.total_collection}</p>
                  </button>
                </div>
              ))}
            </div>

            <div className="flex flex-col justify-between h-full items-end">
              <Link
                to={`/ReportConductor_recipt/${conductor_id}/${fromDate}/${toDate}`}
                className="font-bold"
              >
                See All Recipts{" "}
              </Link>
              <Button
                variant="contained"
                sx={{
                  borderRadius: '50%',
                  aspectRatio: 1 / 1,
                  width: '40px',
                  height: '40px',
                  minWidth: '0',
                }}
                onClick={() => { setOpen(true) }}
              >
                <ArrowForwardIcon />
              </Button>
            </div>
          </div>
        </div>

        // <div className="flex flex-1 flex-col ">
        //   <div className="flex mt-5  flex-row">
        //     <div className="flex font-bold">Name:</div>
        //     <div className="flex ml-4 flex-row">
        //       <div className="flex">{first_name}</div>
        //       <div className="flex ml-2">
        //         {middle_name == "null" ? "" : middle_name}
        //       </div>
        //       <div className="flex ml-2">{last_name}</div>
        //     </div>
        //   </div>
        //   <div className="flex mt-5 flex-row">
        //     <div className="flex font-bold">Age:</div>
        //     <div className="flex ml-4">{age}</div>
        //   </div>
        //   <div className="flex mt-5 flex-row  ">
        //     <div className="flex font-bold">Conductor ID:</div>
        //     <div className="flex ml-4">{conductor_id}</div>
        //   </div>
        //   <div className="flex mt-5 flex-row  ">
        //     <div className="flex font-bold">Contact Number:</div>
        //     <div className="flex ml-4">+91 {mobile_no}</div>
        //   </div>
        //   <div className="flex mt-5 flex-row  ">
        //     <div className="flex font-bold">Adhar Card/Pan Number :</div>
        //     <div className="flex ml-4">{aadhar_no}</div>
        //   </div>
        // </div>




        // <div className="flex items-center gap-10 bg-white p-4 shadow-sm rounded-md w-full">
        //   <div className="flex flex-1 flex-col justify-between h-full ">
        //     <p>Conductor Name : <span className="font-normal">{`${first_name} ${last_name}`}</span></p>
        //     <p>Conductor ID : <span className="font-normal">{conductor_id}</span></p>
        //     <p>Contact Number : <span className="font-normal">{mobile_no}</span></p>
        //     <p>Aadhar Card / Pan Card : <span className="font-normal">{aadhar_no}</span></p>
        //     <p>Age : <span className="font-normal">{age}</span></p>
        //   </div>

        //   <div className="flex flex-1 justify-end gap-8 items-center ">
        //     {details.slice(0, 2).map((item, index) => (
        //       <div key={index} className="flex flex-1 flex-col ">
        //         <h5 className="text-xl">{item?.bus_id}</h5>
        //         <div>
        //           <p>Date : <span className="font-normal">{new Date(item?.date).toLocaleDateString()}</span></p>
        //           {/* <p>Status : <span className="font-normal">{'Scheduled'}</span></p> */}
        //         </div>
        //         <button
        //           disabled
        //           className="bg-[#6366F1] h-10 text-white mt-8 px-4 py-2 rounded-sm"
        //         >
        //           <p>{item?.amount}</p>
        //         </button>
        //       </div>
        //     ))}
        //   </div>

        //   <div className="flex flex-col justify-end h-full items-end">
        //     <Button
        //       variant="contained"
        //       sx={{
        //         borderRadius: '50%',
        //         aspectRatio: 1 / 1,
        //         width: '40px',
        //         height: '40px',
        //         minWidth: '0',
        //       }}
        //       onClick={() => { setOpen(true) }}
        //     >
        //       <ArrowForwardIcon />
        //     </Button>
        //   </div>
        // </div>
      ) : card_type === "bus" ? (
        <div className="flex flex-1 flex-col ">
          <div className="flex mt-5 flex-row">
            <div className="flex font-bold">Id:</div>
            <div className="flex ml-4">{bus_id}</div>
          </div>
          <div className="flex mt-5 flex-row">
            <div className="flex font-bold">Registration Number :</div>
            <div className="flex ml-4">{register_no}</div>
          </div>
          <div className="flex mt-5 flex-row">
            <div className="flex font-bold">VIN Number:</div>
            <div className="flex ml-4">{vin_no}</div>
          </div>
        </div>
      ) : (

        <div className="flex items-center gap-10 bg-white p-4 shadow-sm rounded-md w-full">
          <div className="flex flex-1 flex-col justify-between h-full ">
            <p>Conductor Name : <span className="font-normal">{`${first_name} ${last_name}`}</span></p>
            <p>Conductor ID : <span className="font-normal">{conductor_id}</span></p>
            <p>Contact Number : <span className="font-normal">{mobile_no}</span></p>
            <p>Aadhar Card / Pan Card : <span className="font-normal">{aadhar_no}</span></p>
            <p>Age : <span className="font-normal">{age}</span></p>
          </div>

          <div className="flex flex-1 justify-end gap-8 items-center ">
            {details.slice(0, 2).map((item, index) => (
              <div key={index} className="flex flex-1 flex-col ">
                <h5 className="text-xl">{item?.bus_id}</h5>
                <div>
                  <p>Date : <span className="font-normal">{new Date(item?.date).toLocaleDateString()}</span></p>
                  {/* <p>Status : <span className="font-normal">{'Scheduled'}</span></p> */}
                </div>
                <button
                  disabled
                  className="bg-[#6366F1] h-10 text-white mt-8 px-4 py-2 rounded-sm"
                >
                  <p>{item?.amount}</p>
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-col justify-end h-full items-end">
            {/* <Link
              to={`/ReportConductor_recipt/${conductor_id}/${fromDate}/${toDate}`}
              className="font-bold"
            >
              See All Recipts{" "}
            </Link> */}
            <Button
              variant="contained"
              sx={{
                borderRadius: '50%',
                aspectRatio: 1 / 1,
                width: '40px',
                height: '40px',
                minWidth: '0',
              }}
              onClick={() => { setOpen(true) }}
            >
              <ArrowForwardIcon />
            </Button>
          </div>
        </div>

        // <div className="flex items-center gap-10 bg-white p-8 shadow-lg">
        //   <div className="flex flex-1 flex-col ">
        //     <div className="flex mt-5  flex-row">
        //       <div className="flex font-bold">Name:</div>
        //       <div className="flex ml-4 flex-row">
        //         <div className="flex">{first_name}</div>
        //         <div className="flex ml-2">
        //           {middle_name == "null" ? "" : middle_name}
        //         </div>
        //         <div className="flex ml-2">{last_name}</div>
        //       </div>
        //     </div>
        //     <div className="flex mt-5 flex-row">
        //       <div className="flex font-bold">Age:</div>
        //       <div className="flex ml-4">{age}</div>
        //     </div>
        //     <div className="flex mt-5 flex-row  ">
        //       <div className="flex font-bold">Conductor ID:</div>
        //       <div className="flex ml-4">{conductor_id}</div>
        //     </div>
        //     <div className="flex mt-5 flex-row  ">
        //       <div className="flex font-bold">Contact Number:</div>
        //       <div className="flex ml-4">+91 {mobile_no}</div>
        //     </div>
        //     <div className="flex mt-5 flex-row  ">
        //       <div className="flex font-bold">Adhar Card/Pan Number :</div>
        //       <div className="flex ml-4">{aadhar_no}</div>
        //     </div>
        //   </div>

        //   <div className="flex flex-1 justify-center items-center border  bg-white border p-8 rounded-lg m-4 ">
        //     <div className="flex flex-1 flex-row ">
        //       <div className="flex flex-1">
        //         <div className="flex flex-col flex-1">
        //           <div className="flex flex-1 text-4xl font-bold text-[#12CA46] justify-center items-centers text-center">
        //             {/* {total_collection.data[0].total_bus_collection}/- */}
        //             {total_bus_collection}
        //             /-
        //           </div>
        //           <div className="flex flex-1 text-lg font-bold text-gray-500 mt-2 justify-center items-centers text-center">
        //             Total Amount of the Bus Collection
        //           </div>
        //         </div>
        //       </div>
        //       <div className="flex flex-1">
        //         <img src={busstop} className="flex ml-4 w-24 h-24" />
        //       </div>
        //     </div>
        //   </div>
        // </div>
      )}
    </>
  );
};

const BusCard = ({ bus_id, total_bus_collection, date, status }) => {
  return (
    <div className="flex flex-1 flex-col">
      <div
        key={bus_id}
        className="flex flex-col h-[180px] w-[180px] m-4 rounded-md border-2 justify-center items-center border-blue-400 bg-white"
      >
        {/*
         */}{" "}
        <div className="flex flex-1 flex-col justify-center items-center m-4">
          <img
            src={busstop}
            style={{ translate: "transform(-50%,-50%)" }}
            className="flex ml-4 w-14 h-14"
          />
          <div className="text-[#6D63E8]">Bus: {bus_id}</div>
          <div className="flex flex-col text-black">
            <div className="flex">
              Amount:{" "}
              <span className="ml-2 text-[#2CA70D]">
                {total_bus_collection}
              </span>
            </div>
          </div>
          <div className="flex flex-1 text-xs text-gray-400 justify-start items-start">
            Date: {date?.split("T")[0]}
          </div>
        </div>
        {/* </Link> */}
      </div>
    </div>
  );
};


const BusDialog = ({ open, setOpen, data }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('lg'));

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open responsive dialog
      </Button> */}
      <Dialog
        fullScreen={fullScreen}
        maxWidth={'lg'}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <div className="flex flex-row justify-between border-2">
          <DialogTitle id="responsive-dialog-title">
            {"All details"}
          </DialogTitle>
          <IconButton onClick={handleClose}><CloseIcon /></IconButton>
        </div>
        <DialogContent>
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            {data?.map((item, index) => (
              <Grid item xs={2} sm={4} md={4} key={index}>
                <div key={index} className="flex flex-1 flex-col ">
                  <h5 className="text-xl">{item?.bus_id}</h5>
                  <div>
                    <p>Date : <span className="font-normal">{new Date(item?.date).toLocaleDateString()}</span></p>
                    {/* <p>Status : <span className="font-normal">{'Scheduled'}</span></p> */}
                  </div>
                  <button
                    disabled
                    className="bg-[#6366F1] h-10 text-white mt-8 px-4 py-2 rounded-sm"
                  >
                    <p>₹{item?.total_collection}</p>
                  </button>
                </div>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
    </React.Fragment>

  )
}

export { BusCard, ReportCard };


