import Link from "next/link";

import { Button } from "@/components/ui/button";
import PageHeader from "@/components/shared/PageHeader";

const RecruiterHomePage = () => {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Recruiter Dashboard"
        description="Manage jobs, review applicants, and keep your hiring workflow in one place."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-background p-5">
          <h2 className="text-lg font-semibold">My Jobs</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Create, edit, and delete the roles you are hiring for.
          </p>
          <Link href="/dashboard/recruiter/jobs">
            <Button className="mt-4">Open Jobs</Button>
          </Link>
        </div>

        <div className="rounded-lg border bg-background p-5">
          <h2 className="text-lg font-semibold">Job Applications</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Review applicants, shortlist candidates, and manage interview outcomes.
          </p>
          <Link href="/dashboard/recruiter/job-applications">
            <Button className="mt-4" variant="outline">
              Open Applications
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecruiterHomePage;