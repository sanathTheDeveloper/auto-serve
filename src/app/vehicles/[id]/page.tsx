"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Edit,
  Check,
  X,
  Car,
  Wrench,
  Fuel,
  Gauge,
  FileText,
  Calendar,
  MapPin,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { calculateNextService, getStatusBadgeColor, getStatusColor } from "@/lib/service-logic";

interface ServiceItem {
  name: string;
  price: number;
  category: "parts" | "labor" | "fees";
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
  odometer: number;
  color?: string;
  licensePlate?: string;
  fuelLevel?: number;
  serviceHistory: ServiceEntry[];
}

const mockVehicles: Record<string, Vehicle> = {
  "1": {
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
          { name: "Engine Oil (5L)", price: 45, category: "parts" },
          { name: "Oil Filter", price: 18, category: "parts" },
          { name: "Air Filter", price: 25, category: "parts" },
          { name: "Full Service Labor", price: 140, category: "labor" },
          { name: "Oil Disposal Fee", price: 5, category: "fees" },
        ],
        notes: "All systems checked and functioning normally."
      }
    ]
  },
  "2": {
    id: "2",
    make: "Honda",
    model: "Civic",
    year: 2019,
    odometer: 32000,
    color: "Blue",
    licensePlate: "ABC 456",
    fuelLevel: 40,
    serviceHistory: [
      {
        id: "service-2",
        date: "2024-07-22",
        serviceType: "Basic Service",
        mechanicName: "Melbourne Motor Works",
        mechanicAddress: "456 Flinders Lane, Melbourne",
        totalCost: 185.5,
        odometer: 30000,
        status: "completed",
        warranty: "6 months / 10,000km",
        items: [
          { name: "Engine Oil (5L)", price: 45, category: "parts" },
          { name: "Oil Filter", price: 18, category: "parts" },
          { name: "Basic Service Labor", price: 85, category: "labor" },
          { name: "Shop Supplies", price: 8, category: "fees" },
        ],
        notes: "Routine maintenance completed. Vehicle in excellent condition."
      }
    ]
  },
  "3": {
    id: "3",
    make: "Ford",
    model: "F-150",
    year: 2021,
    odometer: 28000,
    color: "Black",
    licensePlate: "DEF 789",
    fuelLevel: 90,
    serviceHistory: [
      {
        id: "service-3",
        date: "2023-12-10",
        serviceType: "Major Service",
        mechanicName: "Quick Fix Automotive",
        mechanicAddress: "789 Bourke Street, Melbourne",
        totalCost: 450.0,
        odometer: 18000,
        status: "completed",
        warranty: "12 months / 20,000km",
        items: [
          { name: "Engine Oil (6L)", price: 60, category: "parts" },
          { name: "Oil Filter", price: 22, category: "parts" },
          { name: "Air Filter", price: 35, category: "parts" },
          { name: "Brake Fluid", price: 25, category: "parts" },
          { name: "Major Service Labor", price: 180, category: "labor" },
          { name: "Diagnostic Check", price: 45, category: "labor" },
          { name: "Disposal Fees", price: 15, category: "fees" },
        ],
        notes: "Comprehensive service completed. All fluids replaced and systems inspected."
      }
    ]
  },
};

