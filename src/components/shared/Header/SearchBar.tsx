import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export const SearchBar = () => {
  return (
    <div className="hidden lg:flex relative max-w-md w-full">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="What service are you looking for today?"
        className="pl-10 h-10 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary w-full"
      />
    </div>
  );
};
