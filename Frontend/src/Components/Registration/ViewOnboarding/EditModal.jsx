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

  const [pollutionDoc, setPollutionDoc] = useState("");
  const [taxCopyDoc, setTaxCopyDoc] = useState("");
  const [fetchedData, setFetchedData] = useState("");

  // Form Data
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    age: "",
    bloodGrp: "",
    emergencyMobNo: "",
    adhar_no: "",
  });

  // File Data
  const [firstBuffer, setFirstBuffer] = useState(null);
  const [secondBuffer, setSecondBuffer] = useState(null);
  const [adharDoc, setAdharDoc] = useState(null);
  const [fitnessDoc, setFitnessDoc] = useState(null);



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
      const payload = {
        id: dataId,
        ...formData,
      };

      if (adharDoc) payload.adhar_doc = adharDoc;
      if (fitnessDoc) payload.fitness_doc = fitnessDoc;

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/conductor/update`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.data?.status == "Error") {
        console.log("Error Occured");
      } else {
        setIsLoading(false);
        setEditModal(false);
      }
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  const handleImageUpload = async (value, field) => {
    const uploadFormData = new FormData();
    uploadFormData.append("img", value);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/common/img-upload`,
        uploadFormData,
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
 
        if (field == "pollution") {
          setFirstBuffer(responseData);
        }
        if (field == "tax") {
          setSecondBuffer(responseData);
        }
        if (field == "adhar") {
          setAdharDoc({
            fileName: value.name,
            fileUrl: responseData
          });
        }
        if (field == "fitness") {
          setFitnessDoc({
            fileName: value.name,
            fileUrl: responseData
          });
        }
      }
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
        const data = res.data?.data;
        setFetchedData(data);
        setPollutionDoc(data?.pollution_doc?.buffer);
        setTaxCopyDoc(data?.taxCopy_doc?.buffer);
        
        if (page === "conductor") {
          setFormData({
            firstName: data?.first_name || "",
            middleName: data?.middle_name || "",
            lastName: data?.last_name || "",
            age: data?.age || "",
            bloodGrp: data?.blood_grp || "",
            emergencyMobNo: data?.emergency_mob_no || "",
            adhar_no: data?.adhar_no || "",
          });
        }
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
          {page === "bus" ? (
            <div className="flex mt-10">
              <div className="flex flex-col">
                <label className="mb-2 ml-4">
                  Pollution Certificate
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                  onChange={(e) => handleImageUpload(e.target.files[0], "pollution")}
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2 ml-4">
                  Tax Copy
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  className="border border-gray-300 px-3 py-4 rounded-md focus:outline-none ml-4 mr-4 transition duration-300"
                  onChange={(e) => handleImageUpload(e.target.files[0], "tax")}
                />
              </div>
            </div>
          ) : (
            <div className="px-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="mb-2">Email</label>
                  <input
                    type="email"
                    value={fetchedData?.email_id || ""}
                    className="border border-gray-300 px-3 py-2 rounded-md bg-gray-100 cursor-not-allowed"
                    readOnly
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-2">Mobile Number</label>
                  <input
                    type="tel"
                    value={fetchedData?.mobile_no || ""}
                    className="border border-gray-300 px-3 py-2 rounded-md bg-gray-100 cursor-not-allowed"
                    readOnly
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="mb-2">First Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={formData.firstName}
                    className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none"
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-2">Middle Name</label>
                  <input
                    type="text"
                    value={formData.middleName}
                    className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none"
                    onChange={(e) => handleInputChange('middleName', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="mb-2">Last Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={formData.lastName}
                    className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none"
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-2">Age <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    value={formData.age}
                    className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none"
                    onChange={(e) => handleInputChange('age', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="mb-2">Blood Group</label>
                  <select
                    value={formData.bloodGrp}
                    className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none"
                    onChange={(e) => handleInputChange('bloodGrp', e.target.value)}
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="mb-2">Emergency Mobile No <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    value={formData.emergencyMobNo}
                    maxLength="10"
                    className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none"
                    onChange={(e) => handleInputChange('emergencyMobNo', e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="mb-2">Aadhar Number <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.adhar_no}
                  maxLength="12"
                  className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none"
                  onChange={(e) => handleInputChange('adhar_no', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="mb-2">Aadhar Document</label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none"
                    onChange={(e) => handleImageUpload(e.target.files[0], "adhar")}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-2">Fitness Document</label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none"
                    onChange={(e) => handleImageUpload(e.target.files[0], "fitness")}
                  />
                </div>
              </div>
            </div>
          )}
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
