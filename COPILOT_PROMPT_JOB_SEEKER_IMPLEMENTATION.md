# Frontend Job Seeker Implementation Prompt for Copilot

এটা Copilot-এ copy-paste করে দাও। সে সম্পূর্ণ implementation করবে।

---

You are implementing a complete job seeker application system for TaskOrbit frontend.

Reference: Use the `JOB_SEEKER_APIS_COMPLETE_DOCUMENTATION.md` file for all API contracts, endpoints, request/response formats, and validation rules.

## Step-by-Step Implementation

### Step 1: Create API Query Hooks

Create or update these hooks in `src/hooks/api/`:

#### `useJobs.ts`
- Function: `useGetAllJobs(filters?: {page, limit, search, category, level, location, salaryMin, salaryMax})`
- Endpoint: `GET /api/v1/jobs`
- Returns: `{jobs: Job[], meta: {page, limit, total, totalPages}}`
- Features:
  - Pagination support
  - Search and filter support
  - Loading and error states
  - Refetch capability

#### `useJobDetail.ts`
- Function: `useGetJobById(jobId: string)`
- Endpoint: `GET /api/v1/jobs/:id`
- Returns: Single job object with recruiter details
- Side effect: Track that view count will increment on backend

#### `useApplications.ts`
- Function: `useListMyApplications(filters?: {page, limit, search, status})`
- Endpoint: `GET /api/v1/applications/my-applications`
- Returns: `{applications: Application[], meta}`
- Function: `useApplyToJob()`
- Endpoint: `POST /api/v1/applications/:jobId/apply`
- Payload: `{cover_letter?, resume: File?}`
- Handles multipart/form-data for resume upload
- Returns: Created application object

#### `useSavedJobs.ts`
- Function: `useSavedJobs(filters?: {page, limit, search})`
- Endpoint: `GET /api/v1/applications/saved-jobs`
- Returns: `{savedJobs: SavedJob[], meta}`
- Function: `useToggleSaveJob()`
- Endpoint: `POST /api/v1/applications/saved-jobs/:jobId/toggle`
- Returns: `{saved: boolean}`
- Handles optimistic UI updates

#### `useRecruiterJobs.ts` (if recruiter feature needed)
- Function: `useRecruiterJobs(filters?: {page, limit, search})`
- Endpoint: `GET /api/v1/recruiter/jobs`
- Function: `useCreateJob()`
- Endpoint: `POST /api/v1/recruiter/jobs`
- Function: `useUpdateJob(jobId)`
- Endpoint: `PATCH /api/v1/recruiter/jobs/:jobId`
- Function: `useDeleteJob(jobId)`
- Endpoint: `DELETE /api/v1/recruiter/jobs/:jobId`

#### `useApplicationApproval.ts` (if recruiter feature needed)
- Function: `useListApplicants(jobId, filters?)`
- Endpoint: `GET /api/v1/applications/recruiter/jobs/:jobId/applicants`
- Function: `useUpdateApplicationStatus(applicationId)`
- Endpoint: `PATCH /api/v1/applications/recruiter/applications/:applicationId/status`
- Payload: `{status, responseMessage?, interviewDate?, interviewNotes?}`
- Function: `useBulkUpdateApplicationStatus()`
- Endpoint: `PATCH /api/v1/applications/recruiter/applications/bulk-status`

### Step 2: Create UI Components

#### Pages
- `pages/jobs/JobBrowse.tsx` - Job listing with search & filters
- `pages/jobs/JobDetail.tsx` - Individual job details with apply button
- `pages/jobs/SavedJobs.tsx` - Saved jobs list
- `pages/applications/MyApplications.tsx` - My applications with status tracking
- (Optional) `pages/recruiter/RecruiterJobs.tsx` - Job management dashboard
- (Optional) `pages/recruiter/JobApplicants.tsx` - View applicants for a job

#### Reusable Components
- `components/JobCard.tsx` - Job listing card with save button
- `components/JobDetail.tsx` - Full job details
- `components/ApplicationCard.tsx` - Application status card
- `components/ApplicationForm.tsx` - Cover letter + resume upload form
- `components/StatusBadge.tsx` - Application status badge (PENDING, SHORTLISTED, etc.)
- `components/PaginationControls.tsx` - Pagination component
- `components/FilterPanel.tsx` - Job search and filter sidebar

### Step 3: Implement Each Feature

#### Feature 1: Job Search & Browse
```
- Display paginated list of jobs (10 per page)
- Search by keyword (title, description, skills, recruiter name)
- Filter by:
  - Category (WEB_DEVELOPMENT, MOBILE_DEVELOPMENT, DESIGN, etc.)
  - Level (ENTRY_LEVEL, MID_LEVEL, SENIOR_LEVEL, LEAD, MANAGER)
  - Location (country, city, recruiter location)
  - Salary range (min-max with BDT, USD, etc.)
- Show job cards with:
  - Title, salary range, location
  - Recruiter name & image
  - View count, applicant count, saved count
  - Save/unsave button
- Click card to view full details
- Implement infinite scroll OR pagination buttons
```

#### Feature 2: Job Details Page
```
- Display complete job information:
  - All details from job object
  - Employment type, level, category
  - Required skills, experience, education
  - Languages required
  - Remote status, timezone
  - Application closing date
- Show recruiter profile
- "Apply Now" button (redirects to application form if not applied)
- "Save Job" toggle
- Show if already applied (disable apply button)
```

