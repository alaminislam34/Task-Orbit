"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ClientSidebarComponents } from "./Sidebar";
import { ClientHeader } from "./Header";

type ClientLayoutProps = {
  children: React.ReactNode;
};

export function ClientLayoutComponent({ children }: ClientLayoutProps) {
  return (
    <SidebarProvider defaultOpen className="max-w-full overflow-x-hidden">
      <ClientSidebarComponents />
      <SidebarInset className="min-h-svh min-w-0 max-w-full overflow-x-hidden">
        <ClientHeader />
        <section className="flex-1 min-w-0 max-w-full overflow-x-hidden">
          <div className="p-4 h-full">{children}</div>
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}
