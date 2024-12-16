import React, { useState, useEffect } from "react";
import docspng from "../../docs.png";
import CircularIndeterminate from "../loader/Loader";

const ImgModal = ({ imageUrl, type, isLoading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    const processImage = () => {
      let buffer, mime;

      switch (type) {
        case "pollution":
          buffer = imageUrl?.pollution_doc?.buffer?.data;
          mime = imageUrl?.pollution_doc?.mimeType;
          break;
        case "registrationCert":
          buffer = imageUrl?.registrationCert_doc?.buffer?.data;
          mime = imageUrl?.registrationCert_doc?.mimeType;
          break;
        case "taxCopy":
          buffer = imageUrl?.taxCopy_doc?.buffer?.data;
          mime = imageUrl?.taxCopy_doc?.mimeType;
          break;
        case "fitness":
          buffer = imageUrl?.fitness_doc?.buffer?.data;
          mime = imageUrl?.fitness_doc?.mimeType;
          break;
        case "adhar":
          buffer = imageUrl?.adhar_doc?.buffer?.data;
          mime = imageUrl?.adhar_doc?.mimeType;
          break;
        default:
          break;
      }
      console.log("buffer && mime", buffer, mime)

      if (buffer && mime) {
        const view = new Uint8Array(buffer);
        const blob = new Blob([view], { type: mime });
        const urlObject = URL.createObjectURL(blob);
        setImageSrc(urlObject);
      } else if (imageUrl?.[`${type}_doc`]?.imageUrl) {
        setImageSrc(imageUrl[`${type}_doc`].imageUrl);
      }
      else 
      console.log("msg")
    };

    processImage();

    return () => {
      if (imageSrc && imageSrc.startsWith('blob:')) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [imageUrl, type, isLoading]);

  const toggleModal = () => {
    setIsOpen(!isOpen);

    console.log("imageUrl", imageUrl);
    console.log("type", type);
    console.log("imageSrc", imageSrc);
    
  };

  return (
    <div className="relative">
      <img
        src={docspng}
        alt="Gallery Image"
        className="cursor-pointer rounded-lg w-8 h-8 hover:opacity-80 transition-opacity duration-200"
        onClick={toggleModal}
      />

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
          <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full mx-4">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
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
              ) : imageSrc ? (
                <img
                  src={imageSrc}
                  alt={`${type} Document`}
                  className="max-h-[80vh] max-w-full rounded-lg object-contain"
                />
              ) : (
                <p className="text-gray-500 text-center">No image available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImgModal;