#### Feature 3: Job Application Flow
```
- Modal or dedicated page for application
- Form fields:
  - Cover letter (textarea, max 2000 chars)
  - Resume file upload (PDF/DOC/DOCX)
- File validation:
  - Check file type
  - Check file size (show error if too large)
- On submit:
  - Show loading state
  - Send POST request with FormData
  - Handle response:
    - Success: Show confirmation, redirect to my applications
    - Error: Show user-friendly error message
- Prevent duplicate applications (if already applied, show message)
```

#### Feature 4: My Applications
```
- List all applications with:
  - Job title, company, salary
  - Application status badge
  - Applied date
  - Last update (shortlisted, accepted, rejected date)
- Filters:
  - By status (PENDING, SHORTLISTED, ACCEPTED, REJECTED, WITHDRAWN)
  - By search (job title)
- Click to view application details:
  - Job details
  - Cover letter
  - Resume link
  - Recruiter response message (if any)
  - Interview date and notes (if scheduled)
  - Timeline showing status progression
- Resume download link
- Pagination
```

#### Feature 5: Saved Jobs
```
- List all saved jobs
- Show save date
- Quick apply from list (button or link)
- Remove from saved (with confirmation)
- Search in saved jobs
- Pagination
- Show count of saved jobs
```

#### Feature 6: Recruiter Job Management (Optional)
```
- Create Job Page:
  - Form with all fields from schema
  - Real-time validation
  - Auto-generate meta title/description from title
  - Submit and show created job details

- My Jobs Page:
  - List recruiter's jobs with pagination
  - Show: title, status, applicant count, created date
  - Quick actions: View applicants, Edit, Delete
  - Search filter

- Edit Job Modal/Page:
  - Pre-fill with existing data
  - Allow partial updates
  - Show warning if editing open job

- Job Applicants View:
  - List applicants for selected job
  - Sort by status
  - Search by applicant name
  - View applicant profile: name, skills, experience
  - View resume
  - Update status with:
    - Response message (max 1500 chars)
    - Interview date picker
    - Interview notes
  - Bulk update (select multiple applicants, change status)
```

### Step 4: Error Handling

- Network errors: Show retry button with toast
- Validation errors: Show field-level error messages
- 404 errors: Show "Not found" message with go-back button
- 409 conflict: Show "Already applied" message
- 403 forbidden: Show "Access denied" message
- 500 errors: Show generic error with contact support
- Loading states: Skeleton loaders or spinners

### Step 5: UX & Responsiveness

- Mobile-friendly layout for all pages
- Touch-friendly buttons and inputs
- Responsive filter panel (collapsible on mobile)
- Loading skeletons for better UX
- Optimistic UI updates for save/unsave
- Toast notifications for actions (apply, save, error)
- Proper navigation breadcrumbs

### Step 6: Validation & Data Handling

- Form validation before submit:
  - Cover letter max 2000 chars
  - Resume file size and type check
- Display API validation errors clearly
- Handle empty states:
  - No jobs found
  - No applications
  - No saved jobs
- Pagination edge cases:
  - Show proper message if on last page
  - Disable next button if no more pages

### Step 7: Integration Points

- Use auth context to get current user and account type
- Show features based on account type (JOB_SEEKER vs RECRUITER)
- Use routing to navigate between pages
- Store active filters in URL params (for bookmarking/sharing)
- Use React Query or similar for caching and state management

## Deliverables Checklist

- [ ] All hooks created with proper typing
- [ ] All components rendered and responsive
- [ ] Job search and filters working
- [ ] Job details page functional
- [ ] Apply to job working with resume upload
- [ ] My applications showing with correct status
- [ ] Saved jobs list working with toggle
- [ ] Resume download links working
- [ ] Error messages user-friendly
- [ ] Loading states visible
- [ ] Mobile responsive
- [ ] Pagination working
- [ ] Search functional
- [ ] All API contracts matched exactly
- [ ] No duplicate code
- [ ] Proper error boundaries

## API Contract Reference

For exact endpoint paths, query parameters, request/response formats, validation rules, and error codes, refer to `JOB_SEEKER_APIS_COMPLETE_DOCUMENTATION.md`.

Key points:
- Base path: `/api/v1`
- Authentication: Bearer token in Authorization header
- File upload: Use FormData for multipart requests
- Pagination: Always use ?page=X&limit=Y format
- Filters: Query params for all filters (case-sensitive enum values)
- Errors: Check statusCode in response for handling
- Resume URLs: Use resumeAccessUrl from response for downloads

## Testing Checklist

Before finishing:

- [ ] Search returns results matching filters
- [ ] Pagination works forward and backward
- [ ] Apply creates application on backend
- [ ] Resume upload works with Cloudinary
- [ ] Save/unsave toggles correctly
- [ ] Status updates reflect in my applications
- [ ] All error codes handled properly
- [ ] Mobile layout tested
- [ ] Network errors retry gracefully
- [ ] Empty states display properly
- [ ] All forms validate correctly
- [ ] All links navigate correctly

---

**Start with Step 1 & 2, then implement features 1-5 in order. Test as you go. Reference the documentation for exact API contracts.**
