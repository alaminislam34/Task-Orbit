"use client";

import React from "react";
import {
  Users,
  FolderKanban,
  BriefcaseBusiness,
  AlertCircle,
  Clock,
  Zap,
  Activity,
  DollarSign,
} from "lucide-react";

import { StatCard } from "./StatCard";
import { ActivityFeed, type ActivityItem } from "./ActivityFeed";
import { SystemStatus, type SystemStatus as SystemStatusType } from "./SystemStatus";
import { QuickActions, type QuickActionItem } from "./QuickActions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const mockStats = [
  {
    label: "Total Users",
    value: "24,890",
    change: 12.8,
    icon: <Users className="w-5 h-5" />,
  },
  {
    label: "Active Projects",
    value: "3,472",
    change: 4.3,
    icon: <FolderKanban className="w-5 h-5" />,
  },
  {
    label: "Open Jobs",
    value: "1,209",
    change: 7.1,
    icon: <BriefcaseBusiness className="w-5 h-5" />,
  },
  {
    label: "Monthly Revenue",
    value: "$96,420",
    change: 9.6,
    icon: <DollarSign className="w-5 h-5" />,
  },
];

const mockActivityItems: ActivityItem[] = [
  {
    id: "1",
    title: "New recruiter onboarded",
    description: "John Smith completed verification",
    timestamp: "2 minutes ago",
    status: "success",
    icon: <Users className="w-4 h-4" />,
    action: "View Profile",
  },
  {
    id: "2",
    title: "High-value project posted",
    description: "Project worth $15,000 created",
    timestamp: "18 minutes ago",
    status: "success",
    icon: <FolderKanban className="w-4 h-4" />,
    action: "Review Project",
  },
  {
    id: "3",
    title: "Payment flagged for review",
    description: "Transaction exceeds threshold",
    timestamp: "1 hour ago",
    status: "warning",
    icon: <AlertCircle className="w-4 h-4" />,
    action: "Review Payment",
  },
  {
    id: "4",
    title: "Dispute resolution completed",
    description: "Case #4521 resolved successfully",
    timestamp: "3 hours ago",
    status: "success",
    icon: <Activity className="w-4 h-4" />,
  },
  {
    id: "5",
    title: "System maintenance scheduled",
    description: "Planned downtime: 2:00 AM UTC",
    timestamp: "5 hours ago",
    status: "pending",
    icon: <Clock className="w-4 h-4" />,
  },
];

const mockSystemStatus: SystemStatusType[] = [
  {
    label: "API Uptime",
    value: "99.98%",
    status: "healthy",
    icon: <Zap className="w-5 h-5 text-emerald-500" />,
  },
  {
    label: "Payment Queue",
    value: "18 pending",
    status: "healthy",
    icon: <Clock className="w-5 h-5 text-emerald-500" />,
  },
  {
    label: "Moderation Queue",
    value: "42 items",
    status: "warning",
    icon: <AlertCircle className="w-5 h-5 text-amber-500" />,
  },
  {
    label: "Database Health",
    value: "98.2%",
    status: "healthy",
    icon: <Activity className="w-5 h-5 text-emerald-500" />,
  },
];

const mockQuickActions: QuickActionItem[] = [
  {
    id: "approve-user",
    label: "Approve Pending Users",
    icon: <Users className="w-5 h-5" />,
    description: "Review and approve 12 new accounts",
  },
  {
    id: "process-payments",
    label: "Process Payments",
    icon: <DollarSign className="w-5 h-5" />,
    description: "Release 8 pending payouts",
    variant: "secondary",
  },
  {
    id: "review-disputes",
    label: "Review Disputes",
    icon: <AlertCircle className="w-5 h-5" />,
    description: "Handle 3 open support tickets",
    variant: "warning",
  },
];

export const SuperAdminDashboardContent = () => {
  const handleQuickAction = (id: string) => {
    console.log("Quick action triggered:", id);
    // TODO: Implement actual action handlers
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <section className="space-y-1">
        <h1 className="text-3xl font-black tracking-tight text-foreground">
          Admin Dashboard
        </h1>
        <p className="text-sm text-muted-foreground md:text-base">
          Monitor platform health, manage operations, and review growth metrics in real-time.
        </p>
      </section>

      {/* KPI Grid */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {mockStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      {/* Main Content Grid */}
      <section className="grid gap-6 lg:grid-cols-3">
        {/* Activity Feed */}
        <div className="lg:col-span-2 rounded-xl border border-border/60 bg-card p-5 md:p-6">
          <ActivityFeed
            items={mockActivityItems}
            title="Recent Platform Activity"
            subtitle="Real-time highlights across users, jobs, and transactions"
          />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* System Status */}
          <div className="rounded-xl border border-border/60 bg-card p-5 md:p-6">
            <SystemStatus items={mockSystemStatus} />
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl border border-border/60 bg-card p-5 md:p-6">
            <QuickActions
              items={mockQuickActions}
              onAction={handleQuickAction}
            />
          </div>
        </div>
      </section>

      {/* Bottom Section - Additional Metrics */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* User Growth Chart Placeholder */}
        <Card className="gap-3">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>
              Monthly active users over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 rounded-lg bg-linear-to-br from-emerald-500/5 to-blue-500/5 border border-border/40 flex items-center justify-center">
              <div className="text-center">
                <Activity className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-xs text-muted-foreground">
                  Chart visualization coming soon
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Analytics Placeholder */}
        <Card className="gap-3">
          <CardHeader>
            <CardTitle>Revenue Analytics</CardTitle>
            <CardDescription>
              Transaction volume and average order value
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 rounded-lg bg-linear-to-br from-emerald-500/5 to-blue-500/5 border border-border/40 flex items-center justify-center">
              <div className="text-center">
                <DollarSign className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-xs text-muted-foreground">
                  Chart visualization coming soon
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};
