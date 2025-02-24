//////////////////////////////////////////////////////////////////////
// 👉 Author      : R U Bharti
// 👉 Date        : 16th Nov., 2022 | 01:30 PM
// 👉 Project     : JUIDCO
// 👉 Component   : ApiHeader2
// 👉 Description : ApiHeader2 to post documents
//////////////////////////////////////////////////////////////////////

export default function ApiHeader2() {
  let token2 = window.localStorage.getItem("token");
  let roleId = window.localStorage.getItem("roleId");

  const header = {
    headers: {
      Authorization: `Bearer ${token2}`,
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
      "API-KEY": "eff41ef6-d430-4887-aa55-9fcf46c72c99",
      "role-id": roleId,
    },
  };
  return header;
}
