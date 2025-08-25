"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Car,
  Calendar,
  Wrench,
  Shield,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Phone,
  Navigation,
  CreditCard,
  FileText,
  Star,
  User,
  Banknote,
  Receipt,
  Info,
  XCircle,
} from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import { useRouter } from "next/navigation";

interface PaymentDetails {
  totalAmount: number;
  depositAmount?: number;
  remainingAmount?: number;
  paidAmount: number;
  escrowStatus: "holding" | "released" | "refunded";
  paymentMethod: string;
  transactionId: string;
  paidAt: string;
  releasedAt?: string;
}

interface Mechanic {
  name: string;
  rating: number;
  reviewCount: number;
  phoneNumber: string;
  address: string;
  verified: boolean;
  profileImage?: string;
}

interface DetailedBooking {
  id: string;
  vehicle: string;
  service: string;
  serviceDescription: string;
  mechanic: Mechanic;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "pending" | "cancelled";
  paymentStatus: "pending" | "deposit_paid" | "fully_paid" | "released";
  paymentDetails: PaymentDetails;
  escrowProtection: boolean;
  bookingDate: string;
  estimatedDuration: string;
  serviceIncludes: string[];
  notes?: string;
}

const mockBookingDetails: DetailedBooking = {
  id: "1",
  vehicle: "2020 Toyota Camry",
  service: "Full Service",
  serviceDescription: "Comprehensive vehicle maintenance including oil change, brake inspection, tire rotation, and multi-point inspection.",
  mechanic: {
    name: "AutoCare Plus",
    rating: 4.8,
    reviewCount: 127,
    phoneNumber: "(03) 9123 4567",
    address: "123 Collins Street, Melbourne",
    verified: true,
  },
  date: "Tomorrow",
  time: "2:00 PM",
  status: "upcoming",
  paymentStatus: "deposit_paid",
  escrowProtection: true,
  bookingDate: "Jan 2, 2025",
  estimatedDuration: "2-3 hours",
  serviceIncludes: [
    "Engine oil and filter change",
    "Brake system inspection",
    "Tire pressure and tread check",
    "Battery and charging system test",
    "Fluid levels inspection",
    "Multi-point safety check",
  ],
  notes: "Please check the air conditioning system as well - mentioned strange noise when turning on.",
  paymentDetails: {
    totalAmount: 280.0,
    depositAmount: 84.0,
    remainingAmount: 196.0,
    paidAmount: 84.0,
    escrowStatus: "holding",
    paymentMethod: "•••• 3456",
    transactionId: "TXN-1735789200000",
    paidAt: "2024-01-02T14:30:00Z",
  },
};

