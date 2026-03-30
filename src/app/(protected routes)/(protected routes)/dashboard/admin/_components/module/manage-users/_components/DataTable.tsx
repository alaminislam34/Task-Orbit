import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { DataTableColumn, User } from "../types";
import UserRow from "./UserRow";

interface DataTableProps {
  data: User[];
  columns: DataTableColumn<User>[];
  onView: (user: User) => void;
  onStatusChange: (userId: string, status: "active" | "inactive") => void;
}

const DataTable = ({ data, columns, onView, onStatusChange }: DataTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          {columns.map((column) => (
            <TableHead className={column.className} key={column.id}>
              {column.header}
            </TableHead>
          ))}
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((user) => (
          <UserRow
            columns={columns}
            key={user.id}
            onStatusChange={onStatusChange}
            onView={onView}
            user={user}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default DataTable;
