You are building the frontend integration for TaskOrbit Client APIs.

Project context:
- Stack: React + TypeScript (or Next.js App Router if available)
- API base URL: /api/v1/client
- All endpoints require Authorization Bearer token
- Backend returns envelope:
  - success response: { statusCode, success, message, data, meta? }
  - error response: { success, statusCode, message, requestId, errorSource[] }

Your task:
Implement a production-quality Client module frontend with strict typing, reusable API layer, and robust error handling.

Required features:
1) API client layer
- Build typed API functions for:
  - GET /dashboard/summary
  - GET /orders
  - GET /orders/:orderId
  - POST /queries
  - GET /queries
  - GET /queries/:queryId
  - PATCH /queries/:queryId
  - POST /queries/:queryId/replies
  - PATCH /queries/:queryId/close
  - PATCH /queries/:queryId/reopen
  - GET /settings
  - PATCH /settings
- Implement shared fetch wrapper:
  - inject bearer token
  - parse envelope
  - throw typed ApiError with statusCode, message, requestId, errorSource

2) TypeScript types
- Create full interfaces for:
  - dashboard summary
  - order list item and order detail
  - query list/detail, reply, status, priority
  - settings payload and settings response
  - paginated meta response

3) State/data fetching
- Use TanStack Query (preferred) or equivalent.
- Add query keys and mutation hooks.
- Invalidate/refetch related data on mutations.

4) Pages/components
- Client Dashboard page:
  - order counters
  - spending cards
  - pending actions
  - recent orders list
  - unread messages/notifications badges
- Orders page:
  - table/list with pagination, status filter, search, sorting
  - order detail drawer/page from /orders/:orderId
- Queries page:
  - create query form
  - list with filters + pagination
  - query details panel
  - add reply flow
  - close/reopen actions with confirm modals
- Settings page:
  - profile form (name, image, timezone, language)
  - notifications/privacy/account form blocks
  - note in UI: only profile name/image/timezone are currently persisted by backend

5) Validation and UX
- Mirror backend constraints in frontend validation (zod or yup):
  - query subject min 3
  - description min 5
  - category required
  - reply message required
  - orders limit max 100
  - ISO datetime for dateFrom/dateTo
- Show backend message in toasts.
- Map errorSource path messages to form fields.
- Handle 409 conflict with actionable messages.

6) Output format
Return:
- folder/file structure
- full code for each file
- minimal setup instructions
- short explanation of architecture decisions

API details to use exactly:
- Client frontend guide path: CLIENT_FRONTEND_IMPLEMENTATION_GUIDE.md

Quality bar:
- clean architecture
- no any types
- reusable hooks
- loading/skeleton states
- empty states
- retry strategy for safe GET requests
- accessible form controls and buttons
