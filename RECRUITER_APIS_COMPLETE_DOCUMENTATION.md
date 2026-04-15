# Recruiter APIs Complete Documentation (Production Ready)

Last updated: 2026-04-16

এই document-এ recruiter side-এর সব relevant API এক জায়গায় সাজানো আছে: endpoint, auth, input/output, validation, error handling, side effects, এবং frontend implementation guideline.

## Source of Truth

Compiled from:
- [src/app/module/recruiter/recruiter.routes.ts](src/app/module/recruiter/recruiter.routes.ts)
- [src/app/module/recruiter/recruiter.controller.ts](src/app/module/recruiter/recruiter.controller.ts)
- [src/app/module/recruiter/recruiter.service.ts](src/app/module/recruiter/recruiter.service.ts)
- [src/app/module/recruiter/recruiter.validation.ts](src/app/module/recruiter/recruiter.validation.ts)
- [src/app/module/application/application.routes.ts](src/app/module/application/application.routes.ts)
- [src/app/module/application/application.service.ts](src/app/module/application/application.service.ts)
- [src/app/module/application/application.validation.ts](src/app/module/application/application.validation.ts)
- [src/app/routes/index.ts](src/app/routes/index.ts)

## Base URL and Access

- Base: `/api/v1`
- Auth: `Authorization: Bearer <token>`
- Required: `USER_ROLE.USER` + `ACCOUNT_TYPE.RECRUITER`

---

## API Index

1. `POST /api/v1/recruiter/jobs` - Create Job
2. `GET /api/v1/recruiter/jobs` - Get My Jobs
3. `PATCH /api/v1/recruiter/jobs/:jobId` - Update Job
4. `DELETE /api/v1/recruiter/jobs/:jobId` - Delete Job (soft delete)
5. `GET /api/v1/applications/recruiter/jobs/:jobId/applicants` - List Applicants for Recruiter Job
6. `PATCH /api/v1/applications/recruiter/applications/:applicationId/status` - Update Single Application Status
7. `PATCH /api/v1/applications/recruiter/applications/bulk-status` - Bulk Update Application Status
8. `GET /api/v1/applications/:applicationId/resume` - Access Applicant Resume (authorized)

---

## 1) Create Job

Endpoint:
`POST /api/v1/recruiter/jobs`

Validation (strict schema):
- Required:
  - `title` (string, min 3, max 255)
  - `description` (string, min 10)
  - `category` (`JOB_CATEGORY`)
  - `employmentType` (`EMPLOYMENT_TYPE`)
  - `level` (`JOB_LEVEL`)
  - `requiredSkills` (string[], min 1)
- Optional:
  - `salaryMin`, `salaryMax` (number >= 0)
  - `salaryCurrency` (`SALARY_CURRENCY`, default `BDT`)
  - `experience`, `education`, `country`, `city`, `timezone` (string|null)
  - `languages` (string[], default `[]`)
  - `isRemote` (boolean, default `false`)
  - `status` (`PROJECT_STATUS`, default `OPEN`)
  - `isUrgent` (boolean, default `false`)
  - `urgencyUntil`, `closesAt` (ISO datetime|null)
  - `position`, `totalPositions` (positive int, default `1`)
  - `metaTitle` (max 100), `metaDescription` (max 200)

Example request:
```json
{
  "title": "Senior React Developer",
  "description": "Looking for an experienced React developer...",
  "category": "WEB_DEVELOPMENT",
  "employmentType": "FULL_TIME",
  "level": "SENIOR_LEVEL",
  "requiredSkills": ["React", "TypeScript", "Node.js"],
  "salaryMin": 80000,
  "salaryMax": 150000,
  "salaryCurrency": "BDT",
  "country": "Bangladesh",
  "city": "Dhaka",
  "isRemote": true,
  "status": "OPEN"
}
```

Example response (201):
```json
{
  "statusCode": 201,
  "success": true,
  "message": "Job created successfully",
  "data": {
    "id": "job-uuid",
    "recruiterId": "recruiter-uuid",
    "title": "Senior React Developer",
    "slug": "senior-react-developer-12345",
    "viewCount": 0,
    "applicantCount": 0,
    "savedByCount": 0
  }
}
```

Business behavior:
- Recruiter profile must exist.
- Unique slug auto-generated.
- `viewCount`, `applicantCount`, `savedByCount` force set to 0.
- `metaTitle` and `metaDescription` have fallback values.

Common errors:
- `404`: Recruiter profile not found
- `400`: Validation failed
- `401/403`: Unauthorized/Forbidden

---

## 2) Get My Jobs

Endpoint:
`GET /api/v1/recruiter/jobs`

