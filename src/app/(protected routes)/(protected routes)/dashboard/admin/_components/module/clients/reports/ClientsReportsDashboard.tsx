"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ClientStats } from "@/app/(protected routes)/(protected routes)/dashboard/admin/_components/module/clients/ClientStats";
import { ClientUser } from "@/types/data.types";
import { useRouter } from "next/navigation";

type GrowthPoint = {
  month: string;
  count: number;
  total: number;
};

const ACTIVE_COLORS = ["#16a34a", "#94a3b8"];
const SPENDING_BAR_COLOR = "#0f766e";
const GROWTH_LINE_COLOR = "#2563eb";

function getMonthLabel(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

function getLastMonths(length: number) {
  const months: Date[] = [];
  const now = new Date();

  for (let i = length - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(d);
  }

  return months;
}

export default function ClientsReportsDashboard() {
  const [clients, setClients] = useState<ClientUser[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/data/users.json");
        const data = await response.json();
        const onlyClients = data.filter((user: ClientUser) => user.role === "CLIENT");
        setClients(onlyClients);
      } catch (error) {
        console.error("Failed to load clients report data:", error);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const activeInactiveData = useMemo(() => {
    const active = clients.filter((client) => client.base.status === "ONLINE").length;
    const inactive = clients.length - active;

    return [
      { name: "Active", value: active },
      { name: "Inactive", value: inactive },
    ];
  }, [clients]);

  const spendingDistribution = useMemo(() => {
    const buckets = {
      "0-500": 0,
      "501-2000": 0,
      "2001-5000": 0,
      "5000+": 0,
    };

    clients.forEach((client) => {
      const spent = client.profile?.totalSpent ?? 0;

      if (spent <= 500) buckets["0-500"] += 1;
      else if (spent <= 2000) buckets["501-2000"] += 1;
      else if (spent <= 5000) buckets["2001-5000"] += 1;
      else buckets["5000+"] += 1;
    });

    return Object.entries(buckets).map(([range, count]) => ({ range, count }));
  }, [clients]);

  const growthOverTime = useMemo<GrowthPoint[]>(() => {
    const lastSixMonths = getLastMonths(6);
    const monthMap = new Map<string, number>();

    lastSixMonths.forEach((monthDate) => {
      monthMap.set(`${monthDate.getFullYear()}-${monthDate.getMonth()}`, 0);
    });

    clients.forEach((client) => {
      const sourceDate = client.createdAt || client.crmData.lastActive;
      const parsedDate = new Date(sourceDate);
      if (Number.isNaN(parsedDate.getTime())) return;

      const key = `${parsedDate.getFullYear()}-${parsedDate.getMonth()}`;
      if (!monthMap.has(key)) return;

      monthMap.set(key, (monthMap.get(key) || 0) + 1);
    });

    let runningTotal = 0;

    return lastSixMonths.map((monthDate) => {
      const key = `${monthDate.getFullYear()}-${monthDate.getMonth()}`;
      const count = monthMap.get(key) || 0;
      runningTotal += count;

      return {
        month: getMonthLabel(monthDate),
        count,
        total: runningTotal,
      };
    });
  }, [clients]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-80" />
        </div>
        <ClientStats data={[]} loading />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Skeleton className="h-80 w-full rounded-lg" />
          <Skeleton className="h-80 w-full rounded-lg" />
        </div>
        <Skeleton className="h-80 w-full rounded-lg" />
      </div>
    );
  }

  if (!clients.length) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Client Reports</h2>
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No client data available for reports.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 max-w-full space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Client Reports</h2>
          <p className="text-sm text-muted-foreground">
            Track client health, spending patterns, and monthly growth.
          </p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/admin/manage-clients")}
          variant="outline"
          size="sm"
        >
          Back to Clients
        </Button>
      </div>

      <ClientStats data={clients} loading={false} />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Active vs Inactive Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activeInactiveData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {activeInactiveData.map((entry, index) => (
                      <Cell key={entry.name} fill={ACTIVE_COLORS[index % ACTIVE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spending Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={spendingDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill={SPENDING_BAR_COLOR} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Growth Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="New Clients"
                  stroke="#0f766e"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  name="Running Total"
                  stroke={GROWTH_LINE_COLOR}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
