'use client';

import React from 'react';
import { Box, Typography, Badge } from '@mui/material';
import {
  Home,
  Search,
  CalendarMonth,
  DirectionsCar,
  Person
} from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';

interface NavigationItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  badge?: number;
}

const navigationItems: NavigationItem[] = [
  {
    icon: <Home />,
    label: 'Home',
    path: '/'
  },
  {
    icon: <Search />,
    label: 'Mechanics',
    path: '/mechanics'
  },
  {
    icon: <CalendarMonth />,
    label: 'Bookings',
    path: '/bookings',
    badge: 2
  },
  {
    icon: <DirectionsCar />,
    label: 'Vehicles',
    path: '/vehicles'
  },
  {
    icon: <Person />,
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
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTop: '1px solid #f1f5f9',
        paddingBottom: '34px', // Safe area for iOS
        zIndex: 1000,
        boxShadow: '0 -2px 12px rgba(0,0,0,0.08)'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          py: 1
        }}
      >
        {navigationItems.map((item) => {
          const active = isActive(item.path);
          
          return (
            <Box
              key={item.path}
              onClick={() => router.push(item.path)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                py: 1,
                px: 2,
                minWidth: '60px',
                transition: 'all 0.2s ease',
                '&:active': {
                  transform: 'scale(0.95)'
                }
              }}
            >
              <Box sx={{ position: 'relative', mb: 0.5 }}>
                {item.badge ? (
                  <Badge
                    badgeContent={item.badge}
                    sx={{
                      '& .MuiBadge-badge': {
                        backgroundColor: '#ef4444',
                        color: 'white',
                        fontSize: '0.625rem',
                        fontWeight: 600,
                        minWidth: '16px',
                        height: '16px'
                      }
                    }}
                  >
                    <Box
                      sx={{
                        color: active ? '#1e40af' : '#9ca3af',
                        fontSize: '1.5rem',
                        transition: 'color 0.2s ease'
                      }}
                    >
                      {item.icon}
                    </Box>
                  </Badge>
                ) : (
                  <Box
                    sx={{
                      color: active ? '#1e40af' : '#9ca3af',
                      fontSize: '1.5rem',
                      transition: 'color 0.2s ease'
                    }}
                  >
                    {item.icon}
                  </Box>
                )}
              </Box>
              
              <Typography
                variant="caption"
                sx={{
                  color: active ? '#1e40af' : '#9ca3af',
                  fontSize: '0.625rem',
                  fontWeight: active ? 600 : 500,
                  textAlign: 'center',
                  transition: 'color 0.2s ease'
                }}
              >
                {item.label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}