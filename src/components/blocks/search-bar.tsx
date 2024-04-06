import { Search } from "lucide-react";
import { Input } from "../ui/input";

export const SearchBar = () => {
  return (
    <div className="flex items-center gap-2 w-full max-w-lg">
      <Search strokeWidth={1} />
      <Input type="search" placeholder="Search Rabbit" autoComplete="off" />
    </div>
  );
};
