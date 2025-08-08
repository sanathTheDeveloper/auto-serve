"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Star,
  Car,
  Wrench,
  MapPin,
  Calendar,
  Camera,
  CheckCircle,
  X,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";

interface BookingInfo {
  id: string;
  mechanicId: string;
  mechanicName: string;
  mechanicAddress: string;
  serviceType: string;
  vehicleName: string;
  completedDate: string;
  totalAmount: number;
}

export default function RateMechanicPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.bookingId as string;

  const [bookingInfo] = useState<BookingInfo>({
    id: bookingId,
    mechanicId: "1",
    mechanicName: "AutoCare Plus",
    mechanicAddress: "123 Collins Street, Melbourne",
    serviceType: "Full Service",
    vehicleName: "2020 Toyota Camry",
    completedDate: "2024-01-05T10:30:00Z",
    totalAmount: 280.00,
  });

  const [overallRating, setOverallRating] = useState(0);
  const [criteria, setCriteria] = useState({
    quality: 0,
    timeliness: 0,
    communication: 0,
    value: 0,
  });
  const [comment, setComment] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const criteriaLabels = {
    quality: "Service Quality",
    timeliness: "Timeliness",
    communication: "Communication",
    value: "Value for Money",
  };

  const renderStarRating = (
    currentRating: number,
    onRatingChange: (rating: number) => void,
    size = "w-8 h-8",
    keyPrefix = ""
  ) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={`rate-${keyPrefix}-star-${star}`}
            type="button"
            onClick={() => onRatingChange(star)}
            className={`${size} transition-all duration-200 hover:scale-110 ${
              star <= currentRating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300 hover:text-yellow-200"
            }`}
          >
            <Star className="w-full h-full" />
          </button>
        ))}
      </div>
    );
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newPhotos = Array.from(event.target.files);
      setPhotos((prev) => [...prev, ...newPhotos].slice(0, 5)); // Max 5 photos
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (overallRating === 0) {
      alert("Please provide an overall rating");
      return;
    }

    if (comment.trim().length < 10) {
      alert("Please write at least 10 characters in your review");
      return;
    }

    setIsSubmitting(true);

    // Simulate submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Auto redirect after success
      setTimeout(() => {
        router.push("/bookings");
      }, 2000);
    }, 2000);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-app-brand flex items-center justify-center">
        <Card className="card-elevated w-full max-w-sm mx-4">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Review Submitted!
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Thank you for sharing your experience. Your review helps other customers make informed decisions.
            </p>
            <div className="text-xs text-gray-500">
              Redirecting to bookings...
            </div>
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
          onClick={() => router.back()}
          aria-label="Go back"
          className="w-10 h-10 rounded-lg card-elevated"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 tile-brand rounded-lg flex items-center justify-center">
            <Star className="w-4 h-4" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Rate Service</h1>
        </div>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="px-4 pb-28">
        {/* Service Summary */}
        <Card className="mb-6 card-elevated">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 tile-brand rounded-xl flex items-center justify-center">
                <Wrench className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 mb-1">
                  {bookingInfo.mechanicName}
                </h3>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Car className="w-4 h-4" />
                    <span>{bookingInfo.serviceType} - {bookingInfo.vehicleName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{bookingInfo.mechanicAddress}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Completed on {new Date(bookingInfo.completedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">
                  ${bookingInfo.totalAmount.toFixed(2)}
                </div>
                <Badge className="bg-green-100 text-green-700 text-xs mt-1">
                  Completed
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overall Rating */}
        <Card className="mb-6 card-elevated">
          <CardContent className="pt-6">
            <h3 className="font-bold text-slate-900 mb-4">Overall Rating</h3>
            <div className="text-center">
              <div className="mb-4">
                {renderStarRating(overallRating, setOverallRating, "w-12 h-12", "overall")}
              </div>
              <div className="text-sm text-gray-600">
                {overallRating === 0 && "Tap stars to rate"}
                {overallRating === 1 && "Poor"}
                {overallRating === 2 && "Fair"}
                {overallRating === 3 && "Good"}
                {overallRating === 4 && "Very Good"}
                {overallRating === 5 && "Excellent"}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Ratings */}
        <Card className="mb-6 card-elevated">
          <CardContent className="pt-6">
            <h3 className="font-bold text-slate-900 mb-4">Rate Each Aspect</h3>
            <div className="space-y-4">
              {Object.entries(criteriaLabels).map(([key, label]) => (
                <div key={`rate-criteria-${key}`} className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{label}</span>
                  {renderStarRating(
                    criteria[key as keyof typeof criteria],
                    (rating) => setCriteria(prev => ({ ...prev, [key]: rating })),
                    "w-6 h-6",
                    key
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Written Review */}
        <Card className="mb-6 card-elevated">
          <CardContent className="pt-6">
            <h3 className="font-bold text-slate-900 mb-4">Write Your Review</h3>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share details about your experience to help other customers..."
              className="w-full h-32 px-4 py-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-2">
              <div className="text-xs text-gray-500">
                {comment.length}/500 characters
              </div>
              <div className="text-xs text-gray-500">
                {comment.length < 10 ? "Minimum 10 characters" : ""}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Photo Upload */}
        <Card className="mb-6 card-elevated">
          <CardContent className="pt-6">
            <h3 className="font-bold text-slate-900 mb-4">Add Photos (Optional)</h3>
            
            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-4">
                {photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={URL.createObjectURL(photo)}
                      alt={`Upload ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {photos.length < 5 && (
              <label className="block">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors">
                  <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">
                    Tap to add photos ({photos.length}/5)
                  </div>
                </div>
              </label>
            )}
          </CardContent>
        </Card>

        {/* Anonymous Option */}
        <Card className="mb-6 card-elevated">
          <CardContent className="p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div>
                <div className="font-medium text-slate-900">Post Anonymously</div>
                <div className="text-sm text-gray-600">
                  Your name won&apos;t be shown with this review
                </div>
              </div>
            </label>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || overallRating === 0}
          className="w-full py-4 text-lg font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Submitting Review...
            </div>
          ) : (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              Submit Review
            </>
          )}
        </Button>

        {/* Terms Notice */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            By submitting, you agree that your review meets our community guidelines
          </p>
        </div>
      </div>
    </div>
  );
}