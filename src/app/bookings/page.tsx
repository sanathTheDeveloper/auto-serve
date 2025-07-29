"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Car,
  Calendar,
  CheckCircle,
  Clock,
  History,
  MapPin,
  Wrench,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Booking {
  id: string;
  vehicle: string;
  service: string;
  mechanic: string;
  address: string;
  date: string;
  time: string;
  price: string;
  status: "upcoming" | "completed" | "pending";
  paymentStatus: "paid" | "pending" | "deposit";
}

const mockBookings: Booking[] = [
  {
    id: "1",
    vehicle: "2020 Toyota Camry",
    service: "Basic Service",
    mechanic: "AutoCare Plus",
    address: "123 Collins Street, Melbourne",
    date: "Tomorrow",
    time: "2:00 PM",
    price: "$120",
    status: "upcoming",
    paymentStatus: "deposit",
  },
  {
    id: "2",
    vehicle: "2019 Honda Civic",
    service: "Oil Change",
    mechanic: "Quick Fix Automotive",
    address: "789 Bourke Street, Melbourne",
    date: "Dec 28",
    time: "10:30 AM",
    price: "$80",
    status: "completed",
    paymentStatus: "paid",
  },
  {
    id: "3",
    vehicle: "2021 Ford F-150",
    service: "Brake Service",
    mechanic: "Melbourne Motor Works",
    address: "456 Flinders Lane, Melbourne",
    date: "Jan 5",
    time: "3:00 PM",
    price: "$200",
    status: "pending",
    paymentStatus: "pending",
  },
];

export default function Bookings() {
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  const [bookings] = useState<Booking[]>(mockBookings);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "#1e40af";
      case "completed":
        return "#22c55e";
      case "pending":
        return "#f59e0b";
      default:
        return "#64748b";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Calendar className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      default:
        return <History className="w-4 h-4" />;
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (tabValue === 0) return booking.status === "upcoming";
    if (tabValue === 1) return booking.status === "completed";
    return true;
  });

  const handleBookingClick = (bookingId: string) => {
    router.push(`/bookings/${bookingId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
      {/* Status Bar Space */}
      <div className="h-11" />

      {/* Header */}
      <div className="flex items-center justify-center px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold">My Bookings</h1>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-4">
        <Card>
          <CardContent className="p-0">
            <div className="flex w-full">
              <Button
                variant={tabValue === 0 ? "default" : "ghost"}
                className={`flex-1 rounded-none first:rounded-l-lg last:rounded-r-lg py-3 ${
                  tabValue === 0 ? "bg-blue-600 text-white" : "text-gray-600"
                }`}
                onClick={() => setTabValue(0)}
              >
                Upcoming
              </Button>
              <Button
                variant={tabValue === 1 ? "default" : "ghost"}
                className={`flex-1 rounded-none py-3 ${
                  tabValue === 1 ? "bg-blue-600 text-white" : "text-gray-600"
                }`}
                onClick={() => setTabValue(1)}
              >
                Completed
              </Button>
              <Button
                variant={tabValue === 2 ? "default" : "ghost"}
                className={`flex-1 rounded-none first:rounded-l-lg last:rounded-r-lg py-3 ${
                  tabValue === 2 ? "bg-blue-600 text-white" : "text-gray-600"
                }`}
                onClick={() => setTabValue(2)}
              >
                All
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content */}
      <div className="px-4 pb-24">
        {filteredBookings.length === 0 ? (
          <Card className="mb-6">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                No bookings yet
              </h2>
              <p className="text-muted-foreground">
                When you book a service, it will appear here
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <Card
                key={booking.id}
                className="cursor-pointer hover:shadow-lg active:scale-98 transition-all duration-200 border-0 shadow-md"
                onClick={() => handleBookingClick(booking.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-5">
                    {/* Vehicle Avatar */}
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"
                      style={{
                        backgroundColor: getStatusColor(booking.status),
                      }}
                    >
                      <Car className="w-8 h-8 text-white" />
                    </div>

                    {/* Booking Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-bold text-gray-900 text-xl leading-tight">
                          {booking.vehicle}
                        </h3>

                        <div className="flex items-center gap-2 ml-2">
                          {getStatusIcon(booking.status)}
                          <Badge
                            variant="secondary"
                            className="text-xs font-semibold px-2 py-1"
                            style={{
                              backgroundColor: `${getStatusColor(
                                booking.status
                              )}15`,
                              color: getStatusColor(booking.status),
                            }}
                          >
                            {booking.status.charAt(0).toUpperCase() +
                              booking.status.slice(1)}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-base text-gray-700 font-semibold mb-3">
                        {booking.service}
                      </p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Wrench className="w-4 h-4 mr-2 text-gray-500" />
                          <span className="font-medium">
                            {booking.mechanic}
                          </span>
                        </div>

                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                          <span className="truncate">{booking.address}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-semibold text-gray-900">
                            {booking.date} at {booking.time}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <Badge
                            variant="secondary"
                            className={`text-xs font-semibold px-3 py-1 ${
                              booking.paymentStatus === "paid"
                                ? "bg-green-50 text-green-600 border border-green-200"
                                : booking.paymentStatus === "deposit"
                                ? "bg-blue-50 text-blue-600 border border-blue-200"
                                : "bg-yellow-50 text-yellow-600 border border-yellow-200"
                            }`}
                          >
                            {booking.paymentStatus === "paid"
                              ? "Paid"
                              : booking.paymentStatus === "deposit"
                              ? "Deposit Paid"
                              : "Payment Due"}
                          </Badge>

                          <span className="text-lg font-bold text-green-600">
                            {booking.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Safe Area */}
      <div className="h-8" />
    </div>
  );
}
