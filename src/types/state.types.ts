export enum AccountType {
  CLIENT = "CLIENT",
  SELLER = "SELLER",
  RECRUITER = "RECRUITER",
  JOB_SEEKER = "JOB_SEEKER",
}


export interface StateContextType {
  signUpModal: boolean;
  setSignUpModal: React.Dispatch<React.SetStateAction<boolean>>;
  signInModal: boolean;
  setSignInModal: React.Dispatch<React.SetStateAction<boolean>>;
  clientModal: boolean;
  setClientModal: React.Dispatch<React.SetStateAction<boolean>>;
  accountType: AccountType;
  setAccountType: React.Dispatch<React.SetStateAction<AccountType>>;
  otpModalOpen: boolean;
  setOtpModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userEmail: string;
  setUserEmail: React.Dispatch<React.SetStateAction<string>>;
}
