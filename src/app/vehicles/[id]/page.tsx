"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Car, Gauge, FileText, Calendar, Edit3, Trash2, X, MoreVertical } from "lucide-react";
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [editForm, setEditForm] = useState<Vehicle | null>(null);


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
    setShowEditModal(true);
    setShowActionsMenu(false);
  };

  const handleSave = async () => {
    if (editForm) {
      // Update the current state
      setVehicle(editForm);
      
      // Update localStorage
      try {
        const stored = localStorage.getItem("vehicles");
        if (stored) {
          const vehicles = JSON.parse(stored) as Vehicle[];
          const updatedVehicles = vehicles.map(v => 
            v.id === editForm.id ? editForm : v
          );
          localStorage.setItem("vehicles", JSON.stringify(updatedVehicles));
        }
      } catch (error) {
        console.error("Failed to save vehicle:", error);
      }
      
      setShowEditModal(false);
      setEditForm(null);
    }
  };

  const handleDelete = async () => {
    try {
      // Remove from localStorage
      const stored = localStorage.getItem("vehicles");
      if (stored) {
        const vehicles = JSON.parse(stored) as Vehicle[];
        const updatedVehicles = vehicles.filter(v => v.id !== vehicle.id);
        localStorage.setItem("vehicles", JSON.stringify(updatedVehicles));
      }
      
      setShowDeleteModal(false);
      router.push("/vehicles");
    } catch (error) {
      console.error("Failed to delete vehicle:", error);
    }
  };

  const handleCancel = () => {
    setShowEditModal(false);
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

        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowActionsMenu(!showActionsMenu)}
            className="w-10 h-10 rounded-lg card-elevated"
          >
            <MoreVertical className="w-5 h-5" />
          </Button>
          
          {showActionsMenu && (
            <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              <button
                onClick={handleEdit}
                className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
              >
                <Edit3 className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Edit Vehicle</span>
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(true);
                  setShowActionsMenu(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-gray-700">Delete Vehicle</span>
              </button>
            </div>
          )}
        </div>
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

      {/* Edit Vehicle Modal */}
      {showEditModal && editForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 pb-28">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm max-h-[80vh] overflow-hidden my-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Edit3 className="w-4 h-4 text-blue-600" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Edit Vehicle</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCancel}
                className="w-8 h-8 rounded-lg hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-4">
                {/* Make */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Make *
                  </label>
                  <input
                    type="text"
                    value={editForm.make}
                    onChange={(e) => handleInputChange('make', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Toyota"
                  />
                </div>

                {/* Model */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Model *
                  </label>
                  <input
                    type="text"
                    value={editForm.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Camry"
                  />
                </div>

                {/* Year */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Year *
                  </label>
                  <input
                    type="number"
                    value={editForm.year}
                    onChange={(e) => handleInputChange('year', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="2020"
                  />
                </div>

                {/* Odometer */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Current Odometer (km)
                  </label>
                  <input
                    type="number"
                    value={editForm.odometer}
                    onChange={(e) => handleInputChange('odometer', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="45000"
                  />
                </div>

                {/* License Plate */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    License Plate
                  </label>
                  <input
                    type="text"
                    value={editForm.licensePlate || ''}
                    onChange={(e) => handleInputChange('licensePlate', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="XYZ 123"
                  />
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Color
                  </label>
                  <input
                    type="text"
                    value={editForm.color || ''}
                    onChange={(e) => handleInputChange('color', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Silver"
                  />
                </div>
              </div>

            </div>
            
            {/* Form Actions - Fixed Footer */}
            <div className="flex gap-3 p-4 border-t bg-gray-50">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex-1 text-sm"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 pb-28">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden my-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Delete Vehicle</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowDeleteModal(false)}
                className="w-10 h-10 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Delete {vehicle.year} {vehicle.make} {vehicle.model}?
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  This action cannot be undone. All service history and data for this vehicle will be permanently removed.
                </p>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete Vehicle
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close actions menu */}
      {showActionsMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowActionsMenu(false)}
        />
      )}
    </div>
  );
}
