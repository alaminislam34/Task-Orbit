"use client";

import React, { useState } from "react";
import { 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Wallet, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  MoreVertical,
  Download,
  Filter,
  CreditCard
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Mock Transaction Data
const transactions = [
  {
    id: "TXN-9901",
    user: { name: "Al Amin Islam", role: "SELLER", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AlAmin" },
    amount: 1250.00,
    type: "PAYOUT",
    status: "COMPLETED",
    method: "Bank Transfer",
    date: "2026-03-25"
  },
  {
    id: "TXN-9902",
    user: { name: "Violet Evergarden", role: "CLIENT", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Violet" },
    amount: 3200.50,
    type: "ESCROW_DEPOSIT",
    status: "PENDING",
    method: "Stripe",
    date: "2026-03-26"
  },
  {
    id: "TXN-9903",
    user: { name: "Luke Harrison", role: "CLIENT", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Luke" },
    amount: 5000.00,
    type: "PLATFORM_FEE",
    status: "COMPLETED",
    method: "PayPal",
    date: "2026-03-24"
  }
];

const SuperAdminPaymentPage = () => {
  const [activeTab, setActiveTab] = useState("all");

  const stats = [
    { label: "Total Revenue", value: "$142,500", icon: Wallet, color: "text-blue-600", bg: "bg-blue-500/10" },
    { label: "Pending Payouts", value: "$12,400", icon: Clock, color: "text-amber-600", bg: "bg-amber-500/10" },
    { label: "Platform Commission", value: "$28,920", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-500/10" },
    { label: "Refund Requests", value: "3", icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-500/10" },
  ];

  return (
    <div className="p-6 space-y-8 bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
         <h1 className="text-2xl">Financial Ledger</h1>
          <p className="text-muted-foreground font-medium text-sm">Review transactions, handle payouts, and manage fees.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="rounded-xl font-bold border-2 gap-2">
             <Download className="w-4 h-4" /> Report
           </Button>
           <Button className="bg-slate-900 text-white font-bold rounded-xl px-6">
             Process Batch Payouts
           </Button>
        </div>
      </div>

      {/* Financial Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-border/40 shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-2xl font-black mt-1 tracking-tight">{stat.value}</h3>
              </div>
              <div className={cn(stat.bg, stat.color, "p-3 rounded-2xl")}>
                <stat.icon className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Transaction Management */}
      <Card className="border-border/40 shadow-2xl shadow-black/5 rounded-3xl overflow-hidden bg-card">
        <CardHeader className="bg-muted/10 border-b border-border/40 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-2 bg-background border rounded-xl px-3 py-1.5 w-full lg:w-80">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search Transaction ID or User..." className="border-none focus-visible:ring-0 font-medium text-sm" />
            </div>
            
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {["ALL", "PENDING", "COMPLETED", "FAILED"].map((s) => (
                <Button 
                  key={s} 
                  variant={activeTab === s ? "default" : "ghost"}
                  onClick={() => setActiveTab(s)}
                  className={cn("rounded-full text-[10px] font-black px-4 h-8 transition-all", 
                    activeTab === s ? "bg-slate-900 text-white" : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/20 border-b border-border text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                  <th className="px-6 py-5">Transaction ID</th>
                  <th className="px-6 py-5">User & Role</th>
                  <th className="px-6 py-5">Type & Method</th>
                  <th className="px-6 py-5">Amount</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-muted/5 transition-all group">
                    <td className="px-6 py-5">
                      <p className="text-xs font-mono font-bold tracking-tighter">{txn.id}</p>
                      <p className="text-[10px] text-muted-foreground font-medium italic">{txn.date}</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <img src={txn.user.avatar} className="w-9 h-9 rounded-full bg-muted" alt="" />
                        <div>
                          <p className="text-xs font-black">{txn.user.name}</p>
                          <p className="text-[10px] font-bold text-muted-foreground tracking-tighter uppercase">{txn.user.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                       <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase text-slate-700">{txn.type.replace("_", " ")}</p>
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium italic">
                             <CreditCard className="w-3 h-3"/> {txn.method}
                          </p>
                       </div>
                    </td>
                    <td className="px-6 py-5 font-mono">
                       <div className="flex items-center gap-1">
                          {txn.type === "PAYOUT" ? 
                            <ArrowUpRight className="w-3 h-3 text-rose-500" /> : 
                            <ArrowDownLeft className="w-3 h-3 text-emerald-500" />
                          }
                          <span className={cn("text-sm font-black", txn.type === "PAYOUT" ? "text-rose-600" : "text-emerald-600")}>
                            ${txn.amount.toLocaleString()}
                          </span>
                       </div>
                    </td>
                    <td className="px-6 py-5">
                       <Badge variant="outline" className={cn("text-[9px] font-black px-2 py-0", 
                          txn.status === "COMPLETED" ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-600" : 
                          "border-amber-500/30 bg-amber-500/5 text-amber-600"
                       )}>
                          {txn.status}
                       </Badge>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger >
                          <Button variant="ghost" size="icon" className="rounded-full">
                            <MoreVertical className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl w-44 p-2 border-border shadow-2xl">
                          <DropdownMenuItem className="font-bold text-xs gap-3 p-2.5 cursor-pointer">
                            View Invoice
                          </DropdownMenuItem>
                          <DropdownMenuItem className="font-bold text-xs gap-3 p-2.5 cursor-pointer">
                            Approve Payout
                          </DropdownMenuItem>
                          <div className="h-px bg-border my-1" />
                          <DropdownMenuItem className="text-rose-500 font-bold text-xs gap-3 p-2.5 cursor-pointer hover:bg-rose-50">
                            Flag Transaction
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperAdminPaymentPage;