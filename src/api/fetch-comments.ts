import { api } from "./axios";

type Author = {
  username: string;
};

type Comment = {
  id: string;
  content: string;
  author: Author;
};

export const fetchComments = async (postId: string) => {
  const response = await api.get<Comment[]>("/comments", {
    params: { postId },
  });
  return response.data;
};
