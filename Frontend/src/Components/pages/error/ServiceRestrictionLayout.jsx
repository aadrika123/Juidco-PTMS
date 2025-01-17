import React from "react";
import {
  HiLockClosed,
  HiExclamation,
  HiInformationCircle,
} from "react-icons/hi";
import { useLocation } from "react-router-dom";
// import { useLocation } from "react-router-dom";

const ServiceRestrictionLayout = () => {
  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();
  const services = query.get("service");

//   console.log("objectservice", services);

  return (
    <div className="min-h-screen bg-white w-full flex justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mt-20">
          <HiLockClosed className="mx-auto h-12 w-12 text-red-600" />
          <h2 className="mt-4 text-3xl font-extrabold text-red-500">
            {services} is Restricted
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            You don't have permission to create a {services} at this time.
          </p>
        </div>
        <div className="mt-8 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center mb-4">
              <HiExclamation className="h-6 w-6 text-yellow-500 mr-3" />
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Access Denied
              </h3>
            </div>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>
                Access to {services} form is currently restricted. Please try
                again after sometime or contact your admin.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
          <HiInformationCircle className="h-5 w-5 text-blue-500 mr-2" />
          <p>
            For more information, please contact your administrator or support
            team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServiceRestrictionLayout;
