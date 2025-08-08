"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ChevronRight,
  Wrench,
  Shield,
  Car,
  Plus,
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

// Default demo vehicles to ensure list is populated on first visit
const defaultVehicles: Vehicle[] = [
  {
    id: "1",
    make: "Toyota",
    model: "Camry",
    year: 2020,
    odometer: 45000,
    color: "Silver",
    licensePlate: "XYZ 123",
    fuelLevel: 75,
    serviceHistory: mockVehicleData.serviceHistory,
  },
  {
    id: "2",
    make: "Honda",
    model: "Civic",
    year: 2019,
    odometer: 32000,
    color: "Blue",
    licensePlate: "ABC 456",
    fuelLevel: 40,
    serviceHistory: [],
  },
  {
    id: "3",
    make: "Ford",
    model: "F-150",
    year: 2021,
    odometer: 28000,
    color: "Black",
    licensePlate: "DEF 789",
    fuelLevel: 90,
    serviceHistory: [],
  },
];

function MyVehiclesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check if user just added a vehicle
  const vehicleAdded = searchParams.get("vehicleAdded") === "true";

  // Start with empty vehicles; load from localStorage when logged in
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const handleVehicleClick = (vehicleId: string) => {
    router.push(`/vehicles/${vehicleId}`);
  };

  const handleAddVehicle = () => {
    const isLoggedIn =
      typeof window !== "undefined" &&
      localStorage.getItem("isLoggedIn") === "true";

    if (!isLoggedIn) {
      // Redirect to login with return path to add vehicle
      router.push("/login?returnTo=/vehicles/add");
      return;
    }
    router.push("/vehicles/add");
  };

  // Load vehicles from localStorage when logged in or after add flow
  useEffect(() => {
    const isLoggedIn =
      typeof window !== "undefined" &&
      localStorage.getItem("isLoggedIn") === "true";

    if (!isLoggedIn) {
      setVehicles([]);
      return;
    }

    try {
      const stored =
        typeof window !== "undefined" ? localStorage.getItem("vehicles") : null;
      if (stored) {
        const parsed = JSON.parse(stored) as Vehicle[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setVehicles(parsed);
        } else {
          setVehicles(defaultVehicles);
          localStorage.setItem("vehicles", JSON.stringify(defaultVehicles));
        }
      } else {
        setVehicles(defaultVehicles);
        localStorage.setItem("vehicles", JSON.stringify(defaultVehicles));
      }
    } catch {
      setVehicles(defaultVehicles);
      localStorage.setItem("vehicles", JSON.stringify(defaultVehicles));
    }
  }, [vehicleAdded]);

  return (
    <div className="min-h-screen bg-app-brand">
      {/* Status Bar Space */}
      <div className="h-11" />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="h-10 w-10 p-0 rounded-lg card-elevated"
        >
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 tile-brand text-white rounded-lg flex items-center justify-center shadow-sm">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              My Vehicles
            </h1>
          </div>
        </div>
        <div className="w-10" /> {/* Spacer for center alignment */}
      </div>

      {/* Content */}
      <div className="px-4 pb-6">
        {/* Success message for newly added vehicle */}
        {vehicleAdded && vehicles.length > 0 && (
          <Card className="mb-6 border border-emerald-200 bg-emerald-50/70">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-800">
                    Vehicle Added Successfully!
                  </h3>
                  <p className="text-sm text-emerald-700">
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
            <Card className="w-full max-w-sm card-elevated rounded-2xl">
              <CardContent className="p-6 text-center">
                <div className="mb-6">
                  <div className="w-20 h-20 rounded-2xl tile-brand flex items-center justify-center mx-auto mb-4 text-white shadow-md">
                    <Car className="w-10 h-10" />
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-sky-600" />
                    <span className="text-sm text-sky-700 font-medium">
                      Safe & Secure
                    </span>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Welcome to Auto Serve!
                </h2>
                <p className="text-slate-600 mb-6 text-base leading-relaxed">
                  Keep your family&apos;s vehicles running smoothly with trusted
                  mechanics and transparent service records.
                </p>

                <Button
                  onClick={handleAddVehicle}
                  className="w-full btn-brand hover:btn-brand-hover text-white py-3 text-base font-semibold rounded-xl shadow-md"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Your First Vehicle
                </Button>

                <div className="mt-4 text-sm text-slate-600">
                  <span className="mr-1">Have an account?</span>
                  <Button
                    asChild
                    variant="link"
                    className="p-0 h-auto text-blue-700"
                  >
                    <Link
                      href="/login?returnTo=/vehicles/add"
                      aria-label="Log in or Sign up"
                    >
                      Log in / Sign up
                    </Link>
                  </Button>
                </div>

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
                className="cursor-pointer transition-all duration-200 card-elevated rounded-2xl hover:shadow-lg hover:ring-1 hover:ring-blue-100"
                onClick={() => handleVehicleClick(vehicle.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Vehicle Avatar */}
                    <div className="w-16 h-16 rounded-xl tile-brand text-white flex items-center justify-center shadow">
                      <Car className="w-7 h-7" />
                    </div>

                    {/* Vehicle Info */}
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 text-lg mb-1">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </h3>

                      <p className="text-slate-600 mb-2 text-sm">
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
                              <Wrench className="w-3 h-3 text-slate-500" />
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
                    <ChevronRight className="w-5 h-5 text-blue-600" />
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
          className="fixed bottom-24 right-4 w-14 h-14 rounded-full shadow-lg active:scale-95 transition-all border-2 border-white z-50 btn-brand hover:btn-brand-hover text-white"
        >
          <Plus className="w-6 h-6 text-white" />
        </Button>
      )}

      {/* Bottom Safe Area for Navigation */}
      <div className="h-24" />
    </div>
  );
}

export default function MyVehicles() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      }
    >
      <MyVehiclesContent />
    </Suspense>
  );
}
