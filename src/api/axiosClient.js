import axios from "axios";
import { localhost } from "../constants";
import Cookies from "universal-cookie";
// import { ToastError } from "../components/ToastSwal";

const cookies = new Cookies();

const authAxiosTest = () => {
  const token = cookies.get("token_iwaki");

  const axiosTest = axios.create({
    baseURL: localhost,
    // headers: {
    //   Authorization: `Bearer ${token}`,
    // },
  });
  axiosTest.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      return new Promise((resolve, reject) => {
        const oroginReq = error.config;
        console.log(error)
        try {
          if (error.response.status === 400) {
            reject(error.response);
          }
          if (error.response.status === 404 || error.response.status === 500) {
            reject(error.response);
          }
          if (error.response.status === 403) {
            // ToastError.fire({
            //   icon: "error",
            //   title: "Bạn không có quyền xem chức năng này",
            // });
            reject(error.response);
            // message.error("Không tìm thấy dữ liệu");
          } else if (error.response.status === 401 && error.config) {
            oroginReq._retry = true;
            let refresh = cookies.get("refresh_iwaki");
            if (refresh) {
              let res = fetch(token_refresh_URL, {
                method: "POST",
                mode: "cors",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  refresh: cookies.get("refresh_iwaki"),
                }),
              })
                .then((res) => res.json())
                .then((res) => {
                  oroginReq.headers.Authorization = `Bearer ${res.access}`;
                  // cookies.set("token",res.access);
                  return axios(oroginReq);
                })
                .catch(err => { // Hết hạn cookies refresh
                  window.location = "/login"
                  cookies.remove("token_iwaki");
                  cookies.remove("refresh_iwaki");
                });
              resolve(res);
            } else {
              // ToastError.fire({
              //   icon: "error",
              //   title: "You are not signed in.",
              // });
            }
          }
        } catch (e) {
          localStorage.setItem("error_s", "1");
        }
        return error;
        // return Promise.reject(error);
      });
    }
  );
  return axiosTest;
};

export const authAxios = () => authAxiosTest();
