import { api } from "./axios";

type User = {
  id: string;
  email: string;
  username: string;
  fullname: string;
  bio: string;
};

export const fetchProfile = async (userId: string) => {
  const response = await api.get<User>(`/users/${userId}`);
  return response.data;
};
