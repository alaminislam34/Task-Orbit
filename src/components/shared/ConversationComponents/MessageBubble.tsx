import { AlertCircle, Check, CheckCheck, Clock3 } from "lucide-react";

import { cn } from "@/lib/utils";

const MessageBubble = ({
  text,
  time,
  isOwn,
  sending = false,
  sent = false,
  seen = false,
  failed = false,
  onRetry,
}: {
  text: string;
  time: string;
  isOwn: boolean;
  sending?: boolean;
  sent?: boolean;
  seen?: boolean;
  failed?: boolean;
  onRetry?: () => void;
}) => (
  <div className={cn("mb-2 flex", isOwn ? "justify-end" : "justify-start")}>
    <div className={cn("max-w-[82%] md:max-w-[70%]")}>
      <div
        className={cn(
          "flex",
          isOwn ? "justify-end" : "justify-start flex-row-reverse",
        )}
      >
        <div
          className={cn(
            "flex items-center gap-2 text-[9px]",
            isOwn ? "justify-end" : "text-muted-foreground",
          )}
        >
          <span>{time}</span>
          {isOwn ? (
            failed ? (
              <AlertCircle className="size-3.5" />
            ) : sending ? (
              <Clock3 className="size-3.5" />
            ) : seen ? (
              <CheckCheck className="size-3.5" />
            ) : sent ? (
              <Check className="size-3.5" />
            ) : null
          ) : null}
        </div>
        {failed ? (
          <button
            type="button"
            onClick={onRetry}
            className={cn(
              "mt-1 text-[9px] font-medium underline underline-offset-2",
              isOwn ? "text-primary-foreground" : "text-primary",
            )}
          >
            Failed. Retry
          </button>
        ) : null}
        <p
          className={cn(
            "text-sm leading-relaxed rounded-lg px-2.5 py-2 shadow-xs ",
            isOwn
              ? "rounded-br-md bg-primary text-primary-foreground ml-2"
              : "rounded-bl-md border border-border/70 bg-card text-card-foreground mr-2",
          )}
        >
          {text}
        </p>
      </div>
    </div>
  </div>
);

export default MessageBubble;
