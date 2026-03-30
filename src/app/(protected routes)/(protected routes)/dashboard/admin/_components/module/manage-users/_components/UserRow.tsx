import { TableCell, TableRow } from "@/components/ui/table";

import type { DataTableColumn, User } from "../types";
import ActionDropdown from "./ActionDropdown";

interface UserRowProps {
  user: User;
  columns: DataTableColumn<User>[];
  onView: (user: User) => void;
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