export default function VehicleDetail() {
  const router = useRouter();
  const params = useParams();
  const vehicleId = params.id as string;

  const [vehicle, setVehicle] = useState<Vehicle | null>(
    mockVehicles[vehicleId] || null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Vehicle | null>(null);

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Vehicle not found
            </h2>
            <Button onClick={() => router.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleEdit = () => {
    setEditForm({ ...vehicle });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editForm) {
      setVehicle(editForm);
      setIsEditing(false);
      setEditForm(null);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm(null);
  };

  const handleInputChange = (field: keyof Vehicle, value: string | number) => {
    if (editForm) {
      setEditForm((prev) => ({
        ...prev!,
        [field]: value,
      }));
    }
  };

  const getFuelLevelColor = (level: number) => {
    if (level >= 70) return "text-green-600";
    if (level >= 30) return "text-yellow-600";
    return "text-red-600";
  };

  const getFuelLevelBg = (level: number) => {
    if (level >= 70) return "bg-green-500";
    if (level >= 30) return "bg-yellow-500";
    return "bg-red-500";
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
          <h1 className="text-xl font-bold text-white">Vehicle Details</h1>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={isEditing ? handleSave : handleEdit}
          className="w-10 h-10 bg-white/20 text-white hover:bg-white/30 rounded-lg"
        >
          {isEditing ? (
            <Check className="w-5 h-5" />
          ) : (
            <Edit className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Content */}
      <div className="px-4 pb-24">
        {/* Vehicle Info Card */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Car className="w-10 h-10 text-white" />
              </div>

              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Make"
                        value={editForm?.make || ""}
                        onChange={(e) =>
                          handleInputChange("make", e.target.value)
                        }
                      />
                      <Input
                        placeholder="Model"
                        value={editForm?.model || ""}
                        onChange={(e) =>
                          handleInputChange("model", e.target.value)
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        placeholder="Year"
                        value={editForm?.year || ""}
                        onChange={(e) =>
                          handleInputChange("year", parseInt(e.target.value))
                        }
                      />
                      <Input
                        placeholder="Color"
                        value={editForm?.color || ""}
                        onChange={(e) =>
                          handleInputChange("color", e.target.value)
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {vehicle.color && (
                        <Badge
                          variant="secondary"
                          className="bg-gray-100 text-gray-700"
                        >
                          {vehicle.color}
                        </Badge>
                      )}
                      {vehicle.licensePlate && (
                        <Badge
                          variant="secondary"
                          className="bg-blue-50 text-blue-600"
                        >
                          {vehicle.licensePlate}
                        </Badge>
                      )}
                    </div>
                  </>
                )}
              </div>

              {isEditing && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCancel}
                  className="w-8 h-8 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {isEditing && (
              <div className="space-y-3 border-t pt-4">
                <Input
                  placeholder="License Plate"
                  value={editForm?.licensePlate || ""}
                  onChange={(e) =>
                    handleInputChange("licensePlate", e.target.value)
                  }
                />
                <Input
                  type="number"
                  placeholder="Odometer"
                  value={editForm?.odometer || ""}
                  onChange={(e) =>
                    handleInputChange("odometer", parseInt(e.target.value))
                  }
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Gauge className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {vehicle.odometer.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">Kilometers</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Fuel
                  className={`w-8 h-8 ${getFuelLevelColor(
                    vehicle.fuelLevel || 50
                  )}`}
                />
              </div>
              <div
                className={`text-2xl font-bold ${getFuelLevelColor(
                  vehicle.fuelLevel || 50
                )}`}
              >
                {vehicle.fuelLevel || 50}%
              </div>
              <div className="text-sm text-gray-500">Fuel Level</div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getFuelLevelBg(
                    vehicle.fuelLevel || 50
                  )}`}
                  style={{ width: `${vehicle.fuelLevel || 50}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Smart Next Service Card */}
        {(() => {
          const serviceStatus = calculateNextService(vehicle);
          const statusIconColor = 
            serviceStatus.status === 'Overdue' ? 'bg-red-100 text-red-600' :
            serviceStatus.status === 'Due Soon' ? 'bg-yellow-100 text-yellow-600' :
            'bg-green-100 text-green-600';
          
          return (
            <Card className="mb-6">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${statusIconColor}`}>
                    <TrendingUp className="w-6 h-6" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-gray-900">
                        Next Service
                      </h3>
                      <Badge
                        variant="secondary"
                        className={getStatusBadgeColor(serviceStatus.status)}
                      >
                        {serviceStatus.status}
                      </Badge>
                    </div>

                    <p className={`text-sm mb-3 font-medium ${getStatusColor(serviceStatus.status)}`}>
                      {serviceStatus.message}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Service Progress</span>
                        <span>{Math.round(serviceStatus.progressPercentage)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            serviceStatus.status === 'Overdue' ? 'bg-red-500' :
                            serviceStatus.status === 'Due Soon' ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(serviceStatus.progressPercentage, 100)}%` }}
                        />
                      </div>
                    </div>

                    <Button
                      onClick={() => router.push("/mechanics")}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Service
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })()}

        {/* Action Buttons */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-5">
              <Button
                onClick={() => router.push(`/vehicles/${vehicleId}/logbook`)}
                className="w-full h-14 bg-green-600 hover:bg-green-700 text-white font-semibold text-base"
              >
                <FileText className="w-5 h-5 mr-3" />
                View Service Logbook
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <Button
                onClick={() => router.push("/mechanics")}
                variant="outline"
                className="w-full h-14 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold text-base"
              >
                <Wrench className="w-5 h-5 mr-3" />
                Find Nearby Mechanics
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <Button
                variant="outline"
                className="w-full h-14 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold text-base"
              >
                <MapPin className="w-5 h-5 mr-3" />
                Locate My Vehicle
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
