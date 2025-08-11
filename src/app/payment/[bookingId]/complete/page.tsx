"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Shield,
  CreditCard,
  Lock,
  CheckCircle,
  Car,
  Calendar,
  MapPin,
  Banknote,
  DollarSign,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";

interface BookingDetails {
  id: string;
  service: string;
  vehicle: string;
  mechanic: string;
  address: string;
  date: string;
  time: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  estimatedDuration: string;
}

export default function CompletePaymentPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.bookingId as string;

  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<"payment" | "processing">("payment");

  // Mock booking details - in real app, fetch from API
  const [bookingDetails] = useState<BookingDetails>({
    id: bookingId,
    service: "Full Service",
    vehicle: "2020 Toyota Camry",
    mechanic: "AutoCare Plus",
    address: "123 Collins Street, Melbourne",
    date: "Tomorrow",
    time: "2:00 PM",
    totalAmount: 280.00,
    paidAmount: 84.00,
    remainingAmount: 196.00,
    estimatedDuration: "2-3 hours",
  });

  const handlePaymentSubmit = async () => {
    setIsProcessing(true);
    setCurrentStep("processing");

    // Simulate payment processing
    setTimeout(() => {
      router.push(`/payment/${bookingId}/confirmation?option=complete&amount=${bookingDetails.remainingAmount}`);
    }, 3000);
  };

  if (currentStep === "processing") {
    return (
      <div className="min-h-screen bg-app-brand flex items-center justify-center">
        <Card className="card-elevated w-full max-w-sm mx-4">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Processing Payment
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Please wait while we securely process your remaining payment...
            </p>
            <div className="text-xs text-gray-500">
              This may take a few moments
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
          disabled={isProcessing}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 tile-brand rounded-lg flex items-center justify-center">
            <Banknote className="w-4 h-4" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Complete Payment
          </h1>
        </div>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="px-4 pb-28">
        {/* Booking Summary */}
        <Card className="mb-6 card-elevated">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 tile-brand rounded-xl flex items-center justify-center">
                <Car className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900">{bookingDetails.service}</h3>
                <p className="text-sm text-gray-600">{bookingDetails.vehicle}</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-slate-900">
                  ${bookingDetails.totalAmount.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500">Total Amount</div>
              </div>
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{bookingDetails.mechanic}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>{bookingDetails.date} at {bookingDetails.time}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Status */}
        <Card className="mb-6 bg-blue-50/80 border border-blue-200">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-blue-900">Deposit Already Paid</h3>
                <p className="text-sm text-blue-800">
                  ${bookingDetails.paidAmount.toFixed(2)} paid on service booking
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 text-sm">Service Total</span>
                <span className="font-medium">${bookingDetails.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 text-sm">Deposit Paid</span>
                <span className="font-medium text-green-600">-${bookingDetails.paidAmount.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between items-center">
                <span className="font-bold text-slate-900">Remaining Balance</span>
                <span className="font-bold text-xl text-slate-900">
                  ${bookingDetails.remainingAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Form */}
        <Card className="mb-6 card-elevated">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Complete Your Payment</h3>
                <p className="text-sm text-gray-600">
                  Amount to pay: ${bookingDetails.remainingAmount.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Card Number */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Card Number *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <CreditCard className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>

              {/* Expiry and CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Expiry Date *
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    CVV *
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Cardholder Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Cardholder Name *
                </label>
                <input
                  type="text"
                  placeholder="John Smith"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="mb-6 bg-gray-50 border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Secure Payment</h4>
                <p className="text-sm text-gray-600">
                  Your payment information is encrypted and secure. We never store your card details.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Escrow Protection */}
        <Card className="mb-6 bg-blue-50/80 border border-blue-200">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-blue-900 mb-2">Payment Protection</h3>
                <div className="space-y-2 text-sm text-blue-800">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Your payment will be held securely in escrow until service completion</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Automatic release after you confirm satisfactory service</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Full refund protection if service isn&apos;t delivered</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Summary */}
        <Card className="mb-6 card-elevated">
          <CardContent className="p-5">
            <h3 className="font-bold text-slate-900 mb-4">Payment Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Service Total</span>
                <span className="font-medium">${bookingDetails.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Already Paid (Deposit)</span>
                <span className="font-medium text-green-600">-${bookingDetails.paidAmount.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="font-bold text-slate-900">Amount Due Today</span>
                <span className="font-bold text-xl text-green-600">
                  ${bookingDetails.remainingAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handlePaymentSubmit}
            className="w-full py-4 text-lg font-semibold rounded-xl bg-green-600 hover:bg-green-700 text-white"
          >
            <Lock className="w-5 h-5 mr-2" />
            Complete Payment - ${bookingDetails.remainingAmount.toFixed(2)}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="w-full py-3 rounded-xl"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}