"use client";

import React, { useState } from "react";
import {
  Settings,
  ShieldCheck,
  CreditCard,
  Bell,
  Globe,
  Database,
  Lock,
  Save,
  Percent,
  RefreshCcw,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const SuperAdminSettingPage = () => {
  const [activeSection, setActiveSection] = useState("general");

  const menuItems = [
    { id: "general", label: "General Settings", icon: Settings },
    { id: "billing", label: "Payments & Fees", icon: CreditCard },
    { id: "security", label: "Security & Auth", icon: ShieldCheck },
    { id: "notification", label: "Notifications", icon: Bell },
    { id: "backup", label: "Database & Backup", icon: Database },
  ];

  return (
    <div className="p-6 space-y-8 bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl">System Configuration</h1>
          <p className="text-muted-foreground font-medium text-sm">
            Fine-tune TaskOrbit's core parameters and logic.
          </p>
        </div>
        <Button className="bg-slate-900 text-white font-bold rounded-lg px-8 flex gap-2">
          <Save className="w-4 h-4" /> Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-3 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm transition-all",
                activeSection === item.id
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </aside>

        {/* Settings Content Area */}
        <main className="lg:col-span-9 space-y-6">
          {/* General Section */}
          {activeSection === "general" && (
            <Card className="border-border/40 shadow-xl shadow-black/5 rounded-lg">
              <CardHeader>
                <CardTitle className="text-lg font-black uppercase">
                  Platform Info
                </CardTitle>
                <CardDescription>
                  Basic identity and localization settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-bold text-xs uppercase tracking-wider">
                      Site Name
                    </Label>
                    <Input
                      defaultValue="TaskOrbit"
                      className="rounded-lg font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-xs uppercase tracking-wider">
                      Support Email
                    </Label>
                    <Input
                      defaultValue="support@taskorbit.com"
                      className="rounded-lg font-medium"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
                  <div className="space-y-0.5">
                    <p className="text-sm font-black">Maintenance Mode</p>
                    <p className="text-xs text-muted-foreground font-medium">
                      Disable public access during updates.
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Billing & Fees Section */}
          {activeSection === "billing" && (
            <Card className="border-border/40 shadow-xl shadow-black/5 rounded-lg">
              <CardHeader>
                <CardTitle className="text-lg font-black uppercase">
                  Revenue & Commission
                </CardTitle>
                <CardDescription>
                  Manage how much the platform earns from every deal.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6 p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                  <div className="p-4 bg-emerald-500 rounded-lg text-white">
                    <Percent className="w-6 h-6" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <Label className="font-black text-xs uppercase text-emerald-700">
                      Service Commission Fee (%)
                    </Label>
                    <div className="flex items-center gap-4">
                      <Input
                        type="number"
                        defaultValue="10"
                        className="w-32 rounded-lg font-black text-xl border-emerald-500/30"
                      />
                      <p className="text-xs text-muted-foreground font-medium italic">
                        Applied to all successfully completed projects.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg space-y-2">
                    <p className="text-sm font-black">Minimum Payout</p>
                    <Input defaultValue="$50.00" className="rounded-lg" />
                  </div>
                  <div className="p-4 border rounded-lg space-y-2">
                    <p className="text-sm font-black">Tax Registration (VAT)</p>
                    <Input defaultValue="15%" className="rounded-lg" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Section */}
          {activeSection === "security" && (
            <Card className="border-border/40 shadow-xl shadow-black/5 rounded-lg">
              <CardHeader>
                <CardTitle className="text-lg font-black uppercase text-rose-600 flex items-center gap-2">
                  <Lock className="w-5 h-5" /> Security Protocol
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    label: "Two-Factor Authentication (2FA)",
                    desc: "Enforce for all Admin accounts.",
                    default: true,
                  },
                  {
                    label: "Force Password Change",
                    desc: "Every 90 days for Sellers.",
                    default: false,
                  },
                  {
                    label: "IP Whitelisting",
                    desc: "Restrict Admin access to specific IPs.",
                    default: true,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 hover:bg-muted/20 transition-colors rounded-lg border border-transparent hover:border-border/50"
                  >
                    <div className="space-y-0.5">
                      <p className="text-sm font-black">{item.label}</p>
                      <p className="text-xs text-muted-foreground font-medium">
                        {item.desc}
                      </p>
                    </div>
                    <Switch defaultChecked={item.default} />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Database Backup Section */}
          {activeSection === "backup" && (
            <Card className="border-border/40 shadow-xl shadow-black/5 rounded-lg overflow-hidden">
              <div className="p-8 bg-slate-900 text-white flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-xl font-black uppercase italic tracking-tighter">
                    Emergency Backup
                  </h3>
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">
                    Last backup: 2 hours ago
                  </p>
                </div>
                <Button className="bg-white text-slate-900 hover:bg-slate-100 font-black rounded-lg px-6 gap-2">
                  <RefreshCcw className="w-4 h-4" /> Run Manual Backup
                </Button>
              </div>
              <CardContent className="p-6">
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg flex gap-4">
                  <RefreshCcw className="w-5 h-5 text-amber-600 animate-spin" />
                  <p className="text-xs font-bold text-amber-700">
                    Automated backup to AWS S3 is currently in progress. System
                    performance might be slightly affected.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default SuperAdminSettingPage;
