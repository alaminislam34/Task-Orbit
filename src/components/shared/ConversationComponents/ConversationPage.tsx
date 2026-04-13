"use client";

import { ChevronLeft, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ConversationItem from "./ConversationItem";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { useConversationRuntime } from "./useConversationRuntime";

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
    handleSend,
  } = useConversationRuntime();

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
            <p className="px-4 py-3 text-xs text-muted-foreground">Loading users...</p>
          ) : null}

          {sidebarUsers.map((conversation) => (
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
          ))}
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
            {activeSidebarUser ? (
              <ChatHeader
                name={activeSidebarUser.name}
                avatarUrl={activeSidebarUser.avatarUrl}
                status={isPeerTyping ? "Typing..." : activeSidebarUser.status}
              />
            ) : null}
          </div>
        </div>

        <div className="hidden lg:block">
          {activeSidebarUser ? (
            <ChatHeader
              name={activeSidebarUser.name}
              avatarUrl={activeSidebarUser.avatarUrl}
              status={isPeerTyping ? "Typing..." : activeSidebarUser.status}
            />
          ) : null}
        </div>

        <section className="flex-1 space-y-1 overflow-y-auto bg-muted/30 px-4 py-5 md:px-6">
          {isMessagesLoading ? (
            <p className="px-1 text-xs text-muted-foreground">Loading messages...</p>
          ) : null}

          {uiMessages.map((message) => (
            <MessageBubble
              key={message.id}
              text={message.text}
              time={message.time}
              isOwn={message.isOwn}
              failed={message.failed}
              onRetry={message.onRetry}
            />
          ))}

          {isPeerTyping ? (
            <p className="px-1 text-xs text-muted-foreground">Typing...</p>
          ) : null}
        </section>

        <div className="safe-area-bottom border-t border-border/80 bg-background">
          <MessageInput value={text} onChange={handleTextChange} onSend={() => void handleSend()} />
        </div>
      </main>
    </div>
  );
};

export default ConversationPage;
