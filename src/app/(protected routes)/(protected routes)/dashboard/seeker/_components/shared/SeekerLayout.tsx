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
        <section className="flex-1 min-w-0 max-w-full overflow-x-hidden py-5 md:py-6 lg:py-8">
          <div className="mx-4 min-w-0 max-w-full md:mx-6">{children}</div>
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}
