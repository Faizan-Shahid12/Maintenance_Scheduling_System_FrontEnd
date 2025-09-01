import axios from "axios";
import { setLogout, RefreshTokenThunk } from "../Redux/Slicers/LoginSlicer";
import type { MyDispatch } from "../Redux/Store";
import type { LoginResponse } from "../Models/LoginModels/LoginResponse";

const envUrl = import.meta.env.VITE_API_URL as string | undefined;
const defaultBaseUrl = envUrl ?? "http://localhost:5086/api";

const api = axios.create({
  baseURL: defaultBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

export function setupInterceptors(dispatch: MyDispatch) {

    api.interceptors.request.use((config) => 
    {
      const token = localStorage.getItem("AccessToken");
      if (token) 
      {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const isAuthEndpoint = typeof originalRequest?.url === 'string' && originalRequest.url.includes('/Authentication/');

      if (
        error.response?.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        const refreshToken = localStorage.getItem("RefreshToken");

        if (!refreshToken) {
          // Avoid forcing a reload while on the login page or during auth endpoints
          if (window.location.pathname !== '/login' && !isAuthEndpoint) {
            dispatch(setLogout());
            localStorage.clear();
            window.location.href = "/login";
          }
          return Promise.reject(error);
        }

        if (isRefreshing) 
        {
          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve: (token: string) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(api(originalRequest));
              },
              reject: (err) => reject(err),
            });
          });
        }

        isRefreshing = true;

        try 
        {

          const result : LoginResponse = await dispatch(RefreshTokenThunk(refreshToken)).unwrap();
          
          const newToken = result.token;

          if (!newToken) throw new Error("Token refresh failed");

          api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

          processQueue(null, newToken);

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } 
        catch (err) 
        {
          processQueue(err, null);
          // Avoid reload loop on login page or for auth endpoints
          if (window.location.pathname !== '/login' && !isAuthEndpoint) {
            dispatch(setLogout());
            localStorage.clear();
            window.location.href = "/login";
          }
          return Promise.reject(err);
          
        } 
        finally 
        {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
}

export default api;
