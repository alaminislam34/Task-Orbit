"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SeekerSidebarComponents } from "./Sidebar";
import { SeekerHeader } from "./Header";

type SeekerLayoutProps = {
  children: React.ReactNode;
};

export function SeekerLayout({ children }: SeekerLayoutProps) {
  return (
    <SidebarProvider defaultOpen className="max-w-full overflow-x-hidden">
      <SeekerSidebarComponents />
      <SidebarInset className="min-h-svh min-w-0 max-w-full overflow-x-hidden">
        <SeekerHeader />
        <section className="flex-1 min-w-0 max-w-full overflow-x-hidden h-full ">
          <div className="h-full min-w-0 max-w-full p-4">{children}</div>
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}
