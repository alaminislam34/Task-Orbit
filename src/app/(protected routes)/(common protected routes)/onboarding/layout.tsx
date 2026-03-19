import OnboardingNavbar from "@/components/module/Onboarding/OnboardingNavbar";

export default function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <section>
        <OnboardingNavbar />
        {children}
      </section>
    </>
  );
}
