import FeaturesSection from "@/components/module/Pulic Seller page/FeaturesSection";
import SellerHero from "@/components/module/Pulic Seller page/SellerHero";
import TalentGrowth from "@/components/module/Pulic Seller page/TalentGrowth";
import CategorySelection from "@/components/module/Pulic Seller page/WorkCategory";

const SellerPage = () => {
  return (
    <div>
      <SellerHero />
      <FeaturesSection />
      <CategorySelection />
      <TalentGrowth />
    </div>
  );
};

export default SellerPage;
