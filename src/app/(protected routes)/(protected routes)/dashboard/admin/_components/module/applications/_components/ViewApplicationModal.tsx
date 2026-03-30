import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { Application } from "../types";
import { formatCurrency, formatDateTime, formatDeadline } from "../utils";
import StatusBadge from "./StatusBadge";

interface ViewApplicationModalProps {
  application: Application | null;
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const ViewApplicationModal = ({
  application,
  open,
  onOpenChange,
}: ViewApplicationModalProps) => {
  if (!application) {
    return null;
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-lg">Application Details</DialogTitle>
          <DialogDescription>
            Review candidate details before taking action.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="rounded-lg border bg-muted/20 p-4">
            <div className="mb-3 flex items-center gap-3">
              <Avatar>
                <AvatarImage src={application.applicant.avatar} />
                <AvatarFallback>
                  {application.applicant.name
                    .split(" ")
                    .map((item) => item.charAt(0))
                    .slice(0, 2)
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{application.applicant.name}</p>
                <p className="text-sm text-muted-foreground">
                  {application.applicant.email}
                </p>
              </div>
            </div>
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <p>
                <span className="text-muted-foreground">Job:</span>{" "}
                {application.job.title}
              </p>
              <p>
                <span className="text-muted-foreground">Status:</span>{" "}
                <StatusBadge status={application.status} />
              </p>
              <p>
                <span className="text-muted-foreground">Budget:</span>{" "}
                {formatCurrency(application.proposedBudget)}
              </p>
              <p>
                <span className="text-muted-foreground">Deadline:</span>{" "}
                {formatDeadline(application.proposedDeadline)}
              </p>
              <p>
                <span className="text-muted-foreground">Applied At:</span>{" "}
                {formatDateTime(application.appliedAt)}
              </p>
              <p>
                <span className="text-muted-foreground">Updated At:</span>{" "}
                {formatDateTime(application.updatedAt)}
              </p>
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">Cover Letter</p>
            <p className="rounded-lg border bg-background p-4 text-sm leading-6 text-muted-foreground">
              {application.coverLetter}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewApplicationModal;
