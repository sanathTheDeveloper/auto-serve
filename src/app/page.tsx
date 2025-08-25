"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Car,
  Wrench,
  ChevronRight,
  Bell,
  Calendar,
  TrendingUp,
  MapPin,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { IntroPage } from "@/components/IntroPage";
import BottomNavigation from "@/components/BottomNavigation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const [greeting, setGreeting] = useState("");
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // Check if user has seen the intro before
    const hasSeenIntro = localStorage.getItem("auto-serve-intro-seen");
    if (hasSeenIntro === "true") {
      setShowIntro(false);
    }
  }, []);

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) setGreeting("Good morning");
      else if (hour < 17) setGreeting("Good afternoon");
      else setGreeting("Good evening");
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    localStorage.setItem("auto-serve-intro-seen", "true");
    setShowIntro(false);
    // Navigate to add vehicle page for new users
    router.push("/vehicles/add");
  };

  const upcomingServices = [
    {
      vehicle: "2020 Toyota Camry",
      service: "Basic Service",
      date: "Tomorrow, 2:00 PM",
      mechanic: "AutoCare Plus",
      status: "confirmed",
    },
    {
      vehicle: "2019 Honda Civic",
      service: "Oil Change Due",
      date: "Due in 3 days",
      status: "reminder",
    },
  ];

  const quickActions = [
    {
      title: "Find Mechanics",
      desc: "Search nearby mechanics",
      icon: MapPin,
      color: "bg-blue-500",
      path: "/mechanics",
    },
    {
      title: "Book Service",
      desc: "Schedule maintenance",
      icon: Calendar,
      color: "bg-green-500",
      path: "/mechanics",
    },
    {
      title: "My Vehicles",
      desc: "Manage your fleet",
      icon: Car,
      color: "bg-purple-500",
      path: "/vehicles",
    },
  ];

  return (
    <>
      {showIntro ? (
        <IntroPage onGetStarted={handleGetStarted} />
      ) : (
        <div className="min-h-screen bg-app-brand animate-in fade-in duration-500">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <Logo size="2xl" />
              <div>
                <h1 className="text-xl font-bold text-slate-900">Auto Serve</h1>
                <p className="text-slate-600 text-sm">Vehicle Management</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => router.push("/notifications")}
                  className="w-9 h-9 card-elevated rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors active:scale-95"
                >
                  <Bell className="w-4 h-4 text-slate-700" />
                </button>
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                  2
                </Badge>
              </div>
            </div>
          </div>

          {/* Welcome Card */}
          <div className="mx-4 mt-4">
            <Card className="card-elevated">
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {greeting}! 👋
                </h2>
                <p className="text-muted-foreground">
                  Ready to keep your vehicles in top condition?
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Stats Grid */}
          <div className="px-4 mt-4">
            <div className="grid grid-cols-3 gap-3">
              <Card className="card-elevated">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">3</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">
                    Vehicles
                  </div>
                </CardContent>
              </Card>
              <Card className="card-elevated">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600 mb-1">2</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">
                    Due Soon
                  </div>
                </CardContent>
              </Card>
              <Card className="card-elevated">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">$840</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">
                    This Month
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Upcoming Services */}
          {upcomingServices.length > 0 && (
            <div className="px-4 mt-6">
              <h2 className="text-lg font-bold mb-3">Upcoming Services</h2>
              <div className="space-y-3">
                {upcomingServices.map((service, index) => (
                  <Card
                    key={index}
                    className="cursor-pointer active:scale-95 transition-transform card-elevated"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${
                            service.status === "confirmed"
                              ? "bg-green-500"
                              : "bg-yellow-500"
                          }`}
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {service.vehicle}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-1">
                            {service.service}
                          </p>
                          <p
                            className={`text-xs font-medium ${
                              service.status === "confirmed"
                                ? "text-green-600"
                                : "text-yellow-600"
                            }`}
                          >
                            {service.date}{" "}
                            {service.mechanic && `• ${service.mechanic}`}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="px-4 mt-6">
            <h2 className="text-lg font-bold mb-3">Quick Actions</h2>
            <div className="space-y-3">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <Card
                    key={index}
                    className="cursor-pointer active:scale-95 transition-transform card-elevated"
                  >
                    <CardContent className="p-4">
                      <Button
                        variant="ghost"
                        className="w-full justify-start p-0 h-auto"
                        onClick={() => router.push(action.path)}
                      >
                        <div className="flex items-center gap-4 w-full">
                          <div className="w-12 h-12 tile-brand rounded-xl flex items-center justify-center shadow-lg">
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <div className="flex-1 text-left">
                            <h3 className="font-semibold text-gray-900">
                              {action.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {action.desc}
                            </p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-400" />
                        </div>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="px-4 mt-6 mb-6">
            <h2 className="text-lg font-bold mb-3 text-slate-900">
              Recent Activity
            </h2>
            <Card className="card-elevated">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Wrench className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        Service Completed
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        2020 Toyota Camry - Basic Service at AutoCare Plus
                      </p>
                      <p className="text-xs text-gray-400 mt-1">2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        Payment Processed
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        $180 for Honda Civic oil change
                      </p>
                      <p className="text-xs text-gray-400 mt-1">1 week ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <BottomNavigation />
        </div>
      )}
    </>
  );
}
