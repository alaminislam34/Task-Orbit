"use client";

import React, { useState } from "react";
import {
  Star,
  Search,
  MoreVertical,
  Flag,
  CheckCircle2,
  Trash2,
  MessageSquare,
  Filter,
  AlertTriangle,
  ThumbsUp,
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

// Mock Reviews Data
const reviews = [
  {
    id: "REV-401",
    reviewer: {
      name: "Violet Evergarden",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Violet",
    },
    reviewee: {
      name: "Al Amin Islam",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AlAmin",
    },
    rating: 5,
    comment:
      "Exceptional Next.js work! The Bento UI implementation was pixel-perfect. Highly recommended.",
    project: "Bento UI Dashboard",
    date: "2026-03-24",
    status: "PUBLISHED",
  },
  {
    id: "REV-402",
    reviewer: {
      name: "Luke Harrison",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Luke",
    },
    reviewee: {
      name: "Sarah Jenkins",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    rating: 2,
    comment:
      "The delivery was late and the 3D assets had minor glitches. Not satisfied with the response time.",
    project: "E-commerce API",
    date: "2026-03-22",
    status: "FLAGGED",
  },
  {
    id: "REV-403",
    reviewer: {
      name: "Anonymous User",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anon",
    },
    reviewee: {
      name: "Anika Tabassum",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anika",
    },
    rating: 4,
    comment:
      "Great communication and very creative design. A bit pricey but worth it for the quality.",
    project: "Startup Landing Page",
    date: "2026-03-20",
    status: "PUBLISHED",
  },
];

const SuperAdminReviewPage = () => {
  const [filter, setFilter] = useState("all");

  const stats = [
    {
      label: "Total Reviews",
      value: "4,520",
      icon: MessageSquare,
      color: "text-blue-600",
      bg: "bg-blue-500/10",
    },
    {
      label: "Avg. Platform Rating",
      value: "4.8",
      icon: Star,
      color: "text-amber-600",
      bg: "bg-amber-500/10",
    },
    {
      label: "Flagged Reviews",
      value: "14",
      icon: AlertTriangle,
      color: "text-rose-600",
      bg: "bg-rose-500/10",
    },
    {
      label: "Helpful Votes",
      value: "12.8k",
      icon: ThumbsUp,
      color: "text-emerald-600",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="p-6 space-y-8 bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
         <h1 className="text-2xl">
            Trust & Feedback
          </h1>
          <p className="text-muted-foreground font-medium text-sm">
            Moderate user reviews and maintain platform integrity.
          </p>
        </div>
        <Button
          variant="outline"
          className="rounded-xl font-black border-2 gap-2"
        >
          Review Guidelines
        </Button>
      </div>

      {/* Stats Bento */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-border/40 shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  {stat.label}
                </p>
                <h3 className="text-2xl font-black mt-1 tracking-tight">
                  {stat.value}
                </h3>
              </div>
              <div className={cn(stat.bg, stat.color, "p-3 rounded-2xl")}>
                <stat.icon className="w-5 h-5 fill-current" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reviews Table */}
      <Card className="border-border/40 shadow-2xl shadow-black/5 rounded-3xl overflow-hidden bg-card">
        <CardHeader className="bg-muted/10 border-b border-border/40 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-2 bg-background border rounded-xl px-3 py-1.5 w-full lg:w-80">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search reviews or users..."
                className="border-none focus-visible:ring-0 font-medium text-sm"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto">
              {["All", "Published", "Flagged", "Low Rating"].map((s) => (
                <Button
                  key={s}
                  variant={filter === s.toLowerCase() ? "default" : "ghost"}
                  onClick={() => setFilter(s.toLowerCase())}
                  className={cn(
                    "rounded-full text-[10px] font-black px-4 h-8 transition-all",
                    filter === s.toLowerCase()
                      ? "bg-slate-900 text-white"
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
                  <th className="px-6 py-5">Reviewer / Reviewee</th>
                  <th className="px-6 py-5">Rating & Feedback</th>
                  <th className="px-6 py-5">Project Context</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {reviews.map((rev) => (
                  <tr
                    key={rev.id}
                    className="hover:bg-muted/5 transition-all group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-3">
                          <img
                            src={rev.reviewer.avatar}
                            className="w-9 h-9 rounded-full border-2 border-background z-20"
                            alt=""
                            title="Reviewer"
                          />
                          <img
                            src={rev.reviewee.avatar}
                            className="w-9 h-9 rounded-full border-2 border-background z-10"
                            alt=""
                            title="Reviewee"
                          />
                        </div>
                        <div className="ml-2">
                          <p className="text-[11px] font-black text-slate-900">
                            {rev.reviewer.name.split(" ")[0]} →{" "}
                            {rev.reviewee.name.split(" ")[0]}
                          </p>
                          <p className="text-[9px] font-bold text-muted-foreground italic uppercase tracking-tighter">
                            {rev.date}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 max-w-xs">
                      <div className="space-y-1.5">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "w-3 h-3",
                                i < rev.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-300",
                              )}
                            />
                          ))}
                        </div>
                        <p className="text-xs font-medium text-slate-700 leading-relaxed line-clamp-2">
                          "{rev.comment}"
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <Badge
                        variant="secondary"
                        className="text-[10px] font-bold uppercase tracking-tighter"
                      >
                        {rev.project}
                      </Badge>
                    </td>
                    <td className="px-6 py-5">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[9px] font-black px-2 py-0.5",
                          rev.status === "PUBLISHED"
                            ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-600"
                            : "border-rose-500/30 bg-rose-500/5 text-rose-600 animate-pulse",
                        )}
                      >
                        {rev.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                          >
                            <MoreVertical className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="rounded-xl w-44 p-2 border-border shadow-2xl"
                        >
                          <DropdownMenuItem className="font-bold text-xs gap-3 p-2.5 cursor-pointer">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />{" "}
                            Approve Review
                          </DropdownMenuItem>
                          <DropdownMenuItem className="font-bold text-xs gap-3 p-2.5 cursor-pointer">
                            <Flag className="w-4 h-4 text-amber-500" /> Flag as
                            Fake
                          </DropdownMenuItem>
                          <div className="h-px bg-border my-1" />
                          <DropdownMenuItem className="text-rose-500 font-bold text-xs gap-3 p-2.5 cursor-pointer hover:bg-rose-50">
                            <Trash2 className="w-4 h-4" /> Delete Review
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

export default SuperAdminReviewPage;
