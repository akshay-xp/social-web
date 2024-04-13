import * as z from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1).max(70),
  content: z.string().min(1).max(280),
});

export const addCommentSchema = z.object({
  comment: z.string().min(1).max(160),
});
