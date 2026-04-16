# Client Module Frontend Implementation Guide

## Overview
This guide documents the Client APIs implemented in backend phases 1-4.

Base URL prefix:
- `/api/v1/client`

Authentication:
- All endpoints require a valid user token.
- The authenticated user must be a `CLIENT` account type.
- Send `Authorization: Bearer <access_token>` in every request.

Response envelope (success):
```json
{
  "statusCode": 200,
  "success": true,
  "message": "...",
  "data": {},
  "meta": {}
}
```

Response envelope (error):
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "requestId": "uuid",
  "errorSource": [
    { "path": "field", "message": "reason" }
  ]
}
```

---

## 1) Dashboard Summary
### GET `/dashboard/summary`
Fetch client dashboard aggregate data.

Request:
- No query/body.

Success data shape:
```json
{
  "orderCounts": {
    "total": 0,
    "active": 0,
    "pending": 0,
    "completed": 0,
    "cancelled": 0,
    "disputed": 0
  },
  "spending": {
    "totalSpend": 0,
    "monthSpend": 0,
    "currency": "USD"
  },
  "pendingActions": {
    "pendingApprovals": 0,
    "pendingDeliverableReviews": 0
  },
  "recentOrders": [
    {
      "id": "order_id",
      "title": "Landing page",
      "status": "ACTIVE",
      "amount": 250,
      "currency": "USD",
      "updatedAt": "2026-04-16T06:00:00.000Z"
    }
  ],
  "unreadMessagesCount": 2,
  "unreadNotificationsCount": 5
}
```

Frontend notes:
- Treat `amount` and spending fields as numbers.
- Show empty states when arrays are empty and counts are 0.

---

## 2) Client Orders

### GET `/orders`
Paginated order list.

Query params:
- `page` number (optional, default 1)
- `limit` number (optional, default 10, max 100)
- `status` enum (optional)
- `search` string (optional)
- `sortBy` one of `createdAt | amount | deliveryDate | updatedAt` (optional)
- `sortOrder` one of `asc | desc` (optional)
- `dateFrom` ISO datetime string (optional)
- `dateTo` ISO datetime string (optional)

Example request:
- `/api/v1/client/orders?page=1&limit=10&sortBy=updatedAt&sortOrder=desc`

Success data item shape:
```json
{
  "id": "order_id",
  "title": "UI Redesign",
  "status": "ACTIVE",
  "amount": 500,
  "currency": "USD",
  "deliveryDate": "2026-04-30T00:00:00.000Z",
  "updatedAt": "2026-04-16T05:00:00.000Z",
  "seller": {
    "id": "seller_id",
    "name": "Jane",
    "image": "https://..."
  },
  "progress": {
    "totalPhases": 4,
    "completedPhases": 2,
    "percentage": 50
  },
  "lastMessageAt": "2026-04-16T04:00:00.000Z"
}
```

Success meta:
```json
{
  "page": 1,
  "limit": 10,
  "total": 32,
  "totalPages": 4
}
```

### GET `/orders/:orderId`
Single order detail.

Path params:
- `orderId` string (required)

Success data shape:
```json
{
  "order": {
    "id": "order_id",
    "title": "UI Redesign",
    "description": "...",
    "amount": 500,
    "currency": "USD",
    "status": "ACTIVE",
    "requirements": "...",
    "notes": "...",
    "attachmentUrls": ["https://..."],
    "deliveryDate": "2026-04-30T00:00:00.000Z",
    "createdAt": "2026-04-01T00:00:00.000Z",
    "updatedAt": "2026-04-16T00:00:00.000Z"
  },
  "seller": {
    "id": "seller_id",
    "name": "Jane",
    "email": "jane@example.com",
    "image": "https://..."
  },
  "service": {
    "id": "service_id",
    "title": "Website Design",
    "thumbnailUrl": "https://...",
    "category": "DESIGN"
  },
  "phases": [
    {
      "id": "phase_id",
      "title": "Discovery",
      "description": "...",
      "percentage": 25,
      "deliveryDays": 3,
      "status": "APPROVED",
      "startedAt": "2026-04-02T00:00:00.000Z",
      "completedAt": "2026-04-05T00:00:00.000Z"
    }
  ],
  "deliverablesSummary": {
    "total": 5,
    "submitted": 3,
    "approved": 1,
    "rejected": 1,
    "pending": 0
  },
  "lastMessageMetadata": {
    "id": "message_id",
    "senderId": "user_id",
    "message": "Please check",
    "createdAt": "2026-04-16T04:00:00.000Z",
    "isRead": false
  },
  "permittedActions": {
    "canReviewDeliverables": true,
    "canSendMessage": true,
    "canRequestCancellation": true
  }
}
```

Frontend notes:
- Drive UI action buttons from `permittedActions`.
- `lastMessageMetadata` may be `null`.

---

## 3) Client Queries (Support Tickets)

Status enum:
- `OPEN | IN_PROGRESS | RESOLVED | CLOSED`

Priority enum:
- `LOW | MEDIUM | HIGH`

Reply senderRole enum:
- `CLIENT | ADMIN | SUPPORT`

### POST `/queries`
Create a query.

Body:
```json
{
  "subject": "Payment not reflected",
  "description": "I paid but status is pending",
  "category": "billing",
  "priority": "HIGH",
  "attachmentUrls": ["https://..."],
  "relatedOrderId": "order_id"
}
```

Validation:
- `subject`: min 3 chars
- `description`: min 5 chars
- `category`: required non-empty
- `attachmentUrls[]`: valid URLs

Success data:
```json
{
  "id": "query_id",
  "subject": "Payment not reflected",
  "description": "...",
  "category": "billing",
  "priority": "HIGH",
  "status": "OPEN",
  "attachmentUrls": ["https://..."],
  "createdAt": "2026-04-16T06:00:00.000Z",
  "updatedAt": "2026-04-16T06:00:00.000Z",
  "replies": []
}
```

### GET `/queries`
List queries with pagination and filters.

Query params:
- `page`, `limit`
- `status`
- `priority`
- `category`
- `search`
- `sortBy` one of `createdAt | updatedAt`
- `sortOrder` one of `asc | desc`

Success data item shape:
```json
{
  "id": "query_id",
  "subject": "Payment not reflected",
  "description": "...",
  "category": "billing",
  "priority": "HIGH",
  "status": "IN_PROGRESS",
  "attachmentUrls": ["https://..."],
  "repliesCount": 2,
  "createdAt": "2026-04-16T06:00:00.000Z",
  "updatedAt": "2026-04-16T07:00:00.000Z"
}
```

### GET `/queries/:queryId`
Get query detail.

Success data shape:
```json
{
  "id": "query_id",
  "subject": "Payment not reflected",
  "description": "...",
  "category": "billing",
  "priority": "HIGH",
  "status": "IN_PROGRESS",
  "attachmentUrls": ["https://..."],
  "relatedOrderId": "order_id",
  "createdAt": "2026-04-16T06:00:00.000Z",
  "updatedAt": "2026-04-16T07:00:00.000Z",
  "replies": [
    {
      "senderRole": "CLIENT",
      "message": "Any update?",
      "createdAt": "2026-04-16T06:30:00.000Z",
      "attachmentUrls": []
    }
  ]
}
```

### PATCH `/queries/:queryId`
Update query metadata (not description).

Body (any one or more):
```json
{
  "subject": "Updated subject",
  "category": "billing",
  "priority": "MEDIUM"
}
```

Rules:
- Cannot update if status is `RESOLVED` or `CLOSED`.

### POST `/queries/:queryId/replies`
Add reply to query.

Body:
```json
{
  "message": "Please review this screenshot",
  "attachmentUrls": ["https://..."]
}
```

Rules:
- Cannot reply when status is `CLOSED`.
- If query is `OPEN`, backend auto-moves it to `IN_PROGRESS` after reply.

Success data:
```json
{
  "id": "query_id",
  "replies": [
    {
      "senderRole": "CLIENT",
      "message": "Please review this screenshot",
      "createdAt": "2026-04-16T07:30:00.000Z",
      "attachmentUrls": ["https://..."]
    }
  ]
}
```

### PATCH `/queries/:queryId/close`
Close query.

Success data:
```json
{
  "id": "query_id",
  "status": "CLOSED",
  "updatedAt": "2026-04-16T08:00:00.000Z"
}
```

### PATCH `/queries/:queryId/reopen`
Reopen query.

Rules:
- Allowed only when current status is `CLOSED` or `RESOLVED`.

Success data:
```json
{
  "id": "query_id",
  "status": "OPEN",
  "updatedAt": "2026-04-16T08:05:00.000Z"
}
```

---

## 4) Client Settings

### GET `/settings`
Fetch client settings snapshot.

Success data shape:
```json
{
  "profile": {
    "name": "John Doe",
    "image": "https://...",
    "timezone": "Asia/Dhaka",
    "language": null
  },
  "notifications": {
    "email": true,
    "push": false,
    "inApp": true,
    "digestFrequency": "instant"
  },
  "privacy": {
    "profileVisibility": "public",
    "dataSharing": false
  },
  "account": {
    "twoFactorEnabled": false,
    "lastPasswordChange": null
  }
}
```

### PATCH `/settings`
Update settings.

Body blocks (at least one block required):
- `profile`
- `notifications`
- `privacy`
- `account`

Example body:
```json
{
  "profile": {
    "name": "New Name",
    "image": "https://...",
    "timezone": "Asia/Dhaka",
    "language": "en"
  },
  "notifications": {
    "email": true,
    "push": true,
    "inApp": true,
    "digestFrequency": "daily"
  },
  "privacy": {
    "profileVisibility": "private",
    "dataSharing": false
  },
  "account": {
    "twoFactorEnabled": false
  }
}
```

Important persistence note:
- Current backend persists profile fields: `name`, `image`, `timezone`.
- Other settings are currently returned as default values in response.

Frontend recommendation:
- Keep optimistic UI, but treat profile fields as source-of-truth persistence for now.
- Keep notification/privacy/account settings UI behind feature-flag or show info text until full persistence arrives.

---

## Common Frontend Error Mapping

Typical statuses you should handle:
- `400` validation error
- `401` unauthorized token
- `403` client profile/account access issue
- `404` missing order/query
- `409` invalid state transition (closed query reply, reopen/update invalid status)
- `500` server error

Recommended UI behavior:
- Always show `message` from response.
- Use `errorSource[]` to highlight form fields when available.
- Log `requestId` for support/debug tickets.

---

## Quick Integration Checklist

1. Add a shared API client with auth bearer token.
2. Type all responses using the shapes above.
3. Build dashboard widgets from `/dashboard/summary`.
4. Implement order list filters + pagination using `meta`.
5. Implement ticket lifecycle buttons with status guards.
6. Implement settings page with profile edits as persisted fields.
7. Add centralized error toast + field-level validation mapping.
