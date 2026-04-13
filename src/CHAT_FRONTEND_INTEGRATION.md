# TaskOrbit Frontend Integration Guide (Chat + Auth)

This document explains exactly how to integrate your frontend with the current backend implementation.

It covers:
- Authentication flow needed by protected APIs
- Chat REST APIs
- Socket.IO real-time events
- Allowed role/account chat rules
- Production-ready frontend patterns
- Error handling and reconnect strategy

## 1) Backend URLs and Routing

Base API prefix:
- /api/v1

Auth routes:
- /api/v1/auth/...

Chat routes:
- /api/v1/conversations
- /api/v1/messages
- /api/v1/messages/:conversationId
- /api/v1/messages/seen

Socket server:
- Same host/port as backend server
- Example: http://localhost:5000

## 2) Very Important Chat Rule (Enforced in Backend)

Allowed chat pair only:
- SELLER <-> CLIENT
- JOB_SEEKER <-> RECRUITER

Not allowed:
- SELLER <-> RECRUITER
- CLIENT <-> JOB_SEEKER
- SELLER <-> JOB_SEEKER
- CLIENT <-> RECRUITER
- Same account messaging with self

If frontend tries invalid pair, backend returns 403.

## 3) Auth Requirements for Protected APIs

Protected APIs require cookies:
- accessToken cookie
- better-auth.session_token cookie

So in frontend HTTP client, always send credentials.

Axios example:

    import axios from "axios";

    export const api = axios.create({
      baseURL: "http://localhost:5000/api/v1",
      withCredentials: true,
    });

Fetch example:

    await fetch("http://localhost:5000/api/v1/conversations", {
      method: "GET",
      credentials: "include",
    });

## 4) Login Flow (Frontend)

Endpoint:
- POST /api/v1/auth/login

Body example:

    {
      "email": "user@example.com",
      "password": "123456"
    }

Expected behavior:
- Backend sets cookies for protected REST calls.
- Response body also includes accessToken.

You should keep accessToken in memory (React state/store) for Socket auth.

## 5) Token Refresh Flow

Endpoint:
- POST /api/v1/auth/refresh-token

Notes:
- Uses cookies
- Returns new accessToken in response body
- Also updates cookies

Frontend strategy:
1. On 401 from REST call, call refresh-token once.
2. Retry original request.
3. Update in-memory socket token from refresh response.
4. Reconnect socket with new token.

## 6) Chat REST API Integration

All routes below require authenticated user (cookies).

### 6.1 Create or get conversation

POST /api/v1/conversations

Body:

    {
      "participantId": "target_user_id"
    }

Success:
- Returns existing conversation if already present
- Else creates a new conversation

### 6.2 Conversation list (inbox)

GET /api/v1/conversations?page=1&limit=20

Returns:
- conversations array
- meta: page, limit, total, totalPages
- each conversation contains:
  - seller, recruiter
  - lastMessage
  - unreadCount

### 6.3 Message list by conversation

GET /api/v1/messages/:conversationId?page=1&limit=20

Returns:
- messages array (ordered by createdAt desc)
- meta pagination

### 6.4 Send message via REST

POST /api/v1/messages

Body:

    {
      "conversationId": "conv_id",
      "receiverId": "other_user_id",
      "text": "Hello"
    }

### 6.5 Mark conversation seen via REST

POST /api/v1/messages/seen

Body:

    {
      "conversationId": "conv_id"
    }

Returns:
- updatedCount

## 7) Socket.IO Integration (Realtime)

Install client:

    pnpm add socket.io-client

Create socket instance:

    import { io } from "socket.io-client";

    export function connectChatSocket(accessToken) {
      return io("http://localhost:5000", {
        transports: ["websocket"],
        withCredentials: true,
        auth: {
          token: accessToken,
        },
      });
    }

Backend accepts token from:
- handshake auth token
- or Authorization header Bearer token

Recommended:
- use auth token as shown above

## 8) Socket Events (Client <-> Server)

### 8.1 Events emitted by frontend

join_conversation payload:

    {
      "conversationId": "conv_id"
    }

send_message payload:

    {
      "conversationId": "conv_id",
      "receiverId": "other_user_id",
      "text": "Hi"
    }

typing payload:

    {
      "conversationId": "conv_id",
      "receiverId": "other_user_id"
    }

stop_typing payload:

    {
      "conversationId": "conv_id",
      "receiverId": "other_user_id"
    }

mark_as_seen payload:

    {
      "conversationId": "conv_id"
    }

### 8.2 Events received from backend

conversation_joined:

    {
      "conversationId": "conv_id"
    }

receive_message:
- full message object

