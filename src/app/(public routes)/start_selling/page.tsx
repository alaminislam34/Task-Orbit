import FeaturesSection from "@/components/module/Pulic Seller page/FeaturesSection";
// import SellerAuthModal from "@/components/shared/Modals/SellerAuthModal";
import SellerHero from "@/components/module/Pulic Seller page/SellerHero";
import TalentGrowth from "@/components/module/Pulic Seller page/TalentGrowth";
import CategorySelection from "@/components/module/Pulic Seller page/WorkCategory";
import OtpVerifyModal from "@/components/shared/Modals/OtpVerifyModal";
import SellerAuthModal from "@/components/shared/Modals/SellerAuthModal";

const SellerPage = () => {
  return (
    <div>
      <SellerHero />
      <FeaturesSection />
      <CategorySelection />
      <TalentGrowth />
      <SellerAuthModal />
      <OtpVerifyModal />
    </div>
  );
};

export default SellerPage;
