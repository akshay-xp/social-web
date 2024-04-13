import { api } from "./axios";

type Poster = {
  username: string;
};

type Post = {
  id: string;
  title: string;
  content: string;
  poster: Poster;
};

export const fetchPosts = async () => {
  const response = await api.get<Post[]>("/posts");
  return response.data;
};

export const fetchPost = async (postId: string) => {
  const response = await api.get<Post>(`/posts/${postId}`);
  return response.data;
};
