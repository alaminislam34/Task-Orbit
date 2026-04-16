"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import PageHeader from "@/components/shared/PageHeader";

export function SellerSettingsPanel() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Account Settings"
        description="Keep your seller workspace calm, focused, and easy to manage."
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">Email updates</p>
                <p className="text-sm text-muted-foreground">Receive order and message updates in your inbox.</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">Desktop alerts</p>
                <p className="text-sm text-muted-foreground">Show quick browser alerts for activity.</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Workspace</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4 text-sm text-muted-foreground">
              This area can later hold timezone, language, and currency preferences.
            </div>
            <div className="flex flex-wrap gap-2">
              <Button>Save Settings</Button>
              <Button variant="outline">Reset</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default SellerSettingsPanel;
