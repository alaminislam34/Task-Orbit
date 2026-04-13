"use client";

import React from "react";
import { AlertCircle, AlertTriangle, Lock } from "lucide-react";
import { useUserStatus } from "@/hooks/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

/**
 * RestrictionBanner Component
 * 
 * Displays a banner when user account is restricted (suspended, banned, blocked, etc.)
 * Shows appropriate warning/error styling and messages based on restriction type
 * 
 * Features:
 * - Auto-hides when user is not restricted
 * - Semantic color coding (yellow for suspension, red for ban/block)
 * - Accessible with proper ARIA labels
 * - Responsive design
 */
export const RestrictionBanner: React.FC = () => {
  const { isRestricted, status, reason } = useUserStatus();

  if (!isRestricted || !status) {
    return null;
  }

  const isSuspended = status === "SUSPENDED";
  const isBanned = status === "BANNED";
  const isBlocked = status === "BLOCKED";
  const isInactive = status === "INACTIVE";

  // Determine styling based on restriction type
  const getAlertConfig = () => {
    if (isSuspended) {
      return {
        variant: "default" as const,
        icon: AlertTriangle,
        title: "⚠️ Account Suspended",
        subtitle:
          "Your account has been suspended. You cannot perform certain actions.",
        contactText: "Please contact support for more information.",
      };
    }

    if (isBanned || isBlocked) {
      return {
        variant: "destructive" as const,
        icon: AlertCircle,
        title: isBlocked ? "🚫 Account Blocked" : "❌ Account Banned",
        subtitle: isBlocked
          ? "Your account has been blocked and cannot be used."
          : "Your account has been permanently banned.",
        contactText: "Please contact support to appeal this decision.",
      };
    }

    if (isInactive) {
      return {
        variant: "default" as const,
        icon: Lock,
        title: "🔒 Account Inactive",
        subtitle: "Your account is currently inactive.",
        contactText: "Please contact support to reactivate your account.",
      };
    }

    return {
      variant: "destructive" as const,
      icon: AlertCircle,
      title: "⚠️ Account Restricted",
      subtitle: "Your account is restricted.",
      contactText: "Please contact support.",
    };
  };

  const config = getAlertConfig();

  return (
    <div className="sticky top-0 z-40 w-full bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <Alert variant={config.variant} className="border-0 shadow-sm">
          <config.icon className="w-5 h-5" />
          <AlertTitle className="text-base font-semibold">
            {config.title}
          </AlertTitle>
          <AlertDescription className="mt-2">
            <p className="text-sm">{config.subtitle}</p>
            {reason && (
              <p className="text-xs opacity-80 mt-1">
                <strong>Reason:</strong> {reason}
              </p>
            )}
            <p className="text-xs opacity-80 mt-2">{config.contactText}</p>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

/**
 * Compact version of RestrictionBanner for use in sidebars/cards
 * Shows a smaller, inline warning
 */
export const RestrictionBannerCompact: React.FC = () => {
  const { isRestricted, status } = useUserStatus();

  if (!isRestricted) {
    return null;
  }

  const isSuspended = status === "SUSPENDED";
  const bgColor = isSuspended ? "bg-yellow-50" : "bg-red-50";
  const borderColor = isSuspended ? "border-yellow-200" : "border-red-200";
  const textColor = isSuspended ? "text-yellow-800" : "text-red-800";
  const iconColor = isSuspended ? "text-yellow-600" : "text-red-600";

  return (
    <div
      className={`rounded-lg border ${borderColor} ${bgColor} p-3 flex gap-3`}
      role="alert"
      aria-live="polite"
    >
      {isSuspended ? (
        <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${iconColor}`} />
      ) : (
        <AlertCircle className={`w-5 h-5 flex-shrink-0 ${iconColor}`} />
      )}
      <div>
        <h3 className={`font-medium text-sm ${textColor}`}>
          {isSuspended ? "Account Suspended" : "Account Restricted"}
        </h3>
        <p className={`text-xs mt-1 ${textColor}`}>
          {isSuspended
            ? "You cannot access this feature while suspended."
            : "This account is restricted from accessing this feature."}
        </p>
      </div>
    </div>
  );
};
