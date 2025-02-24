import axios from "axios";
import { useEffect } from "react";
import ProjectApiList from "../../api/ProjectApiList";

const useModulePermission = () => {
  const { getMenuByModule } = ProjectApiList();
  const token = window.localStorage.getItem("token");
  const fetchMenuList = () => {
    let requestBody = {
      moduleId: 18,
    };

    axios
      .post(getMenuByModule, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })
      .then(function (response) {
      

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
