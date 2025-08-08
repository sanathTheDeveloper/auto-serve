"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Bell,
  BellRing,
  Car,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  X,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Notification {
  id: string;
  type: "service_due" | "service_reminder" | "service_overdue" | "service_completed" | "booking_confirmed";
  title: string;
  message: string;
  vehicleInfo: string;
  timestamp: string;
  isRead: boolean;
  priority: "high" | "medium" | "low";
  actionRequired?: boolean;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    // Mock notification data - in a real app, this would come from an API or local storage
    const mockNotifications: Notification[] = [
      {
        id: "1",
        type: "service_overdue",
        title: "Service Overdue",
        message: "Your Toyota Camry is overdue for its scheduled service by 2 weeks",
        vehicleInfo: "2020 Toyota Camry",
        timestamp: "2 hours ago",
        isRead: false,
        priority: "high",
        actionRequired: true,
      },
      {
        id: "2",
        type: "service_due",
        title: "Service Due Soon",
        message: "Oil change recommended within the next 500km or 2 weeks",
        vehicleInfo: "2019 Honda Civic",
        timestamp: "1 day ago",
        isRead: false,
        priority: "medium",
        actionRequired: true,
      },
      {
        id: "3",
        type: "booking_confirmed",
        title: "Booking Confirmed",
        message: "Your service appointment has been confirmed for tomorrow at 2:00 PM",
        vehicleInfo: "2020 Toyota Camry",
        timestamp: "2 days ago",
        isRead: true,
        priority: "medium",
      },
      {
        id: "4",
        type: "service_reminder",
        title: "Service Reminder",
        message: "Annual inspection due in 1 month. Book early to avoid delays",
        vehicleInfo: "2021 Ford F-150",
        timestamp: "3 days ago",
        isRead: true,
        priority: "low",
      },
      {
        id: "5",
        type: "service_completed",
        title: "Service Completed",
        message: "Basic service completed successfully. Next service due in 6 months",
        vehicleInfo: "2019 Honda Civic",
        timestamp: "1 week ago",
        isRead: true,
        priority: "low",
      },
    ];

    setNotifications(mockNotifications);
  }, []);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "service_overdue":
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case "service_due":
        return <Clock className="w-5 h-5 text-orange-600" />;
      case "service_reminder":
        return <BellRing className="w-5 h-5 text-blue-600" />;
      case "service_completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "booking_confirmed":
        return <Calendar className="w-5 h-5 text-purple-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationBadgeColor = (priority: Notification["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-orange-100 text-orange-800";
      case "low":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredNotifications = notifications.filter(notification => 
    filter === "all" || !notification.isRead
  );

  const unreadCount = notifications.filter(n => !n.isRead).length;

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
            <Bell className="w-4 h-4" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Notifications</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 rounded-lg card-elevated"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="px-4 pb-24">
        {/* Filter Tabs */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex bg-white rounded-lg p-1 card-elevated">
            <Button
              variant={filter === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("all")}
              className={`text-xs ${
                filter === "all"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              All ({notifications.length})
            </Button>
            <Button
              variant={filter === "unread" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("unread")}
              className={`text-xs ${
                filter === "unread"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Unread ({unreadCount})
            </Button>
          </div>

          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs"
            >
              Mark all read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <Card className="card-elevated">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {filter === "unread" ? "No unread notifications" : "No notifications"}
              </h3>
              <p className="text-gray-600 text-sm">
                {filter === "unread" 
                  ? "You're all caught up! Check back later for new updates."
                  : "We'll notify you about service reminders and important updates here."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`card-elevated transition-all cursor-pointer ${
                  !notification.isRead ? "border-l-4 border-l-blue-600" : ""
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Notification Icon */}
                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Notification Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className={`font-semibold text-slate-900 truncate pr-2 ${
                          !notification.isRead ? "font-bold" : ""
                        }`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {notification.priority === "high" && (
                            <Badge className={`text-xs px-2 py-0.5 ${getNotificationBadgeColor(notification.priority)}`}>
                              Urgent
                            </Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="w-6 h-6 hover:bg-gray-100"
                          >
                            <X className="w-4 h-4 text-gray-400" />
                          </Button>
                        </div>
                      </div>

                      <p className={`text-sm text-gray-600 mb-2 ${
                        !notification.isRead ? "font-medium" : ""
                      }`}>
                        {notification.message}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Car className="w-3 h-3" />
                          <span>{notification.vehicleInfo}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {notification.timestamp}
                        </span>
                      </div>

                      {notification.actionRequired && (
                        <div className="mt-3 flex gap-2">
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push("/mechanics");
                            }}
                          >
                            Book Service
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle remind me later
                            }}
                          >
                            Remind Later
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Unread indicator */}
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}