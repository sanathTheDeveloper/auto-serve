"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Phone,
  Wrench,
  DollarSign,
  CheckCircle,
  X,
  Camera,
  Upload,
  Car,
  FileText,
  AlertCircle,
  Info,
  MessageSquare,
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

interface DamagePhoto {
  id: string;
  url: string;
  description: string;
}

interface ServiceConcern {
  id: string;
  title: string;
  description: string;
}

interface SparePartRequest {
  id: string;
  partName: string;
  reason: string;
}

// Mock vehicle data - in real app this would come from URL params or context
const selectedVehicle = {
  id: "1",
  make: "Toyota",
  model: "Camry",
  year: 2020,
  licensePlate: "ABC 123",
};

export default function MechanicDetail() {
  const router = useRouter();
  const params = useParams();
  const mechanicId = params.id as string;

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showQuoteDialog, setShowQuoteDialog] = useState(false);
  const [showServiceSelector, setShowServiceSelector] = useState(false);

  // Streamlined state for service concerns and requests
  const [damagePhotos, setDamagePhotos] = useState<DamagePhoto[]>([]);
  const [serviceConcerns, setServiceConcerns] = useState<ServiceConcern[]>([]);
  const [sparePartRequests, setSparePartRequests] = useState<
    SparePartRequest[]
  >([]);
  const [additionalNotes, setAdditionalNotes] = useState("");

  const mechanic = mockMechanicData[mechanicId];

  if (!mechanic) {
    return (
      <div className="min-h-screen bg-app-brand flex items-center justify-center">
        <Card className="card-elevated">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Mechanic not found
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

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setShowServiceSelector(true);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newPhoto: DamagePhoto = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            url: e.target?.result as string,
            description: "",
          };
          setDamagePhotos((prev) => [...prev, newPhoto]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemovePhoto = (photoId: string) => {
    setDamagePhotos((prev) => prev.filter((photo) => photo.id !== photoId));
  };

  const addServiceConcern = () => {
    const newConcern: ServiceConcern = {
      id: Date.now().toString(),
      title: "",
      description: "",
    };
    setServiceConcerns((prev) => [...prev, newConcern]);
  };

  const updateServiceConcern = (
    id: string,
    field: "title" | "description",
    value: string
  ) => {
    setServiceConcerns((prev) =>
      prev.map((concern) =>
        concern.id === id ? { ...concern, [field]: value } : concern
      )
    );
  };

  const removeServiceConcern = (id: string) => {
    setServiceConcerns((prev) => prev.filter((concern) => concern.id !== id));
  };

  const addSparePartRequest = () => {
    const newRequest: SparePartRequest = {
      id: Date.now().toString(),
      partName: "",
      reason: "",
    };
    setSparePartRequests((prev) => [...prev, newRequest]);
  };

  const updateSparePartRequest = (
    id: string,
    field: "partName" | "reason",
    value: string
  ) => {
    setSparePartRequests((prev) =>
      prev.map((request) =>
        request.id === id ? { ...request, [field]: value } : request
      )
    );
  };

  const removeSparePartRequest = (id: string) => {
    setSparePartRequests((prev) => prev.filter((request) => request.id !== id));
  };

  const handleRequestQuote = () => {
    setShowServiceSelector(false);
    setShowQuoteDialog(true);
  };

  const handleProceedToPayment = () => {
    if (!selectedService) {
      setShowQuoteDialog(false);
      return;
    }
    const tempBookingId = `booking-${Date.now()}`;
    const bookingData = {
      id: tempBookingId,
      service: selectedService.name,
      mechanic: mechanic.name,
      address: mechanic.address,
      estimatedTotal: 0,
      status: "pending_payment",
    };
    localStorage.setItem(
      `booking-${tempBookingId}`,
      JSON.stringify(bookingData)
    );
    setShowQuoteDialog(false);
    router.push(`/payment/${tempBookingId}?step=payment&option=full`);
  };

  // handleBookService function removed as it was unused

  // calculateTotal function removed as it was unused

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
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 tile-brand rounded-lg flex items-center justify-center">
            <Wrench className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Book Service</h1>
        </div>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="px-4 pb-24">
        {/* Mechanic Info Card */}
        <Card className="mb-6 card-elevated">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow tile-brand">
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
                  className="bg-blue-50 text-blue-700"
                >
                  {specialty}
                </Badge>
              ))}
            </div>

            {/* Quick Action: View Reviews */}
            <div className="mt-5">
              <Button
                onClick={() => router.push(`/mechanics/${mechanicId}/reviews`)}
                className="w-full btn-brand hover:btn-brand-hover text-white"
                aria-label="View mechanic reviews"
              >
                <Star className="w-4 h-4 mr-2" />
                View Reviews
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Services Section */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Available Services
          </h3>
          <div className="space-y-4">
            {mechanic.services.map((service) => (
              <Card
                key={service.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 card-elevated"
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
                    className="w-full btn-brand hover:btn-brand-hover text-white"
                  >
                    Select Service & Get Quote
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Reviews quick action is now on the title card; detailed reviews moved to separate page */}
      </div>

      {/* Service Selection Dialog */}
      <Dialog open={showServiceSelector} onOpenChange={setShowServiceSelector}>
        <DialogContent className="w-[95vw] max-w-md max-h-[90vh] p-0 gap-0 rounded-2xl border-0 shadow-2xl bg-white flex flex-col">
          <DialogTitle className="sr-only">Service Request Details</DialogTitle>

          {/* Header - Fixed at top */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-6 rounded-t-2xl relative flex-shrink-0">
            <button
              onClick={() => setShowServiceSelector(false)}
              className="absolute right-4 top-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors z-20 border border-white/30"
            >
              <X className="w-6 h-6 text-white stroke-2" />
            </button>
            <div className="text-center pr-12">
              <h2 className="text-white text-xl font-bold mb-2">
                Service Request Details
              </h2>
              <p className="text-white/90 text-sm">
                Share your concerns and requirements
              </p>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto flex-1 min-h-0">
            <div className="p-6 space-y-6">
              {/* Selected Service - Top Priority */}
              {selectedService && (
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                  <div className="flex items-center gap-3 mb-3">
                    <Wrench className="w-6 h-6 text-blue-600" />
                    <h3 className="font-bold text-blue-900 text-lg">
                      {selectedService.name}
                    </h3>
                  </div>
                  <p className="text-blue-800 text-sm mb-4 leading-relaxed">
                    {selectedService.description}
                  </p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-sm text-blue-700 bg-blue-100 px-3 py-2 rounded-full font-medium">
                      {selectedService.priceRange}
                    </span>
                    <span className="text-sm text-blue-700 bg-blue-100 px-3 py-2 rounded-full font-medium">
                      {selectedService.estimatedTime}
                    </span>
                  </div>
                </div>
              )}

              {/* Your Vehicle */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <Car className="w-6 h-6 text-gray-700" />
                  <h3 className="font-bold text-gray-900 text-lg">
                    Your Vehicle
                  </h3>
                </div>
                <p className="font-bold text-gray-900 text-lg">
                  {selectedVehicle.year} {selectedVehicle.make}{" "}
                  {selectedVehicle.model}
                </p>
                <p className="text-gray-600 text-base mt-1">
                  {selectedVehicle.licensePlate}
                </p>
              </div>

              {/* Service Concerns Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-gray-700" />
                  <h3 className="font-bold text-gray-900 text-lg">
                    Specific Concerns or Issues
                  </h3>
                </div>

                {serviceConcerns.length === 0 ? (
                  <div
                    onClick={addServiceConcern}
                    className="cursor-pointer text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group"
                  >
                    <AlertCircle className="w-10 h-10 text-gray-400 group-hover:text-blue-500 mx-auto mb-3 transition-colors" />
                    <p className="text-gray-600 group-hover:text-blue-600 text-base font-semibold transition-colors">
                      Tap to add your first concern or issue
                    </p>
                    <p className="text-gray-500 group-hover:text-blue-400 text-sm mt-2 transition-colors">
                      Describe specific problems or symptoms
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {serviceConcerns.map((concern, index) => (
                      <div
                        key={concern.id}
                        className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-bold text-gray-900 text-base flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>
                            Issue #{index + 1}
                          </h4>
                          <button
                            onClick={() => removeServiceConcern(concern.id)}
                            className="w-9 h-9 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full flex items-center justify-center transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        <input
                          type="text"
                          placeholder="Brief description (e.g., Strange noise when braking)"
                          value={concern.title}
                          onChange={(e) =>
                            updateServiceConcern(
                              concern.id,
                              "title",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-4 text-base border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none mb-4"
                        />
                        <textarea
                          placeholder="When does it happen? How long has this been occurring? Any specific symptoms?"
                          value={concern.description}
                          onChange={(e) =>
                            updateServiceConcern(
                              concern.id,
                              "description",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-4 text-base border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none resize-none h-24"
                          rows={3}
                        />
                      </div>
                    ))}

                    {/* Add More Button */}
                    <div
                      onClick={addServiceConcern}
                      className="cursor-pointer text-center py-6 bg-blue-50 rounded-xl border-2 border-dashed border-blue-200 hover:border-blue-400 hover:bg-blue-100 transition-all duration-200 group"
                    >
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-xl leading-none">+</span>
                      </div>
                      <p className="text-blue-600 text-base font-semibold">
                        Add another issue
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Spare Parts Request Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Wrench className="w-6 h-6 text-gray-700" />
                  <h3 className="font-bold text-gray-900 text-lg">
                    Spare Parts Needed
                  </h3>
                </div>

                {sparePartRequests.length === 0 ? (
                  <div
                    onClick={addSparePartRequest}
                    className="cursor-pointer text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 hover:border-green-400 hover:bg-green-50 transition-all duration-200 group"
                  >
                    <Wrench className="w-10 h-10 text-gray-400 group-hover:text-green-500 mx-auto mb-3 transition-colors" />
                    <p className="text-gray-600 group-hover:text-green-600 text-base font-semibold transition-colors">
                      Tap to request specific parts
                    </p>
                    <p className="text-gray-500 group-hover:text-green-400 text-sm mt-2 transition-colors">
                      Add parts you need or prefer
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sparePartRequests.map((request, index) => (
                      <div
                        key={request.id}
                        className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-bold text-gray-900 text-base flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>
                            Part #{index + 1}
                          </h4>
                          <button
                            onClick={() => removeSparePartRequest(request.id)}
                            className="w-9 h-9 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full flex items-center justify-center transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        <input
                          type="text"
                          placeholder="Part name (e.g., Front brake pads, Air filter)"
                          value={request.partName}
                          onChange={(e) =>
                            updateSparePartRequest(
                              request.id,
                              "partName",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-4 text-base border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100 focus:outline-none mb-4"
                        />
                        <textarea
                          placeholder="Why do you need this part? Any brand preferences or requirements?"
                          value={request.reason}
                          onChange={(e) =>
                            updateSparePartRequest(
                              request.id,
                              "reason",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-4 text-base border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100 focus:outline-none resize-none h-24"
                          rows={3}
                        />
                      </div>
                    ))}

                    {/* Add More Button */}
                    <div
                      onClick={addSparePartRequest}
                      className="cursor-pointer text-center py-6 bg-green-50 rounded-xl border-2 border-dashed border-green-200 hover:border-green-400 hover:bg-green-100 transition-all duration-200 group"
                    >
                      <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-xl leading-none">+</span>
                      </div>
                      <p className="text-green-600 text-base font-semibold">
                        Add another part
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Photo Upload Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-gray-700" />
                  <h3 className="font-bold text-gray-900">
                    Vehicle Photos (Optional)
                  </h3>
                </div>
                <p className="text-sm text-gray-600">
                  Upload photos of any damage, issues, or specific areas you
                  want the mechanic to examine.
                </p>

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Tap to upload photos
                    </p>
                    <p className="text-xs text-gray-500">
                      JPG, PNG up to 10MB each
                    </p>
                  </label>
                </div>

                {/* Uploaded Photos */}
                {damagePhotos.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {damagePhotos.map((photo) => (
                      <div
                        key={photo.id}
                        className="relative bg-gray-50 rounded-lg p-2"
                      >
                        <Image
                          src={photo.url}
                          alt="Vehicle photo"
                          className="w-full h-20 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => handleRemovePhoto(photo.id)}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Additional Notes */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-6 h-6 text-gray-700" />
                  <h3 className="font-bold text-gray-900 text-lg">
                    Additional Information
                  </h3>
                </div>
                <textarea
                  placeholder="Any other details, preferences, or requirements the mechanic should know about..."
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  className="w-full px-4 py-4 text-base border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none resize-none h-24"
                  rows={3}
                />
              </div>

              {/* Call Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-amber-900 mb-2 text-base">
                      Mechanic Will Contact You
                    </h4>
                    <p className="text-amber-800 text-sm leading-relaxed">
                      After submitting, {mechanic.name} will call you within 2
                      hours to discuss your quote and schedule your appointment.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <Button
                onClick={handleRequestQuote}
                className="w-full h-14 btn-brand hover:btn-brand-hover text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <FileText className="w-6 h-6 mr-3" />
                Request Quote & Get Call
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quote Response Dialog */}
      <Dialog open={showQuoteDialog} onOpenChange={setShowQuoteDialog}>
        <DialogContent className="w-[95vw] max-w-md max-h-[95vh] overflow-y-auto p-0 gap-0 rounded-2xl border-0 shadow-2xl">
          <DialogTitle className="sr-only">Your Estimated Quote</DialogTitle>
          {/* Custom Header with Gradient */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 pb-4 rounded-t-2xl relative">
            <button
              onClick={() => setShowQuoteDialog(false)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors z-10"
            >
              <X className="w-4 h-4 text-white" />
            </button>
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-white mx-auto mb-2" />
              <h2 className="text-white text-xl font-bold mb-1">
                Quote Request Submitted!
              </h2>
              <p className="text-white/80 text-sm">
                {mechanic.name} will contact you soon
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Request Summary */}
            {selectedService && (
              <div className="space-y-4">
                {/* Service Summary */}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center gap-3 mb-2">
                    <Wrench className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-blue-900">
                      Service Requested
                    </h3>
                  </div>
                  <p className="font-semibold text-blue-900">
                    {selectedService.name}
                  </p>
                  <p className="text-blue-800 text-sm mt-1">
                    {selectedService.description}
                  </p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
                      Est. {selectedService.priceRange}
                    </span>
                    <span className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
                      {selectedService.estimatedTime}
                    </span>
                  </div>
                </div>

                {/* Vehicle Information */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Car className="w-5 h-5 text-gray-700" />
                    <h3 className="font-bold text-gray-900">Your Vehicle</h3>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {selectedVehicle.year} {selectedVehicle.make}{" "}
                    {selectedVehicle.model}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {selectedVehicle.licensePlate}
                  </p>
                </div>

                {/* Photos Summary */}
                {damagePhotos.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Camera className="w-5 h-5 text-gray-700" />
                      <h3 className="font-bold text-gray-900">
                        Vehicle Photos
                      </h3>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        {damagePhotos.length} photo
                        {damagePhotos.length > 1 ? "s" : ""} uploaded
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Photos have been included with your quote request for the
                      mechanic to review.
                    </p>
                  </div>
                )}

                {/* Service Concerns */}
                {serviceConcerns.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <AlertCircle className="w-5 h-5 text-gray-700" />
                      <h3 className="font-bold text-gray-900">
                        Specific Concerns
                      </h3>
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                        {serviceConcerns.length} issue
                        {serviceConcerns.length > 1 ? "s" : ""} reported
                      </span>
                    </div>
                    <div className="space-y-2">
                      {serviceConcerns.map((concern, index) => (
                        <div
                          key={concern.id}
                          className="bg-white p-3 rounded-lg border border-gray-200"
                        >
                          <p className="font-semibold text-gray-900 text-sm">
                            #{index + 1}: {concern.title}
                          </p>
                          {concern.description && (
                            <p className="text-gray-700 text-xs mt-1">
                              {concern.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Spare Parts Requests */}
                {sparePartRequests.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Wrench className="w-5 h-5 text-gray-700" />
                      <h3 className="font-bold text-gray-900">
                        Parts Requested
                      </h3>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        {sparePartRequests.length} part
                        {sparePartRequests.length > 1 ? "s" : ""} needed
                      </span>
                    </div>
                    <div className="space-y-2">
                      {sparePartRequests.map((request, index) => (
                        <div
                          key={request.id}
                          className="bg-white p-3 rounded-lg border border-gray-200"
                        >
                          <p className="font-semibold text-gray-900 text-sm">
                            #{index + 1}: {request.partName}
                          </p>
                          {request.reason && (
                            <p className="text-gray-700 text-xs mt-1">
                              {request.reason}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Notes */}
                {additionalNotes && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <MessageSquare className="w-5 h-5 text-gray-700" />
                      <h3 className="font-bold text-gray-900">
                        Additional Information
                      </h3>
                    </div>
                    <p className="text-sm text-gray-700 italic">
                      &quot;{additionalNotes}&quot;
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* What Happens Next */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
              <div className="text-center mb-4">
                <Phone className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-bold text-blue-900 mb-2">
                  What Happens Next?
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-blue-900 text-sm">
                      Mechanic Review
                    </p>
                    <p className="text-blue-800 text-xs">
                      {mechanic.name} will review your vehicle details and
                      photos
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-blue-900 text-sm">
                      Phone Call Within 2 Hours
                    </p>
                    <p className="text-blue-800 text-xs">
                      Expect a call at {mechanic.phone} to discuss your quote
                      and schedule
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-blue-900 text-sm">
                      Detailed Quote & Booking
                    </p>
                    <p className="text-blue-800 text-xs">
                      Receive final pricing and book your preferred appointment
                      time
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-900 mb-1 text-sm">
                    Quote Reference: #{Date.now().toString().slice(-6)}
                  </h4>
                  <p className="text-amber-800 text-xs leading-relaxed">
                    Save this reference number for your records. The mechanic
                    will use it when calling you to discuss your service
                    request.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <Button
                onClick={() => {
                  handleProceedToPayment();
                }}
                className="w-full h-12 btn-brand hover:btn-brand-hover text-white font-bold text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Proceed to Payment
              </Button>

              <Button
                variant="outline"
                onClick={() => window.open(`tel:${mechanic.phone}`)}
                className="w-full h-12 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold text-base rounded-xl transition-all duration-200"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call {mechanic.name} Now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
