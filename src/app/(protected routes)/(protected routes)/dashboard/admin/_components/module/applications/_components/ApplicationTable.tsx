import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { Application, ApplicationColumn } from "../types";
import ApplicationRow from "./ApplicationRow";

interface ApplicationTableProps {
  applications: Application[];
  columns: ApplicationColumn[];
  onView: (application: Application) => void;
  onStatusChange: (applicationId: string, status: "accepted" | "rejected") => void;
}

const ApplicationTable = ({
  applications,
  columns,
  onView,
  onStatusChange,
}: ApplicationTableProps) => {
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
        {applications.map((application) => (
          <ApplicationRow
            application={application}
            columns={columns}
            key={application.id}
            onStatusChange={onStatusChange}
            onView={onView}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default ApplicationTable;
