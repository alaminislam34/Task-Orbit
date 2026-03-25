"use client";

import ExploreCard from "../../_components/ExploreCard";

type RelatedServicesCarouselProps = {
  services: any[];
};

export default function RelatedServicesCarousel({
  services,
}: RelatedServicesCarouselProps) {
  if (!services.length) return null;

  return (
    <section className="space-y-6 pt-6">
      <h2 className="border-l-4 border-emerald-500 pl-4 text-2xl font-black">
        Related Services
      </h2>

      <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {services.map((item, index) => (
          <div
            key={`${item.id}-${item.slug}-${index}`}
            className="min-w-70 snap-start sm:min-w-85 lg:min-w-90"
          >
            <ExploreCard data={item} type="service" viewMode="grid" />
          </div>
        ))}
      </div>
    </section>
  );
}