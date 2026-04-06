"use client";

import React, { useMemo, useRef, useState } from "react";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface ImportClientRow {
  name: string;
  email: string;
  status: "ONLINE" | "OFFLINE";
}

interface ImportClientsModalProps {
  onImport?: (rows: ImportClientRow[]) => void | Promise<void>;
  trigger?: React.ReactElement;
}

const REQUIRED_HEADERS = ["name", "email"];

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      const nextChar = line[i + 1];
      if (inQuotes && nextChar === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  result.push(current.trim());
  return result;
}

function normalizeStatus(value?: string): "ONLINE" | "OFFLINE" {
  const status = (value || "").trim().toUpperCase();
  return status === "ONLINE" ? "ONLINE" : "OFFLINE";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function ImportClientsModal({
  onImport,
  trigger,
}: ImportClientsModalProps) {
  const [open, setOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [rows, setRows] = useState<ImportClientRow[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const canImport = useMemo(() => rows.length > 0 && !isImporting, [rows, isImporting]);
  const triggerElement = trigger || (
    <Button variant="outline" size="sm">
      Import Clients
    </Button>
  );

  const resetState = () => {
    setFileName("");
    setRows([]);
    setErrors([]);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const parseFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setErrors(["Please upload a valid CSV file."]);
      setRows([]);
      return;
    }

    setIsParsing(true);
    setErrors([]);

    try {
      const text = await file.text();
      const lines = text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      if (!lines.length) {
        setErrors(["CSV is empty."]);
        setRows([]);
        return;
      }

      const headers = parseCsvLine(lines[0]).map((header) => header.toLowerCase().trim());
      const missing = REQUIRED_HEADERS.filter((header) => !headers.includes(header));

      if (missing.length) {
        setErrors([`Missing required columns: ${missing.join(", ")}`]);
        setRows([]);
        return;
      }

      const nameIndex = headers.indexOf("name");
      const emailIndex = headers.indexOf("email");
      const statusIndex = headers.indexOf("status");

      const nextRows: ImportClientRow[] = [];
      const parseErrors: string[] = [];

      for (let i = 1; i < lines.length; i += 1) {
        const cols = parseCsvLine(lines[i]);
        const lineNumber = i + 1;

        const name = (cols[nameIndex] || "").trim();
        const email = (cols[emailIndex] || "").trim().toLowerCase();
        const status = normalizeStatus(cols[statusIndex]);

        if (!name || !email) {
          parseErrors.push(`Row ${lineNumber}: name and email are required.`);
          continue;
        }

        if (!isValidEmail(email)) {
          parseErrors.push(`Row ${lineNumber}: invalid email format (${email}).`);
          continue;
        }

        nextRows.push({ name, email, status });
      }

      setRows(nextRows);
      setErrors(parseErrors);

      if (!nextRows.length) {
        toast.error("No valid rows found in CSV.");
      } else {
        toast.success(`${nextRows.length} row(s) parsed successfully.`);
      }
    } catch (error) {
      console.error("Failed to parse CSV:", error);
      setErrors(["Failed to parse CSV file."]);
      setRows([]);
    } finally {
      setIsParsing(false);
    }
  };

  const handleImport = async () => {
    if (!rows.length) {
      toast.error("No valid rows to import.");
      return;
    }

    try {
      setIsImporting(true);
      await onImport?.(rows);
      toast.success(`${rows.length} client(s) imported.`);
      setOpen(false);
      resetState();
    } catch (error) {
      console.error("Import failed:", error);
      toast.error("Failed to import clients.");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) resetState();
      }}
    >
      <DialogTrigger render={triggerElement} />

      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle>Import Clients</DialogTitle>
          <DialogDescription>
            Upload a CSV file with at least name and email columns.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 px-6 py-4">
          <div
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                inputRef.current?.click();
              }
            }}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragging(false);
              const droppedFile = event.dataTransfer.files?.[0];
              if (droppedFile) {
                setFileName(droppedFile.name);
                void parseFile(droppedFile);
              }
            }}
            className={cn(
              "flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center transition-colors",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:bg-muted/40",
            )}
          >
            <Upload className="mb-2 h-5 w-5 text-muted-foreground" />
            <p className="text-sm font-medium">Drag & drop CSV here</p>
            <p className="text-xs text-muted-foreground">or click to browse</p>
            {fileName ? (
              <Badge variant="secondary" className="mt-3">
                <FileText className="mr-1 h-3.5 w-3.5" /> {fileName}
              </Badge>
            ) : null}
          </div>

          <Input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(event) => {
              const selectedFile = event.target.files?.[0];
              if (selectedFile) {
                setFileName(selectedFile.name);
                void parseFile(selectedFile);
              }
            }}
          />

          {errors.length ? (
            <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3">
              <p className="mb-2 flex items-center gap-2 text-sm font-medium text-destructive">
                <AlertCircle className="h-4 w-4" /> Validation issues
              </p>
              <ul className="max-h-28 space-y-1 overflow-auto text-xs text-destructive">
                {errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="rounded-md border">
            <div className="border-b px-3 py-2 text-sm font-medium">
              Preview ({rows.length})
            </div>
            <div className="max-h-60 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.length ? (
                    rows.map((row) => (
                      <TableRow key={`${row.email}-${row.name}`}>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{row.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="py-8 text-center text-sm text-muted-foreground">
                        No data to preview.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t px-6 py-4">
          <Button variant="outline" onClick={resetState} disabled={isParsing || isImporting}>
            Reset
          </Button>
          <Button onClick={handleImport} disabled={!canImport || isParsing}>
            {isParsing ? "Parsing..." : isImporting ? "Importing..." : "Import Clients"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
