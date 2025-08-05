"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Phone,
  Shield,
  Wrench,
  DollarSign,
  CheckCircle,
  X,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";

interface Service {
  id: string;
  name: string;
  description: string;
  priceRange: string;
  estimatedTime: string;
  details: {
    parts: { name: string; price: number }[];
    labor: { description: string; price: number };
    fees: { name: string; price: number }[];
  };
}

interface Mechanic {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  address: string;
  phone: string;
  specialties: string[];
  services: Service[];
}

const mockMechanicData: Record<string, Mechanic> = {
  "1": {
    id: "1",
    name: "AutoCare Plus",
    rating: 4.8,
    reviewCount: 127,
    address: "123 Collins Street, Melbourne VIC 3000",
    phone: "(03) 9123 4567",
    specialties: ["European Cars", "Quick Service"],
    services: [
      {
        id: "basic",
        name: "Basic Service",
        description: "Oil change, filter replacement, and basic safety check",
        priceRange: "$120 - $180",
        estimatedTime: "45-60 minutes",
        details: {
          parts: [
            { name: "Engine Oil (5L)", price: 45 },
            { name: "Oil Filter", price: 18 },
            { name: "Air Filter", price: 25 },
          ],
          labor: { description: "Basic Service Labor", price: 65 },
          fees: [
            { name: "Oil Disposal Fee", price: 5 },
            { name: "Shop Supplies", price: 8 },
          ],
        },
      },
      {
        id: "full",
        name: "Full Service",
        description:
          "Comprehensive inspection, fluids, filters, and detailed safety check",
        priceRange: "$220 - $320",
        estimatedTime: "2-3 hours",
        details: {
          parts: [
            { name: "Engine Oil (5L)", price: 45 },
            { name: "Oil Filter", price: 18 },
            { name: "Air Filter", price: 25 },
            { name: "Cabin Filter", price: 32 },
            { name: "Brake Fluid", price: 22 },
          ],
          labor: { description: "Full Service Labor", price: 140 },
          fees: [
            { name: "Oil Disposal Fee", price: 5 },
            { name: "Shop Supplies", price: 15 },
            { name: "Diagnostic Check", price: 25 },
          ],
        },
      },
      {
        id: "brake",
        name: "Brake Service",
        description:
          "Brake pad replacement, rotor inspection, and brake system check",
        priceRange: "$180 - $380",
        estimatedTime: "1.5-2 hours",
        details: {
          parts: [
            { name: "Brake Pads (Front)", price: 85 },
            { name: "Brake Pads (Rear)", price: 75 },
            { name: "Brake Fluid", price: 22 },
          ],
          labor: { description: "Brake Service Labor", price: 120 },
          fees: [
            { name: "Brake Fluid Disposal", price: 8 },
            { name: "Safety Inspection", price: 15 },
          ],
        },
      },
    ],
  },
};

