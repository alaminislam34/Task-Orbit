"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Bell,
  Lock,
  ShieldCheck,
  SlidersHorizontal,
  UserPlus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

type SettingsState = {
  requireEmailVerification: boolean;
  requirePhoneVerification: boolean;
  autoApproveNewClients: boolean;
  defaultClientStatus: "ACTIVE" | "PENDING" | "REVIEW";
  healthThreshold: number;
  criticalRiskThreshold: number;
  autoFlagSuspiciousActivity: boolean;
  manualReviewRequired: boolean;
  emailAlertsEnabled: boolean;
  weeklySummaryEnabled: boolean;
  notifyOnNewClients: boolean;
  notifyOnRiskIncidents: boolean;
  webhookUrl: string;
  allowClientDataExport: boolean;
  dataRetentionDays: number;
  gdprDeletionWindowDays: number;
  internalNotes: string;
};

const DEFAULT_SETTINGS: SettingsState = {
  requireEmailVerification: true,
  requirePhoneVerification: false,
  autoApproveNewClients: false,
  defaultClientStatus: "PENDING",
  healthThreshold: 70,
  criticalRiskThreshold: 40,
  autoFlagSuspiciousActivity: true,
  manualReviewRequired: true,
  emailAlertsEnabled: true,
  weeklySummaryEnabled: true,
  notifyOnNewClients: true,
  notifyOnRiskIncidents: true,
  webhookUrl: "",
  allowClientDataExport: false,
  dataRetentionDays: 365,
  gdprDeletionWindowDays: 30,
  internalNotes: "",
};

function SettingsSwitch({
  id,
  label,
  description,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
      <div className="space-y-1">
        <Label htmlFor={id}>{label}</Label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(Boolean(value))}
      />
    </div>
  );
}

