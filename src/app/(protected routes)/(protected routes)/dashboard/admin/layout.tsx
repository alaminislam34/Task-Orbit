import { AdminShell } from "./_components/admin_layout/AdminLayout";

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <section>
        <AdminShell>{children}</AdminShell>
      </section>
    </>
  );
}
