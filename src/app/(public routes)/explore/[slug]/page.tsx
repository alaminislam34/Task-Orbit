"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Star,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Share2,
  Heart,
  ChevronRight,
  Zap,
  Award,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";
import OrderCheckoutDialog from "./_components/OrderCheckoutDialog";
import ContactSellerDialog from "./_components/ContactSellerDialog";
import FaqAccordionSection from "./_components/FaqAccordionSection";
import ReviewsSection from "./_components/ReviewsSection";
import RelatedServicesCarousel from "./_components/RelatedServicesCarousel";

const ServiceByIdPage = () => {
  const { slug } = useParams();
  const [service, setService] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [activePackage, setActivePackage] = useState(0); // 0: Basic, 1: Standard, 2: Premium
  const [loading, setLoading] = useState(true);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await fetch("/data/services.json");
        const data = await res.json();
        setServices(data);
        const normalizedSlug = Array.isArray(slug) ? slug[0] : slug;
        const found = data.find((s: any) => s.slug === normalizedSlug);
        setService(found);
        setActivePackage(0);
      } catch (err) {
        console.error("Failed to fetch service", err);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [slug]);

  const relatedServices = useMemo(() => {
    if (!services.length) return [];

    const currentSlug = service?.slug;
    const pool = services.filter((item) => item.slug !== currentSlug);
    const source = pool.length ? pool : services;

    return Array.from({ length: 4 }, (_, index) => source[index % source.length]);
  }, [service?.slug, services]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  if (!service)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Service not found.
      </div>
    );

  const currentPkg = service.packages[activePackage] ?? service.packages[0];

  const faqData = service.faqs?.length
    ? service.faqs
    : [
        {
          question: "Can we discuss requirements before ordering?",
          answer:
            "Absolutely. Use Contact Seller to discuss scope, timeline, and deliverables before placing an order.",
        },
      ];

  const reviewsData = service.reviews?.length
    ? service.reviews
    : [
        {
          id: "temp-review",
          user: "TaskOrbit User",
          rating: 5,
          comment: "Great communication and smooth delivery.",
          date: "2026-03-01",
          country: "BD",
        },
      ];

  return (
    <div className="min-h-screen bg-background pb-20 selection:bg-emerald-500/30">
      {/* Breadcrumbs */}
      <nav className="container mx-auto px-6 py-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          href="/explore"
          className="hover:text-emerald-600 transition-colors"
        >
          Explore
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-emerald-600 font-semibold">
          {service.category.main}
        </span>
        <ChevronRight className="w-4 h-4" />
        <span className="truncate max-w-50">{service.title}</span>
      </nav>

      <main className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Content (8 Columns) */}
        <div className="lg:col-span-8 space-y-10">
          {/* Header Section */}
          <section className="space-y-6">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.1] text-foreground">
              {service.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center overflow-hidden">
                    {service.seller.avatar ? (
                      <Image
                        src={service.seller.avatar}
                        alt={service.seller.name}
                        width={48}
                        height={48}
                      />
                    ) : (
                      <span className="text-sm font-black text-emerald-600">
                        AA
                      </span>
                    )}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-background rounded-full" />
                </div>
                <div>
                  <p className="text-sm font-bold group-hover:text-emerald-600 transition-colors">
                    {service.seller.name}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-3 h-3 text-amber-500" />
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">
                      {service.seller.level}
                    </p>
                  </div>
                </div>
              </div>

              <div className="h-10 w-px bg-border hidden sm:block" />

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1.5">
                  <Star className="w-5 h-5 fill-emerald-500 text-emerald-500" />
                  <span className="font-bold text-lg">{service.rating}</span>
                  <span className="text-muted-foreground text-sm font-medium">
                    ({service.reviewCount} Reviews)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Badge
                    variant="secondary"
                    className="bg-emerald-500/10 text-emerald-600 border-none"
                  >
                    {service.ordersInQueue} Orders in Queue
                  </Badge>
                </div>
              </div>
            </div>
          </section>

          {/* Sticky Package Nav */}
          <section className="sticky top-3 z-20 rounded-xl border border-border/60 bg-background/90 p-2 shadow-lg supports-backdrop-filter:backdrop-blur-xl">
            <div className="grid grid-cols-3 gap-2">
              {service.packages.map((pkg: any, index: number) => (
                <button
                  key={pkg.id}
                  onClick={() => setActivePackage(index)}
                  className={cn(
                    "rounded-lg px-3 py-2 text-xs font-black uppercase tracking-widest transition-colors sm:text-sm",
                    activePackage === index
                      ? "bg-emerald-500 text-white"
                      : "bg-muted/40 text-muted-foreground hover:bg-muted",
                  )}
                >
                  {pkg.name}
                </button>
              ))}
            </div>
          </section>

          {/* Main Gallery */}
          <section className="relative aspect-video rounded-lg overflow-hidden border border-border group shadow-2xl">
            <Image
              src={service.media.thumbnail}
              alt={service.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-6 right-6 flex gap-3">
              <Button
                size="icon"
                variant="secondary"
                className="rounded-full bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white hover:text-black"
              >
                <Share2 className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="rounded-full bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-rose-500 hover:border-rose-500"
              >
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </section>

          {/* Detailed Description */}
          <section className="space-y-6">
            <h2 className="text-2xl font-black border-l-4 border-emerald-500 pl-4">
              About this service
            </h2>
            <div className="prose prose-emerald dark:prose-invert max-w-none">
              <p className="text-muted-foreground text-lg leading-relaxed">
                {service.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {currentPkg.features.map((feature: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-5 rounded-lg bg-muted/30 border border-border/50 hover:border-emerald-500/30 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </div>
                  <span className="text-sm font-bold text-foreground/80">
                    {feature.label}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <FaqAccordionSection faqs={faqData} />
          <ReviewsSection reviews={reviewsData} />
        </div>

        {/* Right Column: Sticky Sidebar (4 Columns) */}
        <div className="lg:col-span-4">
          <div className="sticky top-8 space-y-6">
            {/* Pricing Card */}
            <div className="bg-card border border-border rounded-lg overflow-hidden shadow-2xl shadow-emerald-500/5">
              {/* Package Selector Tabs */}
              <div className="flex border-b border-border">
                {service.packages.map((pkg: any, index: number) => (
                  <button
                    key={pkg.name}
                    onClick={() => setActivePackage(index)}
                    className={cn(
                      "flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all",
                      activePackage === index
                        ? "bg-emerald-500 text-white"
                        : "bg-muted/20 text-muted-foreground hover:bg-muted/50",
                    )}
                  >
                    {pkg.name}
                  </button>
                ))}
              </div>

              <div className="p-8 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-black text-emerald-600 uppercase tracking-tighter">
                    {currentPkg.title}
                  </h3>
                  <p className="text-4xl font-black">${currentPkg.price}</p>
                </div>

                <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                  Everything included in the {currentPkg.name} tier to get your
                  project started.
                </p>

                <div className="space-y-4 py-4 border-y border-border/50">
                  <div className="flex items-center gap-3 text-sm font-bold">
                    <Clock className="w-4 h-4 text-emerald-500" />
                    {currentPkg.deliveryTime} Days Delivery
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold">
                    <Zap className="w-4 h-4 text-emerald-500" />
                    {currentPkg.revisions === -1
                      ? "Unlimited"
                      : currentPkg.revisions}{" "}
                    Revisions
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => setIsOrderDialogOpen(true)}
                    className="w-full h-14 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                  >
                    Order Now (${currentPkg.price})
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsContactDialogOpen(true)}
                    className="w-full h-12 rounded-lg border-border hover:bg-muted font-bold"
                  >
                    Contact Seller
                  </Button>
                </div>
              </div>
            </div>

            {/* Seller Quick Trust Box */}
            <div className="p-6 rounded-lg bg-emerald-950 text-white border border-emerald-500/20 space-y-4">
              <div className="flex items-center gap-4">
                <ShieldCheck className="w-10 h-10 text-emerald-400" />
                <div>
                  <p className="font-black text-sm uppercase">
                    TaskOrbit Protection
                  </p>
                  <p className="text-[10px] text-emerald-200/60 font-medium">
                    Your payment is held securely until you approve the work.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className="container mx-auto px-6 mt-10">
        <RelatedServicesCarousel services={relatedServices} />
      </section>

      <OrderCheckoutDialog
        open={isOrderDialogOpen}
        onOpenChange={setIsOrderDialogOpen}
        service={service}
        currentPkg={currentPkg}
      />

      <ContactSellerDialog
        open={isContactDialogOpen}
        onOpenChange={setIsContactDialogOpen}
        seller={service.seller}
      />
    </div>
  );
};

export default ServiceByIdPage;
