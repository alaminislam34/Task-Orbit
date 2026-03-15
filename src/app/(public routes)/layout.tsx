import FooterSection from "@/components/shared/Footer/Footer";
import Navbar from "@/components/shared/Header/Navbar";

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
        <FooterSection />
      </section>
    </>
  );
}
