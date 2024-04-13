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
};

export const PostCard = ({ id, title, content, poster }: CardProps) => {
  return (
    <Card>
      <CardHeader>
        <Link to={`/posts/$postId`} params={{ postId: id }}>
          <CardTitle>{title}</CardTitle>
        </Link>
        <CardDescription>{poster}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{content}</p>
      </CardContent>
    </Card>
  );
};
