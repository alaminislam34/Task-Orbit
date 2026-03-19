"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface StateContextType {
  signUpModal: boolean;
  setSignUpModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

export const StateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [signUpModal, setSignUpModal] = useState<boolean>(false);
  const states = {
    signUpModal,
    setSignUpModal,
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
