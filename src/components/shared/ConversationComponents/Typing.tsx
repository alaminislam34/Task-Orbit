const TypingIndicator = () => (
  <div className="flex items-center gap-1 px-3 py-2 bg-muted/50 w-fit rounded-2xl rounded-tl-none ml-1">
    <div className="flex gap-1">
      <span className="h-1.5 w-1.5 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
      <span className="h-1.5 w-1.5 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
      <span className="h-1.5 w-1.5 bg-muted-foreground/60 rounded-full animate-bounce"></span>
    </div>
  </div>
);

export default TypingIndicator;