Query params:
- `page` (default 1)
- `limit` (default 10, max 100)
- `search` (optional, title/description contains, case-insensitive)

Example:
`GET /api/v1/recruiter/jobs?page=1&limit=10&search=react`

Example response (200):
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Recruiter jobs fetched successfully",
  "data": [
    {
      "id": "job-uuid",
      "title": "Senior React Developer",
      "status": "OPEN",
      "applicantCount": 25,
      "createdAt": "2026-04-15T12:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

Business behavior:
- Returns only own jobs.
- Excludes soft-deleted jobs (`isDeleted=false`).
- Ordered by latest first.

---

## 3) Update Job

Endpoint:
`PATCH /api/v1/recruiter/jobs/:jobId`

Body:
- Partial fields allowed (same create schema, partial + strict)

Example request:
```json
{
  "title": "Lead React Engineer",
  "salaryMin": 120000,
  "salaryMax": 200000,
  "isUrgent": true
}
```

Example response (200):
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Job updated successfully",
  "data": {
    "id": "job-uuid",
    "title": "Lead React Engineer",
    "slug": "lead-react-engineer-54321",
    "isUrgent": true
  }
}
```

Business behavior:
- Recruiter can update only own non-deleted job.
- If title changes, slug regenerates.
- Meta fields fallback logic applies.

Common errors:
- `404`: Recruiter profile/job not found
- `400`: Validation failed

---

## 4) Delete Job (Soft Delete)

Endpoint:
`DELETE /api/v1/recruiter/jobs/:jobId`

Example response (200):
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Job deleted successfully",
  "data": {
    "deleted": true
  }
}
```

Business behavior:
- Soft delete only:
  - `isDeleted = true`
  - `deletedAt = now()`
- Recruiter ownership is enforced.

---

## 5) List Applicants for Recruiter Job

Endpoint:
`GET /api/v1/applications/recruiter/jobs/:jobId/applicants`

Query params:
- `page` (default 1)
- `limit` (default 10, max 100)
- `search` (optional, job seeker name / cover letter)
- `status` (`APPLICATION_STATUS`, optional)

Example:
`GET /api/v1/applications/recruiter/jobs/job-uuid/applicants?page=1&limit=20&status=PENDING`

Example response (200):
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Applicants fetched successfully",
  "data": {
    "job": {
      "id": "job-uuid",
      "title": "Senior React Developer"
    },
    "applicants": [
      {
        "id": "application-uuid",
        "status": "PENDING",
        "cover_letter": "I am excited to apply...",
        "resume_url": "https://...",
        "resumeAccessUrl": "https://<host>/api/v1/applications/application-uuid/resume",
        "appliedAt": "2026-04-16T10:00:00.000Z",
        "jobSeeker": {
          "id": "seeker-uuid",
          "designation": "Frontend Engineer",
          "skills": ["React", "Next.js"],
          "user": {
            "id": "user-uuid",
            "name": "Applicant Name",
            "email": "applicant@mail.com",
            "image": "https://..."
          }
        }
      }
    ]
  },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

Business behavior:
- Recruiter must own the job.
- Excludes deleted applications.
- Sort order: status ASC, createdAt DESC.

---

## 6) Update Single Application Status

Endpoint:
`PATCH /api/v1/applications/recruiter/applications/:applicationId/status`

Body:
- `status` (`APPLICATION_STATUS`, required)
- `responseMessage` (optional, max 1500)
- `interviewDate` (optional, ISO datetime)
- `interviewNotes` (optional, max 1500)

Example request:
```json
{
  "status": "SHORTLISTED",
  "responseMessage": "Your profile is shortlisted.",
  "interviewDate": "2026-04-20T10:00:00.000Z",
  "interviewNotes": "Bring portfolio links."
}
```

Example response (200):
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Application status updated successfully",
  "data": {
    "id": "application-uuid",
    "status": "SHORTLISTED",
    "hasResponded": true,
    "respondedAt": "2026-04-16T12:00:00.000Z",
    "shortlistedAt": "2026-04-16T12:00:00.000Z"
  }
}
```

Status side effects:
- `SHORTLISTED` -> sets `shortlistedAt`
- `ACCEPTED` -> sets `acceptedAt`
- `REJECTED` -> sets `rejectedAt` + `rejectionReason`

---

## 7) Bulk Update Application Status

Endpoint:
`PATCH /api/v1/applications/recruiter/applications/bulk-status`

Body:
- `applicationIds: string[]` (1..200)
- `status: APPLICATION_STATUS`
- `responseMessage?: string` (max 1500)

Example request:
```json
{
  "applicationIds": ["app-1", "app-2", "app-3"],
  "status": "REJECTED",
  "responseMessage": "Thanks for applying."
}
```

Example response (200):
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Applications updated successfully",
  "data": {
    "updatedCount": 3
  }
}
```

