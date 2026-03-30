import { BriefcaseBusiness, ShoppingBag, UserSearch, Users } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import type { ManagedUsersStats } from "../types";

interface UsersStatsProps {
  stats: ManagedUsersStats;
}

const cards = [
  {
    key: "total",
    label: "Total",
    hint: "All role users",
    icon: Users,
  },
  {
    key: "sellers",
    label: "Sellers",
    hint: "Service providers",
    icon: ShoppingBag,
  },
  {
    key: "clients",
    label: "Clients",
    hint: "Service buyers",
    icon: BriefcaseBusiness,
  },
  {
    key: "recruiters",
    label: "Recruiters",
    hint: "Talent hiring",
    icon: UserSearch,
  },
] as const;

const UsersStats = ({ stats }: UsersStatsProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card className="gap-3" key={card.key}>
            <CardHeader className="flex flex-row items-center justify-between pb-0">
              <CardDescription>{card.label}</CardDescription>
              <Icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-2xl">{stats[card.key]}</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">{card.hint}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default UsersStats;
