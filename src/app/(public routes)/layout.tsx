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
        {children}
      </section>
    </>
  );
}
