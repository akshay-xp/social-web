"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { addCommentSchema } from "@/lib/validations/posts";
import { usePrivateApi } from "@/hooks/use-private-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type CommentFormProps = {
  postId: string;
};

export function CommentForm({ postId }: CommentFormProps) {
  type FormData = z.infer<typeof addCommentSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(addCommentSchema),
  });

  const api = usePrivateApi();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (payload: { content: string; postId: string }) => {
      return api.post("/comments", payload, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      form.reset({ comment: "" });
    },
  });

  async function onSubmit(payload: FormData) {
    mutation.mutate({ content: payload.comment, postId });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add a comment</FormLabel>
              <FormControl>
                <Textarea placeholder="Type your message here." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="float-right">
          Comment
        </Button>
      </form>
    </Form>
  );
}