export default function ClientSettingsPage() {
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const hasChanges = useMemo(
    () => JSON.stringify(settings) !== JSON.stringify(DEFAULT_SETTINGS),
    [settings],
  );

  const handleSave = async () => {
    try {
      setIsSaving(true);
      // Placeholder: replace with API call when backend is ready.
      await new Promise((resolve) => setTimeout(resolve, 600));
      toast.success("Client settings saved successfully.");
    } catch (error) {
      console.error("Failed to save client settings:", error);
      toast.error("Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    toast.success("Settings reset to defaults.");
  };

  return (
    <div className="w-full min-w-0 max-w-full space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Client Settings
          </h2>
          <p className="text-sm text-muted-foreground">
            Centralized controls for onboarding, risk, notifications, and
            compliance.
          </p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/admin/manage-clients")}
          variant="outline"
          size="sm"
        >
          Back to Clients
        </Button>
      </div>

      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            Configuration Console
          </CardTitle>
          <CardDescription>
            Update client platform behavior by section and save once.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="registration" className="w-full">
            <TabsList
              variant="line"
              className="w-full justify-start overflow-x-auto overflow-y-hidden *:cursor-pointer"
            >
              <TabsTrigger value="registration" className="gap-2">
                <UserPlus className="h-4 w-4" /> Registration
              </TabsTrigger>
              <TabsTrigger value="risk" className="gap-2">
                <ShieldCheck className="h-4 w-4" /> Risk
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="h-4 w-4" /> Notifications
              </TabsTrigger>
              <TabsTrigger value="compliance" className="gap-2">
                <Lock className="h-4 w-4" /> Compliance
              </TabsTrigger>
            </TabsList>

            <TabsContent value="registration" className="mt-6 space-y-4">
              <SettingsSwitch
                id="require-email-verification"
                label="Require Email Verification"
                description="New clients must verify email before full access."
                checked={settings.requireEmailVerification}
                onCheckedChange={(value) =>
                  setSettings((prev) => ({
                    ...prev,
                    requireEmailVerification: value,
                  }))
                }
              />

              <SettingsSwitch
                id="require-phone-verification"
                label="Require Phone Verification"
                description="Require phone verification for high-risk signups."
                checked={settings.requirePhoneVerification}
                onCheckedChange={(value) =>
                  setSettings((prev) => ({
                    ...prev,
                    requirePhoneVerification: value,
                  }))
                }
              />

              <SettingsSwitch
                id="auto-approve-new-clients"
                label="Auto-Approve New Clients"
                description="Automatically activate new clients without manual review."
                checked={settings.autoApproveNewClients}
                onCheckedChange={(value) =>
                  setSettings((prev) => ({
                    ...prev,
                    autoApproveNewClients: value,
                  }))
                }
              />

              <div className="space-y-2">
                <Label>Default Client Status</Label>
                <Select
                  value={settings.defaultClientStatus}
                  onValueChange={(value) =>
                    setSettings((prev) => ({
                      ...prev,
                      defaultClientStatus:
                        value as SettingsState["defaultClientStatus"],
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select default status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="PENDING">Pending Review</SelectItem>
                    <SelectItem value="REVIEW">Manual Review Queue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="risk" className="mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="health-threshold">
                    Health Warning Threshold (%)
                  </Label>
                  <Input
                    id="health-threshold"
                    type="number"
                    min={0}
                    max={100}
                    value={settings.healthThreshold}
                    onChange={(event) => {
                      const nextValue = Number(event.target.value);
                      setSettings((prev) => ({
                        ...prev,
                        healthThreshold: Number.isNaN(nextValue)
                          ? prev.healthThreshold
                          : Math.max(0, Math.min(100, nextValue)),
                      }));
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="critical-risk-threshold">
                    Critical Risk Threshold (%)
                  </Label>
                  <Input
                    id="critical-risk-threshold"
                    type="number"
                    min={0}
                    max={100}
                    value={settings.criticalRiskThreshold}
                    onChange={(event) => {
                      const nextValue = Number(event.target.value);
                      setSettings((prev) => ({
                        ...prev,
                        criticalRiskThreshold: Number.isNaN(nextValue)
                          ? prev.criticalRiskThreshold
                          : Math.max(0, Math.min(100, nextValue)),
                      }));
                    }}
                  />
                </div>
              </div>

              <SettingsSwitch
                id="auto-flag-suspicious"
                label="Auto-Flag Suspicious Activity"
                description="Automatically flag accounts with unusual behavior patterns."
                checked={settings.autoFlagSuspiciousActivity}
                onCheckedChange={(value) =>
                  setSettings((prev) => ({
                    ...prev,
                    autoFlagSuspiciousActivity: value,
                  }))
                }
              />

              <SettingsSwitch
                id="manual-review-required"
                label="Manual Review for Critical Risk"
                description="Force manual review when clients cross critical threshold."
                checked={settings.manualReviewRequired}
                onCheckedChange={(value) =>
                  setSettings((prev) => ({
                    ...prev,
                    manualReviewRequired: value,
                  }))
                }
              />
            </TabsContent>

            <TabsContent value="notifications" className="mt-6 space-y-4">
              <SettingsSwitch
                id="email-alerts"
                label="Enable Email Alerts"
                description="Send email alerts for account and risk events."
                checked={settings.emailAlertsEnabled}
                onCheckedChange={(value) =>
                  setSettings((prev) => ({
                    ...prev,
                    emailAlertsEnabled: value,
                  }))
                }
              />

              <SettingsSwitch
                id="weekly-summary"
                label="Weekly Summary"
                description="Send weekly summary report to admin team."
                checked={settings.weeklySummaryEnabled}
                onCheckedChange={(value) =>
                  setSettings((prev) => ({
                    ...prev,
                    weeklySummaryEnabled: value,
                  }))
                }
              />

              <SettingsSwitch
                id="notify-new-clients"
                label="Notify on New Client Signup"
                description="Instant alert when a new client joins the platform."
                checked={settings.notifyOnNewClients}
                onCheckedChange={(value) =>
                  setSettings((prev) => ({
                    ...prev,
                    notifyOnNewClients: value,
                  }))
                }
              />

              <SettingsSwitch
                id="notify-risk-incidents"
                label="Notify on Risk Incidents"
                description="Send high-priority alerts for suspicious activities."
                checked={settings.notifyOnRiskIncidents}
                onCheckedChange={(value) =>
                  setSettings((prev) => ({
                    ...prev,
                    notifyOnRiskIncidents: value,
                  }))
                }
              />

              <div className="space-y-2">
                <Label htmlFor="webhook-url">Webhook Endpoint (Optional)</Label>
                <Input
                  id="webhook-url"
                  placeholder="https://your-domain.com/hooks/client-alerts"
                  value={settings.webhookUrl}
                  onChange={(event) =>
                    setSettings((prev) => ({
                      ...prev,
                      webhookUrl: event.target.value,
                    }))
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Push client events to external systems.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="compliance" className="mt-6 space-y-4">
              <SettingsSwitch
                id="allow-client-data-export"
                label="Allow Client Data Export"
                description="Permit admins to export client-level data from dashboard."
                checked={settings.allowClientDataExport}
                onCheckedChange={(value) =>
                  setSettings((prev) => ({
                    ...prev,
                    allowClientDataExport: value,
                  }))
                }
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="retention-days">Data Retention (Days)</Label>
                  <Input
                    id="retention-days"
                    type="number"
                    min={30}
                    max={3650}
                    value={settings.dataRetentionDays}
                    onChange={(event) => {
                      const nextValue = Number(event.target.value);
                      setSettings((prev) => ({
                        ...prev,
                        dataRetentionDays: Number.isNaN(nextValue)
                          ? prev.dataRetentionDays
                          : Math.max(30, Math.min(3650, nextValue)),
                      }));
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gdpr-window">
                    GDPR Deletion Window (Days)
                  </Label>
                  <Input
                    id="gdpr-window"
                    type="number"
                    min={1}
                    max={180}
                    value={settings.gdprDeletionWindowDays}
                    onChange={(event) => {
                      const nextValue = Number(event.target.value);
                      setSettings((prev) => ({
                        ...prev,
                        gdprDeletionWindowDays: Number.isNaN(nextValue)
                          ? prev.gdprDeletionWindowDays
                          : Math.max(1, Math.min(180, nextValue)),
                      }));
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="internal-notes">Internal Policy Notes</Label>
                <Textarea
                  id="internal-notes"
                  rows={4}
                  placeholder="Add internal instructions for support/compliance teams..."
                  value={settings.internalNotes}
                  onChange={(event) =>
                    setSettings((prev) => ({
                      ...prev,
                      internalNotes: event.target.value,
                    }))
                  }
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-muted/30 px-4 py-3">
        <p className="text-sm text-muted-foreground">
          {hasChanges
            ? "You have unsaved changes."
            : "All settings are up to date."}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={isSaving || !hasChanges}
          >
            Reset
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !hasChanges}>
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </div>
  );
}
