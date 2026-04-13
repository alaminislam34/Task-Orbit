import { io, Socket } from "socket.io-client";
import {
  ChatErrorPayload,
  ChatMessage,
  MessagesSeenPayload,
  OnlineUsersPayload,
  TypingPayload,
  UserStatusPayload,
} from "@/types/chat.types";

type ChatSocketHandlers = {
  onMessage?: (message: ChatMessage) => void;
  onTyping?: (payload: TypingPayload & { senderId: string }) => void;
  onStopTyping?: (payload: TypingPayload & { senderId: string }) => void;
  onMessagesSeen?: (payload: MessagesSeenPayload) => void;
  onUserStatus?: (payload: UserStatusPayload) => void;
  onOnlineUsers?: (payload: OnlineUsersPayload) => void;
  onChatError?: (payload: ChatErrorPayload) => void;
};

const resolveSocketBaseUrl = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    return "http://localhost:5000";
  }

  return apiBaseUrl.replace(/\/api\/v1\/?$/, "").replace(/\/+$/, "");
};

class ChatSocketManager {
  private socket: Socket | null = null;
  private accessToken: string | null = null;

  connect(accessToken: string) {
    this.accessToken = accessToken;

    if (this.socket?.connected) {
      return this.socket;
    }

    if (this.socket) {
      this.socket.disconnect();
    }

    this.socket = io(resolveSocketBaseUrl(), {
      transports: ["websocket"],
      withCredentials: true,
      auth: {
        token: accessToken,
      },
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 500,
      reconnectionDelayMax: 4000,
    });

    return this.socket;
  }

  updateToken(accessToken: string) {
    this.accessToken = accessToken;

    if (!this.socket) {
      return;
    }

    this.socket.auth = { token: accessToken };

    if (this.socket.connected) {
      this.socket.disconnect();
      this.socket.connect();
    }
  }

  getSocket() {
    return this.socket;
  }

  disconnect() {
    if (!this.socket) {
      return;
    }

    this.socket.disconnect();
    this.socket = null;
  }

  bindHandlers(handlers: ChatSocketHandlers) {
    if (!this.socket) {
      return () => undefined;
    }

    if (handlers.onMessage) {
      this.socket.on("receive_message", handlers.onMessage);
    }
    if (handlers.onTyping) {
      this.socket.on("typing", handlers.onTyping);
    }
    if (handlers.onStopTyping) {
      this.socket.on("stop_typing", handlers.onStopTyping);
    }
    if (handlers.onMessagesSeen) {
      this.socket.on("messages_seen", handlers.onMessagesSeen);
    }
    if (handlers.onUserStatus) {
      this.socket.on("user_status", handlers.onUserStatus);
    }
    if (handlers.onOnlineUsers) {
      this.socket.on("online_users", handlers.onOnlineUsers);
    }
    if (handlers.onChatError) {
      this.socket.on("chat_error", handlers.onChatError);
    }

    return () => {
      if (!this.socket) {
        return;
      }

      if (handlers.onMessage) {
        this.socket.off("receive_message", handlers.onMessage);
      }
      if (handlers.onTyping) {
        this.socket.off("typing", handlers.onTyping);
      }
      if (handlers.onStopTyping) {
        this.socket.off("stop_typing", handlers.onStopTyping);
      }
      if (handlers.onMessagesSeen) {
        this.socket.off("messages_seen", handlers.onMessagesSeen);
      }
      if (handlers.onUserStatus) {
        this.socket.off("user_status", handlers.onUserStatus);
      }
      if (handlers.onOnlineUsers) {
        this.socket.off("online_users", handlers.onOnlineUsers);
      }
      if (handlers.onChatError) {
        this.socket.off("chat_error", handlers.onChatError);
      }
    };
  }
}

export const chatSocketManager = new ChatSocketManager();
