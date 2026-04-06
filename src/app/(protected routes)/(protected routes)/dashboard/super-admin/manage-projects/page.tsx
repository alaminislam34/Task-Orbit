"use client";

import React, { useState } from "react";
import {
  Briefcase,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  ExternalLink,
  DollarSign,
  MoreHorizontal,
  ArrowUpDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

// Mock Project Data based on your CRM requirements
const projects = [
  {
    id: "PRJ-701",
    title: "Bento UI Dashboard Design",
    client: {
      name: "Violet Evergarden",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Violet",
    },
    seller: {
      name: "Al Amin Islam",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AlAmin",
    },
    budget: 1200,
    deadline: "2026-04-10",
    status: "IN_PROGRESS",
    priority: "HIGH",
  },
  {
    id: "PRJ-702",
    title: "E-commerce API Integration",
    client: {
      name: "Luke Harrison",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Luke",
    },
    seller: {
      name: "Sarah Jenkins",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    budget: 3500,
    deadline: "2026-03-20",
    status: "COMPLETED",
    priority: "MEDIUM",
  },
  {
    id: "PRJ-703",
    title: "Mobile App Security Audit",
    client: {
      name: "David Miller",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    },
    seller: {
      name: "Anika Tabassum",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anika",
    },
    budget: 800,
    deadline: "2026-03-25",
    status: "DISPUTED",
    priority: "URGENT",
  },
];

const SuperAdminProjectPage = () => {
  const [filter, setFilter] = useState("ALL");

  const stats = [
    {
      label: "Active Projects",
      value: "154",
      icon: Clock,
      color: "text-blue-600",
      bg: "bg-blue-500/10",
    },
    {
      label: "Completed",
      value: "1,240",
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Disputed",
      value: "12",
      icon: AlertCircle,
      color: "text-rose-600",
      bg: "bg-rose-500/10",
    },
    {
      label: "Total Revenue",
      value: "$42.5k",
      icon: DollarSign,
      color: "text-amber-600",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="p-6 space-y-8 bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl">Project Command Center</h1>
          <p className="text-muted-foreground font-medium">
            Monitor deliverables, budgets, and dispute resolutions.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-lg font-bold border-2">
            Export CSV
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg px-6">
            View Analytics
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card
            key={i}
            className="border-none shadow-sm bg-card/50 backdrop-blur-sm"
          >
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  {stat.label}
                </p>
                <h3 className="text-2xl font-black mt-1">{stat.value}</h3>
              </div>
              <div className={cn(stat.bg, stat.color, "p-3 rounded-lg")}>
                <stat.icon className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Card className="border-none shadow-2xl shadow-black/5 rounded-lg overflow-hidden">
        <CardHeader className="bg-muted/10 border-b border-border/50 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-2 bg-background border rounded-lg px-3 py-1.5 w-full lg:w-96">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search projects by ID, Client or Seller..."
                className="border-none focus-visible:ring-0 font-medium"
              />
            </div>

            <div className="flex items-center gap-2">
              {["ALL", "IN_PROGRESS", "COMPLETED", "DISPUTED"].map((s) => (
                <Button
                  key={s}
                  variant={filter === s ? "default" : "ghost"}
                  onClick={() => setFilter(s)}
                  className={cn(
                    "rounded-full text-[10px] px-4 h-8",
                    filter === s
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
                <tr className="bg-muted/20 border-b border-border text-[10px] uppercase font-black tracking-tighter text-muted-foreground">
                  <th className="px-6 py-4">Project / ID</th>
                  <th className="px-6 py-4 text-center">Stakeholders</th>
                  <th className="px-6 py-4">Status & Priority</th>
                  <th className="px-6 py-4">Budget</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {projects.map((proj) => (
                  <tr
                    key={proj.id}
                    className="hover:bg-muted/5 transition-all group"
                  >
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <p className="text-sm font-black group-hover:text-blue-600 transition-colors cursor-pointer">
                          {proj.title}
                        </p>
                        <Badge
                          variant="secondary"
                          className="text-[9px] font-mono tracking-tighter"
                        >
                          {proj.id}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center -space-x-3">
                        <div className="flex flex-col items-center group/client">
                          <img
                            src={proj.client.avatar}
                            alt="client"
                            className="w-10 h-10 rounded-full border-2 border-background bg-muted z-20 hover:scale-110 transition-transform"
                          />
                          <span className="text-[8px] font-bold mt-1 opacity-0 group-hover/client:opacity-100 uppercase">
                            Client
                          </span>
                        </div>
                        <div className="flex flex-col items-center group/seller">
                          <img
                            src={proj.seller.avatar}
                            alt="seller"
                            className="w-10 h-10 rounded-full border-2 border-background bg-muted z-10 hover:scale-110 transition-transform"
                          />
                          <span className="text-[8px] font-bold mt-1 opacity-0 group-hover/seller:opacity-100 uppercase">
                            Seller
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-1.5">
                          <div
                            className={cn(
                              "w-2 h-2 rounded-full",
                              proj.status === "COMPLETED"
                                ? "bg-emerald-500"
                                : proj.status === "DISPUTED"
                                  ? "bg-rose-500 animate-pulse"
                                  : "bg-blue-500",
                            )}
                          />
                          <span className="text-[10px] font-black uppercase">
                            {proj.status.replace("_", " ")}
                          </span>
                        </div>
                        <Badge
                          className={cn(
                            "w-fit text-[9px] font-bold",
                            proj.priority === "URGENT"
                              ? "bg-rose-500/10 text-rose-600 border-rose-200"
                              : "bg-slate-100 text-slate-600",
                          )}
                        >
                          {proj.priority} PRIORITY
                        </Badge>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-mono">
                      <p className="text-sm font-black text-slate-900">
                        ${proj.budget.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-medium italic">
                        Due: {proj.deadline}
                      </p>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full hover:bg-muted transition-colors"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="rounded-lg w-48 p-2 border-border shadow-2xl"
                        >
                          <DropdownMenuItem className="font-bold text-xs gap-3 p-2.5">
                            <ExternalLink className="w-4 h-4 text-blue-500" />{" "}
                            View Workspace
                          </DropdownMenuItem>
                          <DropdownMenuItem className="font-bold text-xs gap-3 p-2.5">
                            <DollarSign className="w-4 h-4 text-emerald-500" />{" "}
                            Release Payment
                          </DropdownMenuItem>
                          <div className="h-px bg-border my-1" />
                          <DropdownMenuItem className="text-rose-500 font-bold text-xs gap-3 p-2.5 hover:bg-rose-50">
                            <AlertCircle className="w-4 h-4" /> Intervene
                            Dispute
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

export default SuperAdminProjectPage;
