"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import {
  useJobSeekerSettings,
  useUpdateJobSeekerSettings,
} from "@/hooks/api";
import { getApiErrorMessage } from "@/lib/api-error";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const VISIBILITY_OPTIONS = ["PUBLIC", "PRIVATE", "CONNECTIONS_ONLY"] as const;

export default function SeekerSettingsForm() {
  const { data, isLoading, refetch } = useJobSeekerSettings();
  const updateSettings = useUpdateJobSeekerSettings();

  const settings = data?.data;

  const [timezone, setTimezone] = useState("Asia/Dhaka");
  const [language, setLanguage] = useState("en");
  const [jobAlertFrequency, setJobAlertFrequency] = useState("daily");
  const [visibility, setVisibility] = useState<(typeof VISIBILITY_OPTIONS)[number]>("PUBLIC");
  const [emailNotifications, setEmailNotifications] = useState(true);

  useEffect(() => {
    if (!settings) {
      return;
    }

    setTimezone(settings.timezone || "Asia/Dhaka");
    setLanguage(settings.language || "en");
    setJobAlertFrequency(settings.jobAlertFrequency || "daily");
    setVisibility((settings.visibility as (typeof VISIBILITY_OPTIONS)[number]) || "PUBLIC");
    setEmailNotifications(Boolean(settings.emailNotifications));
  }, [settings]);

  const isSubmitting = updateSettings.isPending;

  const validationError = useMemo(() => {
    if (!timezone.trim()) {
      return "Timezone is required.";
    }

    if (!language.trim()) {
      return "Language is required.";
    }

    return null;
  }, [timezone, language]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      await updateSettings.mutateAsync({
        timezone: timezone.trim(),
        language: language.trim(),
        emailNotifications,
        jobAlertFrequency: jobAlertFrequency.trim(),
        visibility,
      });
      toast.success("Settings updated successfully.");
      await refetch();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>
          Manage alert preferences and account visibility.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="rounded-xl border border-border/70 p-6 text-sm text-muted-foreground">
            Loading settings...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-xl border border-border/70 p-4 space-y-4">
              <h3 className="text-sm font-medium text-foreground">Regional Preferences</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    value={timezone}
                    onChange={(event) => setTimezone(event.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Input
                    id="language"
                    value={language}
                    onChange={(event) => setLanguage(event.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border/70 p-4 space-y-4">
              <h3 className="text-sm font-medium text-foreground">Visibility and Alerts</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="alert-frequency">Job Alert Frequency</Label>
                  <Input
                    id="alert-frequency"
                    value={jobAlertFrequency}
                    onChange={(event) => setJobAlertFrequency(event.target.value)}
                    disabled={isSubmitting}
                    placeholder="daily"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="visibility">Profile Visibility</Label>
                  <select
                    id="visibility"
                    className="h-10 w-full rounded-md border bg-transparent px-3 text-sm"
                    value={visibility}
                    onChange={(event) =>
                      setVisibility(event.target.value as (typeof VISIBILITY_OPTIONS)[number])
                    }
                    disabled={isSubmitting}
                  >
                    {VISIBILITY_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option.replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="rounded-lg border border-border/70 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive job and application updates by email.
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={(checked) => setEmailNotifications(Boolean(checked))}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end border-t pt-2">
              <Button type="submit" disabled={Boolean(validationError) || isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 size-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
