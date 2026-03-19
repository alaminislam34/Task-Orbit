"use client";

import { motion } from "motion/react";
import {
  Zap,
  TrendingUp,
  Wallet,
  ShieldCheck,
  Globe2,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStateContext } from "@/providers/StateProvider";

const features = [
  {
    title: "Smarter Workflow",
    description:
      "Manage projects, communication, and files in one intuitive dashboard designed for speed.",
    icon: Zap,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    className: "md:col-span-2",
  },
  {
    title: "Global Growth",
    description:
      "Connect with premium clients from over 120 countries and expand your reach.",
    icon: Globe2,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    className: "md:col-span-1",
  },
  {
    title: "Secure Earnings",
    description:
      "Get paid on time, every time. Our escrow system ensures your work is always valued.",
    icon: Wallet,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    className: "md:col-span-1",
  },
  {
    title: "Professional Growth",
    description:
      "Level up your career with TaskOrbit badges, certifications, and seller insights.",
    icon: TrendingUp,
    color: "text-primary",
    bg: "bg-primary/10",
    className: "md:col-span-2",
  },
];

const FeaturesSection = () => {
  const { setSignUpModal } = useStateContext();
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              A smarter way to <span className="text-primary">work</span>,{" "}
              <br />
              grow, and earn.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              TaskOrbit provides the tools and the network you need to build a
              sustainable freelance business without the traditional headaches.
            </p>
          </motion.div>
        </div>

        {/* Features Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group relative p-8 rounded-3xl border bg-card hover:bg-accent/50 transition-all duration-300 ${feature.className}`}
            >
              <div
                className={`w-12 h-12 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
              >
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>

              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              {/* Subtle Decorative Gradient on Hover */}
              <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          ))}
        </div>

        <div className="flex items-center justify-center my-6">
          <Button
            variant={"default"}
            size={"lg"}
            className={"px-6 py-2"}
            onClick={() => setSignUpModal(true)}
          >
            Get Started
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
