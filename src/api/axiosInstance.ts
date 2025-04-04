import axios, { AxiosHeaders, AxiosInstance } from "axios";
import Cookies from "js-cookie";

// const BASE_URL = "https://sparkapi-50025700077.development.catalystappsail.in/api/";

const BASE_URL = "http://localhost:8090/api/";
const OAUTH_URL = "http://localhost:8090/oauth2/";

const getToken = (): string | undefined => {
  return Cookies.get("jwt");
};

const getUserType = (): 'guest' | 'google' | null => {
  const userType = Cookies.get("userType");
  return userType === "guest" || userType === "google" ? userType : null;
};

const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
  });

  instance.interceptors.request.use(
    (config) => {
      const token = getToken();
      const userType = getUserType();
      console.log("UserType:", userType);
      console.log("Token:", token);

      if (token) {
        config.headers = new AxiosHeaders({
          ...config.headers?.toJSON(),
          Authorization: `Bearer ${token}`,
        });
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return instance;
};

const createOAuthInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: OAUTH_URL,
    withCredentials: true,
  });

  instance.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers = new AxiosHeaders({
          ...config.headers?.toJSON(),
          Authorization: `Bearer ${token}`,
        });
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return instance;
};

export default createAxiosInstance();
export const oauthInstance = createOAuthInstance();
