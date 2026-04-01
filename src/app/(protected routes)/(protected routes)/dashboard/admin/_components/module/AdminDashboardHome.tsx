"use client";

import {
  Users,
  BadgeCheck,
  AlertTriangle,
  Gavel,
  CircleDollarSign,
  TrendingUp,
  ArrowUpRight,
  MoreHorizontal,
  FileText,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const MARKETPLACE_METRICS = [
  {
    title: "Escrow Balance",
    value: "$124,592.00",
    description: "Funds held in active orders",
    icon: <CircleDollarSign className="size-5 text-emerald-600" />,
    trend: "+8.2%",
    color: "emerald",
  },
  {
    title: "Pending Gigs",
    value: "142",
    description: "Requires manual review",
    icon: <FileText className="size-5 text-blue-600" />,
    trend: "Action Required",
    color: "blue",
  },
  {
    title: "Open Disputes",
    value: "12",
    description: "Active support tickets",
    icon: <AlertTriangle className="size-5 text-red-600" />,
    trend: "High Priority",
    color: "red",
  },
  {
    title: "Seller Verifications",
    value: "28",
    description: "ID checks in progress",
    icon: <BadgeCheck className="size-5 text-purple-600" />,
    trend: "Ongoing",
    color: "purple",
  },
];

const AdminDashboardHome = () => {
  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Header with Quick Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Marketplace Insights
          </h1>
          <p className="text-muted-foreground">
            Monitor transactions, users, and marketplace integrity.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">System Logs</Button>
          <Button className="bg-primary hover:bg-primary/90">
            Platform Settings
          </Button>
        </div>
      </div>

      {/* High-Level CRM Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {MARKETPLACE_METRICS.map((item, i) => (
          <Card
            key={i}
            className="relative overflow-hidden border-none shadow-sm ring-1 ring-border"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                {item.title}
              </CardTitle>
              {item.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <div className="flex items-center mt-1">
                <span
                  className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md ${
                    item.color === "red"
                      ? "bg-red-100 text-red-700"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {item.trend}
                </span>
                <span className="ml-2 text-[11px] text-muted-foreground truncate">
                  {item.description}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main CRM Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Dispute & Resolution Center (CRM Priority) */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Dispute Resolution Center</CardTitle>
              <CardDescription>
                Active conflicts between Clients and Sellers.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              Manage All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card/50 hover:bg-accent/10 transition-colors"
                >
                  <div className="flex gap-4">
                    <div className="size-10 rounded-lg bg-red-100 dark:bg-red-950 flex items-center justify-center">
                      <Gavel className="size-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">
                        Order #ORD-99218 - Refund Requested
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Seller: @pro_designer | Client: @tech_corp
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden md:block text-right">
                      <p className="text-xs font-medium">$450.00</p>
                      <p className="text-[10px] text-muted-foreground">
                        24h remaining
                      </p>
                    </div>
                    <Button size="sm">Review</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Marketplace Health / Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Distribution</CardTitle>
            <CardDescription>User role balance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Sellers (Supply)</span>
                <span className="font-bold">65%</span>
              </div>
              <Progress value={65} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Clients (Demand)</span>
                <span className="font-bold">25%</span>
              </div>
              <Progress value={25} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Recruiters (Enterprise)
                </span>
                <span className="font-bold">10%</span>
              </div>
              <Progress value={10} className="h-2" />
            </div>

            <div className="pt-4 border-t border-dashed mt-6">
              <h4 className="text-xs font-bold uppercase text-muted-foreground mb-4">
                Quick Stats
              </h4>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 rounded-lg bg-accent/50">
                  <p className="text-xs text-muted-foreground">
                    Avg. Commission
                  </p>
                  <p className="text-lg font-bold">15.2%</p>
                </div>
                <div className="p-3 rounded-lg bg-accent/50">
                  <p className="text-xs text-muted-foreground">Success Rate</p>
                  <p className="text-lg font-bold">98.4%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardHome;
