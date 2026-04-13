import { cn } from "@/lib/utils";

const MessageBubble = ({
  text,
  time,
  isOwn,
  failed = false,
  onRetry,
}: {
  text: string;
  time: string;
  isOwn: boolean;
  failed?: boolean;
  onRetry?: () => void;
}) => (
  <div className={cn("mb-4 flex", isOwn ? "justify-end" : "justify-start")}>
    <div
      className={cn(
        "max-w-[82%] rounded-2xl px-3 py-2.5 shadow-xs md:max-w-[70%]",
        isOwn
          ? "rounded-br-md bg-primary text-primary-foreground"
          : "rounded-bl-md border border-border/70 bg-card text-card-foreground",
      )}
    >
      <p className="text-sm leading-relaxed">{text}</p>
      <span className={cn("mt-1 block text-[11px]", isOwn ? "text-primary-foreground/75" : "text-muted-foreground")}>
        {time}
      </span>
      {failed ? (
        <button
          type="button"
          onClick={onRetry}
          className={cn(
            "mt-1 text-[11px] font-medium underline underline-offset-2",
            isOwn ? "text-primary-foreground" : "text-primary",
          )}
        >
          Failed. Retry
        </button>
      ) : null}
    </div>
  </div>
);

export default MessageBubble;
