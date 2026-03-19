export interface StateContextType {
  signUpModal: boolean;
  setSignUpModal: React.Dispatch<React.SetStateAction<boolean>>;
  signInModal: boolean;
  setSignInModal: React.Dispatch<React.SetStateAction<boolean>>;
  clientModal: boolean;
  setClientModal: React.Dispatch<React.SetStateAction<boolean>>;
}
