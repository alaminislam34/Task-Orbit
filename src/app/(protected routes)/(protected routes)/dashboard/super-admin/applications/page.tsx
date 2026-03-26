"use client";

import React, { useState } from "react";
import {
  FileText,
  CheckCircle,
  XCircle,
  Search,
  Eye,
  Clock,
  UserPlus,
  ShieldCheck,
  MoreHorizontal,
  Download,
  Mail,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Mock Application Data
const applications = [
  {
    id: "APP-2021",
    user: {
      name: "Tanvir Rahman",
      email: "tanvir@dev.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tanvir",
    },
    type: "SELLER",
    specialization: "Next.js & AWS",
    documents: 3,
    submittedAt: "2026-03-25",
    status: "PENDING",
  },
  {
    id: "APP-2022",
    user: {
      name: "Anisul Islam",
      email: "anis@agency.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anis",
    },
    type: "RECRUITER",
    specialization: "IT Recruitment",
    documents: 5,
    submittedAt: "2026-03-24",
    status: "UNDER_REVIEW",
  },
  {
    id: "APP-2023",
    user: {
      name: "Karim Ullah",
      email: "karim@textile.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Karim",
    },
    type: "SELLER",
    specialization: "Fabric Specialist",
    documents: 2,
    submittedAt: "2026-03-20",
    status: "REJECTED",
  },
];

const SuperAdminApplicationPage = () => {
  const [activeFilter, setActiveFilter] = useState("ALL");

  const stats = [
    {
      label: "New Requests",
      value: "28",
      icon: UserPlus,
      color: "text-blue-600",
      bg: "bg-blue-500/10",
    },
    {
      label: "Under Review",
      value: "12",
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-500/10",
    },
    {
      label: "Verified Today",
      value: "85",
      icon: ShieldCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Rejection Rate",
      value: "4.2%",
      icon: XCircle,
      color: "text-rose-600",
      bg: "bg-rose-500/10",
    },
  ];

  return (
    <div className="p-6 space-y-8 bg-background min-h-screen font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl">Vetting Center</h1>
          <p className="text-muted-foreground font-medium text-sm">
            Review and verify new seller & recruiter applications.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl font-bold border-2">
            Verification Logs
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl px-6">
            Auto-Verify Settings
          </Button>
        </div>
      </div>

      {/* Stats Bento */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card
            key={i}
            className="border-border/40 shadow-sm hover:shadow-md transition-all"
          >
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  {stat.label}
                </p>
                <h3 className="text-2xl font-black mt-1">{stat.value}</h3>
              </div>
              <div className={cn(stat.bg, stat.color, "p-3 rounded-2xl")}>
                <stat.icon className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Applications Table */}
      <Card className="border-border/40 shadow-2xl shadow-black/5 rounded-3xl overflow-hidden">
        <CardHeader className="bg-muted/10 border-b border-border/40 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-2 bg-background border rounded-xl px-3 py-1.5 w-full lg:w-80">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or specialization..."
                className="border-none focus-visible:ring-0 font-medium text-sm"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto">
              {["ALL", "PENDING", "UNDER_REVIEW", "REJECTED"].map((s) => (
                <Button
                  key={s}
                  variant={activeFilter === s ? "default" : "ghost"}
                  onClick={() => setActiveFilter(s)}
                  className={cn(
                    "rounded-full text-[10px] font-black px-4 h-8 transition-all",
                    activeFilter === s
                      ? "bg-slate-900 text-white"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  {s.replace("_", " ")}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/20 border-b border-border text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                  <th className="px-6 py-5">Applicant</th>
                  <th className="px-6 py-5">Role & Focus</th>
                  <th className="px-6 py-5">Documentation</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-right">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {applications.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-muted/5 transition-all group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={app.user.avatar}
                          className="w-10 h-10 rounded-full bg-muted border-2 border-border group-hover:border-blue-500/50 transition-all"
                          alt=""
                        />
                        <div>
                          <p className="text-sm font-black">{app.user.name}</p>
                          <p className="text-[10px] text-muted-foreground font-medium italic">
                            {app.user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <Badge
                          variant="secondary"
                          className="text-[9px] font-bold uppercase py-0 rounded-md"
                        >
                          {app.type}
                        </Badge>
                        <p className="text-[11px] font-bold text-slate-700 tracking-tight">
                          {app.specialization}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1.5 text-blue-600">
                        <FileText className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-black">
                          {app.documents} Files Attached
                        </span>
                      </div>
                      <p className="text-[9px] text-muted-foreground mt-1 font-bold italic uppercase">
                        Submitted: {app.submittedAt}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[9px] font-black px-2 py-0.5",
                          app.status === "PENDING"
                            ? "border-blue-500/30 bg-blue-500/5 text-blue-600 animate-pulse"
                            : app.status === "UNDER_REVIEW"
                              ? "border-amber-500/30 bg-amber-500/5 text-amber-600"
                              : "border-rose-500/30 bg-rose-500/5 text-rose-600",
                        )}
                      >
                        {app.status.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8 rounded-full hover:bg-emerald-50 hover:text-emerald-600"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8 rounded-full hover:bg-rose-50 hover:text-rose-600"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-8 h-8 rounded-full"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="rounded-xl w-48 p-2 border-border shadow-2xl"
                          >
                            <DropdownMenuItem className="font-bold text-xs gap-3 p-2.5 cursor-pointer">
                              <Eye className="w-4 h-4 text-blue-500" /> Full
                              Profile Review
                            </DropdownMenuItem>
                            <DropdownMenuItem className="font-bold text-xs gap-3 p-2.5 cursor-pointer">
                              <Download className="w-4 h-4 text-emerald-500" />{" "}
                              Download Dossier
                            </DropdownMenuItem>
                            <div className="h-px bg-border my-1" />
                            <DropdownMenuItem className="font-bold text-xs gap-3 p-2.5 cursor-pointer">
                              <Mail className="w-4 h-4 text-amber-500" />{" "}
                              Request More Info
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperAdminApplicationPage;
