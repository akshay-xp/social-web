import { Rabbit } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { SearchBar } from "./search-bar";
import { Link } from "@tanstack/react-router";

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex justify-between p-3 items-center">
      <Link to={"/"}>
        <Rabbit size={32} strokeWidth={1} />
      </Link>
      <SearchBar />
      <ul>
        <Link className={buttonVariants({ variant: "default" })} to={"/login"}>
          Login
        </Link>
      </ul>
    </header>
  );
};
