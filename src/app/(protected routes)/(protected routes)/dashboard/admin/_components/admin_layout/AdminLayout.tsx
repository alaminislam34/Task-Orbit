"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { AdminHeader } from "./AdminHeader";
import { AdminSidebarComponents } from "./AdminSidebar";

type AdminShellProps = {
  children: React.ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  return (
    <SidebarProvider defaultOpen>
      <AdminSidebarComponents />
      <SidebarInset className="min-h-svh">
        <AdminHeader />
        <section className="flex-1 py-5 md:py-6 lg:py-8">
          <div className="mx-4 md:mx-6">{children}</div>
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}
