import { fetchCommentsByAuthor } from "@/api/fetch-comments";
import { fetchPosts } from "@/api/fetch-posts";
import { fetchProfile } from "@/api/fetch-profile";
import { PostCard } from "@/components/blocks/post-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toggle } from "@/components/ui/toggle";
import {
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";

const profileQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ["profile", { userId }],
    queryFn: () => fetchProfile(userId),
  });

export const Route = createFileRoute("/_base/profile/$userId")({
  component: ProfilePage,
  pendingComponent: () => <div>Loading...</div>,
});

function ProfilePage() {
  const userId = Route.useParams().userId;
  const profileQuery = useSuspenseQuery(profileQueryOptions(userId));
  const profile = profileQuery.data;
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

  return (
    <div className="gap-6 flex flex-col p-4">
      <div className="flex flex-col gap-2">
        <div>
          <h2 className="capitalize text-3xl">{profile.fullname}</h2>
          <p>@{profile.username}</p>
        </div>
        <p>{profile.bio}</p>
        <div className="flex gap-1">
          <Toggle variant={"outline"}>Follow</Toggle>
          <Button variant={"outline"}>Edit</Button>
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
