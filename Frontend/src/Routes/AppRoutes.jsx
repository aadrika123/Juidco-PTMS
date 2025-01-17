// AppRoutes.js
import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Main from "../Components/Main";
import Recipt from "../Components/Recipt";
import BusRegistration from "../Components/Registration/BusRegistration";
import ConductorRegistration from "../Components/Registration/ConductorRegistration";
import RegisterMain from "../Components/Registration/RegisterMain";
import ChangeScheduling from "../Components/Registration/ChangeScheduling";
import Report_Generation from "../Components/Registration/Report_Generation";
import Conductor_dashboard from "../Components/Conductor/Conductor_dashboard";
import Ticket_check from "../Components/Conductor/Ticket_check";
import Conductor_Report_Generation from "../Components/Conductor/Conductor_Report_Generation";
import Bus_Report_Generation from "../Components/Registration/Bus_Report_Generation";
import Conductor_report_page from "../Components/Registration/Report/Conductor_report_page";
import Bus_report_page from "../Components/Registration/Report/Bus_report_page";
import Bus_Onboarding from "../Components/Registration/Onboarding/Bus_Onboarding";
import Conductor_Onboarding from "../Components/Registration/Onboarding/Conductor_Onboarding";
import ChaneScheduling_main from "../Components/Registration/ChangeScheduling/ChaneScheduling_main";
import ReportGeneration_main from "../Components/Registration/ReportGeneration/ReportGeneration_main";
import Login_main from "../Components/Login/Login_main";
import PrivateRoute from "./PrivateRoute";
import No_access from "../Components/Login/No_access";
import Dashboard from "../Components/Dashboard/Dashboard";
import Dashboard_data from "../Components/Dashboard/Dashboard_data";
import ProtectedApproute from "./ProtectedApproute";
import ReportBus_recipt from "../Components/Registration/ReportGeneration/ReportBus_recipt";
import ReportConductor_Bus from "../Components/Registration/ReportGeneration/ReportConductor_Bus";
import All_report_conductor from "../Components/Conductor/All_report_conductor";
import Collection_Report from "../Components/Tables/Collection_Report";
// import AccountantDashboard from "../Components/Accountant/AccountantDashboard";
// import ConductorDetails from "../Components/Accountant/ConductorDetails";
import Conductor_CashValidation from "../Components/Conductor/Conductor_CashValidation";
import AccountantViewPage from "../Components/Accountant/AccountantViewPage.jsx";
import AccountantViews from "../Components/Accountant/AccountantViews.jsx";
import ValidateTransaction from "../Components/Accountant/ValidateTransaction.jsx";
import BusOnboarding_View from "../Components/Registration/ViewOnboarding/BusOnboarding_View.jsx";
import ConductorOnboarding_View from "../Components/Registration/ViewOnboarding/ConductorOnboarding_View.jsx";
import ServiceRestrictionLayout from "../Components/pages/error/ServiceRestrictionLayout.jsx";

