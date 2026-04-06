"use client";

import React, { useMemo } from "react";
import { 
  Users, 
  UserCheck, 
  UserX, 
  ShieldCheck, 
  ShieldAlert, 
  Activity, 
  HeartPulse 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// --- Types ---
interface ClientUser {
  id: string;
  base: {
    status: "ONLINE" | "OFFLINE";
    isVerified: boolean;
  };
  crmData: {
    accountHealth: number;
  };
}

interface ClientStatsProps {
  data: ClientUser[];
  loading?: boolean;
}

// --- Sub-component: StatCard ---
const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  colorClass 
}: { 
  title: string; 
  value: string | number; 
  icon: any; 
  description?: string;
  colorClass?: string;
}) => (
  <Card className="hover:shadow-md transition-shadow duration-200 rounded-lg border-slate-200">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className={`h-4 w-4 ${colorClass || "text-muted-foreground"}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold tracking-tight">{value}</div>
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
    </CardContent>
  </Card>
);

// --- Sub-component: StatsSkeleton ---
const StatsSkeleton = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    {[...Array(4)].map((_, i) => (
      <Card key={i} className="rounded-lg border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-3 w-32" />
        </CardContent>
      </Card>
    ))}
  </div>
);

// --- Main Component ---
export const ClientStats: React.FC<ClientStatsProps> = ({ data, loading }) => {
  const stats = useMemo(() => {
    if (!data.length) return null;

    const total = data.length;
    const active = data.filter((u) => u.base.status === "ONLINE").length;
    const verified = data.filter((u) => u.base.isVerified).length;
    const healthy = data.filter((u) => u.crmData.accountHealth >= 70).length;
    
    const avgHealth = data.reduce((acc, curr) => acc + curr.crmData.accountHealth, 0) / total;

    return {
      total,
      active,
      inactive: total - active,
      verified,
      unverified: total - verified,
      healthy,
      avgHealth: Math.round(avgHealth),
    };
  }, [data]);

  if (loading) return <StatsSkeleton />;
  if (!stats) return null;

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      <StatCard 
        title="Total Clients" 
        value={stats.total} 
        icon={Users} 
        description="Total registered accounts" 
      />
      <StatCard 
        title="Active Status" 
        value={stats.active} 
        icon={UserCheck} 
        colorClass="text-emerald-500"
        description={`${stats.inactive} currently offline`} 
      />
      <StatCard 
        title="Verified Clients" 
        value={stats.verified} 
        icon={ShieldCheck} 
        colorClass="text-blue-500"
        description={`${stats.unverified} pending verification`} 
      />
      <StatCard 
        title="Avg. Health" 
        value={`${stats.avgHealth}%`} 
        icon={HeartPulse} 
        colorClass={stats.avgHealth > 70 ? "text-emerald-500" : "text-amber-500"}
        description={`${stats.healthy} accounts in good standing`} 
      />
    </div>
  );
};