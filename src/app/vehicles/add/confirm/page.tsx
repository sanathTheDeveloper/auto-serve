"use client";

import React, { useEffect, useState, Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Car, Check, X, Shield } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface VehicleData {
  make: string;
  model: string;
  year: string;
  color: string;
  vin: string;
  rego: string;
}

function ConfirmVehicleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    // Get vehicle data from URL params
    const make = searchParams.get("make");
    const model = searchParams.get("model");
    const year = searchParams.get("year");
    const color = searchParams.get("color");
    const vin = searchParams.get("vin");
    const rego = searchParams.get("rego");

    if (make && model && year && color && vin && rego) {
      setVehicleData({ make, model, year, color, vin, rego });
    }
  }, [searchParams]);

  const handleAddToGarage = async () => {
    console.log("Button clicked - adding vehicle to garage");
    setIsAdding(true);

    // Simulate API call to add vehicle
    setTimeout(() => {
      console.log("Navigating to vehicles page");
      // Save simple vehicle array in localStorage for demo purposes
      try {
        const existing =
          typeof window !== "undefined"
            ? localStorage.getItem("vehicles")
            : null;
        const vehicles = existing ? JSON.parse(existing) : [];
        const newVehicle = {
          id: `${Date.now()}`,
          make: vehicleData?.make,
          model: vehicleData?.model,
          year: parseInt(vehicleData?.year || "0", 10),
          color: vehicleData?.color,
          licensePlate: vehicleData?.rego,
          odometer: 0,
          serviceHistory: [],
        };
        const updated = Array.isArray(vehicles)
          ? [...vehicles, newVehicle]
          : [newVehicle];
        if (typeof window !== "undefined") {
          localStorage.setItem("vehicles", JSON.stringify(updated));
        }
      } catch (_e) {
        // ignore demo storage errors
      }
      // Navigate to vehicles page to show the newly added vehicle
      router.push("/vehicles?vehicleAdded=true");
    }, 1000);
  };

  const handleGoBack = () => {
    router.back();
  };

  const maskVin = (vin: string) => {
    if (vin.length <= 6) return vin;
    return "••••••••" + vin.slice(-6);
  };

  if (!vehicleData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Loading vehicle details...
            </h2>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app-brand">
      {/* Status Bar Space */}
      <div className="h-11" />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleGoBack}
          className="w-10 h-10 rounded-lg border border-slate-200 bg-white/70 hover:bg-white shadow-sm"
          disabled={isAdding}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 tile-brand rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Is this your vehicle?
          </h1>
        </div>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Content */}
      <div className="px-4 pb-8">
        {/* Vehicle Details Card */}
        <Card className="mb-6 card-elevated">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 tile-brand rounded-2xl flex items-center justify-center shadow-lg">
                <Car className="w-10 h-10" />
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {vehicleData.year} {vehicleData.make} {vehicleData.model}
                </h2>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-gray-100 text-gray-700"
                  >
                    {vehicleData.color}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-blue-50 text-blue-600"
                  >
                    {vehicleData.rego}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="space-y-4 border-t pt-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Make</span>
                <span className="text-gray-900 font-semibold">
                  {vehicleData.make}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Model</span>
                <span className="text-gray-900 font-semibold">
                  {vehicleData.model}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Year</span>
                <span className="text-gray-900 font-semibold">
                  {vehicleData.year}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Color</span>
                <span className="text-gray-900 font-semibold">
                  {vehicleData.color}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">VIN</span>
                <span className="text-gray-900 font-mono text-sm">
                  {maskVin(vehicleData.vin)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">
                  Privacy Protected
                </h3>
                <p className="text-sm text-blue-700">
                  Your VIN is partially masked for security. We only use this
                  information to provide accurate service records and
                  maintenance reminders.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4 relative" style={{ zIndex: 1000 }}>
          <Button
            onClick={handleAddToGarage}
            disabled={isAdding}
            className={`w-full py-4 text-lg font-bold rounded-xl transition-all z-50 relative border-2 border-white cursor-pointer ${
              !isAdding
                ? "bg-green-600 hover:bg-green-700 text-white shadow-xl active:scale-95"
                : "bg-green-600/70 text-white cursor-not-allowed"
            }`}
          >
            {isAdding ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Adding to Your Garage...
              </div>
            ) : (
              <>
                <Check className="w-6 h-6 mr-3" />
                Yes, Add to My Garage
              </>
            )}
          </Button>

          <Button
            onClick={handleGoBack}
            disabled={isAdding}
            variant="outline"
            className="w-full py-4 text-lg font-semibold rounded-xl border-2 border-white text-white hover:bg-white/20 transition-all bg-white/10"
          >
            <X className="w-5 h-5 mr-2" />
            No, that&apos;s not it
          </Button>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-white/70 text-sm">
            Don&apos;t see your vehicle? Try entering your registration number
            again or add details manually.
          </p>
        </div>
      </div>

      {/* Bottom Safe Area for Navigation */}
      <div className="h-32" />
    </div>
  );
}

export default function ConfirmVehicle() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      }
    >
      <ConfirmVehicleContent />
    </Suspense>
  );
}
