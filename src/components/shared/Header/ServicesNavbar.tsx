"use client";

import Link from "next/link";
import {
  Sparkles,
  Paintbrush,
  Globe,
  Video,
  Search,
  Smartphone,
  PenTool,
  BarChart3,
  Headphones,
  Briefcase,
  Scale,
  UserCheck,
  Languages,
  ShoppingCart,
  Code,
  Play,
  Music,
  Layout,
  Database,
  Gamepad2,
  Server,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

const services = [
  {
    name: "AI Services",
    icon: Sparkles,
    subs: [
      "AI Artists",
      "AI Applications",
      "ChatGPT Models",
      "Prompt Engineering",
    ],
  },
  {
    name: "Graphic Design",
    icon: Paintbrush,
    subs: [
      "Logo Design",
      "Brand Identity",
      "Business Cards",
      "Packaging Design",
    ],
  },
  {
    name: "Web Development",
    icon: Code,
    subs: ["Frontend", "Backend", "Full Stack", "React / Next.js"],
  },
  {
    name: "WordPress",
    icon: Globe,
    subs: [
      "Customization",
      "Theme Development",
      "Plugin Development",
      "Landing Pages",
    ],
  },
  {
    name: "Mobile Apps",
    icon: Smartphone,
    subs: ["iOS Apps", "Android Apps", "Flutter", "React Native"],
  },
  {
    name: "Video Editing",
    icon: Video,
    subs: ["YouTube Editing", "Social Media", "Corporate", "Visual Effects"],
  },
  {
    name: "Animation",
    icon: Play,
    subs: ["2D Animation", "3D Animation", "Motion Graphics"],
  },
  {
    name: "SEO",
    icon: Search,
    subs: ["On-Page SEO", "Off-Page SEO", "Technical SEO", "Keyword Research"],
  },
  {
    name: "UI / UX Design",
    icon: Layout,
    subs: ["Website UI", "Mobile App UI", "Wireframing", "Prototyping"],
  },
];

const ServicesNavbarSection = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when user scrolls down 100px
      setIsVisible(window.scrollY > 100);
      if (window.scrollY <= 100) setActiveCategory(null);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            // Slide down from height 0
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full bg-background overflow-hidden"
            onMouseLeave={() => setActiveCategory(null)}
          >
            <div className="max-w-360 mx-auto w-11/12 relative">
              {/* Fade Gradients */}
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-linear-to-r from-background to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-linear-to-l from-background to-transparent z-10 pointer-events-none" />

              <ul className="flex flex-row justify-between items-center gap-8 overflow-x-auto no-scrollbar py-3">
                {services.map((service, index) => (
                  <li
                    key={index}
                    className="group whitespace-nowrap cursor-pointer"
                    onMouseEnter={() => setActiveCategory(service.name)}
                  >
                    <div className="flex flex-col items-center gap-1.5 relative">
                      <div
                        className={`flex items-center gap-2 transition-all duration-300 ${
                          activeCategory === service.name
                            ? "text-foreground"
                            : "text-muted-foreground group-hover:text-foreground"
                        }`}
                      >
                        <service.icon size={14} strokeWidth={1.5} />
                        <span className="text-[12px] font-medium tracking-wide">
                          {service.name}
                        </span>
                      </div>

                      <motion.div
                        className="absolute -bottom-3.25 h-0.5 bg-primary"
                        initial={false}
                        animate={{
                          width:
                            activeCategory === service.name ? "100%" : "0%",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sub-Category Bar */}
            <AnimatePresence>
              {activeCategory && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="w-full bg-muted/20 overflow-hidden"
                >
                  <div className="max-w-360 mx-auto w-11/12 py-3">
                    <ul className="flex flex-wrap items-center gap-x-8 gap-y-2">
                      {services
                        .find((s) => s.name === activeCategory)
                        ?.subs.map((sub, idx) => (
                          <li key={idx}>
                            <Link
                              href={`/categories/${sub.toLowerCase().replace(/ /g, "-")}`}
                              className="text-sm font-normal text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {sub}
                            </Link>
                          </li>
                        ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServicesNavbarSection;
