import axios, { AxiosInstance } from "axios";

const BASE_URL = "http://localhost:8090/api/";
const OAUTH_URL = "http://localhost:8090/oauth2/";

const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: BASE_URL,
  });

  // Add a request interceptor
  instance.interceptors.request.use(
    (config) => {
      // Add security-related headers if needed
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return instance;
};

// Create a separate OAuth instance using the same function
const createOAuthInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: OAUTH_URL,
  });

  return instance;
};

export default createAxiosInstance();
export const oauthInstance = createOAuthInstance();
