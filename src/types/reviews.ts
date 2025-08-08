export interface Review {
  id: string;
  mechanicId: string;
  bookingId: string;
  userId: string;
  userName: string;
  userInitials: string;
  rating: number;
  serviceType: string;
  comment: string;
  date: string;
  verified: boolean;
  helpful: number;
  photos?: string[];
  criteria?: {
    quality: number;
    timeliness: number;
    communication: number;
    value: number;
  };
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface ReviewFilters {
  sortBy: "recent" | "highest" | "lowest" | "helpful";
  filterBy: "all" | "verified" | "service";
  serviceType?: string;
}

export interface RatingSubmission {
  bookingId: string;
  mechanicId: string;
  rating: number;
  comment: string;
  criteria: {
    quality: number;
    timeliness: number;
    communication: number;
    value: number;
  };
  anonymous: boolean;
  photos?: File[];
}