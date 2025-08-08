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
  X,
  Upload,
  Camera,
  DollarSign,
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
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [addServiceMode, setAddServiceMode] = useState<'manual' | 'upload' | null>(null);

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
      <div className="px-4 pb-28 max-w-4xl mx-auto">
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

                <div className="grid grid-cols-3 gap-4 sm:gap-6">
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-blue-600">
                      {vehicle.serviceHistory.length}
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide leading-tight">
                      Services
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-green-600">
                      ${totalSpent.toFixed(0)}
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide leading-tight">
                      Total Spent
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-purple-600">
                      {vehicle.serviceHistory[0]?.odometer.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide leading-tight">
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
              <h3 className="text-xl font-bold text-slate-900">Service History</h3>
            </div>
            <Button
              onClick={() => setShowAddServiceModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Service
            </Button>
          </div>
          
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
            <div className="space-y-4">
              {vehicle.serviceHistory.map((service) => (
                <Card key={service.id} className="card-elevated overflow-hidden">
                  <CardContent className="p-0">
                    {/* Service Summary */}
                    <div
                      className="cursor-pointer p-5"
                      onClick={() => toggleServiceExpansion(service.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 tile-brand rounded-xl flex items-center justify-center text-white flex-shrink-0">
                          <Wrench className="w-6 h-6" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-lg font-bold text-gray-900 truncate pr-2">
                              {service.serviceType}
                            </h4>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Badge
                                variant="secondary"
                                className={`text-xs px-2.5 py-1 rounded-full ${getStatusColor(
                                  service.status
                                )}`}
                              >
                                {getStatusIcon(service.status)}
                                <span className="ml-1.5 capitalize font-medium">
                                  {service.status}
                                </span>
                              </Badge>
                            </div>
                          </div>

                          <div className="space-y-2 mb-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="font-medium">
                                {formatDate(service.date)}
                              </span>
                              <span className="text-gray-400">•</span>
                              <span>{service.odometer.toLocaleString()} km</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <div className="min-w-0">
                                <div className="font-medium truncate">
                                  {service.mechanicName}
                                </div>
                                <div className="text-xs text-gray-500 truncate">
                                  {service.mechanicAddress}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-baseline gap-1">
                              <span className="text-sm font-medium text-gray-500">$</span>
                              <span className="text-3xl font-bold text-green-600 tracking-tight">
                                {Math.floor(service.totalCost)}
                              </span>
                              {service.totalCost !== Math.floor(service.totalCost) && (
                                <span className="text-xl font-bold text-green-600">
                                  .{(service.totalCost % 1).toFixed(2).slice(2)}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center">
                              {expandedService === service.id ? (
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Service Details */}
                    {expandedService === service.id && (
                      <div className="border-t bg-slate-50/70 p-6">
                        <div className="flex items-center gap-2 mb-5">
                          <FileText className="w-5 h-5 text-slate-600" />
                          <h5 className="font-bold text-slate-900 text-lg">
                            Invoice Details
                          </h5>
                        </div>

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
                            <div className="space-y-6">
                              {/* Parts */}
                              {partItems.length > 0 && (
                                <div className="bg-white rounded-lg border border-slate-200 p-4">
                                  <h6 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    Parts Supplied
                                  </h6>
                                  <div className="space-y-3">
                                    {partItems.map((item, index) => (
                                      <div key={index} className="group">
                                        <div className="flex justify-between items-start">
                                          <div className="flex-1">
                                            <div className="font-medium text-slate-700 mb-1">
                                              {item.name}
                                            </div>
                                            {item.condition && (
                                              <div className="flex">
                                                <span
                                                  className={`inline-flex items-center px-2 py-1 text-xs rounded-md font-medium ${
                                                    item.condition === "new"
                                                      ? "bg-emerald-100 text-emerald-700"
                                                      : item.condition === "genuine"
                                                      ? "bg-blue-100 text-blue-700"
                                                      : item.condition === "aftermarket"
                                                      ? "bg-amber-100 text-amber-700"
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
                                          <div className="text-right ml-4">
                                            <span className="font-bold text-slate-900">
                                              ${item.price.toFixed(2)}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="border-t border-slate-200 pt-3 mt-4">
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium text-slate-600">Parts Subtotal</span>
                                      <span className="font-bold text-slate-900">
                                        ${totals.partsTotal.toFixed(2)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Labor */}
                              {laborItems.length > 0 && (
                                <div className="bg-white rounded-lg border border-slate-200 p-4">
                                  <h6 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    Work Undertaken
                                  </h6>
                                  <div className="space-y-3">
                                    {laborItems.map((item, index) => (
                                      <div key={index} className="group">
                                        <div className="flex justify-between items-start">
                                          <div className="flex-1">
                                            <div className="font-medium text-slate-700 mb-1">
                                              {item.name}
                                            </div>
                                            {item.hours && (
                                              <div className="text-sm text-slate-500">
                                                {item.hours} hour{item.hours !== 1 ? "s" : ""} @ $
                                                {(item.price / item.hours).toFixed(0)}/hr
                                              </div>
                                            )}
                                          </div>
                                          <div className="text-right ml-4">
                                            <span className="font-bold text-slate-900">
                                              ${item.price.toFixed(2)}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="border-t border-slate-200 pt-3 mt-4">
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium text-slate-600">Labor Subtotal</span>
                                      <span className="font-bold text-slate-900">
                                        ${totals.laborTotal.toFixed(2)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Fees */}
                              {feeItems.length > 0 && (
                                <div className="bg-white rounded-lg border border-slate-200 p-4">
                                  <h6 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                    Additional Fees
                                  </h6>
                                  <div className="space-y-3">
                                    {feeItems.map((item, index) => (
                                      <div key={index} className="group">
                                        <div className="flex justify-between items-center">
                                          <div className="font-medium text-slate-700">
                                            {item.name}
                                          </div>
                                          <div className="text-right ml-4">
                                            <span className="font-bold text-slate-900">
                                              ${item.price.toFixed(2)}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="border-t border-slate-200 pt-3 mt-4">
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium text-slate-600">Fees Subtotal</span>
                                      <span className="font-bold text-slate-900">
                                        ${totals.feesTotal.toFixed(2)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Totals */}
                              <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200 p-5">
                                <div className="space-y-3">
                                  <div className="flex justify-between items-center text-slate-600">
                                    <span className="font-medium">Subtotal</span>
                                    <span className="font-semibold">${totals.subtotal.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between items-center text-slate-600">
                                    <span className="font-medium">GST (10%)</span>
                                    <span className="font-semibold">${totals.gst.toFixed(2)}</span>
                                  </div>
                                  <div className="border-t border-slate-300 pt-3">
                                    <div className="flex justify-between items-center">
                                      <span className="text-xl font-bold text-slate-900">Total</span>
                                      <span className="text-2xl font-bold text-green-600">
                                        ${totals.total.toFixed(2)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Notes */}
                              {(service.notes || service.warranty) && (
                                <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <FileText className="w-4 h-4 text-blue-600" />
                                    <h6 className="font-bold text-blue-800">Service Notes</h6>
                                  </div>
                                  <div className="space-y-2">
                                    {service.notes && (
                                      <p className="text-sm text-blue-700 leading-relaxed">
                                        {service.notes}
                                      </p>
                                    )}
                                    {service.warranty && (
                                      <div className="flex items-center gap-2 text-sm text-blue-700">
                                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0"></div>
                                        <span className="font-medium">Warranty Coverage:</span>
                                        <span>{service.warranty}</span>
                                      </div>
                                    )}
                                  </div>
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
                                className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg"
                              >
                                <Download className="w-5 h-5 mr-2" />
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

      {/* Add Service Modal */}
      {showAddServiceModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 pb-28">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden my-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 tile-brand rounded-xl flex items-center justify-center text-white">
                  <Plus className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Add Service Record</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowAddServiceModal(false);
                  setAddServiceMode(null);
                }}
                className="w-10 h-10 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {!addServiceMode ? (
                /* Mode Selection */
                <div className="space-y-4">
                  <p className="text-gray-600 mb-6">How would you like to add your service record?</p>
                  
                  <div className="grid gap-4">
                    {/* Manual Entry Option */}
                    <Card 
                      className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-200"
                      onClick={() => setAddServiceMode('manual')}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <FileText className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-slate-900 mb-1">Manual Entry</h3>
                            <p className="text-sm text-gray-600">Enter service details manually using a form</p>
                          </div>
                          <ChevronDown className="w-5 h-5 text-gray-400 rotate-[-90deg]" />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Upload Option */}
                    <Card 
                      className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-green-200"
                      onClick={() => setAddServiceMode('upload')}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <Upload className="w-6 h-6 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-slate-900 mb-1">Upload Document</h3>
                            <p className="text-sm text-gray-600">Upload an invoice, receipt, or photo to auto-extract details</p>
                          </div>
                          <ChevronDown className="w-5 h-5 text-gray-400 rotate-[-90deg]" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : addServiceMode === 'manual' ? (
                /* Manual Entry Form */
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAddServiceMode(null)}
                      className="p-1"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <h3 className="font-bold text-slate-900">Enter Service Details</h3>
                  </div>

                  <div className="grid gap-6 max-h-[50vh] overflow-y-auto">
                    {/* Service Type */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Service Type *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Full Service, Oil Change, Brake Service"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Date and Odometer */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Service Date *
                        </label>
                        <input
                          type="date"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Odometer Reading *
                        </label>
                        <input
                          type="number"
                          placeholder="45000"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Mechanic Details */}
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Mechanic/Shop Name *
                        </label>
                        <input
                          type="text"
                          placeholder="AutoCare Plus"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Address
                        </label>
                        <input
                          type="text"
                          placeholder="123 Collins Street, Melbourne"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Cost and Warranty */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Total Cost *
                        </label>
                        <div className="relative">
                          <DollarSign className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                          <input
                            type="number"
                            step="0.01"
                            placeholder="327.80"
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Warranty Period
                        </label>
                        <input
                          type="text"
                          placeholder="12 months / 20,000km"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Service Notes
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Additional details about the service..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowAddServiceModal(false);
                        setAddServiceMode(null);
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        // TODO: Handle form submission
                        alert("Manual entry functionality will be implemented");
                        setShowAddServiceModal(false);
                        setAddServiceMode(null);
                      }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Add Service Record
                    </Button>
                  </div>
                </div>
              ) : (
                /* Upload Form */
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAddServiceMode(null)}
                      className="p-1"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <h3 className="font-bold text-slate-900">Upload Service Document</h3>
                  </div>

                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto">
                        <Upload className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-1">Upload Service Document</h4>
                        <p className="text-sm text-gray-600 mb-4">
                          Drag and drop your service invoice, receipt, or photo here
                        </p>
                        <Button
                          variant="outline"
                          className="bg-white hover:bg-gray-50"
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          Choose File
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Supports: PDF, JPG, PNG, HEIC (Max 10MB)
                      </p>
                    </div>
                  </div>

                  {/* Upload Actions */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowAddServiceModal(false);
                        setAddServiceMode(null);
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        // TODO: Handle file upload
                        alert("Document upload functionality will be implemented");
                        setShowAddServiceModal(false);
                        setAddServiceMode(null);
                      }}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      Analyze & Add Service
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
