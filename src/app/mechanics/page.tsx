"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Navigation,
  X,
  SlidersHorizontal,
  Map,
  List,
  Car,
  MapPin,
} from "lucide-react";
import MechanicCard from "@/components/MechanicCard";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Mechanic, Vehicle, Filters } from "@/types/mechanic";

// Dynamically import MapBox to avoid SSR issues
const MapboxMap = dynamic(() => import("@/components/MapboxMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full bg-gray-100 flex items-center justify-center">
      <div className="text-gray-500">Loading map...</div>
    </div>
  ),
});

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
    <div className="min-h-screen bg-app-brand">
      {/* Status Bar Space */}
      <div className="h-11" />

      {/* Header - Simplified */}
      <div className="px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            Find Auto Repair
          </h1>
          <p className="text-slate-700 text-base">
            Trusted automotive services near you
          </p>
        </div>
      </div>

      {/* Vehicle Selection */}
      <div className="px-4 mb-6">
        <Card className="card-elevated">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 tile-brand rounded-xl flex items-center justify-center">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-base font-semibold text-gray-900">
                    {selectedVehicle
                      ? `${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}`
                      : "Select Vehicle"}
                  </span>
                  {selectedVehicle && (
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedVehicle.licensePlate}
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowVehicleSelector(!showVehicleSelector)}
                className="text-blue-700 border-blue-200 hover:bg-blue-50 hover:border-blue-300 font-medium px-4 py-2 rounded-lg"
              >
                {selectedVehicle ? "Change" : "Select"}
              </Button>
            </div>

            {/* Vehicle Selector Dropdown */}
            {showVehicleSelector && (
              <div className="mt-5 pt-5 border-t border-gray-100">
                <div className="space-y-3">
                  {mockVehicles.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      onClick={() => handleVehicleSelect(vehicle)}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-all duration-200 hover:shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Car className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {vehicle.licensePlate}
                          </p>
                        </div>
                      </div>
                      {selectedVehicle?.id === vehicle.id && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
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
      <div className="px-4 mb-6">
        <Card className="card-elevated">
          <CardContent className="p-6">
            {/* Location */}
            <div className="flex items-center justify-between mb-6 p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span className="text-base font-medium text-blue-900">
                  {currentLocation}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLocationSearch(true)}
                className="text-blue-700 hover:text-blue-800 hover:bg-blue-100 px-4 py-2 rounded-lg font-medium"
              >
                Change
              </Button>
            </div>

            {/* Search Box */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search mechanics, services or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 h-14 bg-gray-50 border-gray-200 focus:border-blue-500 focus:bg-white rounded-xl text-base placeholder:text-gray-500"
              />
            </div>

            {/* Search Radius */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-700 flex-shrink-0">
                Search radius:
              </span>
              <div className="flex gap-2 flex-shrink-0">
                {[2, 5, 10, 20].map((radius) => (
                  <Button
                    key={radius}
                    variant={searchRadius === radius ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSearchRadius(radius)}
                    className={`h-7 px-3 text-xs font-medium rounded-md transition-all flex-shrink-0 ${
                      searchRadius === radius
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"
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
        <Card className="card-elevated">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              {/* Map/List Toggle */}
              <div className="flex bg-gray-100 rounded-xl p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={`h-10 px-5 text-sm font-medium rounded-lg transition-all ${
                    viewMode === "list"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <List className="w-4 h-4 mr-2" />
                  List
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("map")}
                  className={`h-10 px-5 text-sm font-medium rounded-lg transition-all ${
                    viewMode === "map"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
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
                className={`h-10 px-5 text-sm font-medium border-gray-200 relative rounded-lg transition-all ${
                  hasActiveFilters
                    ? "border-blue-500 bg-blue-50 text-blue-700 hover:bg-blue-100"
                    : "text-gray-600 hover:bg-gray-50 hover:border-blue-300 hover:text-blue-600"
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
        <div className="px-4 mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-medium text-white/90">
              Active filters:
            </span>
            {filters.serviceTypes.map((service) => (
              <Badge
                key={service}
                variant="secondary"
                className="bg-white/20 text-white border-white/30 px-3 py-1 rounded-lg"
              >
                {service}
              </Badge>
            ))}
            {filters.maxPrice < 500 && (
              <Badge
                variant="secondary"
                className="bg-white/20 text-white border-white/30 px-3 py-1 rounded-lg"
              >
                Under ${filters.maxPrice}
              </Badge>
            )}
            {filters.availability !== "Any" && (
              <Badge
                variant="secondary"
                className="bg-white/20 text-white border-white/30 px-3 py-1 rounded-lg"
              >
                {filters.availability}
              </Badge>
            )}
            {filters.verifiedOnly && (
              <Badge
                variant="secondary"
                className="bg-white/20 text-white border-white/30 px-3 py-1 rounded-lg"
              >
                Verified Only
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="text-white/80 hover:text-white text-sm font-medium hover:bg-white/10 rounded-lg px-3 py-1"
            >
              Clear All
            </Button>
          </div>
        </div>
      )}

      {/* Content Area - Map or List */}
      <div className={viewMode === "map" ? "" : "px-4 pb-24"}>
        {viewMode === "map" ? (
          /* Full Screen Map View */
          <div className="fixed inset-0 z-40">
            <MapboxMap
              mechanics={filteredAndSortedMechanics}
              onMechanicClick={handleMechanicClick}
              currentLocation={currentLocation}
              onToggleView={() => setViewMode("list")}
              onFilterClick={() => setShowFilterModal(true)}
              hasActiveFilters={hasActiveFilters}
            />
          </div>
        ) : null}

        {/* Mechanics List */}
        <div className="space-y-4">
          {filteredAndSortedMechanics.length > 0 ? (
            filteredAndSortedMechanics.map((mechanic) => (
              <MechanicCard
                key={mechanic.id}
                mechanic={mechanic}
                onClick={handleMechanicClick}
                className="card-elevated"
              />
            ))
          ) : (
            <Card className="card-elevated">
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
                <h3 className="font-medium text-gray-900 mb-3 text-sm">
                  Popular Locations
                </h3>
                <div className="space-y-2">
                  {[
                    { name: "Melbourne CBD", state: "VIC" },
                    { name: "Sydney CBD", state: "NSW" },
                  ]
                    .filter(
                      (location) =>
                        locationSearchQuery === "" ||
                        location.name
                          .toLowerCase()
                          .includes(locationSearchQuery.toLowerCase())
                    )
                    .map((location) => (
                      <div
                        key={location.name}
                        onClick={() => handleLocationSelect(location.name)}
                        className={`w-full p-3 rounded-lg cursor-pointer transition-all ${
                          currentLocation === location.name
                            ? "bg-blue-50 border border-blue-200"
                            : "bg-gray-50 hover:bg-gray-100 border border-transparent"
                        }`}
                      >
                        <div className="flex items-center justify-center">
                          <span
                            className={`font-medium text-sm ${
                              currentLocation === location.name
                                ? "text-blue-700"
                                : "text-gray-900"
                            }`}
                          >
                            {location.name}
                          </span>
                          <span
                            className={`text-xs ml-2 ${
                              currentLocation === location.name
                                ? "text-blue-600"
                                : "text-gray-500"
                            }`}
                          >
                            {location.state}
                          </span>
                          {currentLocation === location.name && (
                            <div className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
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
