"use client";

import { AccountType, StateContextType } from "@/types/state.types";
import React, { createContext, useContext, useState, ReactNode } from "react";

const StateContext = createContext<StateContextType | undefined>(undefined);

export const StateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [signUpModal, setSignUpModal] = useState<boolean>(false);
  const [signInModal, setSignInModal] = useState<boolean>(false);
  const [clientModal, setClientModal] = useState<boolean>(false);
  const [accountType, setAccountType] = useState<AccountType>(AccountType.JOB_SEEKER);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const states = {
    signUpModal,
    setSignUpModal,
    signInModal,
    setSignInModal,
    clientModal,
    setClientModal,
    accountType,
    setAccountType,
    otpModalOpen,
    setOtpModalOpen,
    userEmail,
    setUserEmail,
  };
  return (
    <StateContext.Provider value={states}>{children}</StateContext.Provider>
  );
};

export const useStateContext = (): StateContextType => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useStateContext must be used within a StateProvider");
  }
  return context;
};
