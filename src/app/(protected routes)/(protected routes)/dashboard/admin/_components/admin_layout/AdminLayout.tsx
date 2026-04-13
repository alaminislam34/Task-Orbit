"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { AdminHeader } from "./AdminHeader";
import { AdminSidebarComponents } from "./AdminSidebar";

type AdminShellProps = {
  children: React.ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  return (
    <SidebarProvider defaultOpen className="max-w-full overflow-x-hidden">
      <AdminSidebarComponents />
      <SidebarInset className="min-h-svh min-w-0 max-w-full overflow-x-hidden">
        <AdminHeader />
        <section className="flex-1 min-w-0 max-w-full overflow-x-hidden h-full">
          <div className="p-4 min-w-0 max-w-full h-full">{children}</div>
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}
