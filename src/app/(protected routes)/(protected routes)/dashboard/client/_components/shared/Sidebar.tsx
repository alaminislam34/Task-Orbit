"use client";

import {
  MessageCircleMore,
  ReceiptText,
  FileTextIcon,
  Gauge,
  Settings2,
  UserCheck2,
} from "lucide-react";

import {
  CommonSidebar,
  type SidebarItem,
} from "@/components/shared/Sidebar/Sidebar";

const SIDEBAR_ITEMS: SidebarItem[] = [
  { label: "Dashboard", href: "/dashboard/client", icon: Gauge },
  {
    label: "My Profile",
    href: "/dashboard/client/profile",
    icon: UserCheck2,
  },
  {
    label: "Orders",
    href: "/dashboard/client/orders",
    icon: ReceiptText,
  },
  {
    label: "Queries",
    href: "/dashboard/client/queries",
    icon: FileTextIcon,
  },
  {
    label: "Conversation",
    href: "/dashboard/client/conversation",
    icon: MessageCircleMore,
  },
  { label: "Settings", href: "/dashboard/client/settings", icon: Settings2 },
];

export function ClientSidebarComponents() {
  return (
    <CommonSidebar
      items={SIDEBAR_ITEMS}
      brandTitle="Client"
      brandHref="/dashboard/client"
      brandIcon={<UserCheck2 className="size-4" />}
      footerText="Manage your Client activities from one place."
    />
  );
}
