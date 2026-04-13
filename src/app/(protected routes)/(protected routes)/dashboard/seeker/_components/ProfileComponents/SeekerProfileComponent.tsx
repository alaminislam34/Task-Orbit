"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Mail,
  Calendar,
  ShieldCheck,
  User,
  Settings,
  LogOut,
  CheckCircle2,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStatus, useUser as useStoredUser } from "@/store/useUserStore";
import { useUser as useFetchUser, useLogout } from "@/hooks/api";

const SeekerProfile = () => {
  const user = useStoredUser();
  const { isLoading } = useAuthStatus();
  useFetchUser();
  const { mutateAsync: performLogout } = useLogout();
  const handleLogout = async () => {
    await performLogout();
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  if (isLoading) return <ProfileSkeleton />;

  if (!user) return <ProfileSkeleton />;

  return (
    <div>
      <motion.div
        className="max-w-4xl mx-auto space-y-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header Section */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-white shadow-sm">
              <AvatarImage src={user.image || undefined} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{user.name}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Badge variant="secondary" className="capitalize">
                  {user.accountType.replace("_", " ").toLowerCase()}
                </Badge>
                <span className="text-xs">•</span>
                <span className="text-sm flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                  {user.status}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" /> Edit Profile
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Account Details Card */}
          <Card className="md:col-span-2 shadow-sm border-none bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <motion.div
                variants={itemVariants}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Email Address
                    </p>
                    <p className="text-sm font-medium">{user.email}</p>
                  </div>
                </div>
                {user.emailVerified && (
                  <Badge className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-50">
                    Verified
                  </Badge>
                )}
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <div className="space-y-1 px-3">
                  <p className="text-xs font-medium text-slate-500 uppercase">
                    Role
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-primary" /> {user.role}
                  </p>
                </div>
                <div className="space-y-1 px-3">
                  <p className="text-xs font-medium text-slate-500 uppercase">
                    Member Since
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })
                      : "N/A"}
                  </p>
                </div>
              </motion.div>
            </CardContent>
          </Card>

          {/* Side Actions / Stats */}
          <Card className="shadow-sm border-none bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Keep your account secure by updating your credentials regularly.
              </div>
              <Button className="w-full justify-start" variant="ghost">
                <User className="w-4 h-4 mr-2" /> Profile Privacy
              </Button>
              <Button
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                variant="ghost"
              >
                <LogOut className="w-4 h-4 mr-2" /> Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

// Skeleton Loader Component
const ProfileSkeleton = () => (
  <div className="max-w-4xl mx-auto p-8 space-y-8">
    <div className="flex items-center gap-4">
      <Skeleton className="h-20 w-20 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Skeleton className="h-64 md:col-span-2 rounded-xl" />
      <Skeleton className="h-64 rounded-xl" />
    </div>
  </div>
);

export default SeekerProfile;
