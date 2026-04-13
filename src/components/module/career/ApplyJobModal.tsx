"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Job } from "@/types/jobs.types";

const ACCEPTED_RESUME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const ACCEPTED_RESUME_EXTENSIONS = ["pdf", "doc", "docx"];
const MAX_RESUME_FILE_SIZE_BYTES = 5 * 1024 * 1024;

const getFileExtension = (fileName: string) => {
  const parts = fileName.split(".");
  return parts.length > 1 ? parts.pop()?.toLowerCase() ?? "" : "";
};

const isAcceptedResumeFile = (file: File) => {
  const hasAcceptedMimeType = file.type
    ? ACCEPTED_RESUME_TYPES.includes(file.type)
    : false;

  const extension = getFileExtension(file.name);
  const hasAcceptedExtension = ACCEPTED_RESUME_EXTENSIONS.includes(extension);

  // Some browsers may not provide MIME type for local files; extension check is fallback.
  return hasAcceptedMimeType || hasAcceptedExtension;
};

interface ApplyJobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job | null;
  isSubmitting: boolean;
  onSubmit: (payload: { coverLetter: string; resumeFile: File }) => Promise<void>;
}

export const ApplyJobModal = ({
  open,
  onOpenChange,
  job,
  isSubmitting,
  onSubmit,
}: ApplyJobModalProps) => {
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const selectedFileLabel = useMemo(() => {
    if (!resumeFile) return "No file selected";
    return `${resumeFile.name} (${Math.max(1, Math.round(resumeFile.size / 1024))} KB)`;
  }, [resumeFile]);

  const handleClose = (nextOpen: boolean) => {
    onOpenChange(nextOpen);

    if (!nextOpen) {
      setCoverLetter("");
      setResumeFile(null);
      setFormError(null);
    }
  };

  const handleResumeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      setResumeFile(null);
      return;
    }

    if (file.size > MAX_RESUME_FILE_SIZE_BYTES) {
      setFormError("Resume/CV must be 5MB or smaller.");
      event.target.value = "";
      return;
    }

    if (!isAcceptedResumeFile(file)) {
      setFormError("Please upload a PDF or DOC/DOCX resume.");
      event.target.value = "";
      return;
    }

    setResumeFile(file);
    setFormError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!coverLetter.trim()) {
      setFormError("Cover letter is required.");
      return;
    }

    if (!resumeFile) {
      setFormError("Please upload your resume/CV.");
      return;
    }

    setFormError(null);
    await onSubmit({
      coverLetter: coverLetter.trim(),
      resumeFile,
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl p-6 border-none bg-white/98 backdrop-blur-xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900">Apply for this job</DialogTitle>
          <DialogDescription>
            {job ? `Submit your application for ${job.title}.` : "Submit your job application."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cover-letter">Cover Letter</Label>
            <Textarea
              id="cover-letter"
              placeholder="Write why you are a good fit for this role..."
              value={coverLetter}
              onChange={(event) => setCoverLetter(event.target.value)}
              className="min-h-36"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="resume-file">Resume / CV</Label>
            <Input
              id="resume-file"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeChange}
              disabled={isSubmitting}
            />
            <p className="text-xs text-slate-500">{selectedFileLabel}</p>
fail            <p className="text-xs text-slate-400">Accepted: PDF, DOC, DOCX (max 5MB)</p>
          </div>

          {formError ? <p className="text-sm text-destructive">{formError}</p> : null}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Submit Application
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
