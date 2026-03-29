"use client";

import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  PieChart as PieChartIcon,
  BarChart3,
  ArrowUpRight,
  Info,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// দ্রষ্টব্য: আসল গ্রাফের জন্য আপনি 'recharts' লাইব্রেরি ব্যবহার করবেন।
// এখানে আমি সেগুলোর জন্য সুন্দর প্লেসহোল্ডার ডিজাইন করে দিচ্ছি।

const SuperAdminReportsPage = () => {
  return (
    <div className="p-6 space-y-8 bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
         <h1 className="text-2xl">
            Insights & Analytics
          </h1>
          <p className="text-muted-foreground font-medium text-sm">
            Deep dive into platform growth and user behavior.
          </p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="30d">
            <SelectTrigger className="w-40 rounded-xl font-bold border-2">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Select Range" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 3 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl px-6 gap-2">
            <Download className="w-4 h-4" /> Export All
          </Button>
        </div>
      </div>

      {/* Main Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Growth Chart Placeholder */}
        <Card className="md:col-span-2 border-border/40 shadow-xl shadow-black/5 rounded-3xl overflow-hidden bg-card/50 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-black uppercase">
                Platform Growth
              </CardTitle>
              <CardDescription>
                Monthly active users vs New signups
              </CardDescription>
            </div>
            <div className="flex items-center gap-1 text-emerald-500 font-black text-sm bg-emerald-500/10 px-2 py-1 rounded-lg">
              <TrendingUp className="w-4 h-4" /> +12.5%
            </div>
          </CardHeader>
          <CardContent className="h-75 flex items-end gap-2 px-6 pb-6">
            {/* Visual Bar Placeholder */}
            {[40, 70, 45, 90, 65, 80, 50, 85, 100, 75, 60, 95].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-emerald-500/20 hover:bg-emerald-500 transition-all rounded-t-lg group relative"
                style={{ height: `${h}%` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {h}%
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Revenue Distribution */}
        <Card className="border-border/40 shadow-xl shadow-black/5 rounded-3xl bg-card">
          <CardHeader>
            <CardTitle className="text-lg font-black uppercase">
              Revenue Split
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center h-48 relative">
              {/* Circular Indicator Placeholder */}
              <div className="w-40 h-40 rounded-full border-16 border-emerald-500 border-t-blue-500 border-l-amber-500 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-black">$42k</p>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase">
                    Total
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-bold">Services (65%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-[11px] font-bold">Jobs (20%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-[11px] font-bold">Ads (15%)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            title: "Seller Retention",
            value: "88%",
            desc: "Who stay active monthly",
            icon: ArrowUpRight,
            trend: "up",
          },
          {
            title: "Client Acquisition",
            value: "1.2k",
            desc: "New businesses this month",
            icon: Users,
            trend: "up",
          },
          {
            title: "Avg. Project Value",
            value: "$450",
            desc: "Standard ticket size",
            icon: BarChart3,
            trend: "down",
          },
          {
            title: "Dispute Rate",
            value: "0.8%",
            desc: "Successful mediation",
            icon: Info,
            trend: "up",
          },
        ].map((item, i) => (
          <Card
            key={i}
            className="border-border/40 hover:border-emerald-500/50 transition-colors rounded-2xl"
          >
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-2">
                <div className="p-2 bg-muted rounded-xl">
                  <item.icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <span
                  className={cn(
                    "text-[10px] font-black",
                    item.trend === "up" ? "text-emerald-500" : "text-rose-500",
                  )}
                >
                  {item.trend === "up" ? "↑" : "↓"} 2.4%
                </span>
              </div>
              <h4 className="text-2xl font-black tracking-tight">
                {item.value}
              </h4>
              <p className="text-[11px] font-bold text-slate-900 mt-1 uppercase tracking-tighter">
                {item.title}
              </p>
              <p className="text-[10px] text-muted-foreground font-medium">
                {item.desc}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SuperAdminReportsPage;
