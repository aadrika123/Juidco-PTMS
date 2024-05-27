import React, { useState } from "react";
import { FieldProps } from "formik";

const PasswordInput = ({ field, form, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="relative">
      <input
        {...field}
        {...props}
        type={showPassword ? "text" : "password"}
        className="border rounded-md px-3 py-4 w-full focus:outline-none focus:border-blue-500"
      />
      <button
        type="button"
        className="absolute inset-y-0 right-0 flex items-center pr-3"
        onClick={togglePasswordVisibility}
      >
        {showPassword ? (
          <svg
            width="20"
            height="20"
            viewBox="0 0 60 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M37.5018 30C37.5018 34.1423 34.144 37.5 30.0018 37.5C25.8598 37.5 22.5018 34.1423 22.5018 30C22.5018 25.8577 25.8598 22.5 30.0018 22.5C34.144 22.5 37.5018 25.8577 37.5018 30Z"
              stroke="black"
              stroke-width="5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M30.003 12.5C18.8089 12.5 9.33316 19.8572 6.14746 30C9.33311 40.1427 18.8089 47.5 30.003 47.5C41.197 47.5 50.6728 40.1427 53.8585 30C50.6728 19.8573 41.197 12.5 30.003 12.5Z"
              stroke="black"
              stroke-width="5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        ) : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 60 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.49755 7.5L52.4975 52.5M24.6083 24.7841C23.3017 26.134 22.4976 27.973 22.4976 30C22.4976 34.1423 25.8555 37.5 29.9975 37.5C32.0538 37.5 33.9168 36.6725 35.2715 35.3325M16.2476 16.6179C11.4993 19.7509 7.88263 24.4599 6.14258 30C9.3282 40.1427 18.804 47.5 29.998 47.5C34.9703 47.5 39.6035 46.0485 43.497 43.546M27.4975 12.6235C28.32 12.5418 29.1543 12.5 29.998 12.5C41.1923 12.5 50.668 19.8573 53.8535 30C53.1518 32.235 52.1443 34.3345 50.8805 36.25"
              stroke="black"
              stroke-width="5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        )}
      </button>
    </div>
  );
};

export default PasswordInput;
