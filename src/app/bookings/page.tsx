"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Car,
  Calendar,
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


  const filteredBookings = bookings.filter((booking) => {
    if (tabValue === 0) return booking.status === "upcoming";
    if (tabValue === 1) return booking.status === "completed";
    return true;
  });

  const handleBookingClick = (bookingId: string) => {
    router.push(`/bookings/${bookingId}`);
  };

  return (
    <div className="min-h-screen bg-app-brand">
      {/* Status Bar Space */}
      <div className="h-11" />

      {/* Header */}
      <div className="flex items-center justify-center px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 tile-brand rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">My Bookings</h1>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-4">
        <Card className="card-elevated">
          <CardContent className="p-0">
            <div className="flex w-full">
              <Button
                variant={tabValue === 0 ? "default" : "ghost"}
                className={`flex-1 rounded-none first:rounded-l-lg last:rounded-r-lg py-3 ${
                  tabValue === 0
                    ? "btn-brand hover:btn-brand-hover text-white"
                    : "text-gray-600"
                }`}
                onClick={() => setTabValue(0)}
              >
                Upcoming
              </Button>
              <Button
                variant={tabValue === 1 ? "default" : "ghost"}
                className={`flex-1 rounded-none py-3 ${
                  tabValue === 1
                    ? "btn-brand hover:btn-brand-hover text-white"
                    : "text-gray-600"
                }`}
                onClick={() => setTabValue(1)}
              >
                Completed
              </Button>
              <Button
                variant={tabValue === 2 ? "default" : "ghost"}
                className={`flex-1 rounded-none first:rounded-l-lg last:rounded-r-lg py-3 ${
                  tabValue === 2
                    ? "btn-brand hover:btn-brand-hover text-white"
                    : "text-gray-600"
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
          <Card className="mb-6 card-elevated">
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
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <Card
                key={booking.id}
                className="cursor-pointer hover:shadow-lg active:scale-98 transition-all duration-200 card-elevated"
                onClick={() => handleBookingClick(booking.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Vehicle Avatar */}
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 tile-brand shadow">
                      <Car className="w-6 h-6 text-white" />
                    </div>

                    {/* Booking Info */}
                    <div className="flex-1 min-w-0">
                      {/* Title row */}
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-slate-900 leading-tight truncate pr-3">
                          {booking.vehicle}
                        </h3>
                        <span className="text-base font-bold text-green-600 ml-2 whitespace-nowrap">
                          {booking.price}
                        </span>
                      </div>

                      {/* Service + status */}
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-sm text-slate-700 font-medium truncate">
                          {booking.service}
                        </span>
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                          style={{
                            backgroundColor: `${getStatusColor(
                              booking.status
                            )}15`,
                            color: getStatusColor(booking.status),
                          }}
                        >
                          {booking.status}
                        </span>
                      </div>

                      {/* Meta */}
                      <div className="mt-2 grid grid-cols-1 gap-1 text-xs text-slate-600">
                        <div className="flex items-center gap-2 truncate">
                          <Wrench className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate">{booking.mechanic}</span>
                        </div>
                        <div className="flex items-center gap-2 truncate">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate">{booking.address}</span>
                        </div>
                        <div className="flex items-center gap-2 truncate">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate">
                            {booking.date} at {booking.time}
                          </span>
                        </div>
                      </div>

                      {/* Payment status */}
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-[11px] text-slate-600 flex items-center gap-1">
                          <span
                            className={`inline-block w-2 h-2 rounded-full ${
                              booking.paymentStatus === "paid"
                                ? "bg-green-500"
                                : booking.paymentStatus === "deposit"
                                ? "bg-blue-500"
                                : "bg-yellow-500"
                            }`}
                          />
                          {booking.paymentStatus === "paid"
                            ? "Paid"
                            : booking.paymentStatus === "deposit"
                            ? "Deposit paid"
                            : "Payment due"}
                        </span>
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
