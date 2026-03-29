"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  Download,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  UserPlus,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserActionDropdown } from "../../shared/UserActionDropDown";

const MOCK_USERS = [
  {
    id: "1",
    name: "Zane Studio",
    email: "zane@design.com",
    role: "SELLER",
    status: "Verified",
    joined: "Oct 12, 2023",
    avatar: "",
  },
  {
    id: "2",
    name: "Global HR",
    email: "hr@global.com",
    role: "RECRUITER",
    status: "Pending",
    joined: "Jan 05, 2024",
    avatar: "",
  },
  {
    id: "3",
    name: "Alice Smith",
    email: "alice@me.com",
    role: "CLIENT",
    status: "Verified",
    joined: "Feb 20, 2024",
    avatar: "",
  },
  {
    id: "4",
    name: "Bob Wilson",
    email: "bob@user.com",
    role: "NORMAL",
    status: "Suspended",
    joined: "Mar 10, 2024",
    avatar: "",
  },
];

export default function AdminUserManagePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState(MOCK_USERS);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const handleStatusChange = (id: string, newStatus: string) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, status: newStatus } : u)));
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((u) => u.id));
    }
  };

  const toggleSelectUser = (id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Community Moderation
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage user roles, verify accounts, and monitor activity.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex shadow-none"
          >
            <Download className="mr-2 size-4" /> Export
          </Button>
          <Button
            size="sm"
            className="shadow-none bg-indigo-600 hover:bg-indigo-700"
          >
            <UserPlus className="mr-2 size-4" /> Add User
          </Button>
        </div>
      </div>

      <Card className="shadow-sm border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <CardHeader className="p-4 border-b bg-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                placeholder="Search name, email or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-slate-50/50 border-slate-200 focus:bg-white transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              {selectedUsers.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="h-8 animate-in fade-in slide-in-from-right-2"
                >
                  Delete ({selectedUsers.length})
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-slate-600 border-slate-200"
              >
                <Filter className="mr-2 size-3.5" /> Filter
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="relative overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50 border-b">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-12.5 px-4">
                    <Checkbox
                      checked={
                        selectedUsers.length === filteredUsers.length &&
                        filteredUsers.length > 0
                      }
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="px-4 font-semibold text-slate-900">
                    <div className="flex items-center gap-1 cursor-pointer select-none">
                      User <ChevronDown className="size-3.5 text-slate-400" />
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-slate-900">
                    Role
                  </TableHead>
                  <TableHead className="font-semibold text-slate-900">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-slate-900">
                    Joined Date
                  </TableHead>
                  <TableHead className="text-right px-6 font-semibold text-slate-900">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className={`transition-colors group ${selectedUsers.includes(user.id) ? "bg-indigo-50/30" : "hover:bg-slate-50/50"}`}
                  >
                    <TableCell className="px-4">
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => toggleSelectUser(user.id)}
                      />
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8 rounded-lg border shadow-sm">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="bg-indigo-100 text-indigo-700 text-[10px] font-bold">
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-900 text-sm tracking-tight leading-none mb-1 group-hover:underline cursor-pointer">
                            {user.name}
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono tracking-tighter">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0 h-5 border-none"
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={user.status} />
                    </TableCell>
                    <TableCell className="text-xs text-slate-500 font-medium">
                      {user.joined}
                    </TableCell>
                    <TableCell className="text-right px-6">
                      <UserActionDropdown
                        user={user}
                        onStatusChange={handleStatusChange}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>

        {/* Professional Pagination Footer */}
        <CardFooter className="flex items-center justify-between p-4 border-t bg-slate-50/30">
          <div className="text-xs text-slate-500 font-medium">
            Showing{" "}
            <span className="text-slate-900">{filteredUsers.length}</span> of{" "}
            <span className="text-slate-900">{users.length}</span> users
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              disabled
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 bg-white border-indigo-200 text-indigo-600 shadow-sm"
            >
              1
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              2
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Verified: "bg-emerald-50 text-emerald-700 border-emerald-100/50",
    Pending: "bg-amber-50 text-amber-700 border-amber-100/50",
    Suspended: "bg-rose-50 text-rose-700 border-rose-100/50",
  };

  return (
    <Badge
      variant="outline"
      className={`rounded-full px-2 py-0 h-5 text-[10px] font-semibold tracking-wide ${styles[status]}`}
    >
      <span
        className={`mr-1.5 size-1 rounded-full ${
          status === "Verified"
            ? "bg-emerald-500"
            : status === "Pending"
              ? "bg-amber-500"
              : "bg-rose-500"
        }`}
      />
      {status}
    </Badge>
  );
}
