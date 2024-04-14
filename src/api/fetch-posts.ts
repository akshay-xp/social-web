import { api } from "./axios";

type Poster = {
  id: string;
  username: string;
};

type Post = {
  id: string;
  title: string;
  content: string;
  poster: Poster;
};

export const fetchPosts = async (posterId?: string) => {
  const response = await api.get<Post[]>("/posts", {
    params: { posterId },
  });
  return response.data;
};

export const fetchPost = async (postId: string) => {
  const response = await api.get<Post>(`/posts/${postId}`);
  return response.data;
};
