"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Car, Gauge, FileText, Calendar } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { calculateNextService } from "@/lib/service-logic";

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

interface Booking {
  id: string;
  vehicle: string;
  service: string;
  date: string;
  time: string;
  price: string;
  status: "upcoming" | "completed" | "pending";
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
        notes: "All systems checked and functioning normally.",
      },
    ],
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
        notes: "Routine maintenance completed. Vehicle in excellent condition.",
      },
    ],
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
        notes:
          "Comprehensive service completed. All fluids replaced and systems inspected.",
      },
    ],
  },
};

export default function VehicleDetail() {
  const router = useRouter();
  const params = useParams();
  const vehicleId = params.id as string;

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  useEffect(() => {
    try {
      const stored =
        typeof window !== "undefined" ? localStorage.getItem("vehicles") : null;
      if (stored) {
        const list = JSON.parse(stored) as Vehicle[];
        const found = Array.isArray(list)
          ? list.find((v) => v.id === vehicleId)
          : null;
        setVehicle(found || mockVehicles[vehicleId] || null);
      } else {
        setVehicle(mockVehicles[vehicleId] || null);
      }
    } catch {
      setVehicle(mockVehicles[vehicleId] || null);
    }
  }, [vehicleId]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Vehicle | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (!vehicle) return;
    const vehicleLabel = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
    try {
      const stored =
        typeof window !== "undefined" ? localStorage.getItem("bookings") : null;
      if (stored) {
        const list = JSON.parse(stored) as Booking[];
        const filtered = Array.isArray(list)
          ? list.filter(
              (b) =>
                b.vehicle === vehicleLabel || b.vehicle?.includes(vehicle.make)
            )
          : [];
        setBookings(
          filtered.length > 0
            ? filtered
            : [
                {
                  id: "b1",
                  vehicle: vehicleLabel,
                  service: "Basic Service",
                  date: "Jan 12",
                  time: "10:00 AM",
                  price: "$120",
                  status: "completed",
                },
              ]
        );
      } else {
        setBookings([
          {
            id: "b1",
            vehicle: vehicleLabel,
            service: "Basic Service",
            date: "Jan 12",
            time: "10:00 AM",
            price: "$120",
            status: "completed",
          },
        ]);
      }
    } catch {
      setBookings([
        {
          id: "b1",
          vehicle: vehicleLabel,
          service: "Basic Service",
          date: "Jan 12",
          time: "10:00 AM",
          price: "$120",
          status: "completed",
        },
      ]);
    }
  }, [vehicle]);

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-app-brand flex items-center justify-center">
        <Card className="card-elevated">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Vehicle not found
            </h2>
            <Button
              className="btn-brand hover:btn-brand-hover text-white"
              onClick={() => router.back()}
            >
              Go Back
            </Button>
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
    <div className="min-h-screen bg-app-brand">
      {/* Status Bar Space */}
      <div className="h-11" />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="w-10 h-10 rounded-lg card-elevated"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <div className="flex items-center gap-3">
          <div className="w-7 h-7 tile-brand rounded-lg flex items-center justify-center">
            <Car className="w-4 h-4" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Vehicle Details</h1>
        </div>

        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="px-4 pb-24">
        <Card className="card-elevated">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 tile-brand rounded-xl flex items-center justify-center shadow">
                <Car className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h2>
              </div>
            </div>

            <div className="mt-2 divide-y divide-gray-200">
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-slate-600">Make</span>
                <span className="font-semibold text-slate-900">
                  {vehicle.make}
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-slate-600">Model</span>
                <span className="font-semibold text-slate-900">
                  {vehicle.model}
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-slate-600">Year</span>
                <span className="font-semibold text-slate-900">
                  {vehicle.year}
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2 text-slate-600">
                  <Gauge className="w-4 h-4 text-slate-400" />
                  <span className="text-sm">Odometer</span>
                </div>
                <span className="font-semibold text-slate-900">
                  {vehicle.odometer.toLocaleString()} km
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Service Due */}
        {(() => {
          const status =
            vehicle &&
            Array.isArray(vehicle.serviceHistory) &&
            vehicle.serviceHistory.length > 0
              ? calculateNextService(vehicle)
              : {
                  status: "Due Soon",
                  message: "No service history yet. Book your first service.",
                  progressPercentage: 0,
                };
          return (
            <Card className="mt-4 card-elevated">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center tile-brand text-white">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-900">
                        Next Service
                      </h3>
                      <span
                        className="text-xs font-semibold px-2 py-1 rounded-full"
                        style={{
                          backgroundColor:
                            status.status === "Overdue"
                              ? "#fee2e2"
                              : status.status === "Due Soon"
                              ? "#fef9c3"
                              : "#dcfce7",
                          color:
                            status.status === "Overdue"
                              ? "#b91c1c"
                              : status.status === "Due Soon"
                              ? "#a16207"
                              : "#166534",
                        }}
                      >
                        {status.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-700">
                      {status.message}
                    </p>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${
                          status.status === "Overdue"
                            ? "bg-red-500"
                            : status.status === "Due Soon"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                        style={{
                          width: `${Math.min(status.progressPercentage, 100)}%`,
                        }}
                      />
                    </div>
                    <div className="mt-3">
                      <Button
                        onClick={() => router.push("/mechanics")}
                        className="w-full btn-brand hover:btn-brand-hover text-white"
                      >
                        Book Service
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })()}

        {/* Quick Action: View Logbook */}
        <Card className="mt-4 card-elevated">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg tile-brand text-white flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Logbook</h3>
                <p className="text-xs text-slate-600">
                  View full service history
                </p>
              </div>
            </div>
            <Button
              onClick={() => router.push(`/vehicles/${vehicleId}/logbook`)}
              className="w-full btn-brand hover:btn-brand-hover text-white"
            >
              Open Logbook
            </Button>
          </CardContent>
        </Card>

        {/* Quick Action: View Bookings */}
        <Card className="mt-4 card-elevated">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg tile-brand text-white flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Bookings</h3>
                <p className="text-xs text-slate-600">
                  See your past and upcoming bookings
                </p>
              </div>
            </div>
            <Button
              onClick={() => router.push(`/bookings`)}
              className="w-full btn-brand hover:btn-brand-hover text-white"
            >
              View Bookings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
