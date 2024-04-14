import { api } from "./axios";

type Author = {
  id: string;
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

export const fetchCommentsByAuthor = async (authorId: string) => {
  const response = await api.get<Comment[]>("/comments", {
    params: { authorId },
  });
  return response.data;
};
