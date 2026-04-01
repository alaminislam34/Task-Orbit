import { AdminShell } from "./_components/admin_layout/AdminLayout";

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <section className="min-w-0 max-w-full overflow-x-hidden">
        <AdminShell>{children}</AdminShell>
      </section>
    </>
  );
}
