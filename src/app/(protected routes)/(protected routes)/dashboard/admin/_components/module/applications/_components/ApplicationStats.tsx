import { CheckCircle2, Clock3, FileText, XCircle } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { ApplicationStatsData } from "../types";

interface ApplicationStatsProps {
  stats: ApplicationStatsData;
}

const metricCards = [
  {
    key: "total",
    label: "Total Applications",
    description: "All submissions",
    icon: FileText,
    color: "text-slate-700",
  },
  {
    key: "pending",
    label: "Pending",
    description: "Awaiting decision",
    icon: Clock3,
    color: "text-amber-700",
  },
  {
    key: "accepted",
    label: "Accepted",
    description: "Approved candidates",
    icon: CheckCircle2,
    color: "text-emerald-700",
  },
  {
    key: "rejected",
    label: "Rejected",
    description: "Declined candidates",
    icon: XCircle,
    color: "text-rose-700",
  },
] as const;

const ApplicationStats = ({ stats }: ApplicationStatsProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metricCards.map((card) => {
        const Icon = card.icon;

        return (
          <Card key={card.key} className="gap-3">
            <CardHeader className="flex flex-row items-center justify-between pb-0">
              <CardDescription>{card.label}</CardDescription>
              <Icon className={`size-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-2xl">
                {stats[card.key as keyof ApplicationStatsData]}
              </CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ApplicationStats;
