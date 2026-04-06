"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { ClientUser } from "@/types/data.types";
import { exportToCSV, exportToExcel } from "@/lib/export.utils";

type ExportClientRow = {
  name: string;
  email: string;
  status: string;
  totalSpent: number;
  createdAt: string;
};

function formatDate(value?: string) {
  if (!value) return "-";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";

  return parsed.toISOString().slice(0, 10);
}

function getFileDateStamp() {
  return new Date().toISOString().slice(0, 10);
}

export function useExportClients(clients: ClientUser[]) {
  const [isExporting, setIsExporting] = useState(false);
  const columns = ["name", "email", "status", "totalSpent", "createdAt"];

  const exportRows = useMemo<ExportClientRow[]>(() => {
    return clients.map((client) => ({
      name: client.base.name,
      email: client.base.email,
      status: client.base.status,
      totalSpent: client.profile?.totalSpent ?? 0,
      createdAt: formatDate(client.createdAt),
    }));
  }, [clients]);

  const exportCSV = useCallback(async () => {
    if (!exportRows.length) {
      toast.error("No clients found to export.");
      return;
    }

    try {
      setIsExporting(true);
      exportToCSV(exportRows, {
        filename: `clients-${getFileDateStamp()}.csv`,
        columns,
      });
      toast.success("Clients exported successfully.");
    } catch (error) {
      console.error("Failed to export clients as CSV:", error);
      toast.error("Failed to export clients.");
    } finally {
      setIsExporting(false);
    }
  }, [exportRows]);

  const exportExcelFile = useCallback(async () => {
    if (!exportRows.length) {
      toast.error("No clients found to export.");
      return;
    }

    try {
      setIsExporting(true);
      exportToExcel(exportRows, {
        filename: `clients-${getFileDateStamp()}.xls`,
        columns,
      });
      toast.success("Clients exported successfully.");
    } catch (error) {
      console.error("Failed to export clients as Excel:", error);
      toast.error("Failed to export clients.");
    } finally {
      setIsExporting(false);
    }
  }, [exportRows, columns]);

  return {
    isExporting,
    exportCSV,
    exportExcel: exportExcelFile,
  };
}
