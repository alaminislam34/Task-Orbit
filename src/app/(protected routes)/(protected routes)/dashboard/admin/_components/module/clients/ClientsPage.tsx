"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Eye,
  Edit2,
  Trash2,
  ShieldCheck,
  AlertTriangle,
  Mail,
} from "lucide-react";

// Reusable Components
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
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { ClientUser } from "@/types/data.types";
import { useExportClients } from "@/hooks/useExportClients";
import ImportClientsModal, {
  ImportClientRow,
} from "@/app/(protected routes)/(protected routes)/dashboard/admin/_components/module/clients/ImportClientsModal";
import BulkActionsBar from "@/app/(protected routes)/(protected routes)/dashboard/admin/_components/module/clients/BulkActionsBar";
import { useBulkSelection } from "@/hooks/useBulkSelection";

const PAGE_SIZE = 8;

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

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

  const formatDate = (date?: string) => {
    if (!date) return "-";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  const getRisk = (health: number) => {
    if (health >= 80)
      return {
        label: "Safe",
        class: "bg-emerald-50 text-emerald-700 border-emerald-100",
        icon: ShieldCheck,
      };
    if (health >= 50)
      return {
        label: "Warning",
        class: "bg-amber-50 text-amber-700 border-amber-100",
        icon: AlertTriangle,
      };
    return {
      label: "Risk",
      class: "bg-rose-50 text-rose-700 border-rose-100",
      icon: AlertTriangle,
    };
  };

  const columns: Column<ClientUser>[] = [
    {
      header: "Client",
      accessor: "base.name",
      // Sticky column keeps identity visible while scrolling right
      className:
        "min-w-[220px] sticky left-0 z-10 bg-white border-r shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]",
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-slate-100 shadow-sm">
            <AvatarImage src={row.base.avatar} />
            <AvatarFallback className="text-xs">
              {row.base.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <span className="font-semibold text-sm truncate text-slate-900">
              {row.base.name}
            </span>
            <span className="text-[10px] text-muted-foreground truncate italic">
              @{row.base.username}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Email",
      accessor: "base.email",
      className: "min-w-[200px]",
      render: (row) => (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Mail size={12} />
          <span className="truncate">{row.base.email}</span>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "base.status",
      className: "min-w-[110px]",
      render: (row) => (
        <Badge
          variant="outline"
          className={cn(
            "capitalize font-medium text-[10px] px-2",
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
      header: "Tier",
      accessor: "crmData.clientTier",
      className: "min-w-[100px]",
      render: (row) => (
        <Badge
          className={cn(
            "shadow-none border-none text-[10px] uppercase tracking-wider",
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
      header: "Spending",
      accessor: "profile.totalSpent",
      className: "min-w-[130px]",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-700">
            {formatCurrency(row.profile?.totalSpent)}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {row.profile?.completedOrders || 0} orders
          </span>
        </div>
      ),
    },
    {
      header: "Health",
      accessor: "crmData.accountHealth",
      className: "min-w-[140px]",
      render: (row) => {
        const health = row.crmData?.accountHealth ?? 75;
        return (
          <div className="flex flex-col gap-1">
            <Progress value={health} className="h-1.5 w-24" />
            <span className="text-[10px] text-muted-foreground font-medium">
              {health}% Score
            </span>
          </div>
        );
      },
    },
    {
      header: "Risk",
      accessor: "crmData.accountHealth",
      className: "min-w-[100px]",
      render: (row) => {
        const risk = getRisk(row.crmData.accountHealth);
        const Icon = risk.icon;
        return (
          <Badge
            className={cn(
              "flex items-center gap-1 text-[10px] shadow-none border font-medium",
              risk.class,
            )}
          >
            <Icon size={10} /> {risk.label}
          </Badge>
        );
      },
    },
    {
      header: "Verification",
      accessor: "base.isVerified",
      className: "min-w-[130px]",
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.base.isVerified ? (
            <ShieldCheck className="text-blue-500 h-4 w-4" />
          ) : (
            <AlertTriangle className="text-slate-300 h-4 w-4" />
          )}
          <span className="text-[10px] font-medium text-slate-500 uppercase">
            {row.profile?.paymentVerified ? "Verified" : "Pending"}
          </span>
        </div>
      ),
    },
    {
      header: "Activity",
      accessor: "crmData.lastActive",
      className: "min-w-[150px]",
      render: (row) => (
        <div className="flex flex-col text-[11px]">
          <span className="font-medium text-slate-700">
            {formatDate(row.crmData.lastActive)}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {row.profile?.country || "Global"}
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

  const { isExporting, exportCSV } = useExportClients(filteredData);
  const bulkSelection = useBulkSelection();

  const filteredIds = useMemo(
    () => filteredData.map((client) => client.id),
    [filteredData],
  );
  const visibleIds = useMemo(
    () => paginatedData.map((client) => client.id),
    [paginatedData],
  );
  const visibleSelectionState = bulkSelection.getSelectionState(visibleIds);

  const handleImportClients = (importedRows: ImportClientRow[]) => {
    const now = new Date().toISOString();

    const nextClients: ClientUser[] = importedRows.map((row, index) => {
      const baseUsername = row.email.split("@")[0] || `client_${index + 1}`;

      return {
        id:
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `imported-${Date.now()}-${index}`,
        role: "CLIENT",
        createdAt: now,
        base: {
          name: row.name,
          username: baseUsername,
          email: row.email,
          status: row.status,
          isVerified: false,
        },
        profile: {
          totalSpent: 0,
          activeOrders: 0,
          completedOrders: 0,
          paymentVerified: false,
          country: "Global",
        },
        crmData: {
          lastActive: now,
          accountHealth: 70,
          clientTier: "SILVER",
          isSpam: false,
        },
      };
    });

    setRawData((prev) => [...nextClients, ...prev]);
  };

  const handleBulkDelete = () => {
    const selectedSet = new Set(bulkSelection.getSelectedList());
    setRawData((prev) => prev.filter((client) => !selectedSet.has(client.id)));
    bulkSelection.clearAll();
  };

  const handleBulkStatusChange = (status: "ONLINE" | "OFFLINE") => {
    const selectedSet = new Set(bulkSelection.getSelectedList());
    setRawData((prev) =>
      prev.map((client) =>
        selectedSet.has(client.id)
          ? {
              ...client,
              base: {
                ...client.base,
                status,
              },
            }
          : client,
      ),
    );
  };

  const handleBulkMarkVerified = () => {
    const selectedSet = new Set(bulkSelection.getSelectedList());
    setRawData((prev) =>
      prev.map((client) =>
        selectedSet.has(client.id)
          ? {
              ...client,
              base: {
                ...client.base,
                isVerified: true,
              },
              profile: {
                ...client.profile,
                paymentVerified: true,
              },
            }
          : client,
      ),
    );
  };

  return (
    <div className="w-full min-w-0 max-w-full space-y-6 overflow-x-hidden">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Manage Clients</h2>
        <p className="text-sm text-muted-foreground mt-1">
          View and manage all clients registered on the platform.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="ml-2"
            onClick={exportCSV}
            disabled={isExporting}
          >
            {isExporting ? "Exporting..." : "Export Data"}
          </Button>

          <ImportClientsModal
            onImport={handleImportClients}
            trigger={
              <Button variant="outline" size="sm" className="ml-2">
                Import Clients
              </Button>
            }
          />

          <BulkActionsBar
            selectedCount={bulkSelection.selectedCount}
            totalCount={filteredIds.length}
            onSelectAll={() => bulkSelection.toggleMany(filteredIds, true)}
            onClearAll={bulkSelection.clearAll}
            onChangeStatus={handleBulkStatusChange}
            onMarkVerified={handleBulkMarkVerified}
            onDelete={handleBulkDelete}
          />

          <Button
            render={<Link href="/dashboard/admin/manage-clients/reports" />}
            variant="outline"
            size="sm"
            className="ml-2"
          >
            View Reports
          </Button>
          <Button variant="outline" size="sm" className="ml-2">
            Settings
          </Button>{" "}
        </div>
      </div>
      <div className="w-full min-w-0 max-w-full p-1">
        <ClientStats data={rawData} loading={isLoading} />
      </div>

      {/* --- RESPONSIVE WRAPPER --- */}
      <div className="w-full min-w-0 max-w-full overflow-hidden">
        <div className="w-full min-w-0 max-w-full">
          <CommonTable
            columns={columns}
            data={paginatedData}
            loading={isLoading}
            selection={{
              getRowId: (row) => row.id,
              selectedRowIds: bulkSelection.selectedIds,
              allVisibleSelected: visibleSelectionState.allSelected,
              someVisibleSelected: visibleSelectionState.someSelected,
              onToggleAllVisible: (checked) =>
                bulkSelection.toggleMany(visibleIds, checked),
              onToggleRow: bulkSelection.toggleOne,
            }}
            pagination={{
              page: currentPage,
              totalPages: totalPages,
              onPageChange: setCurrentPage,
            }}
            actions={(row) => (
              <TooltipProvider>
                {/* min-width on actions ensures they don't wrap or squish */}
                <div className="flex items-center gap-1 justify-end pr-4 min-w-32.5">
                  <Tooltip>
                    <TooltipTrigger>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-500 hover:text-indigo-600"
                      >
                        <Link
                          href={`/dashboard/admin/manage-clients/${row.id}`}
                        >
                          <Eye size={16} />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>View Details</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        <Edit2 size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Edit Client</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 size={16} />
                      </Button>
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
            ></TableToolbar>
          </CommonTable>
        </div>
      </div>
    </div>
  );
}
