import { io, Socket } from "socket.io-client";
import {
  ChatErrorPayload,
  ChatMessage,
  MessagesSeenPayload,
  OnlineUsersPayload,
  TypingPayload,
  UserStatusPayload,
} from "@/types/chat.types";
import { INotification, UnreadCountPayload } from "@/types/notification.types";

type ChatSocketHandlers = {
  onMessage?: (message: ChatMessage) => void;
  onTyping?: (payload: TypingPayload & { senderId: string }) => void;
  onStopTyping?: (payload: TypingPayload & { senderId: string }) => void;
  onMessagesSeen?: (payload: MessagesSeenPayload) => void;
  onUserStatus?: (payload: UserStatusPayload) => void;
  onOnlineUsers?: (payload: OnlineUsersPayload) => void;
  onChatError?: (payload: ChatErrorPayload) => void;
};

type NotificationSocketHandlers = {
  onNotificationNew?: (notification: INotification) => void;
  onNotificationRead?: (payload: {
    notificationId: string;
    updatedCount: number;
  }) => void;
  onUnreadCountUpdate?: (payload: UnreadCountPayload) => void;
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
  private nextBindingId = 1;
  private chatBindings = new Map<number, ChatSocketHandlers>();
  private notificationBindings = new Map<number, NotificationSocketHandlers>();

  private registerSocketLifecycle(socket: Socket) {
    socket.off("connect");
    socket.off("disconnect");

    socket.on("connect", () => {
      this.rebindAllHandlers();
    });

    socket.on("disconnect", () => {
      // Listener re-attachment is handled by the connect event after auto-reconnect.
    });
  }

  private attachChatHandlers(socket: Socket, handlers: ChatSocketHandlers) {
    if (handlers.onMessage) {
      socket.off("receive_message", handlers.onMessage);
      socket.on("receive_message", handlers.onMessage);
    }
    if (handlers.onTyping) {
      socket.off("typing", handlers.onTyping);
      socket.on("typing", handlers.onTyping);
    }
    if (handlers.onStopTyping) {
      socket.off("stop_typing", handlers.onStopTyping);
      socket.on("stop_typing", handlers.onStopTyping);
    }
    if (handlers.onMessagesSeen) {
      socket.off("message_seen", handlers.onMessagesSeen);
      socket.on("message_seen", handlers.onMessagesSeen);
    }
    if (handlers.onUserStatus) {
      socket.off("user_status", handlers.onUserStatus);
      socket.on("user_status", handlers.onUserStatus);
    }
    if (handlers.onOnlineUsers) {
      socket.off("online_users", handlers.onOnlineUsers);
      socket.on("online_users", handlers.onOnlineUsers);
    }
    if (handlers.onChatError) {
      socket.off("chat_error", handlers.onChatError);
      socket.on("chat_error", handlers.onChatError);
    }
  }

  private detachChatHandlers(socket: Socket, handlers: ChatSocketHandlers) {
    if (handlers.onMessage) {
      socket.off("receive_message", handlers.onMessage);
    }
    if (handlers.onTyping) {
      socket.off("typing", handlers.onTyping);
    }
    if (handlers.onStopTyping) {
      socket.off("stop_typing", handlers.onStopTyping);
    }
    if (handlers.onMessagesSeen) {
      socket.off("message_seen", handlers.onMessagesSeen);
    }
    if (handlers.onUserStatus) {
      socket.off("user_status", handlers.onUserStatus);
    }
    if (handlers.onOnlineUsers) {
      socket.off("online_users", handlers.onOnlineUsers);
    }
    if (handlers.onChatError) {
      socket.off("chat_error", handlers.onChatError);
    }
  }

  private attachNotificationHandlers(
    socket: Socket,
    handlers: NotificationSocketHandlers,
  ) {
    if (handlers.onNotificationNew) {
      socket.off("notification:new", handlers.onNotificationNew);
      socket.on("notification:new", handlers.onNotificationNew);
    }
    if (handlers.onNotificationRead) {
      socket.off("notification:read", handlers.onNotificationRead);
      socket.on("notification:read", handlers.onNotificationRead);
    }
    if (handlers.onUnreadCountUpdate) {
      socket.off("notification:unread-count", handlers.onUnreadCountUpdate);
      socket.on("notification:unread-count", handlers.onUnreadCountUpdate);
    }
  }

  private detachNotificationHandlers(
    socket: Socket,
    handlers: NotificationSocketHandlers,
  ) {
    if (handlers.onNotificationNew) {
      socket.off("notification:new", handlers.onNotificationNew);
    }
    if (handlers.onNotificationRead) {
      socket.off("notification:read", handlers.onNotificationRead);
    }
    if (handlers.onUnreadCountUpdate) {
      socket.off("notification:unread-count", handlers.onUnreadCountUpdate);
    }
  }

  private rebindAllHandlers() {
    if (!this.socket) {
      return;
    }

    this.chatBindings.forEach((handlers) => {
      this.attachChatHandlers(this.socket as Socket, handlers);
    });

    this.notificationBindings.forEach((handlers) => {
      this.attachNotificationHandlers(this.socket as Socket, handlers);
    });
  }

  private createSocket(accessToken: string) {
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

    this.registerSocketLifecycle(this.socket);
    this.rebindAllHandlers();
  }

  private destroySocket() {
    if (!this.socket) {
      return;
    }

    this.socket.removeAllListeners();
    this.socket.disconnect();
    this.socket = null;
  }

  connect(accessToken: string) {
    const shouldRecreateSocket =
      !this.socket || this.accessToken !== accessToken;

    this.accessToken = accessToken;

    if (shouldRecreateSocket) {
      this.destroySocket();
      this.createSocket(accessToken);
      return this.socket;
    }

    if (this.socket && !this.socket.connected) {
      this.socket.connect();
    }

    return this.socket;
  }

  updateToken(accessToken: string) {
    this.connect(accessToken);
  }

  getSocket() {
    return this.socket;
  }

  disconnect() {
    this.destroySocket();
  }

  bindHandlers(handlers: ChatSocketHandlers) {
    const bindingId = this.nextBindingId++;
    this.chatBindings.set(bindingId, handlers);

    if (this.socket) {
      this.attachChatHandlers(this.socket, handlers);
    }

    return () => {
      this.chatBindings.delete(bindingId);

      if (this.socket) {
        this.detachChatHandlers(this.socket, handlers);
      }
    };
  }

  /**
   * Bind notification event handlers
   * Separate method to keep chat and notification concerns isolated
   */
  bindNotificationHandlers(handlers: NotificationSocketHandlers) {
    const bindingId = this.nextBindingId++;
    this.notificationBindings.set(bindingId, handlers);

    if (this.socket) {
      this.attachNotificationHandlers(this.socket, handlers);
    }

    return () => {
      this.notificationBindings.delete(bindingId);

      if (this.socket) {
        this.detachNotificationHandlers(this.socket, handlers);
      }
    };
  }
}

export const chatSocketManager = new ChatSocketManager();
