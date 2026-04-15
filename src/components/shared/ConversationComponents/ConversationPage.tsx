"use client";

import { ChevronLeft, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import ConversationItem from "./ConversationItem";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { useConversationRuntime } from "./useConversationRuntime";
import TypingIndicator from "./Typing";
import { useEffect, useRef } from "react";

const ConversationListSkeleton = () => (
  <div className="space-y-2 p-3">
    {Array.from({ length: 7 }).map((_, index) => (
      <div key={index} className="flex items-center gap-3 rounded-lg px-2 py-2">
        <Skeleton className="size-11 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between gap-3">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3 w-10" />
          </div>
          <Skeleton className="h-3 w-36" />
        </div>
      </div>
    ))}
  </div>
);

const MessagesSkeleton = () => (
  <>
    {Array.from({ length: 6 }).map((_, index) => {
      const isOwn = index % 2 === 1;

      return (
        <div
          key={index}
          className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[78%] space-y-2 ${isOwn ? "items-end" : "items-start"}`}
          >
            <Skeleton className="h-10 w-52 rounded-2xl" />
            <Skeleton className={`h-2.5 ${isOwn ? "ml-auto" : ""} w-14`} />
          </div>
        </div>
      );
    })}
  </>
);

const ChatHeaderSkeleton = () => (
  <div className="flex items-center gap-3 px-4 py-3 md:px-5">
    <Skeleton className="size-10 rounded-full" />
    <div className="space-y-2">
      <Skeleton className="h-3.5 w-28" />
      <Skeleton className="h-3 w-20" />
    </div>
  </div>
);

const ConversationPage = () => {
  const {
    text,
    query,
    isChatOpen,
    setIsChatOpen,
    setQuery,
    sidebarUsers,
    activeSidebarUser,
    uiMessages,
    isPeerTyping,
    isUsersLoading,
    isMessagesLoading,
    handleSelectUser,
    handleTextChange,
    handleInputFocus,
    handleInputBlur,
    handleSend,
  } = useConversationRuntime();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [uiMessages, isPeerTyping]);
  return (
    <div className="flex h-full overflow-hidden rounded-xl border border-border bg-background shadow-xs">
      <aside
        className={`
        ${isChatOpen ? "hidden" : "flex"} 
        lg:flex w-full lg:w-88 shrink-0 border-r border-border/80 flex-col
      `}
      >
        <div className="border-b border-border/80 px-4 py-4 md:px-5">
          <h1 className="mb-4 text-lg font-semibold text-foreground">Chats</h1>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search chats"
              className="h-10 rounded-full border-border/80 bg-muted/30 pl-9"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isUsersLoading ? (
            <ConversationListSkeleton />
          ) : (
            sidebarUsers.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                name={conversation.name}
                lastMsg={conversation.lastMsg}
                time={conversation.time}
                avatarUrl={conversation.avatarUrl}
                online={conversation.online}
                unreadCount={conversation.unreadCount}
                active={conversation.active}
                onClick={() => {
                  void handleSelectUser({
                    id: conversation.id,
                    name: conversation.name,
                    image: conversation.avatarUrl,
                  });
                }}
              />
            ))
          )}
        </div>
      </aside>

      <main
        className={`
        ${isChatOpen ? "flex" : "hidden"} 
        lg:flex flex-1 min-w-0 flex-col bg-background
      `}
      >
        <div className="flex items-center border-b border-border/80 bg-background lg:hidden">
          <Button
            onClick={() => setIsChatOpen(false)}
            variant="ghost"
            size="icon"
            className="mx-2"
            aria-label="Back to conversations"
          >
            <ChevronLeft className="size-5" />
          </Button>
          <div className="flex-1">
            {isMessagesLoading && !activeSidebarUser ? (
              <ChatHeaderSkeleton />
            ) : activeSidebarUser ? (
              <ChatHeader
                name={activeSidebarUser.name}
                avatarUrl={activeSidebarUser.avatarUrl}
                status={isPeerTyping ? "Typing..." : activeSidebarUser.status}
              />
            ) : null}
          </div>
        </div>

        <div className="hidden lg:block">
          {isMessagesLoading && !activeSidebarUser ? (
            <ChatHeaderSkeleton />
          ) : activeSidebarUser ? (
            <ChatHeader
              name={activeSidebarUser.name}
              avatarUrl={activeSidebarUser.avatarUrl}
              status={isPeerTyping ? "Typing..." : activeSidebarUser.status}
            />
          ) : null}
        </div>

        <section className="flex-1 space-y-1 overflow-y-auto bg-muted/30 px-4 py-5 md:px-6">
          {isMessagesLoading ? (
            <MessagesSkeleton />
          ) : (
            uiMessages.map((message) => (
              <MessageBubble
                key={message.id}
                text={message.text}
                time={message.time}
                isOwn={message.isOwn}
                sending={message.sending}
                sent={message.sent}
                seen={message.seen}
                failed={message.failed}
                onRetry={message.onRetry}
              />
            ))
          )}

          {isPeerTyping ? <TypingIndicator /> : null}
          <div ref={messagesEndRef} />
        </section>

        <div className="safe-area-bottom border-t border-border/80 bg-background">
          <MessageInput
            value={text}
            onChange={handleTextChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onSend={() => void handleSend()}
          />
        </div>
      </main>
    </div>
  );
};

export default ConversationPage;
