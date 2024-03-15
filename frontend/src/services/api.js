import axios from "axios";
import TokenService from "./token.service";

// const instance = axios.create({
//     baseURL: "http://localhost:8080/api/v1",
//     headers: {
//         "Content-Type": "application/json",
//     },
// });

// instance.interceptors.request.use(
//     (config) => {
//         const token = TokenService.getLocalAccessToken();
//         if (token) {
//             config.headers["Authorization"] = 'Bearer ' + token;  // for Spring Boot back-end
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// instance.interceptors.response.use(
//     (res) => {
//         return res;
//     },
//     async (err) => {
//         const originalConfig = err.config;

//         if (originalConfig.url !== "/auth/signin" && err.response) {
//             // Access Token was expired
//             if (err.response.status === 401 && !originalConfig._retry) {
//                 originalConfig._retry = true;

//                 try {
//                     const rs = await instance.post("/auth/refreshtoken", {
//                         refreshToken: TokenService.getLocalRefreshToken(),
//                     });

//                     const { accessToken } = rs.data;
//                     TokenService.updateLocalAccessToken(accessToken);

//                     return instance(originalConfig);
//                 } catch (_error) {
//                     return Promise.reject(_error);
//                 }
//             }
//         }

//         return Promise.reject(err);
//     }
// );

// export default instance;

export function fetchWithInterceptor(url, options) {

  return fetch("http://localhost:8080" + url, options).then((response) => {
    // Check if the response contains the 'newToken' header and update the token in localStorage
    const newToken = response.headers.get("New-Token");

    if (
      newToken !== null &&
      newToken !== TokenService.getLocalAccessToken()
    ) {
      TokenService.updateLocalAccessToken(newToken);
      alert("Clinic plan changed!");
      window.location.reload();
    }

    return response;
  });
}
