import React from 'react';
  
  const AxiosInstance = () =>  {
	return (
	  <div>
	  </div>
	);
  }
  
  export default AxiosInstance;
  import Cookies from "js-cookie";
const setHeader = () => {
  const Auth = Cookies.get("accessToken");
  const t0k3n = `Bearer ${Auth}`;
  return t0k3n;
};

export default setHeader;
