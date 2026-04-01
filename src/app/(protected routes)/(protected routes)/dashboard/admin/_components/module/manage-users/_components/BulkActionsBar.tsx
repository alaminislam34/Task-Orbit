"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Trash2,
  CheckCircle,
  Mail,
  Download,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

interface BulkActionsBarProps {
  selectedCount: number;
  totalCount: number;
  onClearAll: () => void;
  onDelete?: () => void;
  onMarkVerified?: () => void;
  onExport?: () => void;
  onSendEmail?: () => void;
}

export default function BulkActionsBar({
  selectedCount,
  totalCount,
  onClearAll,
  onDelete,
  onMarkVerified,
  onExport,
  onSendEmail,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, x: "-50%", opacity: 0 }}
        animate={{ y: 0, x: "-50%", opacity: 1 }}
        exit={{ y: 100, x: "-50%", opacity: 0 }}
        className="fixed bottom-8 left-1/2 z-50 flex items-center gap-4 rounded-full border border-slate-200 bg-white/90 p-2 pl-6 pr-3 shadow-2xl backdrop-blur-md ring-1 ring-slate-950/5"
      >
        {/* Selection Info */}
        <div className="flex items-center gap-3">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-[12px] font-bold text-white shadow-sm">
            {selectedCount}
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-bold text-slate-900 leading-none">
              Selected Users
            </p>
            <p className="text-[10px] text-muted-foreground font-medium">
              out of {totalCount} total records
            </p>
          </div>
        </div>

        <Separator orientation="vertical" className="mx-2 h-8" />

        {/* Primary Actions */}
        <div className="flex items-center gap-1">
          <TooltipButton
            label="Send Email"
            icon={Mail}
            onClick={onSendEmail}
            className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50"
          />

          <TooltipButton
            label="Mark Verified"
            icon={CheckCircle}
            onClick={onMarkVerified}
            className="text-slate-600 hover:text-emerald-600 hover:bg-emerald-50"
          />

          <TooltipButton
            label="Export Selected"
            icon={Download}
            onClick={onExport}
            className="text-slate-600 hover:text-blue-600 hover:bg-blue-50"
          />

          <TooltipButton
            label="Delete"
            icon={Trash2}
            onClick={onDelete}
            className="text-rose-500 hover:text-rose-700 hover:bg-rose-50"
          />
        </div>

        <Separator orientation="vertical" className="mx-2 h-8" />

        {/* More Actions & Close */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full"
              >
                <MoreHorizontal size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={onMarkVerified}>
                Update Membership Tier
              </DropdownMenuItem>
              <DropdownMenuItem>Add to Campaign</DropdownMenuItem>
              <DropdownMenuItem className="text-rose-600 font-medium">
                Restrict Access
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="secondary"
            size="sm"
            onClick={onClearAll}
            className="h-9 rounded-full bg-slate-900 px-4 text-xs font-semibold text-white hover:bg-slate-800 transition-all active:scale-95"
          >
            <X size={14} className="mr-2" />
            Deselect
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Helper Component for Tooltip Buttons
function TooltipButton({ icon: Icon, onClick, className, label }: any) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={`h-9 w-9 rounded-full transition-colors ${className}`}
      title={label}
    >
      <Icon size={18} />
    </Button>
  );
}
