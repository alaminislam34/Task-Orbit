import { Skeleton } from "@/components/ui/skeleton";

const UsersTableSkeleton = () => {
  return (
    <div className="space-y-3 p-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  );
};

export default UsersTableSkeleton;
