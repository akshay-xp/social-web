import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPostSchema } from "@/lib/validations/posts";
import { usePrivateApi } from "@/hooks/use-private-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Props = {
  setIsOpen: (state: boolean) => void;
};

type FormData = z.infer<typeof createPostSchema>;

export const CreatePostForm = ({ setIsOpen }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(createPostSchema),
  });

  const api = usePrivateApi();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (payload: { title: string; content: string }) => {
      return api.post("/posts", payload, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setIsOpen(false);
    },
  });

  async function onSubmit(payload: FormData) {
    mutation.mutate(payload);
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2">
          <div className="">
            <Label htmlFor="title" className="">
              Title
            </Label>
            <Input
              id="title"
              placeholder="Title"
              className=""
              disabled={mutation.isPending}
              {...register("title")}
            />
            {errors?.title && (
              <p className="px-1 text-xs text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>
          <div className="">
            <Label htmlFor="content" className="">
              Content
            </Label>
            <Textarea
              id="content"
              placeholder="Content"
              className=""
              disabled={mutation.isPending}
              {...register("content")}
            />
            {errors?.content && (
              <p className="px-1 text-xs text-red-600">
                {errors.content.message}
              </p>
            )}
          </div>
          <Button type="submit" disabled={mutation.isPending}>
            Save changes
          </Button>
        </div>
      </form>
    </>
  );
};
