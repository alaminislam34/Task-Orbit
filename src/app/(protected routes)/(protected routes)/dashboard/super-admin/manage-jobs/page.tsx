"use client";

import React, { useState } from "react";
import {
  Briefcase,
  Users,
  Zap,
  MapPin,
  Search,
  MoreHorizontal,
  ExternalLink,
  Trash2,
  CheckCircle,
  Building2,
  Trophy,
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

// Mock Jobs Data (Standard Marketplace Structure)
const jobs = [
  {
    id: "JOB-1024",
    title: "Senior Next.js Developer",
    recruiter: {
      name: "Saiful Islam",
      agency: "TechTalent Global",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Saiful",
    },
    type: "Remote",
    salary: "$4k - $6k",
    applicants: 42,
    status: "ACTIVE",
    category: "Software",
  },
  {
    id: "JOB-1025",
    title: "Fabric Production Manager",
    recruiter: {
      name: "Emma Watson",
      agency: "Fashion Talent Scout",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    },
    type: "On-site (Milan)",
    salary: "€3k - €5k",
    applicants: 12,
    status: "URGENT",
    category: "Textile",
  },
  {
    id: "JOB-1026",
    title: "UI/UX Designer (Bento Specialist)",
    recruiter: {
      name: "Sophia Rodriguez",
      agency: "Global Talent Source",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia",
    },
    type: "Contract",
    salary: "$50/hr",
    applicants: 89,
    status: "CLOSED",
    category: "Design",
  },
];

const SuperAdminJobsPage = () => {
  const [activeFilter, setActiveFilter] = useState("ALL");

  const stats = [
    {
      label: "Live Vacancies",
      value: "482",
      icon: Briefcase,
      color: "text-indigo-600",
      bg: "bg-indigo-500/10",
    },
    {
      label: "New Applicants",
      value: "1,840",
      icon: Users,
      color: "text-emerald-600",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Urgent Hires",
      value: "24",
      icon: Zap,
      color: "text-amber-600",
      bg: "bg-amber-500/10",
    },
    {
      label: "Success Rate",
      value: "92%",
      icon: Trophy,
      color: "text-rose-600",
      bg: "bg-rose-500/10",
    },
  ];

  return (
    <div className="p-6 space-y-8 bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
         <h1 className="text-2xl">
            Job Board Oversight
          </h1>
          <p className="text-muted-foreground font-medium text-sm">
            Monitor recruitment activities and talent acquisition.
          </p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg px-8 shadow-lg shadow-indigo-500/20">
          Post Internal Job
        </Button>
      </div>

      {/* Stats Bento */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card
            key={i}
            className="border-border/40 shadow-sm hover:shadow-md transition-all cursor-default group"
          >
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  {stat.label}
                </p>
                <h3 className="text-2xl font-black mt-1 group-hover:scale-105 transition-transform origin-left">
                  {stat.value}
                </h3>
              </div>
              <div className={cn(stat.bg, stat.color, "p-3 rounded-lg")}>
                <stat.icon className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter & Table */}
      <Card className="border-border/40 shadow-2xl shadow-black/5 rounded-lg overflow-hidden">
        <CardHeader className="bg-muted/10 border-b border-border/40 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-2 bg-background border rounded-lg px-3 py-1.5 w-full lg:w-80">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs, skills or agencies..."
                className="border-none focus-visible:ring-0 font-medium text-sm"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0">
              {["ALL", "ACTIVE", "URGENT", "CLOSED"].map((s) => (
                <Button
                  key={s}
                  variant={activeFilter === s ? "default" : "ghost"}
                  onClick={() => setActiveFilter(s)}
                  className={cn(
                    "rounded-full text-[10px] font-black px-4 h-8 transition-all",
                    activeFilter === s
                      ? "bg-indigo-600 text-white"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  {s}
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
                  <th className="px-6 py-5">Position / Category</th>
                  <th className="px-6 py-5">Posted By (Recruiter)</th>
                  <th className="px-6 py-5">Engagement</th>
                  <th className="px-6 py-5">Compensation</th>
                  <th className="px-6 py-5 text-right">Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {jobs.map((job) => (
                  <tr
                    key={job.id}
                    className="hover:bg-muted/5 transition-all group"
                  >
                    <td className="px-6 py-5">
                      <div className="space-y-1.5">
                        <p className="text-sm font-black group-hover:text-indigo-600 transition-colors">
                          {job.title}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="text-[9px] font-bold uppercase py-0"
                          >
                            {job.category}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-0.5 font-medium">
                            <MapPin className="w-3 h-3" /> {job.type}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={job.recruiter.avatar}
                          className="w-9 h-9 rounded-full bg-muted border border-border"
                          alt=""
                        />
                        <div>
                          <p className="text-xs font-black">
                            {job.recruiter.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium italic">
                            <Building2 className="w-2.5 h-2.5" />{" "}
                            {job.recruiter.agency}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "w-2 h-2 rounded-full",
                              job.status === "ACTIVE"
                                ? "bg-emerald-500"
                                : job.status === "URGENT"
                                  ? "bg-rose-500 animate-pulse"
                                  : "bg-slate-400",
                            )}
                          />
                          <span className="text-[10px] font-black uppercase">
                            {job.status}
                          </span>
                        </div>
                        <p className="text-[11px] font-bold text-indigo-600 tracking-tight">
                          {job.applicants} Applicants applied
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-black text-slate-800 tracking-tighter">
                        {job.salary}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-medium uppercase">
                        Budget Range
                      </p>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full hover:bg-muted opacity-60 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="rounded-lg w-48 p-2 border-border shadow-2xl"
                        >
                          <DropdownMenuItem className="font-bold text-xs gap-3 p-2.5 cursor-pointer">
                            <ExternalLink className="w-4 h-4 text-indigo-500" />{" "}
                            View Live Post
                          </DropdownMenuItem>
                          <DropdownMenuItem className="font-bold text-xs gap-3 p-2.5 cursor-pointer">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />{" "}
                            Approve/Feature
                          </DropdownMenuItem>
                          <div className="h-px bg-border my-1" />
                          <DropdownMenuItem className="text-rose-500 font-bold text-xs gap-3 p-2.5 cursor-pointer hover:bg-rose-50">
                            <Trash2 className="w-4 h-4" /> Take Down Post
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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

export default SuperAdminJobsPage;
