"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  MapPin,
  Car,
  Star,
  Clock,
  ChevronRight,
  Shield,
  Heart,
  Navigation,
  X,
  SlidersHorizontal,
  Phone,
  Map,
  List,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Mechanic {
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

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
}

interface Filters {
  serviceTypes: string[];
  maxPrice: number;
  availability: string;
  verifiedOnly: boolean;
}

const mockVehicles: Vehicle[] = [
  {
    id: "1",
    make: "Toyota",
    model: "Camry",
    year: 2020,
    licensePlate: "ABC 123",
  },
  {
    id: "2",
    make: "Honda",
    model: "Civic",
    year: 2019,
    licensePlate: "XYZ 789",
  },
];

const mockMechanics: Mechanic[] = [
  {
    id: "1",
    name: "AutoCare Plus",
    rating: 4.8,
    reviewCount: 127,
    distance: "0.8 km",
    address: "123 Collins Street, Melbourne",
    services: [
      "Basic Service",
      "Full Service",
      "Brake Service",
      "Logbook Service",
    ],
    priceRange: "$80-150",
    availability: "Available Today",
    specialties: ["Family Friendly", "Quick Service"],
    verified: true,
    familyFriendly: true,
    phoneNumber: "(03) 9123 4567",
    openingHours: {
      today: "Open until 6:00 PM",
      isOpen: true,
    },
  },
  {
    id: "2",
    name: "Melbourne Motor Works",
    rating: 4.6,
    reviewCount: 89,
    distance: "1.2 km",
    address: "456 Flinders Lane, Melbourne",
    services: [
      "Full Service",
      "Tire Service",
      "Engine Repair",
      "Brake Repairs",
    ],
    priceRange: "$100-200",
    availability: "Tomorrow",
    specialties: ["Premium Service", "Diagnostics"],
    verified: true,
    familyFriendly: true,
    phoneNumber: "(03) 9456 7890",
    openingHours: {
      today: "Opens 8:00 AM tomorrow",
      isOpen: false,
    },
  },
  {
    id: "3",
    name: "Quick Fix Automotive",
    rating: 4.4,
    reviewCount: 203,
    distance: "2.1 km",
    address: "789 Bourke Street, Melbourne",
    services: ["Basic Service", "Oil Change", "Brake Service", "Tire Change"],
    priceRange: "$60-120",
    availability: "Available Today",
    specialties: ["Fast Service", "Budget Friendly"],
    verified: true,
    familyFriendly: true,
    phoneNumber: "(03) 9789 0123",
    openingHours: {
      today: "Open 24 hours",
      isOpen: true,
    },
  },
];

const availableServices = [
  "Logbook Service",
  "Brake Repairs",
  "Tire Change",
  "Oil Change",
  "Full Service",
  "Basic Service",
  "Engine Repair",
  "Tire Service",
  "Brake Service",
];

