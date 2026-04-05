"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useStateContext } from "@/providers/StateProvider";


import { EmailSignUpForm } from "./EmailSignUpForm";
import { InitialView } from "./InitialView";

const SellerAuthModal = () => {
  const [view, setView] = useState<"initial" | "email">("initial");
  const { signUpModal, setSignUpModal } = useStateContext();

  const handleOpenChange = (open: boolean) => {
    setSignUpModal(open);
    if (!open) {
      setTimeout(() => setView("initial"), 300);
    }
  };

  return (
    <Dialog open={signUpModal} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[450px] w-[95vw] max-h-[90vh] overflow-y-auto p-6 sm:p-8 border-none bg-white/95 backdrop-blur-xl shadow-2xl">
        <AnimatePresence mode="wait">
          {view === "initial" ? (
            <InitialView key="initial" onEmailClick={() => setView("email")} />
          ) : (
            <EmailSignUpForm key="email" onBack={() => setView("initial")} />
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default SellerAuthModal;