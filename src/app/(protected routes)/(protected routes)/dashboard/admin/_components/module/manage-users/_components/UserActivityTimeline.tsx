"use client";

import React from "react";
import {
  Circle,
  Mail,
  MousePointer2,
  UserPlus,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// টাইপ ডেফিনিশন (এটি আপনার ডাটা অনুযায়ী হবে)
interface Activity {
  id: string;
  type:
    | "REGISTRATION"
    | "EMAIL_SENT"
    | "SERVICE_VIEW"
    | "PROFILE_UPDATE"
    | "ALERT";
  title: string;
  description: string;
  timestamp: string;
  status?: "SUCCESS" | "PENDING" | "FAILED";
}

const activities: Activity[] = [
  {
    id: "1",
    type: "PROFILE_UPDATE",
    title: "Onboarding Step 2 Completed",
    description: "User updated interests: Next.js, Logo Design.",
    timestamp: "2 hours ago",
    status: "SUCCESS",
  },
  {
    id: "2",
    type: "EMAIL_SENT",
    title: "Marketing Email Sent",
    description: "Sent 'Welcome Discount' campaign email.",
    timestamp: "5 hours ago",
    status: "SUCCESS",
  },
  {
    id: "3",
    type: "SERVICE_VIEW",
    title: "Viewed High-Value Service",
    description: "User spent 5 minutes on 'Enterprise Web Development'.",
    timestamp: "Yesterday",
  },
  {
    id: "4",
    type: "ALERT",
    title: "Account Needs Verification",
    description: "User tried to post a job without identity proof.",
    timestamp: "2 days ago",
    status: "FAILED",
  },
  {
    id: "5",
    type: "REGISTRATION",
    title: "New Account Created",
    description: "Signed up via Google Authentication.",
    timestamp: "3 days ago",
    status: "SUCCESS",
  },
];

export default function UserActivityTimeline() {
  const getIcon = (type: Activity["type"]) => {
    switch (type) {
      case "REGISTRATION":
        return <UserPlus size={14} className="text-blue-600" />;
      case "EMAIL_SENT":
        return <Mail size={14} className="text-indigo-600" />;
      case "SERVICE_VIEW":
        return <MousePointer2 size={14} className="text-amber-600" />;
      case "PROFILE_UPDATE":
        return <CheckCircle2 size={14} className="text-emerald-600" />;
      case "ALERT":
        return <ShieldAlert size={14} className="text-rose-600" />;
      default:
        return <Circle size={14} />;
    }
  };

  return (
    <Card className="border-none shadow-xl ring-1 ring-slate-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-bold">Activity Log</CardTitle>
        <Badge variant="outline" className="font-normal text-[10px]">
          Last 30 Days
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-6 before:absolute before:inset-0 before:ml-3 before:-translate-x-px before:h-full before:w-0.5 before:bg-linear-to-b before:from-slate-200 before:via-slate-200 before:to-transparent">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="relative flex items-start gap-4 group"
            >
              {/* Timeline dot & Icon */}
              <div className="absolute left-0 mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-white ring-2 ring-slate-100 shadow-sm z-10 group-hover:scale-110 transition-transform">
                {getIcon(activity.type)}
              </div>

              {/* Content */}
              <div className="ml-8 flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-900 leading-none">
                    {activity.title}
                  </h4>
                  <time className="text-[10px] font-medium text-slate-400">
                    {activity.timestamp}
                  </time>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {activity.description}
                </p>

                {activity.status && (
                  <div className="flex items-center gap-1.5 pt-1">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        activity.status === "SUCCESS"
                          ? "bg-emerald-500"
                          : "bg-rose-500"
                      }`}
                    />
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">
                      {activity.status}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <button className="w-full mt-6 py-2 flex items-center justify-center gap-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors group">
          View All Activity
          <ArrowRight
            size={14}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </CardContent>
    </Card>
  );
}
