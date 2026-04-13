import { Info, Phone, Video } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ChatHeaderProps = {
  name: string;
  avatarUrl?: string;
  status?: string;
};

const ChatHeader = ({
  name,
  avatarUrl,
  status = "Active now",
}: ChatHeaderProps) => (
  <header className="flex items-center justify-between border-b border-border bg-background px-4 py-3 md:px-6">
    <div className="flex min-w-0 items-center gap-3">
      <Avatar size="lg" className="ring-1 ring-border/70">
        <AvatarImage src={avatarUrl} alt={name} />
        <AvatarFallback className="bg-primary/10 font-semibold text-primary">
          {name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <h2 className="truncate text-sm font-semibold text-foreground md:text-base">
          {name}
        </h2>
        <Badge variant="secondary" className="mt-1 h-5 rounded-full px-2 text-[11px]">
          {status}
        </Badge>
      </div>
    </div>

    <div className="flex items-center gap-1">
      <Button size="icon-sm" variant="ghost" aria-label="Call user">
        <Phone className="size-4" />
      </Button>
      <Button size="icon-sm" variant="ghost" aria-label="Start video call">
        <Video className="size-4" />
      </Button>
      <Button size="icon-sm" variant="ghost" aria-label="Conversation info">
        <Info className="size-4" />
      </Button>
    </div>
  </header>
);

export default ChatHeader;
