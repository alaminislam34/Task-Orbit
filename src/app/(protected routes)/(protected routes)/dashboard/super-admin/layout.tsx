import { SuperAdminShell } from "./_components/SuperAdminShell";

export default function SuperAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SuperAdminShell>
      {children}
    </SuperAdminShell>
  );
}
