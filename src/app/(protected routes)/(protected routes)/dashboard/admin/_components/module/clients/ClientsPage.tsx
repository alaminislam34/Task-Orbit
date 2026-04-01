"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  User,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

// Existing Reusable Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CommonTable, { Column } from "@/components/shared/Table/C_Table";
import { TableToolbar } from "@/components/shared/Table/TableToolbar";
import { ClientStats } from "./ClientStats";

interface ClientUser {
  id: string;
  role: "CLIENT" | "SELLER" | "ADMIN"; // Specific literal types are better for Senior devs
  createdAt?: string;
  base: {
    name: string;
    username: string;
    email: string;
    avatar?: string;
    status: "ONLINE" | "OFFLINE";
    isVerified: boolean;
  };
  profile?: {
    // Company Information
    company?: {
      name: string;
      website: string;
      size: string;
      industry: string;
    };
    bio?: string;

    // Financials & Stats
    totalSpent?: number;
    activeOrders?: number;
    completedOrders?: number;
    avgRating?: number;

    // Preferences & Trust
    paymentVerified?: boolean;
    preferredCategories?: string[];
    budgetPreference?: "LOW" | "MID" | "HIGH" | "MID_TO_HIGH";

    // Geography
    country?: string;
    timezone?: string;
  };
  history?: {
    lastHired?: string;
    topSellersHired?: string[];
    reviewLeft?: number;
  };
  crmData: {
    lastActive: string;
    accountHealth: number; // Derived 0-100
    clientTier: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";
    matchingSellers?: string[];
    isSpam?: boolean;
  };
}
const PAGE_SIZE = 8;

export default function ClientManagePage() {
  const [rawData, setRawData] = useState<ClientUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/data/users.json");
        const data = await response.json();
        const clients = data.filter(
          (user: ClientUser) => user.role === "CLIENT",
        );
        setRawData(clients);
      } catch (error) {
        console.error("Failed to fetch clients:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredData = useMemo(() => {
    return rawData.filter((client) => {
      const matchesSearch =
        search === "" ||
        [client.base.name, client.base.username, client.base.email].some(
          (field) => field.toLowerCase().includes(search.toLowerCase()),
        );

      const matchesStatus =
        !filters.status || client.base.status === filters.status;
      const matchesVerified =
        !filters.verified ||
        String(client.base.isVerified) === filters.verified;

      return matchesSearch && matchesStatus && matchesVerified;
    });
  }, [rawData, search, filters]);

  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredData.slice(start, start + PAGE_SIZE);
  }, [filteredData, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filters]);

  const formatCurrency = (value?: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value || 0);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(dateString));
  };

  const columns: Column<ClientUser>[] = [
    {
      header: "Client & Company",
      accessor: "base.name",
      className: "min-w-[250px]",
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-slate-100">
            <AvatarImage src={row.base.avatar} alt={row.base.name} />
            <AvatarFallback className="font-bold">
              {row.base.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <span className="font-semibold text-slate-900 truncate">
              {row.base.name}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {row.profile?.company?.name || `@${row.base.username}`}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Tier",
      accessor: "crmData.clientTier",
      render: (row) => (
        <Badge
          variant="secondary"
          className={cn(
            "font-bold shadow-none border-none",
            row.crmData.clientTier === "GOLD"
              ? "bg-amber-100 text-amber-700"
              : row.crmData.clientTier === "PLATINUM"
                ? "bg-indigo-100 text-indigo-700"
                : "bg-slate-100 text-slate-700",
          )}
        >
          {row.crmData.clientTier}
        </Badge>
      ),
    },
    {
      header: "Status",
      accessor: "base.status",
      render: (row) => (
        <Badge
          variant="outline"
          className={cn(
            "capitalize font-medium px-2.5",
            row.base.status === "ONLINE"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-slate-200 bg-slate-50 text-slate-600",
          )}
        >
          <span
            className={cn(
              "mr-1.5 h-1.5 w-1.5 rounded-full inline-block",
              row.base.status === "ONLINE" ? "bg-emerald-500" : "bg-slate-400",
            )}
          />
          {row.base.status.toLowerCase()}
        </Badge>
      ),
    },
    {
      header: "Financials",
      accessor: "profile.totalSpent",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-700">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(row.profile?.totalSpent || 0)}
          </span>
          <span className="text-[10px] text-muted-foreground uppercase font-medium">
            {row.profile?.completedOrders || 0} Completed
          </span>
        </div>
      ),
    },
    {
      header: "Activity",
      accessor: "crmData.lastActive",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-sm text-slate-600 font-medium">
            {new Intl.DateTimeFormat("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }).format(new Date(row.crmData.lastActive))}
          </span>
          <span className="text-[10px] text-muted-foreground truncate">
            {row.profile?.country || "Global"} •{" "}
            {row.profile?.timezone || "UTC"}
          </span>
        </div>
      ),
    },
    {
      header: "Verification",
      accessor: "base.isVerified",
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.base.isVerified ? (
            <ShieldCheck className="h-5 w-5 text-blue-500" />
          ) : (
            <AlertCircle className="h-5 w-5 text-slate-300" />
          )}
          <span className="text-xs font-medium text-slate-500">
            {row.profile?.paymentVerified ? "Payment ✓" : "ID Only"}
          </span>
        </div>
      ),
    },
  ];

  const filterOptions = [
    {
      key: "status",
      label: "Status",
      options: [
        { label: "Online", value: "ONLINE" },
        { label: "Offline", value: "OFFLINE" },
      ],
    },
    {
      key: "verified",
      label: "Verified",
      options: [
        { label: "Yes", value: "true" },
        { label: "No", value: "false" },
      ],
    },
  ];

  return (
    <div className="w-full space-y-6">
      <ClientStats data={rawData} loading={isLoading} />

      <CommonTable
        columns={columns}
        data={paginatedData}
        loading={isLoading}
        pagination={{
          page: currentPage,
          totalPages: totalPages,
          onPageChange: setCurrentPage,
        }}
        actions={(row) => (
          // 1. TooltipProvider wraps the group (no delayDuration here)
          <TooltipProvider>
            <div className="flex items-center gap-1 justify-end">
              {/* 2. Move  to the Tooltip component */}
              <Tooltip>
                <TooltipTrigger>
                  {/* 3. Use <span> to wrap Button since asChild is disabled */}
                  <span className="inline-block">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-slate-100"
                      onClick={() => console.log("View", row.id)}
                    >
                      <Eye size={16} className="text-slate-500" />
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>View Details</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <span className="inline-block">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-indigo-50 hover:text-indigo-600"
                      onClick={() => console.log("Edit", row.id)}
                    >
                      <Edit2 size={16} />
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>Edit Client</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <span className="inline-block">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-rose-50 hover:text-rose-600"
                      onClick={() => console.log("Delete", row.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>Delete Client</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        )}
      >
        <TableToolbar
          searchProps={{
            value: search,
            onChange: setSearch,
            placeholder: "Search clients...",
          }}
          filterProps={{
            filters: filterOptions,
            value: filters,
            onChange: setFilters,
            onReset: () => {
              setSearch("");
              setFilters({});
            },
          }}
        >
          <Button
            size="sm"
            variant="default"
            className="bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
          >
            Add Client
          </Button>
        </TableToolbar>
      </CommonTable>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
