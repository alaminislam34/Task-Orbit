"use client";

import { useUser } from "@/hooks/api";

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    useUser();

    return <>{children}</>;
};