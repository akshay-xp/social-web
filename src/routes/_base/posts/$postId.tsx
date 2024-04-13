import { fetchComments } from "@/api/fetch-comments";
import { fetchPost } from "@/api/fetch-posts";
import { PostCard } from "@/components/blocks/post-card";
import { CommentForm } from "@/components/forms/comment-form";
import { useAuth } from "@/hooks/use-auth";
import {
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

const postQueryOptions = (postId: string) =>
  queryOptions({
    queryKey: ["post", { postId }],
    queryFn: () => fetchPost(postId),
  });

export const Route = createFileRoute("/_base/posts/$postId")({
  component: Post,
  loader: ({ context: { queryClient }, params: { postId } }) =>
    queryClient.ensureQueryData(postQueryOptions(postId)),
  pendingComponent: () => <div>Loading...</div>,
});

function Post() {
  const isAuthenticated = useAuth().auth.accessToken;
  const postId = Route.useParams().postId;
  const postQuery = useSuspenseQuery(postQueryOptions(postId));
  const post = postQuery.data;
  const commentQuery = useQuery({
    queryKey: ["comments"],
    queryFn: () => fetchComments(postId),
  });
  const comments = commentQuery.data;

  return (
    <div className="gap-6 flex flex-col p-4">
      <PostCard
        id={post.id}
        title={post.title}
        content={post.content}
        poster={post.poster.username}
      />
      {isAuthenticated && <CommentForm postId={postId} />}
      {comments
        ? comments.map((comment) => (
            <div key={comment.id} className="space-y-1">
              <h4 className="text-sm font-medium leading-none">
                {comment.author.username}
              </h4>
              <p className="text-sm text-muted-foreground">{comment.content}</p>
            </div>
          ))
        : null}
    </div>
  );
}
