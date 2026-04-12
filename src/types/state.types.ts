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
  forgotPasswordModal: boolean;
  setForgotPasswordModal: React.Dispatch<React.SetStateAction<boolean>>;
  resetPasswordModal: boolean;
  setResetPasswordModal: React.Dispatch<React.SetStateAction<boolean>>;
  otpOrigin: "register" | "forgot_password" | null;
  setOtpOrigin: React.Dispatch<React.SetStateAction<"register" | "forgot_password" | null>>;
  resetOtp: string;
  setResetOtp: React.Dispatch<React.SetStateAction<string>>;
  pendingJobId: string | null;
  setPendingJobId: React.Dispatch<React.SetStateAction<string | null>>;
  userEmail: string;
  setUserEmail: React.Dispatch<React.SetStateAction<string>>;
}
