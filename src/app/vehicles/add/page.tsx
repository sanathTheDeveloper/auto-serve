"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Car, Check } from "lucide-react";
import { useRouter } from "next/navigation";

interface NewVehicle {
  make: string;
  model: string;
  year: string;
  odometer: string;
  color: string;
  licensePlate: string;
}

export default function AddVehicle() {
  const router = useRouter();
  const [vehicle, setVehicle] = useState<NewVehicle>({
    make: "",
    model: "",
    year: "",
    odometer: "",
    color: "",
    licensePlate: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (field: keyof NewVehicle, value: string) => {
    setVehicle((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!vehicle.make.trim()) {
      newErrors.make = "Make is required";
    }

    if (!vehicle.model.trim()) {
      newErrors.model = "Model is required";
    }

    if (!vehicle.year.trim()) {
      newErrors.year = "Year is required";
    } else {
      const yearNum = parseInt(vehicle.year);
      const currentYear = new Date().getFullYear();
      if (yearNum < 1900 || yearNum > currentYear + 1) {
        newErrors.year = `Year must be between 1900 and ${currentYear + 1}`;
      }
    }

    if (!vehicle.odometer.trim()) {
      newErrors.odometer = "Odometer reading is required";
    } else {
      const odometerNum = parseInt(vehicle.odometer);
      if (odometerNum < 0) {
        newErrors.odometer = "Odometer reading must be positive";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const canSave = () => {
    return (
      vehicle.make.trim() &&
      vehicle.model.trim() &&
      vehicle.year.trim() &&
      vehicle.odometer.trim()
    );
  };

  const handleSave = () => {
    if (validateForm()) {
      console.log("Saving vehicle:", vehicle);
      setShowSuccess(true);

      setTimeout(() => {
        router.push("/vehicles");
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
      {/* Status Bar Space */}
      <div className="h-11" />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="w-10 h-10 bg-white/20 text-white hover:bg-white/30 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
            <Car className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">Add Vehicle</h1>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleSave}
          disabled={!canSave()}
          className={`w-10 h-10 rounded-lg ${
            canSave()
              ? "bg-white/20 text-white hover:bg-white/30"
              : "bg-white/10 text-white/50"
          }`}
        >
          <Check className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="px-4 pb-6">
        {/* Hero Section */}
        <Card className="mb-4">
          <CardContent className="pt-6 text-center">
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Car className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Add Your Vehicle
            </h2>
            <p className="text-muted-foreground max-w-xs mx-auto">
              Enter your vehicle details to start tracking maintenance and
              services
            </p>
          </CardContent>
        </Card>

        {/* Form Section */}
        <Card className="mb-4">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Make *
                </label>
                <Input
                  placeholder="Toyota, Honda, Ford..."
                  value={vehicle.make}
                  onChange={(e) => handleInputChange("make", e.target.value)}
                  className={errors.make ? "border-red-500" : ""}
                />
                {errors.make && (
                  <p className="text-red-500 text-sm mt-1">{errors.make}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Model *
                </label>
                <Input
                  placeholder="Camry, Civic, F-150..."
                  value={vehicle.model}
                  onChange={(e) => handleInputChange("model", e.target.value)}
                  className={errors.model ? "border-red-500" : ""}
                />
                {errors.model && (
                  <p className="text-red-500 text-sm mt-1">{errors.model}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Year *
                </label>
                <Input
                  type="number"
                  placeholder="2020"
                  value={vehicle.year}
                  onChange={(e) => handleInputChange("year", e.target.value)}
                  min={1900}
                  max={new Date().getFullYear() + 1}
                  className={errors.year ? "border-red-500" : ""}
                />
                {errors.year && (
                  <p className="text-red-500 text-sm mt-1">{errors.year}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Current Mileage *
                </label>
                <Input
                  type="number"
                  placeholder="45,000"
                  value={vehicle.odometer}
                  onChange={(e) =>
                    handleInputChange("odometer", e.target.value)
                  }
                  min={0}
                  className={errors.odometer ? "border-red-500" : ""}
                />
                {errors.odometer ? (
                  <p className="text-red-500 text-sm mt-1">{errors.odometer}</p>
                ) : (
                  <p className="text-gray-500 text-sm mt-1">
                    Current odometer reading
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Color (Optional)
                </label>
                <Input
                  placeholder="Silver, Blue, Black..."
                  value={vehicle.color}
                  onChange={(e) => handleInputChange("color", e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  License Plate (Optional)
                </label>
                <Input
                  placeholder="ABC 123"
                  value={vehicle.licensePlate}
                  onChange={(e) =>
                    handleInputChange(
                      "licensePlate",
                      e.target.value.toUpperCase()
                    )
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom CTA */}
        <Button
          onClick={canSave() ? handleSave : undefined}
          disabled={!canSave()}
          className={`w-full py-3 text-lg font-bold rounded-xl transition-all ${
            canSave()
              ? "bg-red-500 hover:bg-red-600 text-white shadow-lg active:scale-95"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Add Vehicle
        </Button>
      </div>

      {/* Success Dialog */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm bg-green-500 text-white border-0">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Vehicle Added!</h3>
              <p className="opacity-90">Redirecting to your vehicles...</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bottom Safe Area for Navigation */}
      <div className="h-24" />
    </div>
  );
}
