"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  UserCheck,
  UserCog,
  ShieldAlert,
  Search,
  MoreVertical,
  ArrowUpRight,
  Mail,
  Globe,
  Briefcase,
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

const UsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);

  // 1. Fetch Users Data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/data/users.json");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // 2. Filter Logic
  const filteredUsers = users.filter((user) => {
    if (activeTab === "all") return true;
    return user.role.toLowerCase() === activeTab.toLowerCase();
  });

  // 3. Helper to get Role Badge Styles
  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      SELLER: "border-emerald-500/30 bg-emerald-500/5 text-emerald-600",
      CLIENT: "border-amber-500/30 bg-amber-500/5 text-amber-600",
      RECRUITER: "border-rose-500/30 bg-rose-500/5 text-rose-600",
      NORMAL: "border-slate-500/30 bg-slate-500/5 text-slate-600",
    };
    return styles[role] || styles.NORMAL;
  };

  return (
    <div className="p-6 space-y-8 bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl">User Management</h1>
          <p className="text-muted-foreground font-medium text-sm">
            Real-time CRM monitoring for TaskOrbit.
          </p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl px-6">
          + Create User
        </Button>
      </div>

      {/* CRM Table Section */}
      <Card className="border-border/50 shadow-xl shadow-black/5 overflow-hidden bg-card">
        <CardHeader className="border-b border-border/50 bg-muted/20 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-1.5 focus-within:ring-2 ring-emerald-500/20 transition-all">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search CRM..."
                className="border-none focus-visible:ring-0 w-64 h-8 font-medium bg-transparent"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {["All", "Seller", "Client", "Recruiter", "Normal"].map(
                (role) => (
                  <Button
                    key={role}
                    variant={
                      activeTab === role.toLowerCase() ? "default" : "ghost"
                    }
                    onClick={() => setActiveTab(role.toLowerCase())}
                    className={cn(
                      "rounded-full px-5 h-9 font-bold text-xs tracking-tight transition-all",
                      activeTab === role.toLowerCase()
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : "hover:bg-muted",
                    )}
                  >
                    {role}
                  </Button>
                ),
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/30 border-b border-border text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                  <th className="px-6 py-5">User Details</th>
                  <th className="px-6 py-5">Role & Badge</th>
                  <th className="px-6 py-5">Activity/Info</th>
                  <th className="px-6 py-5">Connection CRM</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-muted/10 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img
                            src={user.base.avatar}
                            alt={user.base.username}
                            className="w-11 h-11 rounded-full bg-muted border-2 border-border group-hover:border-emerald-500/50 transition-all"
                          />
                          {user.base.status === "ONLINE" && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-background rounded-full" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-black">{user.base.name}</p>
                          <p className="text-[11px] text-muted-foreground font-medium italic">
                            @{user.base.username}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-md px-2.5 py-0.5 font-black uppercase text-[9px]",
                          getRoleBadge(user.role),
                        )}
                      >
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {user.role === "SELLER" && (
                          <div className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground">
                            <span className="text-emerald-600">
                              ${user.profile.earnings.toLocaleString()}
                            </span>{" "}
                            Earned
                          </div>
                        )}
                        {user.role === "CLIENT" && (
                          <div className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground text-nowrap">
                            <Briefcase className="w-3 h-3" />{" "}
                            {user.profile.company.name}
                          </div>
                        )}
                        {user.role === "RECRUITER" && (
                          <div className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground">
                            <Globe className="w-3 h-3" />{" "}
                            {user.profile.agency.location}
                          </div>
                        )}
                        <p className="text-[10px] text-muted-foreground/60 font-medium tracking-tight">
                          Active:{" "}
                          {new Date(
                            user.crmData.lastActive,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <p className="text-xs font-bold text-muted-foreground">
                          {user.role === "SELLER"
                            ? `${user.crmData.suggestedClients.length} Potential Clients`
                            : user.role === "CLIENT"
                              ? `${user.crmData.matchingSellers.length} Matching Sellers`
                              : user.role === "NORMAL"
                                ? `Path: ${user.crmData.suggestedPath}`
                                : "Recruiting Matches"}
                        </p>
                        <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 w-[70%]" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full hover:bg-muted group-hover:scale-110 transition-transform"
                          >
                            <MoreVertical className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="rounded-xl p-2 border-border shadow-2xl"
                        >
                          <DropdownMenuItem className="font-bold flex gap-3 text-xs p-2.5 cursor-pointer">
                            <ArrowUpRight className="w-4 h-4 text-emerald-500" />{" "}
                            Full Profile Analysis
                          </DropdownMenuItem>
                          <DropdownMenuItem className="font-bold flex gap-3 text-xs p-2.5 cursor-pointer">
                            <Mail className="w-4 h-4 text-blue-500" /> Direct
                            CRM Message
                          </DropdownMenuItem>
                          <div className="h-px bg-border my-1" />
                          <DropdownMenuItem className="text-rose-500 font-bold flex gap-3 text-xs p-2.5 cursor-pointer hover:bg-rose-50">
                            Restrict Access
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

export default UsersPage;
