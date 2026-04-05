"use client";

import { Button } from "@/components/ui/button";
import { useStateContext } from "@/providers/StateProvider";
import { useRouter } from "next/navigation";
import { AccountType } from "@/types/state.types";

export const AuthButtons = () => {
  const { setSignInModal, setSignUpModal, setAccountType } = useStateContext();
  const router = useRouter();

  const handleJoin = () => {
    setAccountType(AccountType.SELLER);
    setSignUpModal(true);
    router.push("/start_selling?source=top_nav");
  };

  return (
    <div className="flex items-center gap-3">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setSignInModal(true)} 
        className="font-semibold px-4"
        aria-label="Sign In"
      >
        Sign In
      </Button>
      <Button 
        size="sm" 
        className="px-6 font-bold shadow-sm" 
        onClick={handleJoin}
        aria-label="Sign Up"
      >
        Sign Up
      </Button>
    </div>
  );
};
