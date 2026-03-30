import type { ManagedRole, ManagedUser, ManagedUsersStats } from "./types";

const managedRoles: ManagedRole[] = ["seller", "client", "recruiter"];

export const isManagedRole = (value: string): value is ManagedRole => {
  return managedRoles.includes(value as ManagedRole);
};

export const getManagedUsersStats = (users: ManagedUser[]): ManagedUsersStats => {
  return users.reduce<ManagedUsersStats>(
    (accumulator, user) => {
      accumulator.total += 1;

      if (user.role === "seller") {
        accumulator.sellers += 1;
      }

      if (user.role === "client") {
        accumulator.clients += 1;
      }

      if (user.role === "recruiter") {
        accumulator.recruiters += 1;
      }

      return accumulator;
    },
    {
      total: 0,
      sellers: 0,
      clients: 0,
      recruiters: 0,
    },
  );
};