Business behavior:
- All IDs must be recruiter-accessible.
- Any mismatch -> `403` with message: One or more applications are not accessible.

---

## 8) Access Applicant Resume

Endpoint:
`GET /api/v1/applications/:applicationId/resume`

Access:
- Recruiter or Job Seeker
- Recruiter can access only in-scope applications

Behavior:
- Responds with redirect to `resume_url` (302)

Common errors:
- `404`: Application not found or no access
- `404`: Resume not found

---

## Enums Used

`APPLICATION_STATUS`
- `PENDING`, `SHORTLISTED`, `ACCEPTED`, `REJECTED`, `WITHDRAWN`

`JOB_CATEGORY`
- `WEB_DEVELOPMENT`, `MOBILE_DEVELOPMENT`, `DESIGN`, `MARKETING`, `WRITING`, `FINANCE`, `BUSINESS`, `ENGINEERING`, `OTHER`

`JOB_LEVEL`
- `ENTRY_LEVEL`, `MID_LEVEL`, `SENIOR_LEVEL`, `LEAD`, `MANAGER`

`EMPLOYMENT_TYPE`
- `FULL_TIME`, `PART_TIME`, `CONTRACT`, `FREELANCE`, `TEMPORARY`, `INTERNSHIP`

`PROJECT_STATUS`
- `OPEN`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`, `ON_HOLD`

`SALARY_CURRENCY`
- `BDT`, `USD`, `EUR`, `GBP`, `CAD`, `AUD`, `JPY`, `CHF`, `CNY`, `INR`

---

## Standard Response Envelope

Success:
```json
{
  "statusCode": 200,
  "success": true,
  "message": "...",
  "data": {},
  "meta": {}
}
```

Error:
```json
{
  "statusCode": 400,
  "success": false,
  "message": "..."
}
```

Common status codes:
- `200`, `201`, `302`
- `400`, `401`, `403`, `404`, `409`, `500`

---

## Frontend Implementation Guideline (Copilot-ready)

Step 1: Hooks/API layer
- `useRecruiterJobs` (GET /recruiter/jobs)
- `useCreateRecruiterJob` (POST /recruiter/jobs)
- `useUpdateRecruiterJob` (PATCH /recruiter/jobs/:jobId)
- `useDeleteRecruiterJob` (DELETE /recruiter/jobs/:jobId)
- `useRecruiterApplicants` (GET /applications/recruiter/jobs/:jobId/applicants)
- `useUpdateApplicationStatus` (PATCH /applications/recruiter/applications/:applicationId/status)
- `useBulkUpdateApplicationStatus` (PATCH /applications/recruiter/applications/bulk-status)
- `useApplicationResumeLink` (GET /applications/:applicationId/resume)

Step 2: Pages
- Recruiter jobs list (search/pagination)
- Create/Edit job form
- Applicants page (status filter + bulk actions)

Step 3: Must-have behavior
- Always include bearer token
- Strict enum-safe form values
- ISO datetime for interviewDate/urgencyUntil/closesAt
- Proper loading/empty/error states
- Disable submit buttons while pending
- Invalidate/refetch query cache after mutations

Step 4: Security and UX
- Handle 401: force re-auth
- Handle 403: permission message
- Handle 404: stale/missing resource handling
- Confirmation modal for delete and bulk operations

---

## Copy-Paste Prompt for Frontend Copilot

```text
Implement recruiter APIs from RECRUITER_APIS_COMPLETE_DOCUMENTATION.md in a production-ready way.

Requirements:
1) Build hooks for all recruiter endpoints:
- GET /api/v1/recruiter/jobs
- POST /api/v1/recruiter/jobs
- PATCH /api/v1/recruiter/jobs/:jobId
- DELETE /api/v1/recruiter/jobs/:jobId
- GET /api/v1/applications/recruiter/jobs/:jobId/applicants
- PATCH /api/v1/applications/recruiter/applications/:applicationId/status
- PATCH /api/v1/applications/recruiter/applications/bulk-status
- GET /api/v1/applications/:applicationId/resume

2) Build pages/components:
- RecruiterJobsPage (list/search/pagination/delete)
- RecruiterJobForm (create/edit with strict validation)
- RecruiterApplicantsPage (status filter, search, single and bulk status update)

3) Must-have behavior:
- Auth header on all protected requests
- Proper loading/empty/error states
- Toast notifications for all mutations
- Disable action buttons while pending
- Query invalidation/refetch after mutations
- Correct enum usage exactly as backend expects
- Use ISO datetime for interviewDate/urgencyUntil/closesAt

4) Match request/response contracts exactly as documented.
```
