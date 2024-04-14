import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@tanstack/react-router";

type CardProps = {
  id: string;
  title: string;
  content: string;
  poster: string;
  posterId: string;
};

export const PostCard = ({
  id,
  title,
  content,
  poster,
  posterId,
}: CardProps) => {
  return (
    <Card>
      <CardHeader>
        <Link to={`/posts/$postId`} params={{ postId: id }}>
          <CardTitle>{title}</CardTitle>
        </Link>
        <CardDescription>
          <Link to="/profile/$userId" params={{ userId: posterId }}>
            {poster}
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>{content}</p>
      </CardContent>
    </Card>
  );
};
