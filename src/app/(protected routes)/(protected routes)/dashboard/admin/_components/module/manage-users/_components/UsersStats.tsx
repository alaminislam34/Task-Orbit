import { ShieldCheck, UserMinus, Users } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import type { UsersStatsData } from "../types";

interface UsersStatsProps {
  stats: UsersStatsData;
}

const metrics = [
  {
    key: "total",
    label: "Total Users",
    hint: "Registered users",
    icon: Users,
  },
  {
    key: "active",
    label: "Active",
    hint: "Can access account",
    icon: ShieldCheck,
  },
  {
    key: "inactive",
    label: "Inactive",
    hint: "Temporarily restricted",
    icon: UserMinus,
  },
] as const;

const UsersStats = ({ stats }: UsersStatsProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {metrics.map((metric) => {
        const Icon = metric.icon;

        return (
          <Card className="gap-3" key={metric.key}>
            <CardHeader className="flex flex-row items-center justify-between pb-0">
              <CardDescription>{metric.label}</CardDescription>
              <Icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-2xl">{stats[metric.key]}</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">{metric.hint}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default UsersStats;
