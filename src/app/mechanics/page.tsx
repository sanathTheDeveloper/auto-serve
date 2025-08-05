"use client";

import React, { useState } from "react";
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
  Users,
  Award,
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
}

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
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
    services: ["Basic Service", "Full Service", "Brake Service"],
    priceRange: "$80-150",
    availability: "Available Today",
    specialties: ["Family Friendly", "Quick Service"],
    verified: true,
    familyFriendly: true,
  },
  {
    id: "2",
    name: "Melbourne Motor Works",
    rating: 4.6,
    reviewCount: 89,
    distance: "1.2 km",
    address: "456 Flinders Lane, Melbourne",
    services: ["Full Service", "Tire Service", "Engine Repair"],
    priceRange: "$100-200",
    availability: "Tomorrow",
    specialties: ["Premium Service", "Diagnostics"],
    verified: true,
    familyFriendly: true,
  },
  {
    id: "3",
    name: "Quick Fix Automotive",
    rating: 4.4,
    reviewCount: 203,
    distance: "2.1 km",
    address: "789 Bourke Street, Melbourne",
    services: ["Basic Service", "Oil Change", "Brake Service"],
    priceRange: "$60-120",
    availability: "Available Today",
    specialties: ["Fast Service", "Budget Friendly"],
    verified: true,
    familyFriendly: true,
  },
];

export default function Mechanics() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showVehicleSelector, setShowVehicleSelector] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("Melbourne CBD");
  const [mechanics] = useState<Mechanic[]>(mockMechanics);

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

  const getAvailabilityColor = (availability: string) => {
    return availability === "Available Today"
      ? "text-green-600"
      : "text-orange-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
      {/* Status Bar Space */}
      <div className="h-11" />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
            <Search className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">
              Find Trusted Mechanics
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      {/* Vehicle Selection */}
      <div className="px-4 mb-4">
        <Card className="border-0 bg-white/95 backdrop-blur-sm shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Car className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    Service Vehicle
                  </h3>
                  <p className="text-gray-600 text-xs">
                    {selectedVehicle
                      ? `${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}`
                      : "Select your vehicle"}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowVehicleSelector(!showVehicleSelector)}
                className="text-blue-600 hover:text-blue-700"
              >
                {selectedVehicle ? "Change" : "Select"}
              </Button>
            </div>

            {/* Vehicle Selector Dropdown */}
            {showVehicleSelector && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h4 className="font-medium text-gray-900 text-sm mb-3">
                  Your Vehicles
                </h4>
                <div className="space-y-2">
                  {mockVehicles.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      onClick={() => handleVehicleSelect(vehicle)}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                          <Car className="w-4 h-4 text-white" />
                        </div>
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

      {/* Location and Search */}
      <div className="px-4 mb-4">
        <Card className="border-0 bg-white/95 backdrop-blur-sm shadow-lg">
          <CardContent className="p-4">
            {/* Current Location */}
            <div className="flex items-center gap-3 mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 text-sm">
                  Current Location
                </p>
                <p className="text-gray-600 text-sm">{currentLocation}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:text-blue-700"
              >
                <Navigation className="w-4 h-4" />
              </Button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search for services, mechanics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 focus:border-blue-500"
              />
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
              <div className="flex flex-col items-center gap-1">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Shield className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs text-gray-600">Verified</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <Users className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs text-gray-600">Family Safe</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Award className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs text-gray-600">Top Rated</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mechanics List */}
      <div className="px-4 pb-24">
        <div className="space-y-3">
          {mechanics.map((mechanic) => (
            <Card
              key={mechanic.id}
              className="cursor-pointer hover:shadow-lg active:scale-98 transition-all duration-200 border-0 bg-white/95 backdrop-blur-sm shadow-md"
              onClick={() => handleMechanicClick(mechanic.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Mechanic Avatar */}
                  <div className="relative">
                    <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Car className="w-7 h-7 text-white" />
                    </div>
                    {mechanic.verified && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <Shield className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Mechanic Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">
                          {mechanic.name}
                        </h3>
                        {mechanic.familyFriendly && (
                          <div className="flex items-center gap-1 mt-1">
                            <Heart className="w-3 h-3 text-pink-500" />
                            <span className="text-xs text-pink-600 font-medium">
                              Family Friendly
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center ml-2">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="font-semibold text-sm text-gray-900">
                          {mechanic.rating}
                        </span>
                        <span className="text-xs text-gray-400 ml-1">
                          ({mechanic.reviewCount})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center mb-2">
                      <MapPin className="w-4 h-4 text-gray-500 mr-1" />
                      <span className="text-sm text-gray-600 mr-4">
                        {mechanic.distance}
                      </span>

                      <Clock className="w-4 h-4 text-gray-500 mr-1" />
                      <span
                        className={`text-sm font-semibold ${getAvailabilityColor(
                          mechanic.availability
                        )}`}
                      >
                        {mechanic.availability}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 mb-3 line-clamp-1">
                      {mechanic.address}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {mechanic.specialties
                          .slice(0, 2)
                          .map((specialty, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="bg-blue-50 text-blue-600 text-xs px-2 py-1 h-5"
                            >
                              {specialty}
                            </Badge>
                          ))}
                      </div>

                      <span className="text-sm font-bold text-green-600">
                        {mechanic.priceRange}
                      </span>
                    </div>
                  </div>

                  {/* Chevron */}
                  <ChevronRight className="w-5 h-5 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom Safe Area */}
      <div className="h-8" />
    </div>
  );
}