export default function BookingDetails() {
  const router = useRouter();
  const [booking, setBooking] = useState<DetailedBooking>(mockBookingDetails);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusDisplay = (paymentStatus: string) => {
    switch (paymentStatus) {
      case "pending":
        return {
          text: "Payment Pending",
          color: "bg-yellow-100 text-yellow-800",
          icon: <Clock className="w-4 h-4" />,
        };
      case "deposit_paid":
        return {
          text: `Deposit Paid ($${booking.paymentDetails.paidAmount})`,
          color: "bg-blue-100 text-blue-800",
          icon: <DollarSign className="w-4 h-4" />,
        };
      case "fully_paid":
        return {
          text: "Paid in Full",
          color: "bg-green-100 text-green-800",
          icon: <CheckCircle className="w-4 h-4" />,
        };
      case "released":
        return {
          text: "Payment Released",
          color: "bg-emerald-100 text-emerald-800",
          icon: <CheckCircle className="w-4 h-4" />,
        };
      default:
        return {
          text: "Unknown",
          color: "bg-gray-100 text-gray-800",
          icon: <AlertTriangle className="w-4 h-4" />,
        };
    }
  };

  const handleCancelBooking = async () => {
    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update booking status
    setBooking(prev => ({ ...prev, status: "cancelled" }));
    setIsProcessing(false);
    setShowCancelDialog(false);
    setShowRefundDialog(true);
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
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 tile-brand rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Booking Details</h1>
          </div>
        </div>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="px-4 pb-24 space-y-4">
        {/* Mechanic Details - Primary Information */}
        <Card className="card-elevated">
          <CardContent className="p-5">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-blue-600" />
              Your Mechanic
            </h3>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-slate-900">{booking.mechanic.name}</h4>
                  {booking.mechanic.verified && (
                    <Shield className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(booking.mechanic.rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300 fill-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-slate-900 text-sm">{booking.mechanic.rating}</span>
                  <span className="text-slate-500 text-sm">({booking.mechanic.reviewCount} reviews)</span>
                </div>
                <p className="text-slate-600 text-sm">{booking.mechanic.phoneNumber}</p>
                <p className="text-slate-600 text-sm mt-1">{booking.mechanic.address}</p>
              </div>
            </div>

            {/* Primary Actions - Call & Directions */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <Button
                onClick={() => window.open(`tel:${booking.mechanic.phoneNumber}`)}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Phone className="w-4 h-4" />
                <span>Call Now</span>
              </Button>
              <Button
                onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(booking.mechanic.address)}`)}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Directions</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Appointment Details */}
        <Card className="card-elevated">
          <CardContent className="p-5">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Appointment Details
            </h3>
            
            {/* Service & Vehicle Info */}
            <div className="bg-blue-50 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-3 mb-2">
                <Car className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-slate-900">{booking.vehicle}</span>
                <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </div>
              </div>
              <p className="text-slate-700 font-medium">{booking.service}</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 text-sm">Date & Time</span>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">{booking.date} at {booking.time}</p>
                  <p className="text-xs text-slate-500">Duration: {booking.estimatedDuration}</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 text-sm">Booked On</span>
                <span className="font-semibold text-slate-900">{booking.bookingDate}</span>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Service Details */}
        <Card className="card-elevated">
          <CardContent className="p-5">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              Service Includes
            </h3>
            <div className="space-y-3">
              {booking.serviceIncludes.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-slate-700 text-sm">{item}</span>
                </div>
              ))}
            </div>
            {booking.notes && (
              <div className="mt-4 bg-blue-50 rounded-xl p-4">
                <h4 className="font-semibold text-blue-900 mb-2 text-sm">Special Instructions</h4>
                <p className="text-blue-800 text-sm leading-relaxed">{booking.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Details */}
        <Card className="card-elevated">
          <CardContent className="p-5">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              Payment Details
            </h3>
            
            {/* Payment Status */}
            <div className="mb-4">
              {(() => {
                const paymentStatus = getPaymentStatusDisplay(booking.paymentStatus);
                return (
                  <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl font-semibold ${paymentStatus.color}`}>
                    {paymentStatus.icon}
                    {paymentStatus.text}
                  </div>
                );
              })()}
            </div>

            {/* Payment Breakdown */}
            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 text-sm">Service Total</span>
                <span className="font-semibold text-slate-900">${booking.paymentDetails.totalAmount.toFixed(2)}</span>
              </div>
              {booking.paymentDetails.depositAmount && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-sm">Deposit Paid</span>
                  <span className="font-semibold text-green-600">-${booking.paymentDetails.depositAmount.toFixed(2)}</span>
                </div>
              )}
              {booking.paymentDetails.remainingAmount && booking.paymentDetails.remainingAmount > 0 && (
                <div className="flex justify-between items-center py-2 border-t border-gray-200">
                  <span className="text-slate-900 font-semibold">Remaining Balance</span>
                  <span className="font-bold text-slate-900 text-lg">${booking.paymentDetails.remainingAmount.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Payment Method & Transaction */}
            {booking.paymentDetails.paymentMethod && (
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 text-sm">Payment Method</span>
                  <span className="font-semibold text-slate-900">{booking.paymentDetails.paymentMethod}</span>
                </div>
                {booking.paymentDetails.transactionId && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 text-sm">Transaction ID</span>
                    <span className="font-mono text-slate-900 text-xs">{booking.paymentDetails.transactionId}</span>
                  </div>
                )}
                {booking.paymentDetails.paidAt && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 text-sm">Payment Date</span>
                    <span className="font-semibold text-slate-900 text-sm">
                      {new Date(booking.paymentDetails.paidAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Escrow Protection */}
            {booking.escrowProtection && (
              <div className="mt-4 bg-blue-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-900">Escrow Protection</h4>
                </div>
                <p className="text-blue-800 text-sm leading-relaxed">
                  Your payment is securely held in escrow until the service is completed to your satisfaction. 
                  Funds will be released to the mechanic after service completion.
                </p>
                <div className="mt-2 text-xs text-blue-700">
                  Status: {booking.paymentDetails.escrowStatus === "holding" ? "Funds Secured" : 
                          booking.paymentDetails.escrowStatus === "released" ? "Funds Released" : "Processing"}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          {booking.paymentStatus === "deposit_paid" && booking.status === "upcoming" && (
            <Button
              onClick={() => router.push(`/payment/${booking.id}/complete`)}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Banknote className="w-5 h-5 mr-2" />
              Complete Payment (${booking.paymentDetails.remainingAmount?.toFixed(2)})
            </Button>
          )}
          
          {booking.status === "completed" && (
            <Button
              onClick={() => router.push(`/reviews/${booking.id}/rate`)}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Star className="w-5 h-5 mr-2" />
              Rate & Review Service
            </Button>
          )}

          {/* Cancel/Refund Button - Show for upcoming bookings */}
          {booking.status === "upcoming" && (
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(true)}
              className="w-full border-2 border-red-200 hover:border-red-300 text-red-600 hover:text-red-700 hover:bg-red-50 py-4 rounded-xl font-semibold transition-all duration-200"
            >
              <AlertTriangle className="w-5 h-5 mr-2" />
              Cancel Service & Request Refund
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => router.push(`/receipt/${booking.id}`)}
            className="w-full border-2 border-gray-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 py-4 rounded-xl font-semibold transition-all duration-200"
          >
            <Receipt className="w-5 h-5 mr-2" />
            Download Receipt
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* Cancel Confirmation Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-red-50 px-6 py-5 border-b border-red-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-red-900">Cancel Service?</h2>
                  <p className="text-sm text-red-700">This action cannot be undone</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  Are you sure you want to cancel your service appointment? Your refund will be processed automatically.
                </p>
                
                <div className="bg-blue-50 rounded-2xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <h4 className="font-semibold text-blue-900 text-sm">Need to adjust your booking instead?</h4>
                  </div>
                  <p className="text-blue-800 text-sm mb-3">
                    Contact {booking.mechanic.name} directly to reschedule or modify your appointment.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`tel:${booking.mechanic.phoneNumber}`)}
                    className="w-full border-blue-200 text-blue-700 hover:bg-blue-100"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call {booking.mechanic.name}
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleCancelBooking}
                  disabled={isProcessing}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 mr-2" />
                      Yes, Cancel Service
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCancelDialog(false)}
                  disabled={isProcessing}
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-xl font-semibold"
                >
                  Keep My Booking
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Refund Success Dialog */}
      {showRefundDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-green-50 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-green-900">Service Cancelled</h2>
                  <p className="text-sm text-green-700">Refund in progress</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="text-center mb-6">
                <p className="text-gray-700 mb-4">
                  Your service appointment has been successfully cancelled.
                </p>
                
                <div className="bg-blue-50 rounded-2xl p-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-900">Refund Information</h4>
                  </div>
                  <p className="text-blue-800 text-sm">
                    Your refund of <span className="font-bold">${booking.paymentDetails.paidAmount.toFixed(2)}</span> will reflect in your account within <span className="font-bold">5 business days</span>.
                  </p>
                </div>
              </div>

              <Button
                onClick={() => {
                  setShowRefundDialog(false);
                  router.back();
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Got It
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}