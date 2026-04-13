import { Paperclip, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MessageInput = ({
  value,
  onChange,
  onSend,
  onFocus,
  onBlur,
}: {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}) => (
  <div className="bg-background px-4 py-3 md:px-6">
    <form
      className="flex items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        onSend();
      }}
    >
      <Button type="button" variant="ghost" size="icon" aria-label="Attach file">
        <Paperclip className="size-4" />
      </Button>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder="Type your message"
        className="h-10 flex-1 rounded-full border-border/80 bg-muted/40 px-4"
      />
      <Button
        type="submit"
        disabled={!value.trim()}
        size="icon"
        aria-label="Send message"
        className="rounded-full"
      >
        <Send className="size-4" />
      </Button>
    </form>
  </div>
);

export default MessageInput;
