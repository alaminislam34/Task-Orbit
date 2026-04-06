"use client";

import { useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { useUserStore } from "@/store/useUserStore";

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