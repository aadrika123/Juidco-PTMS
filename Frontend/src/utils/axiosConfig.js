import React from 'react';
  
  const AxiosConfig = () =>  {
	return (
	  <div>
	  </div>
	);
  }
  
  export default AxiosConfig;
  import axios from "axios";
import setHeader from "./axiosInstance";

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
axios.defaults.headers.common["Authorization"] = setHeader();
const UseAxios = () => {
  return;
};

export default UseAxios;
