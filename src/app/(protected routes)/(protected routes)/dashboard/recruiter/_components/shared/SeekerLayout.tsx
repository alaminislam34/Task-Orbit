"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { RecruiterSidebarComponents } from "./Sidebar";
import { RecruiterHeader } from "./Header";

type RecruiterLayoutProps = {
  children: React.ReactNode;
};

export function RecruiterLayout({ children }: RecruiterLayoutProps) {
  return (
    <SidebarProvider defaultOpen className="max-w-full overflow-x-hidden">
      <RecruiterSidebarComponents />
      <SidebarInset className="min-h-svh min-w-0 max-w-full overflow-x-hidden">
        <RecruiterHeader />
        <section className="flex-1 min-w-0 max-w-full overflow-x-hidden">
          <div className="p-4 h-full">{children}</div>
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}
