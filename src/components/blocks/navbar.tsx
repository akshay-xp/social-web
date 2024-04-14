import { Bell, CircleUserRound, Rabbit } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { SearchBar } from "./search-bar";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { CreateDialog } from "./create-dialog";

export const Navbar = () => {
  const { accessToken, userId } = useAuth().auth;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex justify-between p-3 items-center">
      <Link to={"/"}>
        <Rabbit size={32} strokeWidth={1} />
      </Link>
      <SearchBar />
      <ul className="flex items-center gap-2">
        {!accessToken ? (
          <Link
            className={buttonVariants({ variant: "default" })}
            to={"/login"}
          >
            Login
          </Link>
        ) : (
          <>
            <CreateDialog />
            <Button variant={"ghost"}>
              <Bell className="w-5 h-5" />
            </Button>
            <Link to="/profile/$userId" params={{ userId }}>
              <CircleUserRound />
            </Link>
          </>
        )}
      </ul>
    </header>
  );
};
