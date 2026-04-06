"use client";

import Link from "next/link";
import { useStateContext } from "@/providers/StateProvider";
import { AccountType } from "@/types/state.types";

interface DesktopNavProps {
  user: any;
  mounted: boolean;
}

export const DesktopNav = ({ user, mounted }: DesktopNavProps) => {
  const { setAccountType } = useStateContext();

  return (
    <div className="flex items-center gap-6 text-sm font-semibold text-muted-foreground lg:mr-4">
      <Link href="/explore" className="hover:text-primary transition-colors">
        Explore
      </Link>
      <Link href="/career" className="hover:text-primary transition-colors">
        Career
      </Link>
      {mounted && !user && (
        <Link href={"/start_selling"} onClick={() => setAccountType(AccountType.SELLER)}>
          <span className="hover:text-primary transition-colors cursor-pointer">
            Become a Seller
          </span>
        </Link>
      )}
    </div>
  );
};
