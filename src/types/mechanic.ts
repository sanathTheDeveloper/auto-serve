export interface Mechanic {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  distance: string;
  address: string;
  services: string[];
  priceRange: string;
  availability: string;
  image?: string;
  specialties: string[];
  verified: boolean;
  familyFriendly: boolean;
  phoneNumber: string;
  openingHours: {
    today: string;
    isOpen: boolean;
  };
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
}

export interface Filters {
  serviceTypes: string[];
  maxPrice: number;
  availability: string;
  verifiedOnly: boolean;
}