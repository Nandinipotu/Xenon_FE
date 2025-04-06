import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";

const BASE_URL = "https://sparkapi-50025700077.development.catalystappsail.in/api/";
//const BASE_URL = "http://localhost:8090/api/";
const getToken = (): string | undefined => Cookies.get("jwt");
const getUserType = (): 'guest' | 'google' | null => {
  const userType = Cookies.get("userType");
  return userType === "guest" || userType === "google" ? userType : null;
};

const instance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    const token = getToken();
    const userType = getUserType();

    console.log("Axios Interceptor → UserType:", userType);
    console.log("Axios Interceptor → Token:", token);

    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
