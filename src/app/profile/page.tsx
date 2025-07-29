'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Car,
  CreditCard,
  Bell,
  Shield,
  HelpCircle,
  ChevronRight,
  Star,
  History,
  Receipt
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface MenuItem {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  path?: string;
  hasSwitch?: boolean;
  switchValue?: boolean;
  badge?: string;
}

export default function Profile() {
  const router = useRouter();

  const accountItems: MenuItem[] = [
    {
      icon: <User className="w-5 h-5" />,
      title: 'Personal Information',
      subtitle: 'Update your details',
      path: '/profile/personal'
    },
    {
      icon: <Car className="w-5 h-5" />,
      title: 'My Vehicles',
      subtitle: '3 vehicles',
      path: '/vehicles',
      badge: '3'
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      title: 'Payment Methods',
      subtitle: 'Manage cards & payments',
      path: '/profile/payments'
    }
  ];

  const activityItems: MenuItem[] = [
    {
      icon: <History className="w-5 h-5" />,
      title: 'Service History',
      subtitle: 'View past services',
      path: '/profile/history'
    },
    {
      icon: <Star className="w-5 h-5" />,
      title: 'Reviews & Ratings',
      subtitle: 'Your feedback',
      path: '/profile/reviews'
    },
    {
      icon: <Receipt className="w-5 h-5" />,
      title: 'Receipts & Invoices',
      subtitle: 'Download documents',
      path: '/profile/receipts'
    }
  ];

  const settingsItems: MenuItem[] = [
    {
      icon: <Bell className="w-5 h-5" />,
      title: 'Push Notifications',
      subtitle: 'Service reminders & updates',
      hasSwitch: true,
      switchValue: true
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'Privacy & Security',
      subtitle: 'Manage your data',
      path: '/profile/privacy'
    },
    {
      icon: <HelpCircle className="w-5 h-5" />,
      title: 'Help & Support',
      subtitle: 'Get assistance',
      path: '/profile/help'
    }
  ];

  const handleItemClick = (item: MenuItem) => {
    if (item.path) {
      router.push(item.path);
    }
  };

  const renderMenuSection = (title: string, items: MenuItem[]) => (
    <div className="mb-6">
      <h2 className="text-lg font-bold mb-3 text-white px-1">
        {title}
      </h2>
      
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index}>
                <Card 
                  className={`cursor-pointer transition-transform ${
                    item.path ? 'active:scale-95' : 'cursor-default'
                  }`}
                  onClick={() => handleItemClick(item)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                        {item.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <h3 className="font-semibold text-gray-900">
                            {item.title}
                          </h3>
                          {item.badge && (
                            <Badge className="ml-2 bg-blue-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center p-0">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        {item.subtitle && (
                          <p className="text-sm text-muted-foreground">
                            {item.subtitle}
                          </p>
                        )}
                      </div>

                      {/* Action */}
                      {item.hasSwitch ? (
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={item.switchValue}
                            className="w-10 h-6 bg-gray-200 rounded-full relative appearance-none cursor-pointer checked:bg-blue-600 transition-colors"
                            readOnly
                          />
                        </div>
                      ) : item.path ? (
                        <ChevronRight className="w-5 h-5 text-blue-600 opacity-70" />
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
                {index < items.length - 1 && (
                  <div className="h-px bg-gray-200 mx-4" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
      {/* Status Bar Space */}
      <div className="h-11" />
      
      {/* Header */}
      <div className="flex items-center justify-center px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Profile</h1>
          </div>
        </div>
      </div>

      {/* Profile Header */}
      <div className="px-4 mb-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
              JD
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              John Doe
            </h2>
            <p className="text-muted-foreground mb-4">
              john.doe@email.com
            </p>
            
            {/* Quick Stats */}
            <div className="flex justify-center gap-8">
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">3</div>
                <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
                  Vehicles
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">12</div>
                <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
                  Services
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-yellow-600">4.8</div>
                <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
                  Rating
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content */}
      <div className="px-4 pb-24">
        {renderMenuSection('Account', accountItems)}
        {renderMenuSection('Activity', activityItems)}
        {renderMenuSection('Settings', settingsItems)}
      </div>

      {/* Bottom Safe Area */}
      <div className="h-8" />
    </div>
  );
}