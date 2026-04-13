"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SellerSidebarComponents } from "./Sidebar";
import { SellerHeader } from "./Header";

type SellerLayoutProps = {
  children: React.ReactNode;
};

export function SellerLayout({ children }: SellerLayoutProps) {
  return (
    <SidebarProvider defaultOpen className="max-w-full overflow-x-hidden">
      <SellerSidebarComponents />
      <SidebarInset className="min-h-svh min-w-0 max-w-full overflow-x-hidden">
        <SellerHeader />
        <section className="flex-1 min-w-0 max-w-full overflow-x-hidden">
          <div className="p-4 h-full">{children}</div>
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}
