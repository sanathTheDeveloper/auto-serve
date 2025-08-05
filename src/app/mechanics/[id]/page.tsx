"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  const [showQuote, setShowQuote] = useState(false);

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
    setShowQuote(true);
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

        {/* Quote Section */}
        {showQuote && selectedService && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white mb-4">
              Your Estimated Quote
            </h3>
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    {selectedService.name}
                  </h4>
                  <p className="text-gray-600">{selectedService.description}</p>
                </div>

                {(() => {
                  const totals = calculateTotal(selectedService);

                  return (
                    <div className="space-y-4">
                      {/* Parts */}
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">
                          Parts
                        </h5>
                        {selectedService.details.parts.map((part, index) => (
                          <div
                            key={index}
                            className="flex justify-between py-1"
                          >
                            <span className="text-gray-600">{part.name}</span>
                            <span className="font-medium">${part.price}</span>
                          </div>
                        ))}
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between font-semibold">
                            <span>Parts Subtotal</span>
                            <span>${totals.partsTotal}</span>
                          </div>
                        </div>
                      </div>

                      {/* Labor */}
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">
                          Labor
                        </h5>
                        <div className="flex justify-between py-1">
                          <span className="text-gray-600">
                            {selectedService.details.labor.description}
                          </span>
                          <span className="font-medium">
                            ${totals.laborTotal}
                          </span>
                        </div>
                      </div>

                      {/* Fees */}
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">
                          Miscellaneous Fees
                        </h5>
                        {selectedService.details.fees.map((fee, index) => (
                          <div
                            key={index}
                            className="flex justify-between py-1"
                          >
                            <span className="text-gray-600">{fee.name}</span>
                            <span className="font-medium">${fee.price}</span>
                          </div>
                        ))}
                      </div>

                      {/* Totals */}
                      <div className="border-t pt-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-medium">
                            ${totals.subtotal}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">GST (10%)</span>
                          <span className="font-medium">
                            ${totals.gst.toFixed(2)}
                          </span>
                        </div>
                        <div className="border-t pt-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xl font-bold text-gray-900">
                              Total Estimated Cost
                            </span>
                            <span className="text-2xl font-bold text-green-600">
                              ${totals.total.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Authorization Notice */}
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                        <div className="flex items-start gap-2">
                          <Shield className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-yellow-800 mb-1">
                              Authorization Notice
                            </p>
                            <p className="text-sm text-yellow-700">
                              I understand the mechanic must call me for
                              approval before starting any work not included in
                              this estimate.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3 mt-6">
                        <Button
                          onClick={handleBookService}
                          className="w-full h-12 bg-red-500 hover:bg-red-600 text-white font-bold text-lg"
                        >
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Accept Estimate & Book Service
                        </Button>

                        <Button
                          variant="outline"
                          onClick={() => router.back()}
                          className="w-full h-12 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold text-lg"
                        >
                          Decline
                        </Button>
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
