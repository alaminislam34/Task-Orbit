import ResetPasswordPage from "@/components/module/admin-login/ResetPassword";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Admin Login | Task-Orbit",
  description: "Secure login for Task-Orbit admin panel",
};
const ResetPassword = () => {
  return (
    <div>
      <ResetPasswordPage />
    </div>
  );
};

export default ResetPassword;
