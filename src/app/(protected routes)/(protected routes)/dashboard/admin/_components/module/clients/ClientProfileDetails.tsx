"use client";

import {
  Mail,
  Globe,
  Building2,
  ShieldCheck,
  CreditCard,
  AlertTriangle,
  ExternalLink,
  Calendar,
  MapPin,
  Clock,
  Star,
  Briefcase,
  Trophy,
  Copy,
  UserPlus,
  MoreVertical,
  Ban,
  Trash2,
  Edit2,
  CheckCircle2,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ClientUser } from "@/types/data.types";

// Use the ClientUser interface we updated previously
// Assuming it's imported from @/types/user

interface ClientProfileProps {
  client: ClientUser;
}

export default function ClientProfileDetails({ client }: ClientProfileProps) {
  // --- Helpers ---
  const formatCurrency = (val?: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(val || 0);

  const formatDate = (dateString?: string) =>
    dateString
      ? new Intl.DateTimeFormat("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date(dateString))
      : "N/A";

  const getHealthColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 50) return "bg-amber-500";
    return "bg-rose-500";
  };

  const getRiskLabel = (score: number) => {
    if (score >= 80)
      return {
        label: "Safe",
        color: "text-emerald-700 bg-emerald-50 border-emerald-100",
      };
    if (score >= 50)
      return {
        label: "Warning",
        color: "text-amber-700 bg-amber-50 border-amber-100",
      };
    return {
      label: "High Risk",
      color: "text-rose-700 bg-rose-50 border-rose-100",
    };
  };

  const risk = getRiskLabel(client.crmData.accountHealth);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* --- HEADER SECTION --- */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <Avatar className="h-20 w-20 border-4 border-slate-50 shadow-sm">
            <AvatarImage src={client.base.avatar} alt={client.base.name} />
            <AvatarFallback className="text-xl font-bold">
              {client.base.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-slate-900">
                {client.base.name}
              </h1>
              <Badge
                variant="outline"
                className={cn(
                  "font-semibold uppercase tracking-wider text-[10px]",
                  client.crmData.clientTier === "GOLD"
                    ? "border-amber-200 bg-amber-50 text-amber-700"
                    : "bg-slate-100",
                )}
              >
                {client.crmData.clientTier}
              </Badge>
              {client.base.isVerified && (
                <ShieldCheck className="h-5 w-5 text-blue-500" />
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1.5 font-medium">
                @{client.base.username}
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> {client.base.email}
              </span>
              <Badge
                variant={
                  client.base.status === "ONLINE" ? "default" : "destructive"
                }
                className="h-5"
              >
                {client.base.status}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Copy className="h-4 w-4 mr-2" /> Copy Email
          </Button>
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
            <Edit2 className="h-4 w-4 mr-2" /> Edit Profile
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                variant="ghost"
                size="icon"
                className="border border-slate-200"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="text-amber-600">
                <Ban className="mr-2 h-4 w-4" /> Suspend Client
              </DropdownMenuItem>
              <DropdownMenuItem className="text-rose-600">
                <Trash2 className="mr-2 h-4 w-4" /> Delete Account
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* --- QUICK STATS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatItem
          icon={Trophy}
          label="Total Spent"
          value={formatCurrency(client.profile?.totalSpent)}
          color="text-amber-600"
        />
        <StatItem
          icon={Briefcase}
          label="Active Orders"
          value={client.profile?.activeOrders || 0}
          color="text-blue-600"
        />
        <StatItem
          icon={CheckCircle2}
          label="Completed"
          value={client.profile?.completedOrders || 0}
          color="text-emerald-600"
        />
        <StatItem
          icon={Star}
          label="Avg Rating"
          value={`${client.profile?.avgRating || 0} / 5`}
          color="text-purple-600"
        />
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Core Data */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company & Bio */}
          <Card className="rounded-2xl border-slate-200">
            <CardHeader className="pb-3 border-b border-slate-50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5 text-slate-400" /> Company
                Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 grid sm:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                    Company Name
                  </label>
                  <p className="text-slate-900 font-medium">
                    {client.profile?.company?.name || "Independent"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                    Industry & Size
                  </label>
                  <p className="text-slate-900 font-medium">
                    {client.profile?.company?.industry} •{" "}
                    {client.profile?.company?.size}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                    Website
                  </label>
                  <a
                    href={client.profile?.company?.website}
                    target="_blank"
                    className="flex items-center gap-1.5 text-indigo-600 hover:underline font-medium"
                  >
                    {client.profile?.company?.website}{" "}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                    Biography
                  </label>
                  <p className="text-sm text-slate-600 leading-relaxed italic">
                    "{client.profile?.bio}"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* History & Sellers */}
          <Card className="rounded-2xl border-slate-200">
            <CardHeader className="pb-3 border-b border-slate-50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-slate-400" /> Hiring History &
                Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid sm:grid-cols-3 gap-6 mb-8">
                <div className="bg-slate-50 p-4 rounded-xl">
                  <span className="text-xs font-medium text-slate-500 block mb-1">
                    Last Active
                  </span>
                  <span className="text-sm font-semibold text-slate-900">
                    {formatDate(client.crmData.lastActive)}
                  </span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                  <span className="text-xs font-medium text-slate-500 block mb-1">
                    Last Hired
                  </span>
                  <span className="text-sm font-semibold text-slate-900">
                    {formatDate(client.history?.lastHired)}
                  </span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                  <span className="text-xs font-medium text-slate-500 block mb-1">
                    Reviews Left
                  </span>
                  <span className="text-sm font-semibold text-slate-900">
                    {client.history?.reviewLeft} total reviews
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider block mb-3">
                  Matching Sellers
                </label>
                <div className="flex flex-wrap gap-2">
                  {client.crmData.matchingSellers?.map((seller) => (
                    <Badge
                      key={seller}
                      variant="outline"
                      className="bg-white hover:bg-slate-50 cursor-pointer py-1 px-3"
                    >
                      <UserPlus className="h-3 w-3 mr-2 text-slate-400" />{" "}
                      {seller}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Health & Trust */}
        <div className="space-y-6">
          {/* Health & Risk */}
          <Card className="rounded-2xl border-slate-200 overflow-hidden">
            <div
              className={cn(
                "h-2 w-full",
                getHealthColor(client.crmData.accountHealth),
              )}
            />
            <CardHeader>
              <CardTitle className="text-lg">Account Health</CardTitle>
              <CardDescription>
                Overall engagement and risk score
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-3xl font-bold text-slate-900">
                    {client.crmData.accountHealth}%
                  </span>
                  <Badge className={cn("shadow-none border", risk.color)}>
                    {risk.label}
                  </Badge>
                </div>
                <Progress
                  value={client.crmData.accountHealth}
                  className={cn(
                    "h-2",
                    getHealthColor(client.crmData.accountHealth),
                  )}
                />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Health is calculated based on activity frequency, payment
                history, and dispute rate.
              </p>
            </CardContent>
          </Card>

          {/* Verification Status */}
          <Card className="rounded-2xl border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">Trust & Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <VerificationItem
                label="Identity Verified"
                status={client.base.isVerified}
                icon={ShieldCheck}
              />
              <VerificationItem
                label="Payment Method"
                status={client.profile?.paymentVerified || false}
                icon={CreditCard}
              />
              <VerificationItem
                label="Spam System Flag"
                status={!client.crmData.isSpam}
                icon={AlertTriangle}
                reverse
              />
            </CardContent>
          </Card>

          {/* Location Preferences */}
          <Card className="rounded-2xl border-slate-200 bg-slate-900 text-slate-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="h-5 w-5 text-slate-400" /> Context
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-indigo-400" />
                <span className="text-sm font-medium">
                  {client.profile?.country}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-indigo-400" />
                <span className="text-sm font-medium">
                  {client.profile?.timezone}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <label className="text-[10px] font-bold uppercase text-slate-500 block mb-2 tracking-widest">
                  Budget Preference
                </label>
                <Badge
                  variant="outline"
                  className="border-indigo-500 text-indigo-400 bg-indigo-500/10"
                >
                  {client.profile?.budgetPreference?.replace(/_/g, " ")}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// --- Internal UI Components ---

function StatItem({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: any;
  color: string;
}) {
  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm">
      <CardContent className="p-5 flex items-center gap-4">
        <div className={cn("p-2.5 rounded-xl bg-slate-50", color)}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {label}
          </p>
          <p className="text-xl font-bold text-slate-900">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function VerificationItem({
  label,
  status,
  icon: Icon,
  reverse,
}: {
  label: string;
  status: boolean;
  icon: any;
  reverse?: boolean;
}) {
  const isPositive = reverse ? !status : status;
  return (
    <div className="flex items-center justify-between p-3 rounded-xl border border-slate-50 bg-slate-50/50">
      <div className="flex items-center gap-3">
        <Icon
          className={cn(
            "h-4 w-4",
            status ? "text-emerald-500" : "text-slate-300",
          )}
        />
        <span className="text-sm font-medium text-slate-700">{label}</span>
      </div>
      <Badge
        variant={status ? "default" : "destructive"}
        className="h-5 text-[10px] px-1.5 shadow-none"
      >
        {status ? "VERIFIED" : "PENDING"}
      </Badge>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