export default function MechanicDetail() {
  const router = useRouter();
  const params = useParams();
  const mechanicId = params.id as string;

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showQuoteDialog, setShowQuoteDialog] = useState(false);

  const mechanic = mockMechanicData[mechanicId];

  if (!mechanic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Mechanic not found
            </h2>
            <Button onClick={() => router.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setShowQuoteDialog(true);
  };

  const handleBookService = () => {
    // Navigate to bookings page
    router.push("/bookings");
  };

  const calculateTotal = (service: Service) => {
    const partsTotal = service.details.parts.reduce(
      (sum, part) => sum + part.price,
      0
    );
    const laborTotal = service.details.labor.price;
    const feesTotal = service.details.fees.reduce(
      (sum, fee) => sum + fee.price,
      0
    );
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
            <Wrench className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">Book Service</h1>
        </div>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Content */}
      <div className="px-4 pb-24">
        {/* Mechanic Info Card */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Wrench className="w-8 h-8 text-white" />
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {mechanic.name}
                </h2>

                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-900">
                      {mechanic.rating}
                    </span>
                    <span className="text-sm text-gray-600">
                      ({mechanic.reviewCount} reviews)
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{mechanic.address}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{mechanic.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {mechanic.specialties.map((specialty, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-blue-50 text-blue-600"
                >
                  {specialty}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Services Section */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-white mb-4">
            Available Services
          </h3>
          <div className="space-y-4">
            {mechanic.services.map((service) => (
              <Card
                key={service.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-200"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">
                        {service.name}
                      </h4>
                      <p className="text-gray-600 mb-3">
                        {service.description}
                      </p>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="font-semibold text-green-600">
                            {service.priceRange}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {service.estimatedTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleServiceSelect(service)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Get Quote
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Quote Dialog */}
      <Dialog open={showQuoteDialog} onOpenChange={setShowQuoteDialog}>
        <DialogContent className="w-[95vw] max-w-md max-h-[95vh] overflow-y-auto p-0 gap-0 rounded-2xl border-0 shadow-2xl">
          {/* Custom Header with Gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 pb-4 rounded-t-2xl relative">
            <button
              onClick={() => setShowQuoteDialog(false)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors z-10"
            >
              <X className="w-4 h-4 text-white" />
            </button>
            <div className="text-center">
              <h2 className="text-white text-xl font-bold mb-1">
                Your Estimated Quote
              </h2>
              <div className="w-12 h-1 bg-white/30 rounded-full mx-auto"></div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {selectedService && (
              <div className="space-y-5">
                {/* Service Header */}
                <div className="text-center bg-gray-50 rounded-xl p-4">
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    {selectedService.name}
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {selectedService.description}
                  </p>
                </div>

                {(() => {
                  const totals = calculateTotal(selectedService);
                  return (
                    <>
                      {/* Parts Section */}
                      <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                        <h5 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                          Parts
                        </h5>
                        <div className="space-y-3">
                          {selectedService.details.parts.map((part, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg border border-gray-100"
                            >
                              <span className="text-sm text-gray-700 font-medium">
                                {part.name}
                              </span>
                              <span className="text-sm font-bold text-gray-900">
                                ${part.price}
                              </span>
                            </div>
                          ))}
                          <div className="flex justify-between items-center py-2 px-3 bg-blue-50 rounded-lg border border-blue-100">
                            <span className="text-sm font-semibold text-blue-900">
                              Parts Subtotal
                            </span>
                            <span className="text-sm font-bold text-blue-900">
                              ${totals.partsTotal}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Labor Section */}
                      <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                        <h5 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          Labor
                        </h5>
                        <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg border border-gray-100">
                          <span className="text-sm text-gray-700 font-medium">
                            {selectedService.details.labor.description}
                          </span>
                          <span className="text-sm font-bold text-gray-900">
                            ${selectedService.details.labor.price}
                          </span>
                        </div>
                      </div>

                      {/* Fees Section */}
                      <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                        <h5 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                          Miscellaneous Fees
                        </h5>
                        <div className="space-y-2">
                          {selectedService.details.fees.map((fee, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg border border-gray-100"
                            >
                              <span className="text-sm text-gray-700 font-medium">
                                {fee.name}
                              </span>
                              <span className="text-sm font-bold text-gray-900">
                                ${fee.price}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Totals */}
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-100 shadow-sm">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-gray-600 font-medium">
                              Subtotal
                            </span>
                            <span className="text-sm font-bold text-gray-900">
                              ${totals.subtotal.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-gray-600 font-medium">
                              GST (10%)
                            </span>
                            <span className="text-sm font-bold text-gray-900">
                              ${totals.gst.toFixed(2)}
                            </span>
                          </div>
                          <div className="border-t border-gray-300 pt-3">
                            <div className="flex justify-between items-center py-2 px-3 bg-green-500 rounded-lg text-white">
                              <span className="font-bold">
                                Total Estimated Cost
                              </span>
                              <span className="text-xl font-bold">
                                ${totals.total.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Authorization Notice */}
                      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-100 rounded-xl p-4 shadow-sm">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Shield className="w-4 h-4 text-amber-600" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-amber-900 mb-2">
                              Authorization Notice
                            </p>
                            <p className="text-xs text-amber-800 leading-relaxed">
                              I understand the mechanic must call me for
                              approval before starting any work not included in
                              this estimate.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3 pt-2">
                        <Button
                          onClick={() => {
                            handleBookService();
                            setShowQuoteDialog(false);
                          }}
                          className="w-full h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Accept Estimate & Book Service
                        </Button>

                        <Button
                          variant="outline"
                          onClick={() => setShowQuoteDialog(false)}
                          className="w-full h-12 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold text-base rounded-xl transition-all duration-200"
                        >
                          Decline
                        </Button>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
