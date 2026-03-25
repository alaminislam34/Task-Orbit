"use client";

import React from "react";
import Image from "next/image";
import { Check, SendHorizontal } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

type ContactSellerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  seller: any;
};

const QUICK_TEMPLATES = [
  "Custom Quote",
  "Timeline Check",
  "Project Scope",
  "Revisions Policy",
];

function SuccessState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0.3, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", bounce: 0.5, duration: 0.55 }}
        className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white"
      >
        <Check className="h-8 w-8" />
      </motion.div>
      <p className="text-lg font-black text-foreground">Message Sent</p>
      <p className="mt-1 text-sm text-muted-foreground">
        The seller will typically reply within a few hours.
      </p>
    </motion.div>
  );
}

function Composer({ seller }: { seller: any }) {
  const [message, setMessage] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);
  const [isSent, setIsSent] = React.useState(false);

  const onTemplateClick = (template: string) => {
    setMessage((prev) => {
      const prefix = prev.trim().length ? `${prev}\n\n` : "";
      return `${prefix}${template}: `;
    });
  };

  const onSend = async () => {
    if (!message.trim() || isSending) return;
    setIsSending(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setIsSending(false);
    setIsSent(true);
  };

  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-10 -mx-1 flex items-center gap-3 border-b border-border bg-background/95 px-1 pb-3 pt-1 supports-backdrop-filter:backdrop-blur-xl">
        <div className="relative">
          <div className="h-10 w-10 overflow-hidden rounded-full border border-emerald-500/20 bg-muted">
            {seller.avatar ? (
              <Image src={seller.avatar} alt={seller.name} width={40} height={40} />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs font-black text-emerald-700">
                {seller.name?.substring(0, 2).toUpperCase() || "AA"}
              </div>
            )}
          </div>
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full border border-background bg-emerald-500" />
          </span>
        </div>

        <div>
          <p className="text-sm font-black text-foreground">{seller.name}</p>
          <p className="text-xs font-medium text-emerald-600">Online</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isSent ? (
          <SuccessState key="sent" />
        ) : (
          <motion.div key="composer" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a message for your project requirements..."
              className="min-h-44 resize-none rounded-xl border-border bg-muted/50 px-4 py-3 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/25"
            />

            <div className="mt-3 flex flex-wrap gap-2">
              {QUICK_TEMPLATES.map((template) => (
                <button
                  key={template}
                  type="button"
                  onClick={() => onTemplateClick(template)}
                  className={cn(
                    "rounded-full border border-border bg-muted/30 px-3 py-1.5 text-xs font-semibold text-foreground/80 transition-colors",
                    "hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-700",
                  )}
                >
                  {template}
                </button>
              ))}
            </div>

            <Button
              onClick={onSend}
              disabled={!message.trim() || isSending}
              className="mt-4 h-11 w-full rounded-xl bg-emerald-500 font-black text-white hover:bg-emerald-600"
            >
              {isSending ? "Sending..." : "Send Message"}
              <SendHorizontal className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ContactSellerDialog({
  open,
  onOpenChange,
  seller,
}: ContactSellerDialogProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh] rounded-t-3xl border-border bg-background/95 pb-5 supports-backdrop-filter:backdrop-blur-xl">
          <DrawerHeader className="pb-2 text-left">
            <div className="flex items-center justify-between gap-3">
              <DrawerTitle className="text-xl font-black">Contact Seller</DrawerTitle>
              <Badge className="border-none bg-emerald-500/10 text-emerald-600">
                Quick Chat
              </Badge>
            </div>
          </DrawerHeader>
          <div className="overflow-y-auto px-4">
            <Composer seller={seller} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="w-full max-w-125 rounded-2xl border-border bg-background/95 p-5 supports-backdrop-filter:backdrop-blur-xl"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-black">Contact Seller</DialogTitle>
        </DialogHeader>
        <Composer seller={seller} />
      </DialogContent>
    </Dialog>
  );
}