typing:

    {
      "conversationId": "conv_id",
      "senderId": "user_id"
    }

stop_typing:

    {
      "conversationId": "conv_id",
      "senderId": "user_id"
    }

messages_seen:

    {
      "conversationId": "conv_id",
      "seenBy": "user_id",
      "updatedCount": 3
    }

user_status:

    {
      "userId": "user_id",
      "status": "ONLINE" | "OFFLINE"
    }

online_users:

    {
      "userIds": ["u1", "u2"]
    }

chat_error:

    {
      "event": "send_message",
      "message": "..."
    }

## 9) Recommended Frontend Architecture

Use this flow:
1. Login and store accessToken in memory.
2. Load conversations through REST.
3. Connect socket after login.
4. On chat room open, emit join_conversation.
5. Send messages with socket send_message for instant UX.
6. Optionally fallback to REST send endpoint if socket disconnected.
7. On room focus/open, emit mark_as_seen.
8. Also call REST messages/seen on navigation change to guarantee consistency.

## 10) React Example (Minimal)

    import { useEffect, useRef } from "react";
    import { io } from "socket.io-client";

    export function useChatSocket(accessToken) {
      const socketRef = useRef(null);

      useEffect(() => {
        if (!accessToken) return;

        const socket = io("http://localhost:5000", {
          transports: ["websocket"],
          withCredentials: true,
          auth: { token: accessToken },
        });

        socket.on("connect", () => {
          console.log("socket connected", socket.id);
        });

        socket.on("receive_message", (message) => {
          console.log("new message", message);
        });

        socket.on("typing", (data) => {
          console.log("typing", data);
        });

        socket.on("stop_typing", (data) => {
          console.log("stop typing", data);
        });

        socket.on("messages_seen", (data) => {
          console.log("seen", data);
        });

        socket.on("chat_error", (err) => {
          console.error("chat error", err);
        });

        socketRef.current = socket;

        return () => {
          socket.disconnect();
        };
      }, [accessToken]);

      return socketRef;
    }

## 11) HTTP + Socket Sync Strategy (Best Practice)

On conversation screen open:
1. GET messages via REST (source of truth)
2. Emit join_conversation
3. Start listening for receive_message

When user sends:
1. Optimistic add message in UI (temporary id)
2. Emit send_message
3. Replace temporary with server message on receive_message
4. If chat_error received, mark failed and show retry button

When user reads:
1. Emit mark_as_seen
2. Optionally call POST /messages/seen for hard consistency

## 12) Pagination Pattern

Conversations:
- GET /conversations?page=N&limit=20

Messages:
- GET /messages/:conversationId?page=N&limit=20

Backend returns newest-first for messages.
If your UI is oldest-to-newest, reverse array in frontend before render.

## 13) CORS and Environment Checklist

Frontend origin must match backend environment settings:
- FRONTEND_URL
- BETTER_AUTH_URL

If mismatch happens:
- cookies may not be set/sent
- protected routes return 401
- socket connection may fail

## 14) Common Errors and Fix

401 Unauthorized on REST:
- Confirm withCredentials true
- Confirm cookies exist in browser
- Call refresh-token and retry

Socket Unauthorized:
- Ensure accessToken passed in auth.token
- Reconnect socket after token refresh

403 Invalid chat pair:
- Enforce pair in frontend before create/send
- Show clear message to user

No realtime receive:
- Ensure join_conversation emitted after opening chat
- Ensure both users are in same conversation id

## 15) Frontend Validation You Should Add

Before enabling message input:
- Validate selected chat pair is allowed
- Validate conversationId exists
- Validate receiverId is the opposite participant
- Validate text length > 0 and <= 5000

## 16) Production Recommendations

- Keep accessToken in memory (not localStorage if possible).
- Add axios interceptor for 401 + refresh flow.
- Debounce typing event (e.g. 300ms).
- Auto stop_typing after inactivity timeout.
- Use exponential backoff on socket reconnect.
- Keep unread counters synced with messages_seen and REST refresh.

## 17) Quick End-to-End Test Script

1. Login as SELLER in browser A.
2. Login as CLIENT in browser B.
3. Create conversation from either side.
4. Connect socket in both.
5. Open chat and emit join_conversation.
6. Send message A -> B and verify receive_message.
7. Emit typing/stop_typing and verify.
8. Emit mark_as_seen and verify unread decreases.
9. Try invalid pair (e.g. SELLER -> RECRUITER) and verify 403.

---

If you want, I can also provide a ready-to-copy frontend service layer with:
- api client
- auth token manager
- chat REST wrapper
- socket manager class
- React hooks for inbox and room state
