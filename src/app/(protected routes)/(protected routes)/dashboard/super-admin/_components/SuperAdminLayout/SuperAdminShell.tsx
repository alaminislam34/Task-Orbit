"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SuperAdminSidebar } from "../shared/SuperAdminSidebar";
import { SuperAdminHeader } from "../shared/SuperAdminHeader";

type SuperAdminShellProps = {
  children: React.ReactNode;
};

export function SuperAdminShell({ children }: SuperAdminShellProps) {
  return (
    <SidebarProvider defaultOpen>
      <SuperAdminSidebar />
      <SidebarInset className="min-h-svh">
        <SuperAdminHeader />
        <section className="flex-1 py-5 md:py-6 lg:py-8">
          <div className="mx-4 md:mx-6">{children}</div>
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}
