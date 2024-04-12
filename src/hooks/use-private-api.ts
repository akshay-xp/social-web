import { privateApi } from "@/api/axios";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useRefreshToken } from "./use-refresh-token";
import { useAuth } from "@/hooks/use-auth";

export const usePrivateApi = () => {
  const [isSent, setIsSent] = useState(false);
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    const requestIntercept = privateApi.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    const responseIntercept = privateApi.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const prevRequest = error.config;
        if (error.response?.status === 401 && prevRequest && !isSent) {
          setIsSent(true);
          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return privateApi(prevRequest);
        }
        return Promise.reject(error);
      },
    );

    return () => {
      privateApi.interceptors.request.eject(requestIntercept);
      privateApi.interceptors.response.eject(responseIntercept);
      setIsSent(false);
    };
  }, [auth.accessToken, isSent, refresh]);

  return privateApi;
};
