"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Eye,
  Edit2,
  Trash2,
  UserCheck,
  Zap,
  Clock,
  Target,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";

// Shared & UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CommonTable, { Column } from "@/components/shared/Table/C_Table";
import { TableToolbar } from "@/components/shared/Table/TableToolbar";

// Hooks & Utils
import { useBulkSelection } from "@/hooks/useBulkSelection";
import { useRouter } from "next/navigation";
import BulkActionsBar from "./_components/BulkActionsBar";

// Types (You can move this to your types file)
interface GuestUser {
  id: string;
  role: "NORMAL";
  base: {
    name: string;
    username: string;
    email: string;
    avatar: string;
    isVerified: boolean;
    status: "ONLINE" | "OFFLINE";
  };
  onboarding: {
    step: number;
    isProfileComplete: boolean;
    interestedIn: string[];
    accountTypePreference: "CLIENT" | "SELLER" | "UNDECIDED";
  };
  crmData: {
    conversionProbability: "HIGH" | "MEDIUM" | "LOW";
    suggestedPath: string;
    lastActive: string;
    marketingEmailsSent: number;
  };
}

const PAGE_SIZE = 10;

export default function GuestManagePage() {
  const [rawData, setRawData] = useState<GuestUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  // Data Fetching
  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const response = await fetch("/data/users.json");
        const data = await response.json();
        const guests = data.filter((user: any) => user.role === "NORMAL");
        setRawData(guests);
      } catch (error) {
        console.error("Error loading guests:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGuests();
  }, []);

  // Filtering Logic
  const filteredData = useMemo(() => {
    return rawData.filter((guest) => {
      const matchesSearch =
        search === "" ||
        [guest.base.name, guest.base.email, guest.base.username].some((f) =>
          f.toLowerCase().includes(search.toLowerCase()),
        );
      const matchesProb =
        !filters.probability ||
        guest.crmData.conversionProbability === filters.probability;
      const matchesStatus =
        !filters.status || guest.base.status === filters.status;
      return matchesSearch && matchesProb && matchesStatus;
    });
  }, [rawData, search, filters]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredData.slice(start, start + PAGE_SIZE);
  }, [filteredData, currentPage]);

  const bulkSelection = useBulkSelection();
  const visibleIds = paginatedData.map((g) => g.id);
  const selectionState = bulkSelection.getSelectionState(visibleIds);

  // Table Columns Definition
  const columns: Column<GuestUser>[] = [
    {
      header: "Guest User",
      accessor: "base.name",
      className:
        "min-w-[220px] sticky left-0 z-10 bg-white border-r shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]",
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-slate-100">
            <AvatarImage src={row.base.avatar} />
            <AvatarFallback>{row.base.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <span className="font-semibold text-sm text-slate-900 truncate">
              {row.base.name}
            </span>
            <span className="text-[10px] text-muted-foreground truncate">
              @{row.base.username}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Onboarding",
      accessor: "onboarding.step",
      className: "min-w-[150px]",
      render: (row) => (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[10px] font-medium">
            <span>Step {row.onboarding.step}/4</span>
            <span
              className={
                row.onboarding.isProfileComplete
                  ? "text-emerald-600"
                  : "text-amber-600"
              }
            >
              {row.onboarding.isProfileComplete ? "Complete" : "In Progress"}
            </span>
          </div>
          <Progress value={(row.onboarding.step / 4) * 100} className="h-1" />
        </div>
      ),
    },
    {
      header: "Interests",
      accessor: "onboarding.interestedIn",
      className: "min-w-[180px]",
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.onboarding.interestedIn.slice(0, 2).map((interest, i) => (
            <Badge
              key={i}
              variant="secondary"
              className="text-[9px] px-1.5 py-0 h-4 font-normal"
            >
              {interest}
            </Badge>
          ))}
          {row.onboarding.interestedIn.length > 2 && (
            <span className="text-[9px] text-muted-foreground">
              +{row.onboarding.interestedIn.length - 2}
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Conversion",
      accessor: "crmData.conversionProbability",
      className: "min-w-[120px]",
      render: (row) => {
        const prob = row.crmData.conversionProbability;
        const config = {
          HIGH: "bg-emerald-50 text-emerald-700 border-emerald-100",
          MEDIUM: "bg-blue-50 text-blue-700 border-blue-100",
          LOW: "bg-slate-50 text-slate-600 border-slate-200",
        };
        return (
          <Badge className={`shadow-none border text-[10px] ${config[prob]}`}>
            <Zap size={10} className="mr-1 fill-current" /> {prob}
          </Badge>
        );
      },
    },
    {
      header: "Suggested Path",
      accessor: "crmData.suggestedPath",
      className: "min-w-[110px]",
      render: (row) => (
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600">
          <Target size={12} className="text-indigo-500" />
          {row.crmData.suggestedPath}
        </div>
      ),
    },
    {
      header: "Last Active",
      accessor: "crmData.lastActive",
      className: "min-w-[130px]",
      render: (row) => (
        <div className="flex flex-col text-[11px]">
          <span className="text-slate-700 font-medium">
            {new Date(row.crmData.lastActive).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
          <span className="text-muted-foreground flex items-center gap-1">
            <Clock size={10} />{" "}
            {new Date(row.crmData.lastActive).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Guest Management
          </h2>
          <p className="text-sm text-muted-foreground">
            Monitor and convert potential leads into platform users.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => router.refresh()}>
            Refresh Data
          </Button>
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
            Send Bulk Email
          </Button>
        </div>
      </header>

      {/* Stats Summary (Simplified) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CardStats
          label="Total Guests"
          value={rawData.length}
          icon={UserCheck}
          color="text-blue-600"
        />
        <CardStats
          label="High Probability"
          value={
            rawData.filter((r) => r.crmData.conversionProbability === "HIGH")
              .length
          }
          icon={TrendingUp}
          color="text-emerald-600"
        />
        <CardStats
          label="Average Progress"
          value="Step 2.4"
          icon={ArrowUpRight}
          color="text-indigo-600"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <CommonTable
          columns={columns}
          data={paginatedData}
          loading={isLoading}
          selection={{
            getRowId: (row) => row.id,
            selectedRowIds: bulkSelection.selectedIds,
            allVisibleSelected: selectionState.allSelected,
            someVisibleSelected: selectionState.someSelected,
            onToggleAllVisible: (checked) =>
              bulkSelection.toggleMany(visibleIds, checked),
            onToggleRow: bulkSelection.toggleOne,
          }}
          pagination={{
            page: currentPage,
            totalPages: Math.ceil(filteredData.length / PAGE_SIZE),
            onPageChange: setCurrentPage,
          }}
          actions={(row) => (
            <div className="flex items-center gap-1 justify-end pr-4">
              <ActionButton
                icon={Eye}
                tooltip="View History"
                onClick={() => {}}
              />
              <ActionButton
                icon={Edit2}
                tooltip="Quick Edit"
                onClick={() => {}}
              />
              <ActionButton
                icon={Trash2}
                tooltip="Remove"
                variant="hover:text-rose-600 hover:bg-rose-50"
                onClick={() => {}}
              />
            </div>
          )}
        >
          <TableToolbar
            searchProps={{
              value: search,
              onChange: setSearch,
              placeholder: "Search guests by name or email...",
            }}
            filterProps={{
              filters: [
                {
                  key: "probability",
                  label: "Probability",
                  options: [
                    { label: "High", value: "HIGH" },
                    { label: "Medium", value: "MEDIUM" },
                    { label: "Low", value: "LOW" },
                  ],
                },
                {
                  key: "status",
                  label: "Status",
                  options: [
                    { label: "Online", value: "ONLINE" },
                    { label: "Offline", value: "OFFLINE" },
                  ],
                },
              ],
              value: filters,
              onChange: setFilters,
              onReset: () => {
                setSearch("");
                setFilters({});
              },
            }}
          />
        </CommonTable>
      </div>

      {bulkSelection.selectedCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <BulkActionsBar
            selectedCount={bulkSelection.selectedCount}
            totalCount={filteredData.length}
            onClearAll={bulkSelection.clearAll}
            // Add your bulk handlers here
          />
        </div>
      )}
    </div>
  );
}

// Helper Components
function CardStats({ label, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4">
      <div className={`p-2 rounded-lg bg-slate-50 ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  tooltip,
  onClick,
  variant = "hover:text-indigo-600 hover:bg-indigo-50",
}: any) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 text-slate-500 ${variant}`}
            onClick={onClick}
          >
            <Icon size={16} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
