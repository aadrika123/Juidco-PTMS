import React, { useState, useEffect } from "react";
import docspng from "../../docs.png";
import CircularIndeterminate from "../loader/Loader";

const ImgModal = ({ imageUrl, type, isLoading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageBuffer, setImageBuffer] = useState(false);

  let buffer = [];
  let mime = "";

  switch (type) {
    case "pollution":
      buffer = imageUrl?.pollution_doc?.buffer?.data;
      mime = imageUrl?.pollution_doc?.mimeType;
      break;
    case "registration":
      buffer = imageUrl?.registrationCert_doc?.buffer?.data;
      mime = imageUrl?.registrationCert_doc?.mimeType;
      break;
    case "taxcopy":
      buffer = imageUrl?.taxCopy_doc?.buffer?.data;
      mime = imageUrl?.taxCopy_doc?.mimeType;
      break;
    case "fitness":
      buffer = imageUrl?.fitness_doc?.buffer?.data;
      mime = imageUrl?.fitness_doc?.mimeType;
      break;
    case "aadhar":
      buffer = imageUrl?.adhar_doc?.buffer?.data;
      mime = imageUrl?.adhar_doc?.mimeType;
      break;
    default:
      break;
  }

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const formatting = () => {
    const view = new Uint8Array(buffer);

    // Convert ArrayBuffer to a Blob
    const blob = new Blob([view], {
      type: mime,
    });

    const urlObject = URL.createObjectURL(blob);
    setImageBuffer(urlObject);
  };

  useEffect(() => {
    formatting();
  }, [isLoading]);


  return (
    <div className="relative">
      <img
        src={docspng}
        alt="Gallery Image"
        className="cursor-pointer rounded-lg w-8 h-8"
        onClick={toggleModal}
      />

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
          <div className="relative bg-white p-6 rounded-lg shadow-lg ">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={toggleModal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="flex justify-center items-center w-full h-full">
              {isLoading ? (
                <div className="p-10">
                  <CircularIndeterminate />
                </div>
              ) : (
                <img
                  src={imageBuffer}
                  alt="No Image"
                  className="max-h-[80vh] max-w-full rounded-lg"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImgModal;
