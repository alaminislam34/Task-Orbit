"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser as useStoredUser } from "@/store/useUserStore";
import PageHeader from "@/components/shared/PageHeader";

const field = (label: string, value?: string | null) => (
  <div className="rounded-lg border bg-background p-4">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="mt-1 text-sm font-medium break-words">{value || "-"}</p>
  </div>
);

export function SellerProfilePanel() {
  const user = useStoredUser();

  const initials = useMemo(() => {
    const name = user?.name || "Seller";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [user?.name]);

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="My Profile"
        description="Keep your seller identity, contact details, and public profile details organized."
        actions={<Badge variant="secondary">Seller Account</Badge>}
      />

      <Card>
        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
            {initials}
          </div>
          <div>
            <CardTitle className="text-xl">{user?.name || "Seller User"}</CardTitle>
            <p className="text-sm text-muted-foreground">{user?.email || "No email available"}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {field("Name", user?.name)}
            {field("Email", user?.email)}
            {field("Role", "USER")}
            {field("Account Type", "SELLER")}
          </div>

          <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
            Profile editing is intentionally kept lightweight here. If you want, I can add a full edit form and profile API hook next.
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline">Edit Profile</Button>
            <Button variant="outline">Change Password</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SellerProfilePanel;
