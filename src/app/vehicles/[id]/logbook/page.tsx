"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Car,
  Calendar,
  MapPin,
  Wrench,
  ChevronDown,
  ChevronUp,
  FileText,
  CheckCircle,
  Clock,
  Download,
  Plus,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";

interface ServiceItem {
  name: string;
  price: number;
  category: "parts" | "labor" | "fees";
  condition?: "new" | "used" | "aftermarket" | "genuine"; // For parts compliance
  hours?: number; // For labor items
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
  licensePlate: string;
  serviceHistory: ServiceEntry[];
}

const mockVehicleData: Record<string, Vehicle> = {
  "1": {
    id: "1",
    make: "Toyota",
    model: "Camry",
    year: 2020,
    licensePlate: "XYZ 123",
    serviceHistory: [
      {
        id: "service-1",
        date: "2024-01-15",
        serviceType: "Full Service",
        mechanicName: "AutoCare Plus",
        mechanicAddress: "123 Collins Street, Melbourne",
        totalCost: 327.8,
        odometer: 45000,
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
          { name: "Shop Supplies", price: 15, category: "fees" },
          {
            name: "Diagnostic Check",
            price: 25,
            category: "labor",
            hours: 0.5,
          },
        ],
        notes:
          "All systems checked and functioning normally. Recommended tire rotation at next service.",
      },
      {
        id: "service-2",
        date: "2023-08-22",
        serviceType: "Brake Service",
        mechanicName: "Melbourne Motor Works",
        mechanicAddress: "456 Flinders Lane, Melbourne",
        totalCost: 385.5,
        odometer: 42500,
        status: "completed",
        warranty: "6 months / 15,000km",
        items: [
          {
            name: "Brake Pads (Front) - Bendix General CT",
            price: 85,
            category: "parts",
            condition: "aftermarket",
          },
          {
            name: "Brake Pads (Rear) - OEM Honda",
            price: 75,
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
            name: "Brake Rotors (Front) - Refurbished",
            price: 120,
            category: "parts",
            condition: "used",
          },
          {
            name: "Brake Service Labor",
            price: 75,
            category: "labor",
            hours: 1.5,
          },
          { name: "Brake Fluid Disposal", price: 8, category: "fees" },
        ],
        notes:
          "Replaced worn brake pads and resurfaced rotors. Brake system tested and working optimally.",
      },
      {
        id: "service-3",
        date: "2023-05-10",
        serviceType: "Basic Service",
        mechanicName: "Quick Fix Automotive",
        mechanicAddress: "789 Bourke Street, Melbourne",
        totalCost: 166.1,
        odometer: 40200,
        status: "completed",
        warranty: "6 months / 10,000km",
        items: [
          {
            name: "Engine Oil (5L) - Valvoline MaxLife",
            price: 45,
            category: "parts",
            condition: "new",
          },
          {
            name: "Oil Filter - Aftermarket Premium",
            price: 18,
            category: "parts",
            condition: "aftermarket",
          },
          {
            name: "Air Filter - Mann Filter",
            price: 25,
            category: "parts",
            condition: "new",
          },
          {
            name: "Basic Service Labor",
            price: 65,
            category: "labor",
            hours: 1.0,
          },
          { name: "Oil Disposal Fee", price: 5, category: "fees" },
          { name: "Shop Supplies", price: 8, category: "fees" },
        ],
        notes: "Routine maintenance completed. Vehicle in good condition.",
      },
      {
        id: "service-4",
        date: "2023-01-18",
        serviceType: "Tire Replacement",
        mechanicName: "AutoCare Plus",
        mechanicAddress: "123 Collins Street, Melbourne",
        totalCost: 560.0,
        odometer: 38000,
        status: "completed",
        warranty: "24 months / 40,000km",
        items: [
          {
            name: "Premium Tires (Set of 4) - Michelin Primacy",
            price: 480,
            category: "parts",
            condition: "new",
          },
          { name: "Wheel Alignment", price: 65, category: "labor", hours: 1.0 },
          { name: "Tire Disposal Fee", price: 15, category: "fees" },
        ],
        notes:
          "Replaced all four tires due to wear. Wheel alignment completed. Tire pressure monitoring system reset.",
      },
    ],
  },
};

