import { SellerLayout } from "./_components/shared/SeekerLayout";

export default function FreelancerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <section>
        <SellerLayout>{children}</SellerLayout>
      </section>
    </>
  );
}
