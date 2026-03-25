"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

type AccordionContextValue = {
  value: string | null;
  setValue: (next: string) => void;
  collapsible: boolean;
};

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

type AccordionItemContextValue = {
  itemValue: string;
  isOpen: boolean;
};

const AccordionItemContext = React.createContext<AccordionItemContextValue | null>(
  null,
);

function Accordion({
  className,
  children,
  defaultValue,
  value,
  onValueChange,
  collapsible = true,
}: React.ComponentProps<"div"> & {
  type?: "single";
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  collapsible?: boolean;
}) {
  const [internalValue, setInternalValue] = React.useState<string | null>(
    defaultValue ?? null,
  );

  const resolvedValue = value ?? internalValue;

  const setValue = React.useCallback(
    (next: string) => {
      const shouldClose = collapsible && resolvedValue === next;
      const nextValue = shouldClose ? "" : next;
      if (value === undefined) {
        setInternalValue(nextValue || null);
      }
      onValueChange?.(nextValue);
    },
    [collapsible, onValueChange, resolvedValue, value],
  );

  return (
    <AccordionContext.Provider
      value={{ value: resolvedValue ?? null, setValue, collapsible }}
    >
      <div data-slot="accordion" className={cn("w-full", className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

function AccordionItem({
  className,
  children,
  value,
  ...props
}: React.ComponentProps<"div"> & {
  value: string;
}) {
  const ctx = React.useContext(AccordionContext);
  if (!ctx) {
    throw new Error("AccordionItem must be used inside Accordion");
  }

  const isOpen = ctx.value === value;

  return (
    <AccordionItemContext.Provider value={{ itemValue: value, isOpen }}>
      <div
        data-slot="accordion-item"
        className={cn("border-b border-border", className)}
        {...props}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<"button">) {
  const acc = React.useContext(AccordionContext);
  const item = React.useContext(AccordionItemContext);

  if (!acc || !item) {
    throw new Error("AccordionTrigger must be used inside AccordionItem");
  }

  return (
    <button
      type="button"
      data-slot="accordion-trigger"
      data-state={item.isOpen ? "open" : "closed"}
      onClick={() => acc.setValue(item.itemValue)}
      className={cn(
        "flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-semibold transition-colors hover:text-emerald-600",
        className,
      )}
      {...props}
    >
      <span>{children}</span>
      <ChevronDown
        className={cn(
          "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
          item.isOpen && "rotate-180",
        )}
      />
    </button>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const item = React.useContext(AccordionItemContext);
  if (!item) {
    throw new Error("AccordionContent must be used inside AccordionItem");
  }

  return (
    <div
      data-slot="accordion-content"
      data-state={item.isOpen ? "open" : "closed"}
      className={cn(
        "grid transition-all duration-200",
        item.isOpen ? "grid-rows-[1fr] pb-4" : "grid-rows-[0fr]",
      )}
      {...props}
    >
      <div className={cn("overflow-hidden text-sm text-muted-foreground", className)}>
        {children}
      </div>
    </div>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };