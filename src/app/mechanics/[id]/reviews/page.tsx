"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Star,
  ThumbsUp,
  Shield,
  Camera,
  Filter,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import BottomNavigation from "@/components/BottomNavigation";
import { useRouter } from "next/navigation";
import { Review, ReviewSummary, ReviewFilters } from "@/types/reviews";

const mockReviewSummary: ReviewSummary = {
  averageRating: 4.8,
  totalReviews: 127,
  ratingDistribution: {
    5: 89,
    4: 28,
    3: 7,
    2: 2,
    1: 1,
  },
};

const mockReviews: Review[] = [
  {
    id: "1",
    mechanicId: "1",
    bookingId: "booking-1",
    userId: "user-1",
    userName: "Sarah Chen",
    userInitials: "SC",
    rating: 5,
    serviceType: "Full Service",
    comment:
      "Outstanding service! The team was professional, explained everything clearly, and completed the work on time. My car runs like new. Highly recommend AutoCare Plus!",
    date: "2024-01-05T10:30:00Z",
    verified: true,
    helpful: 12,
    criteria: {
      quality: 5,
      timeliness: 5,
      communication: 5,
      value: 4,
    },
  },
  {
    id: "2",
    mechanicId: "1",
    bookingId: "booking-2",
    userId: "user-2",
    userName: "Michael Rodriguez",
    userInitials: "MR",
    rating: 4,
    serviceType: "Brake Service",
    comment:
      "Good service overall. The brake replacement was done well and the price was fair. Only minor issue was a slight delay in getting started.",
    date: "2024-01-03T14:15:00Z",
    verified: true,
    helpful: 8,
    criteria: {
      quality: 4,
      timeliness: 3,
      communication: 4,
      value: 5,
    },
  },
  {
    id: "3",
    mechanicId: "1",
    bookingId: "booking-3",
    userId: "user-3",
    userName: "Emma Thompson",
    userInitials: "ET",
    rating: 5,
    serviceType: "Basic Service",
    comment:
      "Fast and efficient! Got my oil change done in under an hour. Clean facility and friendly staff.",
    date: "2024-01-01T09:00:00Z",
    verified: true,
    helpful: 15,
  },
];

export default function MechanicReviews() {
  const router = useRouter();

  const [filters, setFilters] = useState<ReviewFilters>({
    sortBy: "recent",
    filterBy: "all",
  });
  // simplified controls – dialog-based
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  const sortOptions = [
    { value: "recent", label: "Most Recent" },
    { value: "highest", label: "Highest Rating" },
    { value: "lowest", label: "Lowest Rating" },
    { value: "helpful", label: "Most Helpful" },
  ];

  // minimal set of filters (by service type)
  const serviceTypes = Array.from(
    new Set(mockReviews.map((r) => r.serviceType))
  );

  const sortedReviews = [...mockReviews].sort((a, b) => {
    switch (filters.sortBy) {
      case "recent":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "highest":
        return b.rating - a.rating;
      case "lowest":
        return a.rating - b.rating;
      case "helpful":
        return b.helpful - a.helpful;
      default:
        return 0;
    }
  });

  // removed cycle sort in favor of dropdown

  const filteredReviews = sortedReviews.filter((review) => {
    if (filters.filterBy === "verified") return review.verified;
    if (filters.filterBy === "service" && filters.serviceType) {
      return review.serviceType === filters.serviceType;
    }
    return true;
  });

  const renderStars = (
    rating: number,
    size = "w-4 h-4",
    keyPrefix = "stars"
  ) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={`reviews-${keyPrefix}-${star}`}
            className={`${size} ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const renderRatingDistribution = () => {
    const total = mockReviewSummary.totalReviews;
    return (
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count =
            mockReviewSummary.ratingDistribution[
              rating as keyof typeof mockReviewSummary.ratingDistribution
            ];
          const percentage = (count / total) * 100;
          return (
            <div
              key={`reviews-dist-row-${rating}`}
              className="flex items-center gap-3"
            >
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium w-3">{rating}</span>
                <Star
                  key={`reviews-dist-star-${rating}`}
                  className="w-3 h-3 fill-yellow-400 text-yellow-400"
                />
              </div>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-xs text-gray-600 w-8">{count}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-app-brand">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          aria-label="Go back"
          className="w-10 h-10 rounded-lg card-elevated"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 tile-brand rounded-lg flex items-center justify-center">
            <Star className="w-4 h-4" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Reviews</h1>
        </div>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="px-4 pb-28">
        {/* Review Summary */}
        <Card className="mb-6 card-elevated">
          <CardContent className="pt-6">
            <div className="flex items-start gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-slate-900 mb-2">
                  {mockReviewSummary.averageRating}
                </div>
                {renderStars(
                  mockReviewSummary.averageRating,
                  "w-5 h-5",
                  "summary"
                )}
                <div className="text-sm text-gray-600 mt-1">
                  {mockReviewSummary.totalReviews} reviews
                </div>
              </div>

              <div className="flex-1">{renderRatingDistribution()}</div>
            </div>
          </CardContent>
        </Card>

        {/* Sort & Filter – dialog trigger */}
        <Card className="mb-6 card-elevated">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Sort:{" "}
                {sortOptions.find((o) => o.value === filters.sortBy)?.label}
                {filters.filterBy === "service" && filters.serviceType
                  ? ` • ${filters.serviceType}`
                  : " • All"}
              </div>
              <Button
                variant="outline"
                size="icon"
                aria-label="Open sort and filter options"
                onClick={() => setIsOptionsOpen(true)}
              >
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Dialog open={isOptionsOpen} onOpenChange={setIsOptionsOpen}>
          <DialogContent className="w-[95vw] max-w-md p-0 gap-0 rounded-2xl">
            <DialogTitle className="sr-only">Sort and Filter</DialogTitle>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-800 mb-2">
                  Sort by
                </p>
                <div className="flex flex-wrap gap-2">
                  {sortOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={
                        filters.sortBy === option.value ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        setFilters({
                          ...filters,
                          sortBy: option.value as ReviewFilters["sortBy"],
                        })
                      }
                      className={
                        filters.sortBy === option.value ? "btn-brand" : ""
                      }
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-800 mb-2">
                  Service type
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={filters.filterBy === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      setFilters({
                        ...filters,
                        filterBy: "all",
                        serviceType: undefined,
                      })
                    }
                    className={filters.filterBy === "all" ? "btn-brand" : ""}
                  >
                    All
                  </Button>
                  {serviceTypes.map((st) => (
                    <Button
                      key={st}
                      variant={
                        filters.filterBy === "service" &&
                        filters.serviceType === st
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        setFilters({
                          ...filters,
                          filterBy: "service",
                          serviceType: st,
                        })
                      }
                      className={
                        filters.filterBy === "service" &&
                        filters.serviceType === st
                          ? "btn-brand"
                          : ""
                      }
                    >
                      {st}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  className="flex-1 btn-brand text-white"
                  onClick={() => setIsOptionsOpen(false)}
                >
                  Apply
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setFilters({ sortBy: "recent", filterBy: "all" });
                    setIsOptionsOpen(false);
                  }}
                >
                  Clear
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <Card key={review.id} className="card-elevated">
              <CardContent className="p-5">
                {/* Review Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="font-bold text-blue-700 text-sm">
                        {review.userInitials}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900">
                          {review.userName}
                        </span>
                        {review.verified && (
                          <Badge className="bg-green-100 text-green-700 text-xs">
                            <Shield className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {renderStars(
                          review.rating,
                          "w-4 h-4",
                          `review-${review.id}`
                        )}
                        <span className="text-xs text-gray-500">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Service Type */}
                <Badge variant="outline" className="mb-3">
                  {review.serviceType}
                </Badge>

                {/* Review Content */}
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  {review.comment}
                </p>

                {/* Criteria Ratings */}
                {review.criteria && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(review.criteria).map(([key, rating]) => (
                        <div
                          key={`reviews-criteria-${key}-${review.id}`}
                          className="flex items-center justify-between"
                        >
                          <span className="text-xs text-gray-600 capitalize">
                            {key}
                          </span>
                          {renderStars(
                            rating,
                            "w-3 h-3",
                            `criteria-${key}-${review.id}`
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Review Actions */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    Helpful ({review.helpful})
                  </Button>

                  {review.photos && review.photos.length > 0 && (
                    <Button variant="ghost" size="sm">
                      <Camera className="w-4 h-4 mr-1" />
                      {review.photos.length} Photos
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-6 text-center">
          <Button variant="outline" className="w-full">
            Load More Reviews
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
