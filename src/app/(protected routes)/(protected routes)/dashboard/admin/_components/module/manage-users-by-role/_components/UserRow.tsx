import { TableCell, TableRow } from "@/components/ui/table";

import type { DataTableColumn, ManagedUser } from "../types";
import ActionDropdown from "./ActionDropdown";

interface UserRowProps {
  user: ManagedUser;
  columns: DataTableColumn<ManagedUser>[];
  onView: (user: ManagedUser) => void;
  onStatusChange: (userId: string, status: "active" | "inactive") => void;
}

const UserRow = ({ user, columns, onView, onStatusChange }: UserRowProps) => {
  return (
    <TableRow>
      {columns.map((column) => (
        <TableCell className={column.cellClassName} key={column.id}>
          {column.renderCell(user)}
        </TableCell>
      ))}
      <TableCell className="text-right">
        <ActionDropdown onStatusChange={onStatusChange} onView={onView} user={user} />
      </TableCell>
    </TableRow>
  );
};

export default UserRow;
