import { useEffect, useState } from "react";
import busstop from "../../../assets/bus-stop.png";
import axios from "axios";
import Cookies from "js-cookie";
import CircularIndeterminate from "../../../assets/common/loader/Loader";
import { useNavigate } from "react-router-dom";

function EditModal({ handleCancel, page, dataId, setEditModal }) {
  const token = Cookies.get("accesstoken");

  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [uploading, setUploading] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  console.log(dataId, "dataId==================>>");

  // console.log(uploading, "uploading");

  // const [firstInput, setFirstInput] = useState("");
  // const [secondInput, setSecondInput] = useState("");
  const [pollutionDoc, setPollutionDoc] = useState("");
  const [taxCopyDoc, setTaxCopyDoc] = useState("");
  const [fetchedData, setFetchedData] = useState("");

  console.log(fetchedData, "fetchedData");
  //Image Data
  const [firstInput, setFirstInput] = useState(null);
  const [secondInput, setSecondInput] = useState(null);

  // Input Data
  const [firstBuffer, setFirstBuffer] = useState(null);
  const [secondBuffer, setSecondBuffer] = useState(null);

  // console.log(firstInput, "firstInput");
  // console.log(secondInput, "secondInput");
  // console.log(firstBuffer, "firstBuffer");
  // console.log(secondBuffer, "secondBuffer");

  // const handleFileChange = (e, setBuffer) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();

  //     reader.onloadend = () => {
  //       const buffer = reader.result;
  //       setBuffer(buffer);
  //     };

  //     reader.readAsArrayBuffer(file);
  //   }
  // };

  // const handle_Image_upload = async (
  //   file,
  //   type,
  //   setUploadedFiles,
  //   setUploading
  // ) => {
  //   const formData = new FormData();
  //   const MAX_SIZE = 2 * 1024 * 1024;
  //   formData.append("img", file);
  //   console.log("File Size", file.size);
  //   if (file.size > MAX_SIZE) {
  //     console.error("Error: File size exceeds 2MB.");
  //     alert("Error: File size exceeds 2MB.");
  //     return;
  //   } else {
  //     try {
  //       setUploading((prev) => ({ ...prev, [type]: true }));
  //       const response = await axios.post(
  //         `${process.env.REACT_APP_BASE_URL}/common/img-upload`,
  //         formData,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       setUploadedFiles((prev) => ({ ...prev, [type]: response.data.data }));
  //     } catch (error) {
  //       console.error("Error uploading image:", error);
  //     } finally {
  //       setUploading((prev) => ({ ...prev, [type]: false }));
  //     }
  //   }
  // };

  let loading =
    "h-6 w-6 rounded-full animate-spin border-4 border-solid border-t-transparent";

  const updateValues = async (values) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/bus/update/v2`,
        {
          id: dataId,
          pollution_cert: firstBuffer,
          taxCopy_cert: secondBuffer,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.data?.status == "Error") {
        console.log("Error Occured");
      } else {
        const responseData = response?.data?.data;
        console.log(responseData, "responseData");
        setIsLoading(false);
        setEditModal(false);
      }
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  const updateInputValues = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/conductor/update`,
        {
          id: dataId,
          mobileNo: firstInput,
          emergencyMobNo: secondInput,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.data?.status == "Error") {
        console.log("Error Occured");
      } else {
        const responseData = response?.data?.data;
        console.log(responseData, "responseData");
        setIsLoading(false);
        setEditModal(false);
      }
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  const handleImageUpload = async (value, field) => {
    const formData = new FormData();
    formData.append("img", value);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/common/img-upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.data?.status == "Error") {
        console.log("Error Occured");
      } else {
        const responseData = response?.data?.data;
        console.log(responseData, "responseData");
        if (field == "pollution") {
          setFirstBuffer(responseData);
        }
        if (field == "tax") {
          setSecondBuffer(responseData);
        }
      }
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/${
          page == "bus" ? "bus" : "conductor"
        }/${dataId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data?.data);
        setFetchedData(res.data?.data);
        setPollutionDoc(res.data?.data?.pollution_doc?.buffer);
        setTaxCopyDoc(res.data?.data?.taxCopy_doc?.buffer);
      });
  }, []);

  // if (isLoading) {
  //   return (
  //     <>
  //       <CircularIndeterminate />
  //     </>
  //   );
  // }

  return (
    <>
      <div></div>
      <div className="fixed inset-0 flex items-center justify-start z-[5000]">
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
        <div className="bg-white w-1/2 mx-auto flex flex-col max-sm:w-full z-10  rounded">
          <div className="mt-10 flex justify-start items-start ">
            <img
              className="h-[2rem] ml-5 animate-wiggle mb-5 "
              src={busstop}
              alt="alt title"
            />
            <h1 className="pl-3 font-bold text-xl">
              {fetchedData?.register_no}
              {fetchedData?.cunique_id}
            </h1>
          </div>
          <div className="flex mt-10">
            {/*  */}
            {/* <div className="flex flex-1 flex-col mt-4">
              <label className="mb-2 ml-4" htmlFor="Pollution_selectedFile">
                Pollution Certificate
                <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                id="Pollution_selectedFile"
                name="Pollution_selectedFile"
                accept="image/*"
                className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                style={{ boxShadow: "0 1px 4px #fff" }}
                onFocus={(e) => (e.target.style.boxShadow = "0 1px 4px #000")}
                onBlur={(e) => (e.target.style.boxShadow = "none")}
                onChange={(e) => setFirstInput(e.target.files[0])}
              />
             
              {firstInput && (
                <div className="flex flex-1 justify-end mr-8 ml-8 mt-2">
                  {uploadedFiles.Pollution && (
                    <div className="text-green-500 ml-4 mt-2">
                      Pollution Certificate Uploaded
                    </div>
                  )}
                  <button
                    type="button"
                    className="flex justify-end items-end  ml-4 px-4 w-fit h-[40px] py-2 bg-[#4245D9] text-white rounded"
                    onClick={() =>
                      handle_Image_upload(
                        firstInput,
                        setUploadedFiles,
                        setUploading
                      )
                    }
                  >
                    {uploading ? "Upload" : "Uploading..."}
                  </button>
                </div>
              )}
            </div> */}
            {/*  */}

            <div className="flex flex-col">
              <label className="mb-2 ml-4">
                {page === "bus"
                  ? "Pollution Certificate"
                  : "Enter Phone Number"}
                <span className="text-red-500">*</span>
              </label>
              <input
                type={page === "bus" ? "file" : "number"}
                className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                onChange={(e) => {
                  if (page === "bus") {
                    handleImageUpload(e.target.files[0], "pollution"); // Handle file upload for first input
                  } else {
                    const value = e.target.value;
                    if (value.length <= 10) {
                      setFirstInput(value);
                    }
                  }
                }}
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-2 ml-4">
                {page === "bus" ? "Tax Copy" : "Enter Emergency Phone Number"}
                <span className="text-red-500">*</span>
              </label>
              <input
                type={page === "bus" ? "file" : "number"}
                className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                onChange={(e) => {
                  if (page === "bus") {
                    handleImageUpload(e.target.files[0], "tax"); // Handle file upload for second input
                  } else {
                    setSecondInput(e.target.value); // Handle text input for second input
                  }
                }}
              />
            </div>
          </div>
          <div className="flex flex-col m-8">
            <div className="flex  space-x-5">
              <div>
                <button
                  className={`bg-white border-blue-900 border text-blue-950 text-sm px-8 py-2 hover:bg-[#4338CA] hover:text-white  rounded leading-5 shadow-lg`}
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>

              <div className="">
                {isLoading ? (
                  <CircularIndeterminate />
                ) : (
                  <button
                    className={`bg-[rgb(67,56,202)] text-sm px-8 py-2 text-white  rounded leading-5 shadow-lg`}
                    onClick={() => {
                      page == "bus" ? updateValues() : updateInputValues();
                    }}
                    disabled={isLoading}
                  >
                    Save
                  </button>
                )}
              </div>
            </div>

            <div>
              {/* <h1 className='text-center pt-5'>
                <span className='text-red-600 text-xl'>*</span> By Clicking
                Continue your data will be Processed
              </h1> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditModal;
