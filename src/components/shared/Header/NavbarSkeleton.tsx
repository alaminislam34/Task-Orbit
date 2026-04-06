import { Skeleton } from "@/components/ui/skeleton";

export const NavbarSkeleton = () => {
  return (
    <div className="flex items-center gap-3">
      {/* Rectangular skeleton for buttons (hidden on mobile) */}
      <Skeleton className="h-9 w-16 rounded-md hidden sm:block" />
      <Skeleton className="h-9 w-20 rounded-md hidden sm:block" />
      {/* Circular skeleton for avatar */}
      <Skeleton className="h-9 w-9 rounded-full" />
    </div>
  );
};
