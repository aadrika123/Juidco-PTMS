import BackendUrl from "./BackendUrl";

export default function ProjectApiList() {
  let baseUrl = BackendUrl;
  let apiList = {
    //heartBeatApi
    api_checkHeartBeat: `${baseUrl}/api/heartbeat`,
    // 1 API TO MENU LIST
    api_getFreeMenuList: `${baseUrl}/api/menu/by-module`,
    //WARD LIST
    api_login: `${baseUrl}/api/login`,

    // 19 API TO GET WORKFLOW BASIC INFO LIKE PERMISSIONS/WORKFLOW-CANDIDATES
    api_workflowInfo: `${baseUrl}/api/workflow/role-map/workflow-info`,

    // 21 API TO POST DEPARTMENTAL COMMUNICATION DATA
    api_postDepartmental: `${baseUrl}/api/post-custom-data`,

    // 22 API TO TO GET SAF DEPARTMENTAL COMMUNICATION LIST
    api_getDepartmentalData: `${baseUrl}/api/get-all-custom-tab-data`,

    //application demand detail in demand screen
    api_verifyDocuments: `${baseUrl}/api/workflows/document/verify-reject`,
    //application demand detail in demand screen
    api_changePassword: `${baseUrl}/api/change-password`,

    // API TO EDIT ADMIN PROFILE
    api_editAdminProfile: `${baseUrl}/api/edit-my-profile`,
    // API TO FETCH JSK DASHBOARD RECENT APPLICATIONS AND RECENT PAYMENTS

    // API TO FETCH NOTIFICATION DATA
    api_getNotification: `${baseUrl}/api/get-user-notifications`,
    // API TO CREATE NOTIFICATION DATA
    api_createNotification: `${baseUrl}/api/dashboard/jsk/prop-dashboard`,
    // API TO DELETE NOTIFICATION DATA
    api_deleteNotification: `${baseUrl}/api/dashboard/jsk/prop-dashboard`,
    api_deleteNotification: `${baseUrl}/api/dashboard/jsk/prop-dashboard`,

    ///////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////

    api_fetchByStatus: `${baseUrl}/report`,

    api_fetchByScheduledconductor: `${baseUrl}/scheduled/receipts`,

    api_getValidationTrans: `${baseUrl}/Cash/validate`,

    api_fetchTransactionDetails: `${baseUrl}/transactions/receipts`,

    api_postUpdateStatus: `${baseUrl}/report/validate`,

    checkPropertyService: `${baseUrl}/get/services-by-module`,
    getPermittedServiceList: `${baseUrl}/get/services-b-ulb-id`,
  };

  return apiList;
}
