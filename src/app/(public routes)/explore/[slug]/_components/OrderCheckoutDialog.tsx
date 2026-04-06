"use client";

import Image from "next/image";
import { ShieldCheck, Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

type OrderCheckoutDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: any;
  currentPkg: any;
};

function BreakdownRows({ price }: { price: number }) {
  const serviceFee = Number((price * 0.05).toFixed(2));
  const total = Number((price + serviceFee).toFixed(2));

  return (
    <div className="rounded-lg border border-border bg-muted/20 p-4">
      <h4 className="mb-3 text-sm font-black uppercase tracking-wider text-foreground/80">
        Breakdown
      </h4>
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Price</span>
          <span className="font-semibold text-foreground">${price.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Service Fee (5%)</span>
          <span className="font-semibold text-foreground">
            ${serviceFee.toFixed(2)}
          </span>
        </div>
        <div className="my-2 border-t border-border" />
        <div className="flex items-center justify-between text-base font-black">
          <span>Total</span>
          <span className="text-emerald-600">${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

function DialogBody({ service, currentPkg }: { service: any; currentPkg: any }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/20 p-3">
        <div className="relative h-16 w-20 overflow-hidden rounded-md bg-muted">
          <Image
            src={service.media.thumbnail}
            alt={service.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-sm font-semibold text-foreground">
            {service.title}
          </p>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5 text-emerald-500" />
            {currentPkg.deliveryTime} Days Delivery
          </div>
        </div>
      </div>

      <BreakdownRows price={Number(currentPkg.price)} />

      <div className="space-y-2 pt-1">
        <Button className="h-12 w-full rounded-lg bg-emerald-500 text-base font-black text-white hover:bg-emerald-600">
          Proceed to Payment
        </Button>
        <p className="flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          Protected by TaskOrbit
        </p>
      </div>
    </div>
  );
}

export default function OrderCheckoutDialog({
  open,
  onOpenChange,
  service,
  currentPkg,
}: OrderCheckoutDialogProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh] rounded-t-3xl border-border bg-background/95 pb-5 supports-backdrop-filter:backdrop-blur-xl">
          <DrawerHeader className="space-y-3 text-left">
            <div className="flex items-center justify-between gap-3">
              <DrawerTitle className="text-xl font-black">Confirm Order</DrawerTitle>
              <Badge className="border-none bg-emerald-500/10 text-emerald-600">
                {currentPkg.name}
              </Badge>
            </div>
            <DrawerDescription>
              Review your package before continuing to payment.
            </DrawerDescription>
          </DrawerHeader>

          <div className="overflow-y-auto px-4">
            <DialogBody service={service} currentPkg={currentPkg} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="w-full max-w-125 rounded-lg border-border bg-background/95 p-6 supports-backdrop-filter:backdrop-blur-xl"
      >
        <DialogHeader className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <DialogTitle className="text-2xl font-black">Confirm Order</DialogTitle>
            <Badge className="border-none bg-emerald-500/10 text-emerald-600">
              {currentPkg.name}
            </Badge>
          </div>
          <DialogDescription>
            Review your package before continuing to payment.
          </DialogDescription>
        </DialogHeader>

        <DialogBody service={service} currentPkg={currentPkg} />
      </DialogContent>
    </Dialog>
  );
}