import { BaseQueryParams } from "./common.types";

type PaginationQueryParams = Omit<BaseQueryParams, "status">;

export type JobCategory =
  | "WEB_DEVELOPMENT"
  | "MOBILE_DEVELOPMENT"
  | "DESIGN"
  | "MARKETING"
  | "WRITING"
  | "FINANCE"
  | "BUSINESS"
  | "ENGINEERING"
  | "OTHER";

export type JobLevel =
  | "ENTRY_LEVEL"
  | "MID_LEVEL"
  | "SENIOR_LEVEL"
  | "LEAD"
  | "MANAGER";

export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "FREELANCE"
  | "TEMPORARY"
  | "INTERNSHIP";

export type SalaryCurrency =
  | "BDT"
  | "USD"
  | "EUR"
  | "GBP"
  | "CAD"
  | "AUD"
  | "JPY"
  | "CHF"
  | "CNY"
  | "INR";

export type JobStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "ON_HOLD";

export type ApplicationStatus =
  | "PENDING"
  | "SHORTLISTED"
  | "ACCEPTED"
  | "REJECTED"
  | "WITHDRAWN";

export interface JobUserSummary {
  id?: string;
  name: string;
  image?: string | null;
  email?: string;
}

export interface RecruiterSummary {
  id: string;
  agencyName?: string;
  bio?: string;
  location?: string;
  user?: JobUserSummary;
}

export interface Job {
  id: string;
  title: string;
  slug?: string;
  description: string;
  employmentType: EmploymentType;
  category: JobCategory;
  level: JobLevel;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: SalaryCurrency;
  requiredSkills?: string[];
  experience?: string;
  education?: string;
  languages?: string[];
  country?: string;
  city?: string;
  isRemote?: boolean;
  timezone?: string;
  position?: number;
  totalPositions?: number;
  isUrgent?: boolean;
  urgencyUntil?: string;
  status: JobStatus | string;
  closesAt?: string;
  deadline?: string;
  viewCount?: number;
  applicantCount?: number;
  savedByCount?: number;
  recruiter?: RecruiterSummary;
  createdAt: string;
  updatedAt: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface JobsQueryParams extends PaginationQueryParams {
  category?: JobCategory;
  level?: JobLevel;
  employmentType?: EmploymentType;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  minSalary?: number;
  maxSalary?: number;
}

export interface CreateJobPayload {
  title: string;
  description: string;
  category: JobCategory;
  employmentType: EmploymentType;
  level: JobLevel;
  requiredSkills: string[];
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: SalaryCurrency;
  experience?: string;
  education?: string;
  languages?: string[];
  country?: string;
  city?: string;
  isRemote?: boolean;
  timezone?: string;
  status?: JobStatus;
  isUrgent?: boolean;
  urgencyUntil?: string;
  position?: number;
  totalPositions?: number;
  closesAt?: string;
  deadline?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface UpdateJobPayload extends Partial<CreateJobPayload> {}

export interface ApplyJobPayload {
  jobId: string;
  cover_letter?: string;
  resume?: File;
}

export interface MyApplicationsQueryParams extends PaginationQueryParams {
  search?: string;
  status?: ApplicationStatus;
}

export interface SearchSuggestionsQueryParams {
  q: string;
  limit?: number;
}

export interface JobSearchSuggestion {
  id: string;
  title: string;
  slug?: string;
}

export interface ApplicationJobSummary {
  id: string;
  title: string;
  slug?: string;
  category?: JobCategory;
  level?: JobLevel;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: SalaryCurrency;
  recruiter?: RecruiterSummary;
}

export interface JobSeekerSummary {
  id: string;
  designation?: string;
  skills?: string[];
  user?: JobUserSummary;
}

export interface JobApplication {
  id: string;
  jobId?: string;
  jobSeekerId?: string;
  recruiterId?: string;
  status: ApplicationStatus;
  cover_letter?: string | null;
  resume_url?: string | null;
  resumeAccessUrl?: string | null;
  appliedAt?: string;
  shortlistedAt?: string | null;
  acceptedAt?: string | null;
  rejectedAt?: string | null;
  rejectionReason?: string | null;
  responseMessage?: string | null;
  hasResponded?: boolean;
  respondedAt?: string | null;
  interviewDate?: string | null;
  interviewNotes?: string | null;
  job?: ApplicationJobSummary;
  jobSeeker?: JobSeekerSummary;
}

export interface JobSeekerSettings {
  id?: string;
  timezone?: string;
  language?: string;
  emailNotifications?: boolean;
  jobAlertFrequency?: string;
  visibility?: "PUBLIC" | "PRIVATE" | "CONNECTIONS_ONLY";
}

export interface JobSeekerProfile {
  id?: string;
  userId?: string;
  designation?: string;
  bio?: string;
  location?: string;
  skills?: string[];
  resumeUrl?: string;
  portfolioUrl?: string;
  linkedInUrl?: string;
  experience?: string[];
  education?: string[];
  settings?: JobSeekerSettings;
}

export interface UpdateJobSeekerProfilePayload {
  designation?: string;
  bio?: string;
  location?: string;
  skills?: string[];
  resumeUrl?: string;
  portfolioUrl?: string;
  linkedInUrl?: string;
  experience?: string[];
  education?: string[];
}

export interface UpdateJobSeekerSettingsPayload {
  timezone?: string;
  language?: string;
  emailNotifications?: boolean;
  jobAlertFrequency?: string;
  visibility?: "PUBLIC" | "PRIVATE" | "CONNECTIONS_ONLY";
}

export interface UpdateUserMePayload {
  name?: string;
  image?: string;
}

export interface UpdateApplicationStatusPayload {
  status: ApplicationStatus;
  responseMessage?: string;
  interviewDate?: string;
  interviewNotes?: string;
}

export interface BulkUpdateApplicationStatusPayload {
  applicationIds: string[];
  status: ApplicationStatus;
  responseMessage?: string;
}

export interface SavedJobItem {
  id: string;
  createdAt: string;
  job: Job;
}

export interface SavedJobsQueryParams extends PaginationQueryParams {}

export interface RecentlyViewedItem {
  id: string;
  jobId: string;
  viewedAt: string;
  job: Job;
}

export interface RecentlyViewedQueryParams extends PaginationQueryParams {
  search?: string;
}

export interface RecommendationQueryParams extends PaginationQueryParams {
  search?: string;
}

export interface ApplicantsQueryParams extends PaginationQueryParams {
  status?: ApplicationStatus;
}
