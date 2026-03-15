"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const categories = [
  {
    title: "AI Services",
    image: "/images/aiService.jpg",
    color: "bg-emerald-900",
  },
  {
    title: "Logo Design",
    image: "/images/logo_design.jpg",
    color: "bg-orange-600",
  },
  {
    title: "WordPress",
    image: "/images/wordpress.jpg",
    color: "bg-blue-700",
  },
  {
    title: "Video Editing",
    image: "/images/videoEditing.jpg",
    color: "bg-rose-700",
  },
  {
    title: "SEO",
    image: "/images/seo.jpg",
    color: "bg-lime-700",
  },
];

const CategorySection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Popular professional services
          </h2>
          <Link
            href="/categories"
            className="hidden md:flex items-center text-primary font-semibold hover:underline"
          >
            View all categories <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        {/* Categories Slider/Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((cat, index) => (
            <Link
              key={index}
              href={`/services/${cat.title.toLowerCase()}`}
              className={`group relative overflow-hidden rounded-xl h-80 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${cat.color}`}
            >
              {/* Image with overlay */}
              <div className="absolute inset-0 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
                {/* Tip: Use high-res images from Unsplash. 
                    If you don't have images yet, the cat.color will show.
                 */}
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Text Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-between">
                <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore {cat.title}
                </span>
                <h3 className="text-white text-xl font-bold leading-tight">
                  {cat.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile View All Link */}
        <div className="mt-6 md:hidden text-center">
          <Link
            href="/categories"
            className="text-primary font-bold inline-flex items-center"
          >
            See more categories <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