// Filter Modal Component
const FilterModal = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
}: {
  isOpen: boolean;
  onClose: () => void;
  filters: Filters;
  onApplyFilters: (filters: Filters) => void;
  onResetFilters: () => void;
}) => {
  const [localFilters, setLocalFilters] = useState<Filters>(filters);

  const handleServiceTypeToggle = (service: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      serviceTypes: prev.serviceTypes.includes(service)
        ? prev.serviceTypes.filter((s) => s !== service)
        : [...prev.serviceTypes, service],
    }));
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    onResetFilters();
    setLocalFilters({
      serviceTypes: [],
      maxPrice: 500,
      availability: "Any",
      verifiedOnly: false,
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-md bg-white rounded-t-2xl shadow-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Filters</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="w-10 h-10 p-0 hover:bg-gray-100 rounded-lg flex items-center justify-center"
          >
            <X className="w-5 h-5 text-gray-600 hover:text-gray-900" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Service Types */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Service Types</h3>
            <div className="space-y-2">
              {availableServices.map((service) => (
                <label
                  key={service}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={localFilters.serviceTypes.includes(service)}
                    onChange={() => handleServiceTypeToggle(service)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{service}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              Maximum Price: ${localFilters.maxPrice}
            </h3>
            <input
              type="range"
              min="50"
              max="500"
              step="10"
              value={localFilters.maxPrice}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  maxPrice: parseInt(e.target.value),
                }))
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>$50</span>
              <span>$500</span>
            </div>
          </div>

          {/* Availability */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Availability</h3>
            <div className="space-y-2">
              {["Any", "Today", "Tomorrow"].map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="availability"
                    checked={localFilters.availability === option}
                    onChange={() =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        availability: option,
                      }))
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Trust & Safety */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Trust & Safety</h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={localFilters.verifiedOnly}
                onChange={(e) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    verifiedOnly: e.target.checked,
                  }))
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                Verified mechanics only
              </span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-3">
          <Button
            onClick={handleApply}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
          >
            Apply Filters
          </Button>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Reset All
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Mechanics() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showVehicleSelector, setShowVehicleSelector] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("Melbourne CBD");
  const [mechanics] = useState<Mechanic[]>(mockMechanics);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [locationSearchQuery, setLocationSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [searchRadius, setSearchRadius] = useState(5); // km
  const [filters, setFilters] = useState<Filters>({
    serviceTypes: [],
    maxPrice: 500,
    availability: "Any",
    verifiedOnly: false,
  });

  const handleMechanicClick = (mechanicId: string) => {
    // Check if user is authenticated (for demo, we'll simulate being logged in)
    const isAuthenticated = true; // Simulate being logged in for demo

    if (isAuthenticated) {
      // User is logged in, go directly to mechanic details
      router.push(`/mechanics/${mechanicId}`);
    } else {
      // User needs to log in first
      router.push("/login");
    }
  };

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowVehicleSelector(false);
  };

  // Filter and sort mechanics based on search query and filters
  const filteredAndSortedMechanics = useMemo(() => {
    let filtered = mechanics;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (mechanic) =>
          mechanic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          mechanic.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          mechanic.specialties.some((specialty) =>
            specialty.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Filter by service types
    if (filters.serviceTypes.length > 0) {
      filtered = filtered.filter((mechanic) =>
        filters.serviceTypes.some((serviceType) =>
          mechanic.services.includes(serviceType)
        )
      );
    }

    // Filter by price range
    filtered = filtered.filter((mechanic) => {
      const maxPrice = parseInt(
        mechanic.priceRange.split("-")[1].replace("$", "")
      );
      return maxPrice <= filters.maxPrice;
    });

    // Filter by availability
    if (filters.availability !== "Any") {
      filtered = filtered.filter((mechanic) => {
        if (filters.availability === "Today") {
          return mechanic.availability === "Available Today";
        } else if (filters.availability === "Tomorrow") {
          return mechanic.availability === "Tomorrow";
        }
        return true;
      });
    }

    // Filter by verified status
    if (filters.verifiedOnly) {
      filtered = filtered.filter((mechanic) => mechanic.verified);
    }

    return filtered;
  }, [mechanics, searchQuery, filters]);

  const hasActiveFilters =
    filters.serviceTypes.length > 0 ||
    filters.maxPrice < 500 ||
    filters.availability !== "Any" ||
    filters.verifiedOnly;

  const handleApplyFilters = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      serviceTypes: [],
      maxPrice: 500,
      availability: "Any",
      verifiedOnly: false,
    });
  };

  const handleLocationSelect = (location: string) => {
    setCurrentLocation(location);
    setShowLocationSearch(false);
    setLocationSearchQuery("");
  };

  const handleUseCurrentLocation = () => {
    // Simulate getting current location
    setCurrentLocation("Melbourne CBD");
    setShowLocationSearch(false);
    setLocationSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
      {/* Status Bar Space */}
      <div className="h-11" />

      {/* Header - Simplified */}
      <div className="px-4 py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Find Mechanics</h1>
          <p className="text-white/80 text-sm">
            Trusted automotive services near you
          </p>
        </div>
      </div>

      {/* Vehicle Selection */}
      <div className="px-4 mb-4">
        <Card className="border-0 bg-white/95 backdrop-blur-sm shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Car className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">
                  {selectedVehicle
                    ? `${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}`
                    : "Select Vehicle"}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowVehicleSelector(!showVehicleSelector)}
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                {selectedVehicle ? "Change" : "Select"}
              </Button>
            </div>

            {/* Vehicle Selector Dropdown */}
            {showVehicleSelector && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="space-y-2">
                  {mockVehicles.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      onClick={() => handleVehicleSelect(vehicle)}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Car className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {vehicle.licensePlate}
                          </p>
                        </div>
                      </div>
                      {selectedVehicle?.id === vehicle.id && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Search Section */}
      <div className="px-4 mb-4">
        <Card className="border-0 bg-white/95 backdrop-blur-sm shadow-lg">
          <CardContent className="p-4">
            {/* Location */}
            <div className="flex items-center justify-between mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  {currentLocation}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLocationSearch(true)}
                className="text-blue-600 hover:text-blue-700"
              >
                Change
              </Button>
            </div>

            {/* Search Box */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search mechanics or services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-gray-50 border-gray-200 focus:border-blue-500 rounded-lg"
              />
            </div>

            {/* Search Radius */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Search within:</span>
              <div className="flex gap-1">
                {[2, 5, 10, 20].map((radius) => (
                  <Button
                    key={radius}
                    variant={searchRadius === radius ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSearchRadius(radius)}
                    className={`h-8 px-3 text-xs ${
                      searchRadius === radius
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 border-gray-200"
                    }`}
                  >
                    {radius}km
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Controls */}
      <div className="px-4 mb-6">
        <Card className="border-0 bg-white/95 backdrop-blur-sm shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              {/* Map/List Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={`h-8 px-4 text-sm ${
                    viewMode === "list"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <List className="w-4 h-4 mr-2" />
                  List
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("map")}
                  className={`h-8 px-4 text-sm ${
                    viewMode === "map"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Map className="w-4 h-4 mr-2" />
                  Map
                </Button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilterModal(true)}
                className={`h-8 px-4 text-sm border-gray-200 relative ${
                  hasActiveFilters
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filter
                {hasActiveFilters && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="px-4 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-white/80">Active filters:</span>
            {filters.serviceTypes.map((service) => (
              <Badge
                key={service}
                variant="secondary"
                className="bg-white/20 text-white border-white/30"
              >
                {service}
              </Badge>
            ))}
            {filters.maxPrice < 500 && (
              <Badge
                variant="secondary"
                className="bg-white/20 text-white border-white/30"
              >
                Under ${filters.maxPrice}
              </Badge>
            )}
            {filters.availability !== "Any" && (
              <Badge
                variant="secondary"
                className="bg-white/20 text-white border-white/30"
              >
                {filters.availability}
              </Badge>
            )}
            {filters.verifiedOnly && (
              <Badge
                variant="secondary"
                className="bg-white/20 text-white border-white/30"
              >
                Verified Only
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="text-white/80 hover:text-white text-xs"
            >
              Clear All
            </Button>
          </div>
        </div>
      )}

      {/* Content Area - Map or List */}
      <div className="px-4 pb-24">
        {viewMode === "map" ? (
          /* Map View - High Fidelity */
          <Card className="border-0 shadow-lg mb-4 overflow-hidden">
            <CardContent className="p-0">
              <div className="relative h-96 bg-gray-100">
                {/* Google Maps Style Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-white">
                  {/* Roads and Streets */}
                  <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 400 300"
                  >
                    {/* Major roads - thicker, darker */}
                    <path
                      d="M0,120 Q100,115 200,120 T400,125"
                      stroke="#ffffff"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      d="M0,180 Q150,175 300,180 L400,182"
                      stroke="#ffffff"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      d="M120,0 Q125,100 130,200 T135,300"
                      stroke="#ffffff"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      d="M280,0 Q275,80 270,160 T265,300"
                      stroke="#ffffff"
                      strokeWidth="4"
                      fill="none"
                    />

                    {/* Minor streets */}
                    <path
                      d="M0,80 L400,85"
                      stroke="#ffffff"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      d="M0,220 L400,215"
                      stroke="#ffffff"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      d="M0,260 L400,265"
                      stroke="#ffffff"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      d="M60,0 L65,300"
                      stroke="#ffffff"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      d="M200,0 L195,300"
                      stroke="#ffffff"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      d="M340,0 L345,300"
                      stroke="#ffffff"
                      strokeWidth="2"
                      fill="none"
                    />

                    {/* Buildings/blocks */}
                    <rect
                      x="20"
                      y="20"
                      width="60"
                      height="40"
                      fill="#f3f4f6"
                      stroke="#e5e7eb"
                      strokeWidth="1"
                    />
                    <rect
                      x="140"
                      y="40"
                      width="80"
                      height="60"
                      fill="#f3f4f6"
                      stroke="#e5e7eb"
                      strokeWidth="1"
                    />
                    <rect
                      x="300"
                      y="30"
                      width="70"
                      height="50"
                      fill="#f3f4f6"
                      stroke="#e5e7eb"
                      strokeWidth="1"
                    />
                    <rect
                      x="50"
                      y="200"
                      width="90"
                      height="70"
                      fill="#f3f4f6"
                      stroke="#e5e7eb"
                      strokeWidth="1"
                    />
                    <rect
                      x="200"
                      y="220"
                      width="60"
                      height="50"
                      fill="#f3f4f6"
                      stroke="#e5e7eb"
                      strokeWidth="1"
                    />
                    <rect
                      x="320"
                      y="200"
                      width="50"
                      height="80"
                      fill="#f3f4f6"
                      stroke="#e5e7eb"
                      strokeWidth="1"
                    />

                    {/* Parks/green areas */}
                    <circle
                      cx="350"
                      cy="100"
                      r="25"
                      fill="#dcfce7"
                      stroke="#bbf7d0"
                      strokeWidth="1"
                    />
                    <rect
                      x="10"
                      y="140"
                      width="40"
                      height="30"
                      fill="#dcfce7"
                      stroke="#bbf7d0"
                      strokeWidth="1"
                      rx="5"
                    />
                  </svg>
                </div>

                {/* Location Pins */}
                <div className="absolute inset-0">
                  {/* User Location - Google Maps style blue dot */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                      {/* Outer pulse ring */}
                      <div className="absolute w-12 h-12 bg-blue-500/20 rounded-full animate-ping"></div>
                      {/* Inner blue dot */}
                      <div className="relative w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg">
                        <div className="absolute inset-0.5 bg-white rounded-full"></div>
                        <div className="absolute inset-1 bg-blue-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Mechanic Pins - Google Maps style */}
                  {filteredAndSortedMechanics
                    .slice(0, 5)
                    .map((mechanic, index) => {
                      const positions = [
                        { top: "25%", left: "30%" },
                        { top: "65%", left: "70%" },
                        { top: "35%", left: "75%" },
                        { top: "75%", left: "20%" },
                        { top: "45%", left: "85%" },
                      ];
                      const position = positions[index] || positions[0];

                      return (
                        <div
                          key={mechanic.id}
                          className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer group"
                          style={{ top: position.top, left: position.left }}
                          onClick={() => handleMechanicClick(mechanic.id)}
                        >
                          {/* Google Maps style pin */}
                          <div className="relative">
                            {/* Pin shadow */}
                            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-6 h-3 bg-black/20 rounded-full blur-sm"></div>

                            {/* Main pin */}
                            <div className="relative">
                              {/* Pin body */}
                              <div className="w-8 h-10 bg-red-500 rounded-t-full rounded-b-none relative shadow-lg">
                                <div className="absolute inset-0 bg-gradient-to-b from-red-400 to-red-600 rounded-t-full"></div>
                                {/* Pin icon */}
                                <div className="absolute top-1.5 left-1/2 transform -translate-x-1/2">
                                  <Car className="w-3 h-3 text-white" />
                                </div>
                                {/* Pin point */}
                                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-600 rotate-45"></div>
                              </div>

                              {/* Price badge */}
                              <div className="absolute -top-1 -right-1 bg-white border border-gray-300 text-gray-800 text-xs px-1.5 py-0.5 rounded-full font-semibold shadow-md">
                                {mechanic.priceRange}
                              </div>
                            </div>
                          </div>

                          {/* Google Maps style info card */}
                          <div className="absolute top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-20">
                            <div className="bg-white rounded-lg shadow-xl border border-gray-200 min-w-52 max-w-64">
                              {/* Card header */}
                              <div className="p-3 border-b border-gray-100">
                                <h4 className="font-semibold text-gray-900 text-sm mb-1">
                                  {mechanic.name}
                                </h4>
                                <div className="flex items-center gap-1 mb-1">
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-3 h-3 ${
                                          i < Math.floor(mechanic.rating)
                                            ? "text-yellow-400 fill-yellow-400"
                                            : "text-gray-300 fill-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-xs text-gray-600">
                                    {mechanic.rating} ({mechanic.reviewCount})
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500">
                                  {mechanic.distance} •{" "}
                                  {mechanic.openingHours.today}
                                </p>
                              </div>

                              {/* Card body */}
                              <div className="p-3">
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {mechanic.services
                                    .slice(0, 3)
                                    .map((service, idx) => (
                                      <span
                                        key={idx}
                                        className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full border border-blue-200"
                                      >
                                        {service}
                                      </span>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-semibold text-green-600">
                                    {mechanic.priceRange}
                                  </span>
                                  <button className="text-xs text-blue-600 font-medium hover:underline">
                                    View Details
                                  </button>
                                </div>
                              </div>
                            </div>
                            {/* Card pointer */}
                            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                              <div className="w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45"></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Google Maps style controls */}
                <div className="absolute top-4 right-4 flex flex-col gap-1">
                  <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200">
                    <span className="text-lg font-normal text-gray-700">+</span>
                  </button>
                  <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200">
                    <span className="text-lg font-normal text-gray-700">−</span>
                  </button>
                </div>

                {/* Current Location Button - Google Maps style */}
                <div className="absolute bottom-16 right-4">
                  <button className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200">
                    <Navigation className="w-5 h-5 text-gray-700" />
                  </button>
                </div>

                {/* Google watermark */}
                <div className="absolute bottom-2 left-2">
                  <div className="text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
                    Google
                  </div>
                </div>

                {/* Scale indicator */}
                <div className="absolute bottom-2 right-2">
                  <div className="flex items-center bg-white/90 px-2 py-1 rounded text-xs text-gray-600">
                    <div className="w-8 h-0.5 bg-gray-600 mr-1"></div>
                    500m
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {/* Mechanics List */}
        <div className="space-y-3">
          {filteredAndSortedMechanics.length > 0 ? (
            filteredAndSortedMechanics.map((mechanic) => (
              <Card
                key={mechanic.id}
                className="cursor-pointer hover:shadow-lg active:scale-98 transition-all duration-200 border-0 bg-white/95 backdrop-blur-sm shadow-md"
                onClick={() => handleMechanicClick(mechanic.id)}
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Mechanic Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center shadow-md">
                        <Car className="w-6 h-6 text-white" />
                      </div>
                      {mechanic.verified && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <Shield className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Mechanic Info */}
                    <div className="flex-1 min-w-0">
                      {/* Header with Name and Rating */}
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 text-base truncate">
                              {mechanic.name}
                            </h3>
                            {mechanic.familyFriendly && (
                              <Heart className="w-3 h-3 text-pink-500 flex-shrink-0" />
                            )}
                          </div>

                          {/* Rating - Most Prominent */}
                          <div className="flex items-center gap-1 mb-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(mechanic.rating)
                                      ? "text-yellow-500 fill-yellow-500"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="font-bold text-gray-900 text-sm">
                              {mechanic.rating}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({mechanic.reviewCount} reviews)
                            </span>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0 ml-2">
                          <div className="text-xs text-gray-500 mb-1">
                            {mechanic.distance}
                          </div>
                          <span className="text-sm font-bold text-green-600">
                            {mechanic.priceRange}
                          </span>
                        </div>
                      </div>

                      {/* Services */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        {mechanic.services.slice(0, 3).map((service, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 h-5"
                          >
                            {service}
                          </Badge>
                        ))}
                        {mechanic.services.length > 3 && (
                          <span className="text-xs text-gray-500 self-center">
                            +{mechanic.services.length - 3} more
                          </span>
                        )}
                      </div>

                      {/* Address */}
                      <div className="flex items-center gap-1 mb-2">
                        <MapPin className="w-3 h-3 text-gray-500 flex-shrink-0" />
                        <span className="text-xs text-gray-600 truncate">
                          {mechanic.address}
                        </span>
                      </div>

                      {/* Opening Hours and Phone */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gray-500" />
                          <span
                            className={`text-xs font-medium ${
                              mechanic.openingHours.isOpen
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {mechanic.openingHours.today}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-blue-600" />
                            <span className="text-xs text-blue-600 font-medium">
                              {mechanic.phoneNumber}
                            </span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="border-0 bg-white/95 backdrop-blur-sm shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No mechanics found
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Try adjusting your search or filters to find more results
                </p>
                <Button
                  variant="outline"
                  onClick={handleResetFilters}
                  className="border-gray-300 text-gray-700"
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />

      {/* Location Search Modal */}
      {showLocationSearch && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4">
          <div className="w-full max-w-md bg-white rounded-t-3xl shadow-2xl max-h-[85vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Change Location
                  </h2>
                  <p className="text-sm text-gray-500">
                    Find mechanics near you
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLocationSearch(false)}
                className="w-10 h-10 p-0 hover:bg-gray-100 rounded-xl"
              >
                <X className="w-5 h-5 text-gray-600" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(85vh-160px)]">
              {/* Search Input */}
              <div>
                <label className="text-sm font-semibold text-gray-900 mb-3 block">
                  Search for a location
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Enter city, suburb, or postcode..."
                    value={locationSearchQuery}
                    onChange={(e) => setLocationSearchQuery(e.target.value)}
                    className="pl-12 h-12 text-base border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                    autoFocus
                  />
                </div>
              </div>

              {/* Current Location */}
              <div>
                <Button
                  variant="outline"
                  onClick={handleUseCurrentLocation}
                  className="w-full justify-start h-14 px-4 border-2 border-green-200 hover:bg-green-50 rounded-xl"
                >
                  <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center mr-3">
                    <Navigation className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-green-700">
                      Use Current Location
                    </p>
                    <p className="text-sm text-green-600">
                      Auto-detect your location
                    </p>
                  </div>
                </Button>
              </div>

              {/* Popular Locations */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">
                  Popular Locations
                </h3>
                <div className="space-y-2">
                  {[
                    { name: "Melbourne CBD", state: "VIC" },
                    { name: "Sydney CBD", state: "NSW" },
                    { name: "Brisbane CBD", state: "QLD" },
                    { name: "Perth CBD", state: "WA" },
                    { name: "Adelaide CBD", state: "SA" },
                    { name: "Gold Coast", state: "QLD" },
                    { name: "Newcastle", state: "NSW" },
                    { name: "Canberra", state: "ACT" },
                  ]
                    .filter(
                      (location) =>
                        locationSearchQuery === "" ||
                        location.name
                          .toLowerCase()
                          .includes(locationSearchQuery.toLowerCase())
                    )
                    .map((location) => (
                      <Button
                        key={location.name}
                        variant="outline"
                        onClick={() => handleLocationSelect(location.name)}
                        className={`w-full justify-start h-12 px-4 ${
                          currentLocation === location.name
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 hover:bg-gray-50"
                        } rounded-xl`}
                      >
                        <MapPin className="w-4 h-4 mr-3 flex-shrink-0" />
                        <div className="text-left">
                          <span className="font-medium">{location.name}</span>
                          <span className="text-sm text-gray-500 ml-2">
                            {location.state}
                          </span>
                        </div>
                        {currentLocation === location.name && (
                          <div className="ml-auto w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </Button>
                    ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <Button
                variant="outline"
                onClick={() => setShowLocationSearch(false)}
                className="w-full h-12 border-gray-300 text-gray-700 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Safe Area */}
      <div className="h-8" />
    </div>
  );
}
