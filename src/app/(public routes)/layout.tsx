import FooterSection from "@/components/shared/Footer/Footer";
import Navbar from "@/components/shared/Header/Navbar";
import ClientRegisterModal from "@/components/shared/Modals/ClientAuthModal";
import SignInModal from "@/components/shared/Modals/Sign_in";
import SellerAuthModal from "@/components/shared/Modals/SellerAuthModal";
import OtpVerifyModal from "@/components/shared/Modals/OtpVerifyModal";
import ForgotPasswordModal from "@/components/shared/Modals/ForgotPasswordModal";
import ResetPasswordModal from "@/components/shared/Modals/ResetPasswordModal";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <section>
        <Navbar />

        <div className="min-h-[50vh]">{children}</div>
        <SignInModal />
        <ClientRegisterModal/>
        <SellerAuthModal />
        <OtpVerifyModal />
        <ForgotPasswordModal />
        <ResetPasswordModal />
        <FooterSection />
      </section>
    </>
  );
}
