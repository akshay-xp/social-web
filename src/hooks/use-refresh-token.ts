import { api } from "@/api/axios";
import { useAuth } from "@/hooks/use-auth";

export const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await api.get("auth/refresh", {
      withCredentials: true,
    });
    setAuth({ accessToken: response.data.accessToken });
    return response.data.accessToken;
  };

  return refresh;
};
