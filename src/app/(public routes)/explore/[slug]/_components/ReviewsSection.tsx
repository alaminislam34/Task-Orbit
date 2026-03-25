"use client";

import { useMemo, useState } from "react";
import { Star } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Review = {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
  country: string;
};

type ReviewsSectionProps = {
  reviews: Review[];
};

export default function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const [sortBy, setSortBy] = useState("latest");

  const ratingCounts = useMemo(() => {
    return [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: reviews.filter((review) => review.rating === star).length,
    }));
  }, [reviews]);

  const sortedReviews = useMemo(() => {
    if (sortBy === "relevant") {
      return [...reviews].sort((a, b) => b.rating - a.rating);
    }
    return [...reviews].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [reviews, sortBy]);

  const maxCount = Math.max(...ratingCounts.map((item) => item.count), 1);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="border-l-4 border-emerald-500 pl-4 text-2xl font-black">
          Reviews
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-muted-foreground">Sort by</span>
          <Select
            value={sortBy}
            onValueChange={(value) => {
              if (value) setSortBy(value);
            }}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Latest" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="relevant">Relevant</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 md:p-6">
        <div className="space-y-2">
          {ratingCounts.map((item) => {
            const width = (item.count / maxCount) * 100;
            return (
              <div key={item.star} className="flex items-center gap-3">
                <div className="flex min-w-14 items-center gap-1 text-sm font-semibold">
                  {item.star}
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                </div>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{ width: `${width}%` }}
                  />
                </div>
                <p className="w-8 text-right text-xs font-semibold text-muted-foreground">
                  {item.count}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        {sortedReviews.map((review) => (
          <div
            key={review.id}
            className="rounded-xl border border-border bg-muted/20 p-4 transition-colors hover:border-emerald-500/30"
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black">{review.user}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(review.date).toLocaleDateString()} . {review.country}
                </p>
              </div>
              <div className="flex items-center gap-1 text-sm font-black text-foreground">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {review.rating}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{review.comment}</p>
          </div>
        ))}
      </div>
    </section>
  );
}