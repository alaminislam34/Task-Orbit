import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type ConversationItemProps = {
  name: string;
  lastMsg: string;
  time: string;
  active?: boolean;
  online?: boolean;
  unreadCount?: number;
  avatarUrl?: string;
  onClick?: () => void;
};

const ConversationItem = ({
  name,
  lastMsg,
  time,
  active = false,
  online = false,
  unreadCount = 0,
  avatarUrl,
  onClick,
}: ConversationItemProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "flex w-full items-center gap-3 border-b border-border/60 px-4 py-3 text-left transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      active ? "bg-primary/10" : "hover:bg-muted/60",
    )}
  >
    <Avatar size="lg" className="ring-1 ring-border/70">
      <AvatarImage src={avatarUrl} alt={name} />
      <AvatarFallback className="bg-primary/10 font-semibold text-primary">
        {name.charAt(0).toUpperCase()}
      </AvatarFallback>
      {online ? <AvatarBadge className="bg-emerald-500" /> : null}
    </Avatar>

    <div className="min-w-0 flex-1">
      <div className="flex items-start justify-between gap-3">
        <h3
          className={cn(
            "truncate text-sm font-semibold",
            active ? "text-primary" : "text-foreground",
          )}
        >
          {name}
        </h3>
        <span className="shrink-0 text-xs text-muted-foreground">{time}</span>
      </div>

      <div className="mt-1 flex items-center justify-between gap-3">
        <p className="truncate text-xs text-muted-foreground">{lastMsg}</p>
        {unreadCount > 0 ? (
          <Badge className="h-5 min-w-5 rounded-full px-1.5 text-[10px]">
            {unreadCount}
          </Badge>
        ) : null}
      </div>
    </div>
  </button>
);
export default ConversationItem;
