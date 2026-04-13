import { BaseQueryParams } from "./common.types";

export interface Job {
  id: string;
  title: string;
  description: string;
  employmentType: EmploymentType;
  category: JobCategory;
  level: JobLevel;
  salaryMin: number;
  salaryMax: number;
  salaryCurrency: string;
  country: string;
  city: string;
  deadline: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "FREELANCE";
export type JobCategory = "WEB_DEVELOPMENT" | "PROGRAMMING" | "DESIGN" | "MARKETING" | "OTHER";
export type JobLevel = "ENTRY_LEVEL" | "MID_LEVEL" | "SENIOR_LEVEL" | "DIRECTOR";

export interface CreateJobPayload {
  title: string;
  description: string;
  employmentType: EmploymentType;
  category: JobCategory;
  level: JobLevel;
  salaryMin: number;
  salaryMax: number;
  salaryCurrency: string;
  country: string;
  city: string;
  deadline: string;
}

export interface UpdateJobPayload extends Partial<CreateJobPayload> {
  status?: string;
}

export interface ApplyJobPayload {
  jobId: string;
  cover_letter: string;
  resume: File;
}

export interface JobsQueryParams extends BaseQueryParams {
  category?: JobCategory;
  level?: JobLevel;
  employmentType?: EmploymentType;
  minSalary?: number;
  maxSalary?: number;
}