const AppRoutes = ({ access_token, userType }) => {
  console.log("AppRoutes with token >>> ", access_token, userType);

  return (
    <Routes>
      <Route path="/" element={<Login_main />} />
      <Route
        path="/service-restriction"
        // element={<ServiceRestrictionLayout />}
        element={<PrivateRoute element={ServiceRestrictionLayout} />}
      />
      {access_token && userType === "Admin" && (
        <>
          <Route
            path="/Bus-onboarding"
            element={<PrivateRoute element={Bus_Onboarding} />}
          />
          <Route
            path="/Bus-onboarding-view"
            element={<PrivateRoute element={BusOnboarding_View} />}
          />
          <Route
            path="/Conductor-onboarding"
            element={<PrivateRoute element={Conductor_Onboarding} />}
          />
          <Route
            path="/Conductor-onboarding-view"
            element={<PrivateRoute element={ConductorOnboarding_View} />}
          />
          <Route
            path="/ConductorRegistration"
            element={<PrivateRoute element={ConductorRegistration} />}
          />
          <Route
            path="/ChangeScheduling-Main"
            element={<PrivateRoute element={ChaneScheduling_main} />}
          />
          <Route
            path="/chagneScheduling"
            element={<PrivateRoute element={ChangeScheduling} />}
          />
          <Route
            path="/reportGeneration"
            element={<PrivateRoute element={Report_Generation} />}
          />
          <Route
            path="/BusreportGeneration"
            element={<PrivateRoute element={Bus_Report_Generation} />}
          />
          <Route
            path="/Conductor_report_page"
            element={<PrivateRoute element={Conductor_report_page} />}
          />
          <Route
            path="/Bus_report_page"
            element={<PrivateRoute element={Bus_report_page} />}
          />
          <Route
            path="/ReportGeneration-main"
            element={<PrivateRoute element={ReportGeneration_main} />}
          />

          <Route
            path="/Collection-report"
            element={<PrivateRoute element={Collection_Report} />}
          />

          <Route
            path="registerBus"
            element={
              <PrivateRoute
                element={<PrivateRoute element={BusRegistration} />}
              />
            }
          />
          {/* <Route
            path="/service-restriction"
            element={<ServiceRestrictionLayout />}
          /> */}
          <Route
            path="/ReportBus_recipt/:id/:Selected_Date/:End_Date"
            element={<PrivateRoute element={ReportBus_recipt} />}
          />
          <Route
            path="/ReportConductor_recipt/:Cid/:Selected_Date?/:End_Date?"
            element={<PrivateRoute element={ReportConductor_Bus} />}
          />
          <Route
            path="dashboard"
            element={<PrivateRoute element={Dashboard_data} />}
            // element={<Dashboard_data/>}
          />
          <Route path="/*" element={<No_access />} />
        </>
      )}

      {access_token && userType === "TC" && (
        <>
          {/* <Route
            path="/service-restriction"
            element={<ServiceRestrictionLayout />}
          /> */}
          <Route
            path="/conductor_dashboard"
            element={<ProtectedApproute element={Conductor_dashboard} />}
          />
          <Route path="/main" element={<ProtectedApproute element={Main} />} />
          <Route path="/recipt" element={<PrivateRoute element={Recipt} />} />
          <Route
            path="/ticket_check"
            element={<ProtectedApproute element={Main} />}
          />
          <Route
            path="/ReportConductor_recipt"
            element={<All_report_conductor />}
          />
          <Route
            path="/conductor_Report"
            element={
              <ProtectedApproute element={Conductor_Report_Generation} />
            }
          />
          <Route
            path="/conductor_CashValidation"
            element={<ProtectedApproute element={Conductor_CashValidation} />}
          />
          <Route path="/*" element={<No_access />} />

          {/* .....................accountant */}
          {/* <Route
            path="/accountant-view"
            element={
              <ProtectedApproute element={AccountantViewPage} />
            }
          />
          <Route
            path="/accountantListView"
            element={
              <ProtectedApproute element={AccountantViewPage} />
            }
          />
          <Route
            path="/accountantViews/:id"
            element={
              <ProtectedApproute element={AccountantViews} />
            }
          />

          <Route
            path="/ValidationListView"
            element={
              <ProtectedApproute element={ValidateTransaction} />
            }
          /> */}
          {/* {path: "/accountant-view", element: <AccountantViewPage /> },,



          {
            path: "/accountantListView",
          element: <AccountantViewPage />,
    },
          {
            path: "/accountantViews/:id",
          element: <AccountantViews />,
    }
          ,
          {
            path: "/ValidationListView",
          element: <ValidateTransaction />,
    }, */}
        </>
      )}

      {access_token && userType === "Accountant" && (
        <>
          {/* <Route
            path="/service-restriction"
            element={<ServiceRestrictionLayout />}
          /> */}
          <Route
            path="/accountant-view"
            element={<ProtectedApproute element={AccountantViewPage} />}
          />
          <Route
            path="/accountantListView"
            element={<ProtectedApproute element={AccountantViewPage} />}
          />
          <Route
            path="/accountantViews/:id"
            element={<ProtectedApproute element={AccountantViews} />}
          />

          <Route
            path="/ValidationListView"
            element={<ProtectedApproute element={ValidateTransaction} />}
          />
        </>
      )}
    </Routes>
  );
};

export default AppRoutes;
