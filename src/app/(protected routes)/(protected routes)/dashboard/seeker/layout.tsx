import { SeekerLayout } from "./_components/shared/SeekerLayout";

export default function JobSeekerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section>
      <SeekerLayout>{children}</SeekerLayout>
    </section>
  );
}
