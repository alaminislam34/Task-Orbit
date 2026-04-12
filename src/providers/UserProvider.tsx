"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useUser } from "@/hooks/api";

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const { data } = useUser();
    const { setUser } = useUserStore();

    useEffect(() => {
        if (data) {
            setUser(data);
        }
    }, [data, setUser]);

    return <>{children}</>;
};