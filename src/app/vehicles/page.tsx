"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Car,
  Plus,
  ArrowLeft,
  ChevronRight,
  Wrench,
  Shield,
  Heart,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  calculateNextService,
  getStatusColor,
  getStatusDotColor,
} from "@/lib/service-logic";

interface ServiceItem {
  name: string;
  price: number;
  category: "parts" | "labor" | "fees";
  condition?: "new" | "used" | "aftermarket" | "genuine";
  hours?: number;
}

interface ServiceEntry {
  id: string;
  date: string;
  serviceType: string;
  mechanicName: string;
  mechanicAddress: string;
  totalCost: number;
  odometer: number;
  status: "completed" | "in-progress" | "cancelled";
  items: ServiceItem[];
  notes?: string;
  warranty?: string;
}

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  image?: string;
  odometer: number;
  color?: string;
  licensePlate?: string;
  fuelLevel?: number;
  serviceHistory: ServiceEntry[];
}

// Mock vehicle data for after user adds their first vehicle
const mockVehicleData: Vehicle = {
  id: "1",
  make: "Toyota",
  model: "Camry",
  year: 2020,
  odometer: 45000,
  color: "Silver",
  licensePlate: "XYZ 123",
  fuelLevel: 75,
  serviceHistory: [
    {
      id: "service-1",
      date: "2024-01-15",
      serviceType: "Full Logbook Service",
      mechanicName: "AutoCare Plus",
      mechanicAddress: "123 Collins Street, Melbourne",
      totalCost: 327.8,
      odometer: 35000,
      status: "completed",
      warranty: "12 months / 20,000km",
      items: [
        {
          name: "Engine Oil (5L) - Castrol GTX",
          price: 45,
          category: "parts",
          condition: "new",
        },
        {
          name: "Oil Filter - Genuine Toyota",
          price: 18,
          category: "parts",
          condition: "genuine",
        },
        {
          name: "Air Filter - K&N Performance",
          price: 25,
          category: "parts",
          condition: "aftermarket",
        },
        {
          name: "Cabin Filter - OEM",
          price: 32,
          category: "parts",
          condition: "genuine",
        },
        {
          name: "Brake Fluid - DOT 4",
          price: 22,
          category: "parts",
          condition: "new",
        },
        {
          name: "Full Service Labor",
          price: 140,
          category: "labor",
          hours: 2.5,
        },
        { name: "Oil Disposal Fee", price: 5, category: "fees" },
      ],
      notes:
        "All systems checked and functioning normally. Recommended tire rotation at next service.",
    },
  ],
};

export default function MyVehicles() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check if user just added a vehicle
  const vehicleAdded = searchParams.get("vehicleAdded") === "true";

  // Start with empty vehicles, but show populated if user added vehicle
  const [vehicles] = useState<Vehicle[]>(vehicleAdded ? [mockVehicleData] : []);

  const handleVehicleClick = (vehicleId: string) => {
    router.push(`/vehicles/${vehicleId}`);
  };

  const handleAddVehicle = () => {
    // For demo purposes, simulate login state based on whether vehicle was added
    // In a real app, you'd check authentication state here
    const isLoggedIn = vehicleAdded; // Simulate being logged in after completing the flow

    if (!isLoggedIn) {
      // Redirect to login with return path to add vehicle
      router.push("/login?returnTo=/vehicles/add");
    } else {
      router.push("/vehicles/add");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
      {/* Status Bar Space */}
      <div className="h-11" />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="h-10 w-10 p-0 bg-white/15 hover:bg-white/25 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
            <Car className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">My Vehicles</h1>
          </div>
        </div>
        <div className="w-10" /> {/* Spacer for center alignment */}
      </div>

      {/* Content */}
      <div className="px-4 pb-6">
        {/* Success message for newly added vehicle */}
        {vehicleAdded && vehicles.length > 0 && (
          <Card className="mb-6 bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <Car className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-800">
                    Vehicle Added Successfully!
                  </h3>
                  <p className="text-sm text-green-600">
                    Your {mockVehicleData.year} {mockVehicleData.make}{" "}
                    {mockVehicleData.model} is now in your garage.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {vehicles.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <Card className="w-full max-w-sm border-0 bg-white shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="mb-6">
                  <div className="w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Car className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-blue-600 font-medium">
                      Safe & Secure
                    </span>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Welcome to Auto Serve!
                </h2>
                <p className="text-gray-600 mb-6 text-base leading-relaxed">
                  Keep your family&apos;s vehicles running smoothly with trusted
                  mechanics and transparent service records.
                </p>

                <Button
                  onClick={handleAddVehicle}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-semibold rounded-xl shadow-md"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Your First Vehicle
                </Button>

                <div className="mt-6 flex items-center justify-center gap-6 text-sm">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-500">Track Services</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-500">Find Mechanics</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-500">Service History</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-3">
            {vehicles.map((vehicle) => (
              <Card
                key={vehicle.id}
                className="cursor-pointer hover:shadow-md active:scale-98 transition-all duration-200 border-0 bg-white shadow-sm"
                onClick={() => handleVehicleClick(vehicle.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Vehicle Avatar */}
                    <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center">
                      <Car className="w-7 h-7 text-white" />
                    </div>

                    {/* Vehicle Info */}
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg mb-1">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </h3>

                      <p className="text-gray-600 mb-2 text-sm">
                        {vehicle.licensePlate} • {vehicle.color} •{" "}
                        {vehicle.odometer?.toLocaleString()} km
                      </p>

                      {/* Smart Service Status */}
                      {(() => {
                        const serviceStatus = calculateNextService(vehicle);
                        return (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <div
                                className={`w-2 h-2 rounded-full ${getStatusDotColor(
                                  serviceStatus.status
                                )}`}
                              />
                              <Wrench className="w-3 h-3 text-gray-500" />
                            </div>
                            <span
                              className={`text-xs font-medium ${getStatusColor(
                                serviceStatus.status
                              )}`}
                            >
                              {serviceStatus.message}
                            </span>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Chevron */}
                    <ChevronRight className="w-5 h-5 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Mobile FAB - Only show when there are vehicles */}
      {vehicles.length > 0 && (
        <Button
          onClick={handleAddVehicle}
          className="fixed bottom-24 right-4 w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 shadow-lg active:scale-95 transition-all border-2 border-white z-50"
        >
          <Plus className="w-6 h-6 text-white" />
        </Button>
      )}

      {/* Bottom Safe Area for Navigation */}
      <div className="h-24" />
    </div>
  );
}
