import { TableCell, TableRow } from "@/components/ui/table";

import type { Application, ApplicationColumn } from "../types";
import ActionDropdown from "./ActionDropdown";

interface ApplicationRowProps {
  application: Application;
  columns: ApplicationColumn[];
  onView: (application: Application) => void;
  onStatusChange: (applicationId: string, status: "accepted" | "rejected") => void;
}

const ApplicationRow = ({
  application,
  columns,
  onView,
  onStatusChange,
}: ApplicationRowProps) => {
  return (
    <TableRow>
      {columns.map((column) => (
        <TableCell className={column.cellClassName} key={column.id}>
          {column.renderCell(application)}
        </TableCell>
      ))}
      <TableCell className="text-right">
        <ActionDropdown
          application={application}
          onStatusChange={onStatusChange}
          onView={onView}
        />
      </TableCell>
    </TableRow>
  );
};

export default ApplicationRow;
