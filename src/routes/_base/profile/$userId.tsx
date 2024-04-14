import { fetchCommentsByAuthor } from "@/api/fetch-comments";
import { fetchPosts } from "@/api/fetch-posts";
import { fetchProfile } from "@/api/fetch-profile";
import { PostCard } from "@/components/blocks/post-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toggle } from "@/components/ui/toggle";
import { useAuth } from "@/hooks/use-auth";
import { usePrivateApi } from "@/hooks/use-private-api";
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";

const profileQueryOptions = (userId: string, followerId: string) =>
  queryOptions({
    queryKey: ["profile", { userId, followerId }],
    queryFn: () => fetchProfile(userId, followerId),
  });

export const Route = createFileRoute("/_base/profile/$userId")({
  component: ProfilePage,
  loader: ({ context: { queryClient, auth }, params: { userId } }) =>
    queryClient.ensureQueryData(profileQueryOptions(userId, auth.auth.userId)),
  pendingComponent: () => <div>Loading...</div>,
});

function ProfilePage() {
  const { userId: currentUserId } = useAuth().auth;
  const userId = Route.useParams().userId;
  const profileQuery = useSuspenseQuery(
    profileQueryOptions(userId, currentUserId),
  );
  const profile = profileQuery.data;
  const isFollowing = profile.following.length === 1;
  const postsQuery = useQuery({
    queryKey: ["posts", { userId }],
    queryFn: () => fetchPosts(userId),
    enabled: !!userId,
  });
  const posts = postsQuery.data;
  const commentQuery = useQuery({
    queryKey: ["comments", { userId }],
    queryFn: () => fetchCommentsByAuthor(userId),
    enabled: !!userId,
  });
  const comments = commentQuery.data;
  const api = usePrivateApi();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (isFollowing: boolean) => {
      if (isFollowing) {
        return api.post(`/follow/${userId}`, {
          withCredentials: true,
        });
      } else {
        return api.delete(`/follow/${userId}`, {
          withCredentials: true,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile", { userId, followerId: currentUserId }],
      });
    },
  });

  const handleFollow = () => {
    mutation.mutate(!isFollowing);
  };

  return (
    <div className="gap-6 flex flex-col p-4">
      <div className="flex flex-col gap-2">
        <div>
          <h2 className="capitalize text-3xl">{profile.fullname}</h2>
          <p>@{profile.username}</p>
        </div>
        <p>{profile.bio}</p>
        <div className="flex gap-1">
          {currentUserId && currentUserId !== userId && (
            <Toggle
              variant={"outline"}
              pressed={isFollowing}
              onClick={handleFollow}
            >
              {isFollowing ? "Following" : "Follow"}
            </Toggle>
          )}
          {currentUserId && currentUserId === userId && (
            <Button variant={"outline"}>Edit</Button>
          )}
        </div>
      </div>
      <Tabs defaultValue="posts">
        <TabsList>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
        </TabsList>
        <TabsContent value="posts" className="flex flex-col gap-4">
          {posts?.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              title={post.title}
              content={post.content}
              poster={post.poster.username}
              posterId={post.poster.id}
            />
          ))}
        </TabsContent>
        <TabsContent value="comments" className="gap-4 flex flex-col">
          {comments?.map((comment) => (
            <div key={comment.id} className="space-y-1">
              <Link
                to={"/profile/$userId"}
                params={{ userId: comment.author.id }}
              >
                <h4 className="text-sm font-medium leading-none">
                  {comment.author.username}
                </h4>
              </Link>
              <p className="text-sm text-muted-foreground">{comment.content}</p>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
