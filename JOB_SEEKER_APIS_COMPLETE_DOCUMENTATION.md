# TaskOrbit Job Seeker APIs - Complete Production Documentation

Last updated: 2026-04-16

এই document সব job seeker-related API endpoints, validation rules, input/output formats, এবং production-ready implementation guidelines contain করে।

---

## Table of Contents

1. [Overview](#overview)
2. [Job Browsing & Search](#job-browsing--search)
3. [Job Applications](#job-applications)
4. [Saved Jobs](#saved-jobs)
5. [Recruiter Job Management](#recruiter-job-management)
6. [Data Models & Enums](#data-models--enums)
7. [Error Handling](#error-handling)
8. [Validation Rules](#validation-rules)
9. [Implementation Checklist](#implementation-checklist)

---

## Overview

### Actors

1. **Job Seeker**: User with `ACCOUNT_TYPE.JOB_SEEKER` who applies to jobs, saves jobs, and manages applications.
2. **Recruiter**: User with `ACCOUNT_TYPE.RECRUITER` who creates, updates, deletes jobs and reviews applications.
3. **Public**: Unauthenticated users who can browse jobs.

### Base Path

All endpoints assume `/api/v1` base path.

### Authentication

- Job listing (browse): **Public** (no auth required)
- Applications, Saved jobs: **Private** (requires JOB_SEEKER role)
- Job management (create/update/delete): **Private** (requires RECRUITER role)

---

## Job Browsing & Search

### 1. Get All Jobs (Public Browse)

#### Endpoint
```
GET /jobs
```

#### Query Parameters

| Parameter | Type | Required | Default | Validation | Description |
|-----------|------|----------|---------|-----------|-------------|
| page | number | No | 1 | int, min: 1 | Pagination page number |
| limit | number | No | 10 | int, min: 1, max: 100 | Items per page |
| search | string | No | - | max: 300 | Search in title, description, skills, recruiter name, location |
| category | enum | No | - | JOB_CATEGORY | Job category filter |
| level | enum | No | - | JOB_LEVEL | Job experience level |
| location | string | No | - | max: 120 | Filter by country, city, or recruiter location |
| salaryMin | number | No | - | min: 0 | Minimum salary filter |
| salaryMax | number | No | - | min: 0 | Maximum salary filter |

#### Validation Rules

```
- page: Must be ≥ 1, converted to number
- limit: Must be 1-100, converted to number
- search: Trimmed, max 300 chars
- category: Must be valid JOB_CATEGORY enum value
- level: Must be valid JOB_LEVEL enum value
- location: Trimmed, max 120 chars
- salaryMin & salaryMax: salaryMin ≤ salaryMax (if both provided)
```

#### Request

```bash
curl -X GET "http://localhost:5000/api/v1/jobs?page=1&limit=10&category=WEB_DEVELOPMENT&level=MID_LEVEL&location=Dhaka&salaryMin=50000&salaryMax=150000&search=react"
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Jobs fetched successfully",
  "data": [
    {
      "id": "uuid",
      "title": "Senior React Developer",
      "slug": "senior-react-developer-12345",
      "description": "We are looking for...",
      "salaryMin": 80000,
      "salaryMax": 150000,
      "salaryCurrency": "BDT",
      "requiredSkills": ["React", "TypeScript", "Node.js"],
      "country": "Bangladesh",
      "city": "Dhaka",
      "isRemote": true,
      "closesAt": "2026-05-16T23:59:59Z",
      "status": "OPEN",
      "viewCount": 245,
      "applicantCount": 15,
      "savedByCount": 8,
      "createdAt": "2026-04-01T10:00:00Z",
      "recruiter": {
        "id": "recruiter-uuid",
        "agencyName": "Tech Solutions Ltd",
        "user": {
          "name": "John Doe",
          "image": "https://..."
        }
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "totalPages": 15
  }
}
```

#### Error Responses

```json
// 400 Bad Request - Invalid query parameters
{
  "success": false,
  "message": "salaryMin cannot be greater than salaryMax.",
  "statusCode": 400
}

// 500 Internal Server Error
{
  "success": false,
  "message": "Internal server error",
  "statusCode": 500
}
```

#### Search Logic

The search parameter looks in:
1. Job title (case-insensitive substring)
2. Job description (case-insensitive substring)
3. Required skills array
4. Recruiter agency name
5. Recruiter location

Location search looks in:
1. Job country
2. Job city
3. Recruiter location

---

### 2. Get Job Details

#### Endpoint
```
GET /jobs/:id
```

#### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Job ID (UUID) |

#### Request

```bash
curl -X GET "http://localhost:5000/api/v1/jobs/550e8400-e29b-41d4-a716-446655440000"
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Job fetched successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Senior React Developer",
    "slug": "senior-react-developer-12345",
    "description": "We are looking for a senior React developer...",
    "category": "WEB_DEVELOPMENT",
    "employmentType": "FULL_TIME",
    "level": "SENIOR_LEVEL",
    "salaryMin": 80000,
    "salaryMax": 150000,
    "salaryCurrency": "BDT",
    "requiredSkills": ["React", "TypeScript", "Node.js", "AWS"],
    "experience": "5+ years in web development",
    "education": "Bachelor's in Computer Science",
    "languages": ["English", "Bangla"],
    "country": "Bangladesh",
    "city": "Dhaka",
    "isRemote": true,
    "timezone": "GMT+6",
    "status": "OPEN",
    "position": 1,
    "totalPositions": 2,
    "viewCount": 246,
    "applicantCount": 15,
    "savedByCount": 8,
    "closesAt": "2026-05-16T23:59:59Z",
    "createdAt": "2026-04-01T10:00:00Z",
    "recruiter": {
      "id": "recruiter-uuid",
      "agencyName": "Tech Solutions Ltd",
      "bio": "Leading tech recruitment agency...",
      "user": {
        "name": "John Doe",
        "image": "https://..."
      }
    }
  }
}
```

#### Side Effects

- Job viewCount incremented by 1

#### Error Responses

```json
// 404 Not Found
{
  "success": false,
  "message": "Job not found or not open for applications.",
  "statusCode": 404
}
```

---

## Job Applications

### 1. Apply to Job

#### Endpoint
```
POST /applications/:jobId/apply
```

#### Authentication
- Required: USER role with JOB_SEEKER account type
- Header: `Authorization: Bearer {token}`

#### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| jobId | string | Yes | Job ID (UUID) |

#### Body (Form Data)

| Field | Type | Required | Validation | Description |
|-------|------|----------|-----------|-------------|
| cover_letter | string | No | max: 2000 | Application cover letter |
| resume | file | No | - | PDF/DOC resume file |

#### Validation

```
- cover_letter: Optional, max 2000 characters
- resume: Optional, but if provided must be valid file
- jobSeeker profile must exist
- Job must exist and be OPEN
- Duplicate application check: Cannot apply twice to same job
```

#### Request

```bash
curl -X POST "http://localhost:5000/api/v1/applications/550e8400-e29b-41d4-a716-446655440000/apply" \
  -H "Authorization: Bearer {token}" \
  -F "cover_letter=I am interested in this position..." \
  -F "resume=@/path/to/resume.pdf"
```

#### Response (201 Created)

```json
{
  "success": true,
  "message": "Application submitted successfully",
  "statusCode": 201,
  "data": {
    "id": "app-uuid-1",
    "jobId": "550e8400-e29b-41d4-a716-446655440000",
    "jobSeekerId": "seeker-uuid",
    "recruiterId": "recruiter-uuid",
    "status": "PENDING",
    "cover_letter": "I am interested in this position...",
    "resume_url": "https://cloudinary.com/...",
    "appliedAt": "2026-04-16T10:30:00Z",
    "job": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Senior React Developer",
      "slug": "senior-react-developer-12345"
    }
  }
}
```

#### Side Effects

- Application record created
- Job applicantCount incremented by 1
- Notification may be sent to recruiter

#### Error Responses

```json
// 404 Not Found - Job seeker profile missing
{
  "success": false,
  "message": "Job seeker profile not found.",
  "statusCode": 404
}

// 404 Not Found - Job not found or closed
{
  "success": false,
  "message": "Job not found or not open for applications.",
  "statusCode": 404
}

// 409 Conflict - Already applied
{
  "success": false,
  "message": "You have already applied to this job.",
  "statusCode": 409
}

// 400 Bad Request - Invalid cover letter
{
  "success": false,
  "message": "cover_letter must be 2000 characters or less",
  "statusCode": 400
}
```

---

### 2. List My Applications

#### Endpoint
```
GET /applications/my-applications
```

#### Authentication
- Required: USER role with JOB_SEEKER account type

#### Query Parameters

| Parameter | Type | Required | Default | Validation |
|-----------|------|----------|---------|-----------|
| page | number | No | 1 | int, min: 1 |
| limit | number | No | 10 | int, min: 1, max: 100 |
| search | string | No | - | Search job titles |
| status | enum | No | - | APPLICATION_STATUS enum |

#### Request

```bash
curl -X GET "http://localhost:5000/api/v1/applications/my-applications?page=1&limit=10&status=SHORTLISTED" \
  -H "Authorization: Bearer {token}"
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Applications fetched successfully",
  "data": [
    {
      "id": "app-uuid-1",
      "status": "SHORTLISTED",
      "cover_letter": "I am interested...",
      "resume_url": "https://cloudinary.com/...",
      "resumeAccessUrl": "http://localhost:5000/api/v1/applications/app-uuid-1/resume",
      "appliedAt": "2026-04-16T10:00:00Z",
      "shortlistedAt": "2026-04-16T14:00:00Z",
      "acceptedAt": null,
      "rejectedAt": null,
      "rejectionReason": null,
      "responseMessage": "Great! We'd like to interview you.",
      "hasResponded": true,
      "respondedAt": "2026-04-16T14:00:00Z",
      "interviewDate": "2026-04-25T10:00:00Z",
      "interviewNotes": "Video interview scheduled",
      "job": {
        "id": "job-uuid",
        "title": "Senior React Developer",
        "slug": "senior-react-developer-12345",
        "category": "WEB_DEVELOPMENT",
        "level": "SENIOR_LEVEL",
        "salaryMin": 80000,
        "salaryMax": 150000,
        "salaryCurrency": "BDT",
        "recruiter": {
          "id": "recruiter-uuid",
          "agencyName": "Tech Solutions Ltd",
          "user": {
            "name": "John Doe",
            "image": "https://..."
          }
        }
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

#### Search Logic

Searches in:
- Job title (case-insensitive)
- Job description (case-insensitive)

---

### 3. Get Application Resume

#### Endpoint
```
GET /applications/:applicationId/resume
```

#### Authentication
- Required: USER role (JOB_SEEKER or RECRUITER)
- Job Seeker: Can only view own resume
- Recruiter: Can view applicants' resumes for their jobs

#### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| applicationId | string | Yes | Application ID |

#### Request

```bash
curl -X GET "http://localhost:5000/api/v1/applications/app-uuid-1/resume" \
  -H "Authorization: Bearer {token}"
```

#### Response

- **302 Redirect** to the actual resume URL on Cloudinary
- Or **404** if resume not found

#### Error Responses

```json
// 404 Not Found
{
  "success": false,
  "message": "Application not found or you do not have access.",
  "statusCode": 404
}

// 404 Not Found - No resume
{
  "success": false,
  "message": "Resume not found for this application.",
  "statusCode": 404
}
```

---

## Recruiter Application Management

### 1. List Applicants for Job

#### Endpoint
```
GET /applications/recruiter/jobs/:jobId/applicants
```

#### Authentication
- Required: USER role with RECRUITER account type
- Can only view applicants for own jobs

#### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| jobId | string | Yes | Job ID |

#### Query Parameters

| Parameter | Type | Required | Default | Validation |
|-----------|------|----------|---------|-----------|
| page | number | No | 1 | int, min: 1 |
| limit | number | No | 10 | int, min: 1, max: 100 |
| search | string | No | - | Search in applicant name, cover letter |
| status | enum | No | - | APPLICATION_STATUS enum |

#### Request

```bash
curl -X GET "http://localhost:5000/api/v1/applications/recruiter/jobs/job-uuid/applicants?page=1&limit=10&status=SHORTLISTED" \
  -H "Authorization: Bearer {token}"
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Applicants fetched successfully",
  "data": {
    "job": {
      "id": "job-uuid",
      "title": "Senior React Developer"
    },
    "applicants": [
      {
        "id": "app-uuid-1",
        "status": "SHORTLISTED",
        "cover_letter": "I am interested...",
        "resume_url": "https://cloudinary.com/...",
        "resumeAccessUrl": "http://localhost:5000/api/v1/applications/app-uuid-1/resume",
        "appliedAt": "2026-04-16T10:00:00Z",
        "shortlistedAt": "2026-04-16T14:00:00Z",
        "responseMessage": "Great! We'd like to interview you.",
        "hasResponded": true,
        "respondedAt": "2026-04-16T14:00:00Z",
        "interviewDate": "2026-04-25T10:00:00Z",
        "interviewNotes": "Video interview scheduled",
        "jobSeeker": {
          "id": "seeker-uuid",
          "designation": "Senior Developer",
          "skills": ["React", "TypeScript", "Node.js"],
          "user": {
            "id": "user-uuid",
            "name": "Jane Smith",
            "email": "jane@example.com",
            "image": "https://..."
          }
        }
      }
    ]
  },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "totalPages": 2
  }
}
```

---

### 2. Update Application Status

#### Endpoint
```
PATCH /applications/recruiter/applications/:applicationId/status
```

#### Authentication
- Required: USER role with RECRUITER account type

#### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| applicationId | string | Yes | Application ID |

#### Body

| Field | Type | Required | Validation | Description |
|-------|------|----------|-----------|-------------|
| status | enum | Yes | APPLICATION_STATUS | New application status |
| responseMessage | string | No | max: 1500 | Message for applicant (rejection reason if REJECTED) |
| interviewDate | string | No | ISO 8601 datetime | Scheduled interview date |
| interviewNotes | string | No | max: 1500 | Interview notes |

#### Validation

```
- status: Must be valid APPLICATION_STATUS enum (PENDING, SHORTLISTED, ACCEPTED, REJECTED, WITHDRAWN)
- responseMessage: Optional, max 1500 chars
- interviewDate: Optional, must be valid ISO 8601 datetime
- interviewNotes: Optional, max 1500 chars
- Application must belong to recruiter's job
```

#### Request

```bash
curl -X PATCH "http://localhost:5000/api/v1/applications/recruiter/applications/app-uuid-1/status" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "SHORTLISTED",
    "responseMessage": "We are impressed with your profile. We would like to schedule an interview.",
    "interviewDate": "2026-04-25T10:00:00Z",
    "interviewNotes": "Video interview via Zoom"
  }'
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Application status updated successfully",
  "statusCode": 200,
  "data": {
    "id": "app-uuid-1",
    "status": "SHORTLISTED",
    "responseMessage": "We are impressed with your profile...",
    "hasResponded": true,
    "respondedAt": "2026-04-16T15:30:00Z",
    "interviewDate": "2026-04-25T10:00:00Z",
    "interviewNotes": "Video interview via Zoom",
    "shortlistedAt": "2026-04-16T15:30:00Z"
  }
}
```

#### Side Effects

- Sets timestamp based on status:
  - SHORTLISTED: Sets `shortlistedAt`
  - ACCEPTED: Sets `acceptedAt`
  - REJECTED: Sets `rejectedAt` and `rejectionReason`
- Sets `responseMessage`, `hasResponded`, `respondedAt`
- May trigger notification to job seeker

#### Error Responses

```json
// 404 Not Found
{
  "success": false,
  "message": "Application not found.",
  "statusCode": 404
}

// 400 Bad Request
{
  "success": false,
  "message": "status is required",
  "statusCode": 400
}
```

---

### 3. Bulk Update Application Status

#### Endpoint
```
PATCH /applications/recruiter/applications/bulk-status
```

#### Authentication
- Required: USER role with RECRUITER account type

#### Body

| Field | Type | Required | Validation | Description |
|-------|------|----------|-----------|-------------|
| applicationIds | array | Yes | Array of 1-200 UUIDs | Application IDs to update |
| status | enum | Yes | APPLICATION_STATUS | New status for all applications |
| responseMessage | string | No | max: 1500 | Same message for all applicants |

#### Validation

```
- applicationIds: Array of 1-200 strings
- All applications must belong to recruiter
- status: Must be valid APPLICATION_STATUS enum
- responseMessage: Optional, max 1500 chars
```

#### Request

```bash
curl -X PATCH "http://localhost:5000/api/v1/applications/recruiter/applications/bulk-status" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "applicationIds": ["app-uuid-1", "app-uuid-2", "app-uuid-3"],
    "status": "SHORTLISTED",
    "responseMessage": "Thank you for applying. We will review your application."
  }'
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Applications updated successfully",
  "statusCode": 200,
  "data": {
    "updatedCount": 3
  }
}
```

#### Error Responses

```json
// 403 Forbidden - Some applications not accessible
{
  "success": false,
  "message": "One or more applications are not accessible.",
  "statusCode": 403
}

// 400 Bad Request
{
  "success": false,
  "message": "applicationIds must have at least 1 item",
  "statusCode": 400
}
```

---

## Saved Jobs

### 1. Toggle Save Job

#### Endpoint
```
POST /applications/saved-jobs/:jobId/toggle
```

#### Authentication
- Required: USER role with JOB_SEEKER account type

#### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| jobId | string | Yes | Job ID |

#### Request

```bash
curl -X POST "http://localhost:5000/api/v1/applications/saved-jobs/job-uuid/toggle" \
  -H "Authorization: Bearer {token}"
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Job saved successfully",
  "statusCode": 200,
  "data": {
    "saved": true
  }
}
```

**OR** (if removing from saved):

```json
{
  "success": true,
  "message": "Job removed from saved list",
  "statusCode": 200,
  "data": {
    "saved": false
  }
}
```

#### Side Effects

- If saved: Creates SavedJob record, increments job `savedByCount`
- If already saved: Deletes SavedJob record, decrements job `savedByCount`

#### Error Responses

```json
// 404 Not Found
{
  "success": false,
  "message": "Job seeker profile not found.",
  "statusCode": 404
}

// 404 Not Found
{
  "success": false,
  "message": "Job not found.",
  "statusCode": 404
}
```

---

### 2. List Saved Jobs

#### Endpoint
```
GET /applications/saved-jobs
```

#### Authentication
- Required: USER role with JOB_SEEKER account type

#### Query Parameters

| Parameter | Type | Required | Default | Validation |
|-----------|------|----------|---------|-----------|
| page | number | No | 1 | int, min: 1 |
| limit | number | No | 10 | int, min: 1, max: 100 |
| search | string | No | - | Search in job title, description |

#### Request

```bash
curl -X GET "http://localhost:5000/api/v1/applications/saved-jobs?page=1&limit=10&search=react" \
  -H "Authorization: Bearer {token}"
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Saved jobs fetched successfully",
  "data": [
    {
      "id": "saved-job-uuid",
      "createdAt": "2026-04-16T10:00:00Z",
      "job": {
        "id": "job-uuid",
        "title": "Senior React Developer",
        "slug": "senior-react-developer-12345",
        "category": "WEB_DEVELOPMENT",
        "country": "Bangladesh",
        "city": "Dhaka",
        "salaryMin": 80000,
        "salaryMax": 150000,
        "salaryCurrency": "BDT",
        "createdAt": "2026-04-01T10:00:00Z",
        "recruiter": {
          "user": {
            "name": "John Doe",
            "image": "https://..."
          }
        }
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

---

## Recruiter Job Management

### 1. Create Job

#### Endpoint
```
POST /recruiter/jobs
```

#### Authentication
- Required: USER role with RECRUITER account type

#### Body (JSON)

| Field | Type | Required | Validation | Description |
|-------|------|----------|-----------|-------------|
| title | string | Yes | min: 3, max: 255 | Job title |
| description | string | Yes | min: 10 | Detailed job description |
| category | enum | Yes | JOB_CATEGORY | Job category |
| employmentType | enum | Yes | EMPLOYMENT_TYPE | Employment type |
| level | enum | Yes | JOB_LEVEL | Experience level |
| salaryMin | number | No | min: 0 | Minimum salary |
| salaryMax | number | No | min: 0 | Maximum salary |
| salaryCurrency | enum | No | default: BDT | Salary currency |
| requiredSkills | array | Yes | min: 1, items string | Required skills |
| experience | string | No | - | Required experience |
| education | string | No | - | Required education |
| languages | array | No | array of strings | Languages required |
| country | string | No | - | Country |
| city | string | No | - | City |
| isRemote | boolean | No | default: false | Remote job? |
| timezone | string | No | - | Timezone (if remote) |
| status | enum | No | default: OPEN | Job status |
| isUrgent | boolean | No | default: false | Urgent hiring? |
| urgencyUntil | string | No | ISO 8601 | Urgency deadline |
| position | number | No | default: 1 | Current position number |
| totalPositions | number | No | default: 1 | Total positions available |
| closesAt | string | No | ISO 8601 | Application closing date |
| metaTitle | string | No | max: 100 | SEO meta title |
| metaDescription | string | No | max: 200 | SEO meta description |

#### Validation

```
- title: Required, 3-255 chars
- description: Required, min 10 chars
- category: Required, must be JOB_CATEGORY enum
- employmentType: Required, must be EMPLOYMENT_TYPE enum
- level: Required, must be JOB_LEVEL enum
- requiredSkills: Required array with at least 1 skill
- salaryMin <= salaryMax (if both provided)
- All fields must match schema (strict validation)
```

#### Request

```bash
curl -X POST "http://localhost:5000/api/v1/recruiter/jobs" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior React Developer",
    "description": "We are looking for an experienced React developer to join our team...",
    "category": "WEB_DEVELOPMENT",
    "employmentType": "FULL_TIME",
    "level": "SENIOR_LEVEL",
    "salaryMin": 80000,
    "salaryMax": 150000,
    "salaryCurrency": "BDT",
    "requiredSkills": ["React", "TypeScript", "Node.js"],
    "experience": "5+ years in web development",
    "education": "Bachelor'\''s in Computer Science",
    "languages": ["English", "Bangla"],
    "country": "Bangladesh",
    "city": "Dhaka",
    "isRemote": true,
    "timezone": "GMT+6",
    "status": "OPEN",
    "isUrgent": false,
    "position": 1,
    "totalPositions": 1,
    "closesAt": "2026-05-16T23:59:59Z",
    "metaTitle": "Senior React Developer Job",
    "metaDescription": "Join our team as a Senior React Developer..."
  }'
```

#### Response (201 Created)

```json
{
  "success": true,
  "message": "Job created successfully",
  "statusCode": 201,
  "data": {
    "id": "job-uuid",
    "recruiterId": "recruiter-uuid",
    "title": "Senior React Developer",
    "slug": "senior-react-developer-12345-67890",
    "description": "We are looking for an experienced React developer...",
    "category": "WEB_DEVELOPMENT",
    "employmentType": "FULL_TIME",
    "level": "SENIOR_LEVEL",
    "salaryMin": 80000,
    "salaryMax": 150000,
    "salaryCurrency": "BDT",
    "requiredSkills": ["React", "TypeScript", "Node.js"],
    "experience": "5+ years in web development",
    "education": "Bachelor's in Computer Science",
    "languages": ["English", "Bangla"],
    "country": "Bangladesh",
    "city": "Dhaka",
    "isRemote": true,
    "timezone": "GMT+6",
    "status": "OPEN",
    "isUrgent": false,
    "position": 1,
    "totalPositions": 1,
    "viewCount": 0,
    "applicantCount": 0,
    "savedByCount": 0,
    "closesAt": "2026-05-16T23:59:59Z",
    "createdAt": "2026-04-16T10:00:00Z",
    "updatedAt": "2026-04-16T10:00:00Z",
    "metaTitle": "Senior React Developer Job",
    "metaDescription": "Join our team as a Senior React Developer..."
  }
}
```

#### Side Effects

- Creates Job record with unique slug
- Auto-generated unique slug format: `{title-slug}-{timestamp-last5}-{random1000}`

#### Error Responses

```json
// 404 Not Found - Recruiter profile missing
{
  "success": false,
  "message": "Recruiter profile not found. Please complete your profile first.",
  "statusCode": 404,
  "errorCode": "RECRUITER_NOT_FOUND"
}

// 400 Bad Request - Invalid data
{
  "success": false,
  "message": "title must be between 3 and 255 characters",
  "statusCode": 400
}
```

---

### 2. Get My Jobs

#### Endpoint
```
GET /recruiter/jobs
```

#### Authentication
- Required: USER role with RECRUITER account type

#### Query Parameters

| Parameter | Type | Required | Default | Validation |
|-----------|------|----------|---------|-----------|
| page | number | No | 1 | int, min: 1 |
| limit | number | No | 10 | int, min: 1, max: 100 |
| search | string | No | - | Search in title, description |

#### Request

```bash
curl -X GET "http://localhost:5000/api/v1/recruiter/jobs?page=1&limit=10&search=react" \
  -H "Authorization: Bearer {token}"
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Recruiter jobs fetched successfully",
  "data": [
    {
      "id": "job-uuid",
      "title": "Senior React Developer",
      "slug": "senior-react-developer-12345",
      "description": "We are looking for...",
      "category": "WEB_DEVELOPMENT",
      "employmentType": "FULL_TIME",
      "level": "SENIOR_LEVEL",
      "salaryMin": 80000,
      "salaryMax": 150000,
      "salaryCurrency": "BDT",
      "requiredSkills": ["React", "TypeScript", "Node.js"],
      "status": "OPEN",
      "viewCount": 245,
      "applicantCount": 15,
      "savedByCount": 8,
      "createdAt": "2026-04-01T10:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

---

### 3. Update Job

#### Endpoint
```
PATCH /recruiter/jobs/:jobId
```

#### Authentication
- Required: USER role with RECRUITER account type
- Can only update own jobs

#### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| jobId | string | Yes | Job ID |

#### Body (JSON)

**All fields are optional** (partial update allowed). Use same fields as Create Job.

#### Validation

```
- Same validation as Create Job, but all fields optional
- Slug will be regenerated if title changes
- salaryMin <= salaryMax (if both provided)
```

#### Request

```bash
curl -X PATCH "http://localhost:5000/api/v1/recruiter/jobs/job-uuid" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "salaryMin": 100000,
    "salaryMax": 200000,
    "closesAt": "2026-06-16T23:59:59Z"
  }'
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Job updated successfully",
  "statusCode": 200,
  "data": {
    "id": "job-uuid",
    "title": "Senior React Developer",
    "slug": "senior-react-developer-new-slug",
    "salaryMin": 100000,
    "salaryMax": 200000,
    "closesAt": "2026-06-16T23:59:59Z",
    "updatedAt": "2026-04-16T15:30:00Z"
  }
}
```

#### Side Effects

- If title changes: Slug is regenerated
- Updates metaTitle/metaDescription if not explicitly provided but title changed

#### Error Responses

```json
// 404 Not Found
{
  "success": false,
  "message": "Job not found.",
  "statusCode": 404
}

// 400 Bad Request
{
  "success": false,
  "message": "Invalid data provided",
  "statusCode": 400
}
```

---

### 4. Delete Job

#### Endpoint
```
DELETE /recruiter/jobs/:jobId
```

#### Authentication
- Required: USER role with RECRUITER account type
- Can only delete own jobs

#### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| jobId | string | Yes | Job ID |

#### Request

```bash
curl -X DELETE "http://localhost:5000/api/v1/recruiter/jobs/job-uuid" \
  -H "Authorization: Bearer {token}"
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Job deleted successfully",
  "statusCode": 200,
  "data": {
    "deleted": true
  }
}
```

#### Side Effects

- Sets `isDeleted: true` (soft delete)
- Sets `deletedAt: <current timestamp>`
- Job no longer appears in public listing

#### Error Responses

```json
// 404 Not Found
{
  "success": false,
  "message": "Job not found.",
  "statusCode": 404
}
```

---

## Data Models & Enums

### Job Status

```typescript
enum PROJECT_STATUS {
  OPEN          // Accepting applications
  IN_PROGRESS   // Hiring in progress
  COMPLETED     // Position filled
  CANCELLED     // Job cancelled
  ON_HOLD       // Temporarily on hold
}
```

### Application Status

```typescript
enum APPLICATION_STATUS {
  PENDING       // Initial submission
  SHORTLISTED  // Candidate shortlisted
  ACCEPTED     // Job offer accepted
  REJECTED     // Application rejected
  WITHDRAWN    // Candidate withdrew
}
```

### Job Category

```typescript
enum JOB_CATEGORY {
  WEB_DEVELOPMENT
  MOBILE_DEVELOPMENT
  DESIGN
  MARKETING
  WRITING
  FINANCE
  BUSINESS
  ENGINEERING
  OTHER
}
```

### Job Level

```typescript
enum JOB_LEVEL {
  ENTRY_LEVEL
  MID_LEVEL
  SENIOR_LEVEL
  LEAD
  MANAGER
}
```

### Employment Type

```typescript
enum EMPLOYMENT_TYPE {
  FULL_TIME
  PART_TIME
  CONTRACT
  FREELANCE
  TEMPORARY
  INTERNSHIP
}
```

### Salary Currency

```typescript
enum SALARY_CURRENCY {
  BDT   // Bangladesh Taka
  USD   // US Dollar
  EUR   // Euro
  GBP   // British Pound
  CAD   // Canadian Dollar
  AUD   // Australian Dollar
  JPY   // Japanese Yen
  CHF   // Swiss Franc
  CNY   // Chinese Yuan
  INR   // Indian Rupee
}
```

---

## Error Handling

### Standard Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "statusCode": <number>,
  "errorCode": "<optional_error_code>"
}
```

### HTTP Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET/PATCH/DELETE |
| 201 | Created | Successful POST (new resource) |
| 400 | Bad Request | Invalid input validation |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate application, etc. |
| 500 | Server Error | Unexpected server error |

### Common Error Scenarios

#### 1. Missing Authentication
```json
{
  "success": false,
  "message": "Unauthorized",
  "statusCode": 401
}
```

#### 2. Wrong Account Type
```json
{
  "success": false,
  "message": "You do not have permission to access this resource",
  "statusCode": 403
}
```

#### 3. Validation Error
```json
{
  "success": false,
  "message": "Field validation failed: requiredSkills must have at least 1 item",
  "statusCode": 400
}
```

#### 4. Resource Not Found
```json
{
  "success": false,
  "message": "Job not found.",
  "statusCode": 404
}
```

---

## Validation Rules

### String Fields

- **Trimmed**: All string values are automatically trimmed
- **Case-insensitive**: Search operations are case-insensitive
- **Max length**: Enforced at validation level
- **Special characters**: Allowed except where explicitly restricted (e.g., slug generation)

### Numeric Fields

- **Integer**: Page, limit must be integers
- **Positive**: Page, limit must be > 0
- **Range**: Min/Max values checked
- **Currency**: Numeric but represented with proper currency

### Enum Fields

- **Strict validation**: Must exactly match enum value
- **No partial matching**: "web" does not match "WEB_DEVELOPMENT"

### Array Fields

- **Min/Max items**: Validated at schema level
- **Item types**: Each item type-checked
- **Uniqueness**: Not enforced (duplicates allowed, e.g., skills)

### File Upload (Resume)

- **Allowed types**: PDF, DOC, DOCX (enforced by middleware)
- **Max size**: Configured in upload middleware
- **Storage**: Cloudinary with folder structure
- **URL**: Returned as `resume_url`

### Pagination

- **Default page**: 1
- **Default limit**: 10
- **Max limit**: 100
- **Query param format**: `?page=1&limit=10`

---

## Implementation Checklist for Copilot

When building the frontend, ensure these are implemented:

### Job Search & Browse Page

- [ ] Display paginated job listing with infinite scroll or pagination controls
- [ ] Search bar for keywords (title, description, skills)
- [ ] Filter by category, level, location, salary range
- [ ] Display recruiter details
- [ ] Show job counts (views, applicants, saved)
- [ ] View individual job details with full information
- [ ] Track view count on job detail page
- [ ] Save/unsave jobs with toggle button
- [ ] Show saved status on job cards

### Job Application Flow

- [ ] Application form with cover letter and resume upload
- [ ] Resume file validation (size, type)
- [ ] Submit application with loading state
- [ ] Success/error message handling
- [ ] Duplicate application prevention (client-side check)
- [ ] Application confirmation page

### My Applications Page

- [ ] List all applications with filters (status, search)
- [ ] Show application details with job info
- [ ] Display application status timeline
- [ ] Show recruiter response message if available
- [ ] Display interview date and notes if scheduled
- [ ] Download resume access
- [ ] Pagination and search functionality

### Saved Jobs Page

- [ ] Display list of saved jobs
- [ ] Search and filter saved jobs
- [ ] Quick apply from saved jobs list
- [ ] Remove from saved with confirmation
- [ ] Show save date/time
- [ ] Pagination

### Recruiter Job Management (if applicable)

- [ ] Job creation form with all fields
- [ ] Job editing with partial updates
- [ ] Job deletion with confirmation
- [ ] List recruiter's own jobs with pagination
- [ ] View applicants for each job
- [ ] Update application status with message
- [ ] Bulk update application statuses
- [ ] Schedule interview with recruiter
- [ ] Resume download for applicants

### Error Handling

- [ ] Display user-friendly error messages
- [ ] Handle network errors gracefully
- [ ] Retry mechanism for failed requests
- [ ] Form validation error display
- [ ] Loading states for async operations
- [ ] Prevent duplicate submissions

### Responsive Design

- [ ] Mobile-optimized job cards
- [ ] Mobile-friendly filter UI
- [ ] Touch-friendly buttons and inputs
- [ ] Responsive file upload
- [ ] Mobile navigation

---

## Production Ready Notes

### Performance

1. **Pagination**: Always paginate results, max 100 items per page
2. **Lazy loading**: Load job details on demand
3. **Resume storage**: Use Cloudinary CDN for fast delivery
4. **Caching**: Cache job listings with reasonable TTL

### Security

1. **Authentication**: Verify token on every protected endpoint
2. **Authorization**: Check account type and job ownership
3. **File upload**: Validate file types and size server-side
4. **Input sanitization**: Zod validation on all inputs
5. **Resume URLs**: Use signed/secure URLs from Cloudinary

### Database Optimization

1. **Indexes**: Queries use indexes on:
   - `job.recruiterId`
   - `job.status`
   - `job.category`
   - `job.createdAt`
   - `job.title`
   - `application.jobSeekerId`
   - `savedJob.jobSeekerId`

2. **Transactions**: Used for:
   - Apply to job (create application + increment count)
   - Toggle save (save/delete + update count)
   - Update status (single update)

### Monitoring

1. Log all API calls
2. Track error rates per endpoint
3. Monitor database query performance
4. Alert on high error rates

---

## Example Implementation Flow

### For Job Seeker

1. **Browse Jobs**
   ```
   GET /api/v1/jobs?category=WEB_DEVELOPMENT&level=MID_LEVEL&page=1
   ```

2. **View Job Details**
   ```
   GET /api/v1/jobs/{jobId}
   ```

3. **Save Job**
   ```
   POST /api/v1/applications/saved-jobs/{jobId}/toggle
   ```

4. **Apply to Job**
   ```
   POST /api/v1/applications/{jobId}/apply
   (with resume and cover letter)
   ```

5. **View Applications**
   ```
   GET /api/v1/applications/my-applications?status=SHORTLISTED
   ```

6. **View Saved Jobs**
   ```
   GET /api/v1/applications/saved-jobs?page=1
   ```

### For Recruiter

1. **Create Job**
   ```
   POST /api/v1/recruiter/jobs
   ```

2. **View My Jobs**
   ```
   GET /api/v1/recruiter/jobs?page=1
   ```

3. **View Applicants**
   ```
   GET /api/v1/applications/recruiter/jobs/{jobId}/applicants
   ```

4. **Shortlist Candidate**
   ```
   PATCH /api/v1/applications/recruiter/applications/{appId}/status
   (status: SHORTLISTED, interviewDate, etc.)
   ```

5. **Update Job**
   ```
   PATCH /api/v1/recruiter/jobs/{jobId}
   ```

6. **Delete Job**
   ```
   DELETE /api/v1/recruiter/jobs/{jobId}
   ```

---

## Copy-Paste Ready Backend Contract for Frontend

You can give this entire document to your frontend Copilot with this prompt:

> Implement a complete job seeker application system following the API contract in this document. Create pages for:
> 1. Job search and browse with filters
> 2. Job details view with save functionality
> 3. Job application with resume upload
> 4. My applications list with status tracking
> 5. Saved jobs list
> 6. (Optional) Recruiter job management dashboard
>
> Use the exact endpoint paths, query parameters, request/response schemas, validation rules, and error handling specified. Ensure all status codes, error messages, and data structures match the contract. Handle pagination, loading states, and error scenarios gracefully.
