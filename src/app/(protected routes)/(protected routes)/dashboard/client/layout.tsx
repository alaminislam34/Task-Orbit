import { ClientLayoutComponent } from "./_components/shared/ClientLayout";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <section>
        <ClientLayoutComponent>{children}</ClientLayoutComponent>
      </section>
    </>
  );
}
