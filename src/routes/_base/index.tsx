import { fetchPosts } from "@/api/fetch-posts";
import { PostCard } from "@/components/blocks/post-card";

import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

const postsQueryOptions = queryOptions({
  queryKey: ["posts"],
  queryFn: () => fetchPosts(),
});

export const Route = createFileRoute("/_base/")({
  component: IndexPage,
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(postsQueryOptions),
});

function IndexPage() {
  const postsQuery = useSuspenseQuery(postsQueryOptions);
  const posts = postsQuery.data;

  return (
    <div className="gap-4 flex flex-col p-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          id={post.id}
          title={post.title}
          content={post.content}
          poster={post.poster.username}
        />
      ))}
    </div>
  );
}
