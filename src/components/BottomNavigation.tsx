'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Home,
  Search,
  Calendar,
  Car,
  User
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

interface NavigationItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
  badge?: number;
}

const navigationItems: NavigationItem[] = [
  {
    icon: Home,
    label: 'Home',
    path: '/'
  },
  {
    icon: Search,
    label: 'Mechanics',
    path: '/mechanics'
  },
  {
    icon: Calendar,
    label: 'Bookings',
    path: '/bookings',
    badge: 2
  },
  {
    icon: Car,
    label: 'Vehicles',
    path: '/vehicles'
  },
  {
    icon: User,
    label: 'Profile',
    path: '/profile'
  }
];

export default function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50 pb-safe">
      <div className="flex justify-around items-center py-2">
        {navigationItems.map((item) => {
          const active = isActive(item.path);
          const IconComponent = item.icon;
          
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className="flex flex-col items-center py-2 px-3 min-w-[60px] transition-all duration-200 active:scale-95"
            >
              <div className="relative mb-1">
                {item.badge ? (
                  <div className="relative">
                    <IconComponent 
                      className={`w-6 h-6 transition-colors ${
                        active ? 'text-primary' : 'text-muted-foreground'
                      }`} 
                    />
                    <Badge className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                      {item.badge}
                    </Badge>
                  </div>
                ) : (
                  <IconComponent 
                    className={`w-6 h-6 transition-colors ${
                      active ? 'text-primary' : 'text-muted-foreground'
                    }`} 
                  />
                )}
              </div>
              
              <span
                className={`text-xs transition-colors ${
                  active 
                    ? 'text-primary font-semibold' 
                    : 'text-muted-foreground font-medium'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}