// import ProjectApiList from "@/Components/api/ProjectApiList";
import axios from "axios";
// import ProjectApiList from '../ApiList/ProjectApiList';
// import ProjectApiList from 'ProjectApiList'
// import ProjectApiList from '../ap'
import { useEffect } from "react";
import ProjectApiList from "../../api/ProjectApiList";

const useModulePermission = () => {
  const { api_getFreeMenuList } = ProjectApiList();
  const token = window.localStorage.getItem("token");
  console.log(token);
  const fetchMenuList = () => {
    let requestBody = {
      moduleId: 18,
    };

    axios
      .post(
        "https://aadrikainfomedia.com/auth/api/menu/by-module",
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      )
      .then(function (response) {
        // console.log("fetched menu list.....", response);
        // return
        // console?.log(
        //   "jjjjjjjjjjdffhdsfd+++++++++====>",
        //   response?.data?.data?.permission?.length
        // );

        // console.log(response, "999999");
        if (response.data.status == true) {
          if (response?.data?.data?.permission?.length == 0) {
            console.log("You are not authorized");
            window.localStorage.clear();
            window.location.href =
              "/ptms?msg=You are not authorized to access this page. Please contact your administrator for more information.";
          }
        } else {
          console.log("false...");
        }
      })
      .catch(function (error) {
        console.log("--2--login error...", error);
      });
  };

  useEffect(() => {
    if (token) {
      fetchMenuList(token);
    }
  }, [token]);
  return null;
};

export default useModulePermission;
