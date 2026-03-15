import HeroSection from "@/components/module/Public_Home/HeroSection";
import ImpactStats from "@/components/module/Public_Home/ImpackStats";
import MultiRoleSection from "@/components/module/Public_Home/MultiRoleSection";
import CategorySection from "@/components/module/Public_Home/PopularServices";
import ValueProposition from "@/components/module/Public_Home/ValueProposition";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <CategorySection />
      <ValueProposition />
      <MultiRoleSection />
      <ImpactStats />
    </div>
  );
}
