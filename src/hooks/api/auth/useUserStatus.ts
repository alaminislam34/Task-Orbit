"use client";

import { useMemo } from "react";
import { useUserStore } from "@/store/useUserStore";
import { USER_STATUS, UserRestrictionInfo } from "@/types/common.types";

/**
 * Hook to check user restriction status
 * Determines if user is restricted from performing certain actions
 * 
 * Usage:
 * const { isRestricted, status, reason } = useUserStatus();
 */
export const useUserStatus = () => {
  const { user } = useUserStore();

  const restrictionInfo = useMemo<UserRestrictionInfo>(() => {
    if (!user) {
      return {
        isRestricted: false,
        status: null,
      };
    }

    const userStatus = (user.status as USER_STATUS) || "ACTIVE";
    const restrictedStatuses: USER_STATUS[] = ["SUSPENDED", "BANNED", "BLOCKED", "DELETED"];
    const isRestricted = restrictedStatuses.includes(userStatus);

    const getRestrictionReason = (status: USER_STATUS): string => {
      const reasons: Record<USER_STATUS, string> = {
        ACTIVE: "",
        INACTIVE: "Your account is inactive",
        SUSPENDED: "Your account has been temporarily suspended",
        BANNED: "Your account has been permanently banned",
        BLOCKED: "Your account has been blocked",
        DELETED: "Your account has been deleted",
      };
      return reasons[status] || "Your account is restricted";
    };

    return {
      isRestricted,
      status: userStatus,
      reason: isRestricted ? getRestrictionReason(userStatus) : null,
    };
  }, [user]);

  return restrictionInfo;
};

/**
 * Hook to check specific restriction type
 */
export const useIsUserRestricted = () => {
  const { isRestricted } = useUserStatus();
  return isRestricted;
};

/**
 * Hook to get user's current status
 */
export const useUserCurrentStatus = () => {
  const { status } = useUserStatus();
  return status;
};
