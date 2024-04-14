import { api } from "./axios";

type Following = {
  followerId: string;
};

type User = {
  id: string;
  email: string;
  username: string;
  fullname: string;
  bio: string;
  following: Following[];
};

export const fetchProfile = async (userId: string, followerId?: string) => {
  const response = await api.get<User>(`/users/${userId}`, {
    params: { followerId },
  });
  return response.data;
};
