//////////////////////////////////////////////////////////////////////
// 👉 Author      : R U Bharti
// 👉 Date        : 16th Nov., 2022 | 01:30 PM
// 👉 Project     : JUIDCO
// 👉 Component   : ApiHeader
// 👉 Description : ApiHeader to post json
//////////////////////////////////////////////////////////////////////

export default function ApiHeader() {
  let token2 = window.localStorage.getItem("token");
  let roleId = window.localStorage.getItem("roleId");

  const header = {
    timeout: 60000,
    headers: {
      Authorization: `Bearer ${token2}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      "API-KEY": "eff41ef6-d430-4887-aa55-9fcf46c72c99",
      "role-id": roleId,
    },
  };
  return header;
}