export default function ServiceLogbook() {
  const router = useRouter();
  const params = useParams();
  const vehicleId = params.id as string;

  const [expandedService, setExpandedService] = useState<string | null>(null);

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
        if (found) {
          // If added vehicles have no service history, fallback to demo history for id 1
          setVehicle({
            ...found,
            serviceHistory:
              found.serviceHistory && found.serviceHistory.length > 0
                ? found.serviceHistory
                : mockVehicleData["1"].serviceHistory,
          });
        } else {
          setVehicle(mockVehicleData[vehicleId] || mockVehicleData["1"]);
        }
      } else {
        setVehicle(mockVehicleData[vehicleId] || mockVehicleData["1"]);
      }
    } catch {
      setVehicle(mockVehicleData[vehicleId] || mockVehicleData["1"]);
    }
  }, [vehicleId]);

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

  const toggleServiceExpansion = (serviceId: string) => {
    setExpandedService(expandedService === serviceId ? null : serviceId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50 text-green-600 border-green-200";
      case "in-progress":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "cancelled":
        return "bg-red-50 text-red-600 border-red-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "in-progress":
        return <Clock className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const calculateServiceTotals = (items: ServiceItem[]) => {
    const partsTotal = items
      .filter((item) => item.category === "parts")
      .reduce((sum, item) => sum + item.price, 0);
    const laborTotal = items
      .filter((item) => item.category === "labor")
      .reduce((sum, item) => sum + item.price, 0);
    const feesTotal = items
      .filter((item) => item.category === "fees")
      .reduce((sum, item) => sum + item.price, 0);
    const subtotal = partsTotal + laborTotal + feesTotal;
    const gst = subtotal * 0.1;
    return {
      partsTotal,
      laborTotal,
      feesTotal,
      subtotal,
      gst,
      total: subtotal + gst,
    };
  };

  const totalSpent = vehicle.serviceHistory.reduce(
    (sum, service) => sum + service.totalCost,
    0
  );

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
          aria-label="Go back"
          className="w-10 h-10 rounded-lg card-elevated"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 tile-brand rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Service Logbook</h1>
        </div>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Content */}
      <div className="px-4 pb-24">
        {/* Vehicle Info Card */}
        <Card className="mb-6 card-elevated">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 tile-brand rounded-2xl flex items-center justify-center shadow-lg">
                <Car className="w-8 h-8" />
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h2>
                <p className="text-gray-600 mb-2">
                  License Plate: {vehicle.licensePlate}
                </p>

                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {vehicle.serviceHistory.length}
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">
                      Services
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      ${totalSpent.toFixed(0)}
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">
                      Total Spent
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {vehicle.serviceHistory[0]?.odometer.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">
                      Current KM
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service History */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-900">Service History</h3>
          <p className="text-xs text-slate-600 mt-1">
            Your recent services at a glance
          </p>

          {vehicle.serviceHistory.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wrench className="w-8 h-8 text-gray-500" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  Welcome! Your service logbook is empty
                </h4>
                <p className="text-gray-600 mb-4">
                  Once you book a service with Auto Serve, all the details will
                  appear here automatically
                </p>
                <Button
                  onClick={() => router.push("/mechanics")}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Book First Service
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {vehicle.serviceHistory.map((service) => (
                <Card key={service.id} className="card-elevated">
                  <CardContent className="p-4">
                    {/* Service Summary */}
                    <div
                      className="cursor-pointer"
                      onClick={() => toggleServiceExpansion(service.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 tile-brand rounded-lg flex items-center justify-center text-white flex-shrink-0">
                          <Wrench className="w-5 h-5" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="font-semibold text-gray-900 truncate pr-2">
                              {service.serviceType}
                            </h4>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="secondary"
                                className={`text-[11px] px-2 py-0.5 ${getStatusColor(
                                  service.status
                                )}`}
                              >
                                {getStatusIcon(service.status)}
                                <span className="ml-1 capitalize">
                                  {service.status}
                                </span>
                              </Badge>
                              {expandedService === service.id ? (
                                <ChevronUp className="w-4 h-4 text-gray-400" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                          </div>

                          <div className="space-y-1 mb-2">
                            <div className="flex items-center gap-2 text-[11px] text-gray-600">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              <span>
                                {formatDate(service.date)} •{" "}
                                {service.odometer.toLocaleString()} km
                              </span>
                            </div>

                            <div className="flex items-center gap-1 text-[11px] text-gray-600 truncate">
                              <MapPin className="w-4 h-4 text-gray-500" />
                              <span className="truncate">
                                {service.mechanicName} •{" "}
                                {service.mechanicAddress}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-100 gap-2 flex-wrap">
                            <span className="text-lg font-bold text-green-600 leading-none">
                              ${service.totalCost.toFixed(2)}
                            </span>
                            {service.warranty && (
                              <Badge
                                variant="secondary"
                                className="bg-purple-50 text-purple-600 text-[10px] px-1.5 py-0.5 whitespace-normal leading-tight max-w-[60%]"
                              >
                                Warranty: {service.warranty}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Service Details */}
                    {expandedService === service.id && (
                      <div className="border-t bg-gray-50 p-5">
                        <h5 className="font-semibold text-gray-900 mb-4">
                          Itemized Invoice
                        </h5>

                        {(() => {
                          const totals = calculateServiceTotals(service.items);
                          const partItems = service.items.filter(
                            (item) => item.category === "parts"
                          );
                          const laborItems = service.items.filter(
                            (item) => item.category === "labor"
                          );
                          const feeItems = service.items.filter(
                            (item) => item.category === "fees"
                          );

                          return (
                            <div className="space-y-4">
                              {/* Parts */}
                              {partItems.length > 0 && (
                                <div>
                                  <h6 className="font-semibold text-gray-800 mb-2">
                                    Parts Supplied
                                  </h6>
                                  {partItems.map((item, index) => (
                                    <div
                                      key={index}
                                      className="py-2 border-b border-gray-100 last:border-b-0"
                                    >
                                      <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                          <span className="text-gray-600 font-medium">
                                            {item.name}
                                          </span>
                                          {item.condition && (
                                            <div className="mt-1">
                                              <span
                                                className={`inline-block px-2 py-0.5 text-xs rounded-full font-medium ${
                                                  item.condition === "new"
                                                    ? "bg-green-100 text-green-700"
                                                    : item.condition ===
                                                      "genuine"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : item.condition ===
                                                      "aftermarket"
                                                    ? "bg-orange-100 text-orange-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                                }`}
                                              >
                                                {item.condition === "genuine"
                                                  ? "OEM/Genuine"
                                                  : item.condition
                                                      .charAt(0)
                                                      .toUpperCase() +
                                                    item.condition.slice(1)}
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                        <span className="font-semibold text-gray-900 ml-4">
                                          ${item.price.toFixed(2)}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                  <div className="border-t pt-2 mt-2">
                                    <div className="flex justify-between font-semibold">
                                      <span>Parts Subtotal</span>
                                      <span>
                                        ${totals.partsTotal.toFixed(2)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Labor */}
                              {laborItems.length > 0 && (
                                <div>
                                  <h6 className="font-semibold text-gray-800 mb-2">
                                    Work Undertaken
                                  </h6>
                                  {laborItems.map((item, index) => (
                                    <div
                                      key={index}
                                      className="py-2 border-b border-gray-100 last:border-b-0"
                                    >
                                      <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                          <span className="text-gray-600 font-medium">
                                            {item.name}
                                          </span>
                                          {item.hours && (
                                            <div className="mt-1 text-xs text-gray-500">
                                              {item.hours} hour
                                              {item.hours !== 1 ? "s" : ""} @ $
                                              {(
                                                item.price / item.hours
                                              ).toFixed(0)}
                                              /hr
                                            </div>
                                          )}
                                        </div>
                                        <span className="font-semibold text-gray-900 ml-4">
                                          ${item.price.toFixed(2)}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                  <div className="border-t pt-2 mt-2">
                                    <div className="flex justify-between font-semibold">
                                      <span>Labor Subtotal</span>
                                      <span>
                                        ${totals.laborTotal.toFixed(2)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Fees */}
                              {feeItems.length > 0 && (
                                <div>
                                  <h6 className="font-semibold text-gray-800 mb-2">
                                    Additional Fees
                                  </h6>
                                  {feeItems.map((item, index) => (
                                    <div
                                      key={index}
                                      className="py-2 border-b border-gray-100 last:border-b-0"
                                    >
                                      <div className="flex justify-between items-center">
                                        <span className="text-gray-600 font-medium">
                                          {item.name}
                                        </span>
                                        <span className="font-semibold text-gray-900">
                                          ${item.price.toFixed(2)}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                  <div className="border-t pt-2 mt-2">
                                    <div className="flex justify-between font-semibold">
                                      <span>Fees Subtotal</span>
                                      <span>
                                        ${totals.feesTotal.toFixed(2)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Totals */}
                              <div className="border-t pt-3 space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Subtotal
                                  </span>
                                  <span className="font-medium">
                                    ${totals.subtotal}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    GST (10%)
                                  </span>
                                  <span className="font-medium">
                                    ${totals.gst.toFixed(2)}
                                  </span>
                                </div>
                                <div className="border-t pt-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-900">
                                      Total
                                    </span>
                                    <span className="text-xl font-bold text-green-600">
                                      ${totals.total.toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Notes */}
                              {service.notes && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                                  <h6 className="font-semibold text-blue-800 mb-1">
                                    Service Notes
                                  </h6>
                                  <p className="text-sm text-blue-700">
                                    {service.notes}
                                  </p>
                                </div>
                              )}

                              {/* Download Invoice Button */}
                              <Button
                                onClick={() => {
                                  // Simulate downloading invoice
                                  alert(
                                    `Downloading invoice for ${service.serviceType} from ${service.mechanicName}`
                                  );
                                }}
                                className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download Invoice/Receipt
                              </Button>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button - Add Past Service */}
      <div className="fixed bottom-24 right-4 z-50">
        <Button
          aria-label="Add past service"
          onClick={() => {
            // Placeholder for add past service functionality
            alert("Add Past Service feature coming soon!");
          }}
          className="w-14 h-14 rounded-full shadow-lg active:scale-95 transition-all border-2 border-white btn-brand hover:btn-brand-hover text-white"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
