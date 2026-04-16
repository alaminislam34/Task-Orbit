"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useClientSettings, useUpdateClientSettings } from "@/hooks/api";
import { getApiErrorMessage } from "@/lib/api-error";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function ClientSettingsPanel() {
  const { data, isLoading, isFetching, refetch } = useClientSettings();
  const updateMutation = useUpdateClientSettings();

  const settings = data?.data;

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [timezone, setTimezone] = useState("Asia/Dhaka");
  const [language, setLanguage] = useState("en");
  const [email, setEmail] = useState(true);
  const [push, setPush] = useState(false);
  const [inApp, setInApp] = useState(true);
  const [digestFrequency, setDigestFrequency] = useState("instant");

  useEffect(() => {
    if (!settings) {
      return;
    }

    setName(settings.profile.name || "");
    setImage(settings.profile.image || "");
    setTimezone(settings.profile.timezone || "Asia/Dhaka");
    setLanguage(settings.profile.language || "en");
    setEmail(settings.notifications.email);
    setPush(settings.notifications.push);
    setInApp(settings.notifications.inApp);
    setDigestFrequency(settings.notifications.digestFrequency || "instant");
  }, [settings]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name is required.");
      return;
    }

    try {
      await updateMutation.mutateAsync({
        profile: {
          name: name.trim(),
          image: image.trim(),
          timezone: timezone.trim(),
          language: language.trim(),
        },
        notifications: {
          email,
          push,
          inApp,
          digestFrequency,
        },
      });
      toast.success("Client settings updated.");
      await refetch();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Client Settings"
        description={`Manage profile and preferences.${isFetching ? " Syncing..." : ""}`}
      />

      {isLoading ? (
        <div className="rounded-xl border border-border/70 p-6 text-sm text-muted-foreground">Loading settings...</div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl border border-border/70 bg-background p-4">
            <h2 className="font-semibold">Profile</h2>
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="client-name">Name</Label>
                <Input id="client-name" value={name} onChange={(event) => setName(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-image">Image URL</Label>
                <Input id="client-image" value={image} onChange={(event) => setImage(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-timezone">Timezone</Label>
                <Input id="client-timezone" value={timezone} onChange={(event) => setTimezone(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-language">Language</Label>
                <Input id="client-language" value={language} onChange={(event) => setLanguage(event.target.value)} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-background p-4">
            <h2 className="font-semibold">Notifications</h2>
            <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between rounded-lg border border-border/60 p-3">
                <p className="text-sm">Email</p>
                <Switch checked={email} onCheckedChange={setEmail} />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border/60 p-3">
                <p className="text-sm">Push</p>
                <Switch checked={push} onCheckedChange={setPush} />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border/60 p-3">
                <p className="text-sm">In-app</p>
                <Switch checked={inApp} onCheckedChange={setInApp} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-digest">Digest Frequency</Label>
                <Input id="client-digest" value={digestFrequency} onChange={(event) => setDigestFrequency(event.target.value)} />
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Note: backend currently guarantees persistence for profile name/image/timezone fields.
            </p>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => void handleSave()} disabled={updateMutation.isPending}>
              Save Settings
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
