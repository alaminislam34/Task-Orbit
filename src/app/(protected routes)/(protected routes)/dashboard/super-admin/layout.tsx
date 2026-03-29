import { SuperAdminShell } from "./_components/SuperAdminLayout/SuperAdminShell";

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
