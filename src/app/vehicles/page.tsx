"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, Plus, ArrowLeft, ChevronRight, Wrench } from "lucide-react";
import { useRouter } from "next/navigation";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  image?: string;
  odometer?: number;
  color?: string;
  licensePlate?: string;
  nextService?: string;
  fuelLevel?: number;
}

const mockVehicles: Vehicle[] = [
  {
    id: "1",
    make: "Toyota",
    model: "Camry",
    year: 2020,
    odometer: 45000,
    color: "Silver",
    licensePlate: "XYZ 123",
    nextService: "Oil Change Due",
    fuelLevel: 75,
  },
  {
    id: "2",
    make: "Honda",
    model: "Civic",
    year: 2019,
    odometer: 32000,
    color: "Blue",
    licensePlate: "ABC 456",
    nextService: "Inspection Due",
    fuelLevel: 40,
  },
  {
    id: "3",
    make: "Ford",
    model: "F-150",
    year: 2021,
    odometer: 28000,
    color: "Black",
    licensePlate: "DEF 789",
    nextService: "Tire Rotation",
    fuelLevel: 90,
  },
];

export default function MyVehicles() {
  const [vehicles] = useState<Vehicle[]>(mockVehicles);
  const router = useRouter();

  const handleVehicleClick = (vehicleId: string) => {
    router.push(`/vehicles/${vehicleId}`);
  };

  const handleAddVehicle = () => {
    router.push("/vehicles/add");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
      {/* Status Bar Space */}
      <div className="h-11" />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="h-9 w-9 p-0 bg-white/20 hover:bg-white/30 backdrop-blur-sm"
        >
          <ArrowLeft className="w-4 h-4 text-white" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold">My Vehicles</h1>
          </div>
        </div>
        <div className="w-9" /> {/* Spacer for center alignment */}
      </div>

      {/* Content */}
      <div className="px-4 pb-6">
        {vehicles.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-gray-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                No vehicles yet
              </h2>
              <p className="text-muted-foreground">
                Add your first vehicle to start tracking maintenance and
                services
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                {vehicles.map((vehicle) => (
                  <Card
                    key={vehicle.id}
                    className="cursor-pointer active:scale-95 transition-transform"
                    onClick={() => handleVehicleClick(vehicle.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {/* Vehicle Avatar */}
                        <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                          <Car className="w-6 h-6 text-white" />
                        </div>

                        {/* Vehicle Info */}
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 text-lg mb-1">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </h3>

                          <p className="text-sm text-muted-foreground mb-2 font-medium">
                            {vehicle.licensePlate} • {vehicle.color} •{" "}
                            {vehicle.odometer?.toLocaleString()} mi
                          </p>

                          {/* Service Status */}
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  vehicle.nextService?.includes("Due")
                                    ? "bg-red-500"
                                    : "bg-green-500"
                                }`}
                              />
                              <Wrench className="w-4 h-4 text-gray-500" />
                            </div>
                            <span
                              className={`text-xs font-semibold ${
                                vehicle.nextService?.includes("Due")
                                  ? "text-red-600"
                                  : "text-green-600"
                              }`}
                            >
                              {vehicle.nextService}
                            </span>
                          </div>
                        </div>

                        {/* Chevron */}
                        <ChevronRight className="w-5 h-5 text-blue-600 opacity-70" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Mobile FAB */}
      <Button
        onClick={handleAddVehicle}
        className="fixed bottom-24 right-6 w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 shadow-lg active:scale-95 transition-all border-2 border-white z-50"
      >
        <Plus className="w-8 h-8 text-white" />
      </Button>

      {/* Bottom Safe Area for Navigation */}
      <div className="h-24" />
    </div>
  );
}
