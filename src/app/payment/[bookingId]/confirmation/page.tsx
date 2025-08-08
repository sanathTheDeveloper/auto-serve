"use client";

import React, { useEffect, useState, Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Shield,
  Calendar,
  Car,
  MapPin,
  Home,
  Receipt,
} from "lucide-react";
import { useRouter, useSearchParams, useParams } from "next/navigation";

function PaymentConfirmationContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const bookingId = params.bookingId as string;
  const paymentOption = searchParams.get("option") as "full" | "deposit";

  const [paymentDetails] = useState({
    transactionId: "TXN-" + Date.now(),
    amount: paymentOption === "deposit" ? 84.00 : 280.00,
    totalAmount: 280.00,
    paymentMethod: "•••• 3456",
    processedAt: new Date().toISOString(),
  });

  const [bookingDetails] = useState({
    id: bookingId,
    service: "Full Service",
    vehicle: "2020 Toyota Camry",
    mechanic: "AutoCare Plus",
    address: "123 Collins Street, Melbourne",
    date: "Tomorrow",
    time: "2:00 PM",
    estimatedDuration: "2-3 hours",
  });

  const isDepositPayment = paymentOption === "deposit";
  const remainingAmount = paymentDetails.totalAmount - paymentDetails.amount;

  useEffect(() => {
    // Simulate updating booking status
    // In real app, this would trigger API calls to update booking status
    console.log("Payment confirmed for booking:", bookingId);
  }, [bookingId]);

  return (
    <div className="min-h-screen bg-app-brand">
      {/* Status Bar Space */}
      <div className="h-11" />

      {/* Success Animation Header */}
      <div className="text-center py-8">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 px-4">
          Your booking has been confirmed and payment is secured in escrow
        </p>
      </div>

      {/* Content */}
      <div className="px-4 pb-28">
        {/* Payment Summary */}
        <Card className="mb-6 card-elevated">
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-green-600 mb-1">
                ${paymentDetails.amount.toFixed(2)}
              </div>
              <div className="text-sm text-gray-500">
                {isDepositPayment ? "Deposit Paid" : "Full Payment"}
              </div>
            </div>

            <div className="space-y-3 border-t pt-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID</span>
                <span className="font-mono text-sm">{paymentDetails.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-medium">{paymentDetails.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date & Time</span>
                <span className="font-medium">
                  {new Date(paymentDetails.processedAt).toLocaleDateString()} at{" "}
                  {new Date(paymentDetails.processedAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              {isDepositPayment && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Remaining Balance</span>
                  <span className="text-gray-700">${remainingAmount.toFixed(2)}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Booking Details */}
        <Card className="mb-6 card-elevated">
          <CardContent className="pt-6">
            <h3 className="font-bold text-slate-900 mb-4">Booking Details</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 tile-brand rounded-lg flex items-center justify-center">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium text-slate-900">{bookingDetails.service}</div>
                  <div className="text-sm text-gray-600">{bookingDetails.vehicle}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium text-slate-900">{bookingDetails.mechanic}</div>
                  <div className="text-sm text-gray-600">{bookingDetails.address}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-slate-900">
                    {bookingDetails.date} at {bookingDetails.time}
                  </div>
                  <div className="text-sm text-gray-600">
                    Duration: {bookingDetails.estimatedDuration}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Escrow Protection Status */}
        <Card className="mb-6 bg-blue-50/80 border border-blue-200">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-blue-900 mb-2">Payment Protected in Escrow</h3>
                <div className="space-y-2 text-sm text-blue-800">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    <span>Your payment is safely held until service completion</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    <span>Funds will be released after you confirm satisfaction</span>
                  </div>
                  {isDepositPayment && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full" />
                      <span>Remaining balance due after service completion</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-6 card-elevated">
          <CardContent className="pt-6">
            <h3 className="font-bold text-slate-900 mb-4">What Happens Next?</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <div className="font-medium text-slate-900">Booking Confirmed</div>
                  <div className="text-sm text-gray-600">
                    Your mechanic has been notified and your slot is secured
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <div className="font-medium text-slate-900">Service Day</div>
                  <div className="text-sm text-gray-600">
                    Bring your vehicle to the mechanic at the scheduled time
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <div className="font-medium text-slate-900">Service Completion</div>
                  <div className="text-sm text-gray-600">
                    Confirm satisfaction and {isDepositPayment ? "pay remaining balance" : "payment will be released"}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => router.push("/bookings")}
            className="w-full py-4 text-lg font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Receipt className="w-5 h-5 mr-2" />
            View My Bookings
          </Button>
          
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="w-full py-3 rounded-xl"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
        </div>

        {/* Support Contact */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Need help? Contact our support team
          </p>
          <Button variant="link" className="text-blue-600 underline">
            support@autoserve.com
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentConfirmation() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-app-brand flex items-center justify-center">
          <div className="text-slate-600">Loading confirmation...</div>
        </div>
      }
    >
      <PaymentConfirmationContent />
    </Suspense>
  );
}