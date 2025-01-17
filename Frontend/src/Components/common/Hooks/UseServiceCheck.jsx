import { useEffect, useState } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom"/;
// import AxiosInterceptors from "../../Components/GlobalData/AxiosInterceptors";
// import ApiHeader from "../../Components/ApiList/ApiHeader";
// import PropertyApiList from "../../Components/ApiList/PropertyApiList";
import axios from "axios";
import ProjectApiList from "../../api/ProjectApiList";
import ApiHeader from "../../api/ApiHeader";
import { useLocation, useNavigate } from "react-router-dom";

export function UseServiceCheck() {
  const location = useLocation();
  const navigate = useNavigate();
  const [serviceList, SetServiceList] = useState([]);
  const { checkPropertyService, getPermittedServiceList } = ProjectApiList();
  const token = window.localStorage.getItem("token");
  const gettingUlbList = () => {
    axios
      .post(getPermittedServiceList, { moduleId: 18 }, ApiHeader())
      .then((res) => {
        if (res?.data?.status === true) {
          SetServiceList(res?.data?.data || []);
        } else {
          SetServiceList([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching service list:", err);
        SetServiceList([]);
      })
      .finally(() => {});
  };

  useEffect(() => {
    if (token) {
      gettingUlbList();
    }
  }, [token]);

  useEffect(() => {
    const serviceCheck = serviceList.find((service) =>
      location?.pathname.includes(
        service?.path.replace(":id", location.pathname.split("/")[3])
      )
    );
    const isService = serviceCheck
      ? { matched: true, services: serviceCheck.services }
      : { matched: false, services: null };

    if (isService.matched) {
      // ---------FETCH SERVICE PERMISSION API--------------
      axios.post(
        checkPropertyService,
        { path: location.pathname, moduleId: 18 },
        ApiHeader()
      )
        .then(function (response) {
          console.log(response);
          if (!response?.data?.status) {
            navigate(
              `/service-restriction?service=${encodeURIComponent(
                isService.services
              )}`
            );
          }
        })
        .catch(function (error) {
          console.log("error with service permission api", error);
        });

      navigate(
        `/service-restriction?service=${encodeURIComponent(isService.services)}`
      );
    }
  }, [location.pathname, navigate, serviceList]);
}
