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
        <section className="flex-1 min-w-0 max-w-full overflow-x-hidden h-full">
          <div className="p-4 h-full">{children}</div>
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}
