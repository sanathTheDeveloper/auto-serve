'use client';

import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  Stack,
  Divider,
  Switch
} from '@mui/material';
import {
  Person,
  DirectionsCar,
  CreditCard,
  Notifications,
  Security,
  Help,
  ChevronRight,
  Star,
  History,
  Receipt
} from '@mui/icons-material';
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
      icon: <Person sx={{ fontSize: '1.25rem' }} />,
      title: 'Personal Information',
      subtitle: 'Update your details',
      path: '/profile/personal'
    },
    {
      icon: <DirectionsCar sx={{ fontSize: '1.25rem' }} />,
      title: 'My Vehicles',
      subtitle: '3 vehicles',
      path: '/vehicles',
      badge: '3'
    },
    {
      icon: <CreditCard sx={{ fontSize: '1.25rem' }} />,
      title: 'Payment Methods',
      subtitle: 'Manage cards & payments',
      path: '/profile/payments'
    }
  ];

  const activityItems: MenuItem[] = [
    {
      icon: <History sx={{ fontSize: '1.25rem' }} />,
      title: 'Service History',
      subtitle: 'View past services',
      path: '/profile/history'
    },
    {
      icon: <Star sx={{ fontSize: '1.25rem' }} />,
      title: 'Reviews & Ratings',
      subtitle: 'Your feedback',
      path: '/profile/reviews'
    },
    {
      icon: <Receipt sx={{ fontSize: '1.25rem' }} />,
      title: 'Receipts & Invoices',
      subtitle: 'Download documents',
      path: '/profile/receipts'
    }
  ];

  const settingsItems: MenuItem[] = [
    {
      icon: <Notifications sx={{ fontSize: '1.25rem' }} />,
      title: 'Push Notifications',
      subtitle: 'Service reminders & updates',
      hasSwitch: true,
      switchValue: true
    },
    {
      icon: <Security sx={{ fontSize: '1.25rem' }} />,
      title: 'Privacy & Security',
      subtitle: 'Manage your data',
      path: '/profile/privacy'
    },
    {
      icon: <Help sx={{ fontSize: '1.25rem' }} />,
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
    <Box sx={{ mb: 3 }}>
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 700, 
          mb: 2, 
          color: 'white',
          fontSize: '1.125rem',
          px: 1
        }}
      >
        {title}
      </Typography>
      
      <Box sx={{ 
        backgroundColor: 'white', 
        borderRadius: 3,
        p: 2,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid rgba(255,255,255,0.8)'
      }}>
        <Stack spacing={1}>
          {items.map((item, index) => (
            <Box key={index}>
              <Box
                onClick={() => handleItemClick(item)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2.5,
                  borderRadius: 2.5,
                  cursor: item.path ? 'pointer' : 'default',
                  transition: 'all 0.2s ease',
                  backgroundColor: '#fafafa',
                  border: '1px solid #f1f5f9',
                  '&:active': item.path ? {
                    backgroundColor: '#f3f4f6',
                    transform: 'scale(0.98)'
                  } : {}
                }}
              >
                {/* Icon */}
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2.5,
                    backgroundColor: '#1e40af15',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#1e40af',
                    mr: 3
                  }}
                >
                  {item.icon}
                </Box>

                {/* Content */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        color: '#1e293b',
                        fontSize: '1rem'
                      }}
                    >
                      {item.title}
                    </Typography>
                    {item.badge && (
                      <Box
                        sx={{
                          backgroundColor: '#1e40af',
                          color: 'white',
                          borderRadius: '50%',
                          width: 20,
                          height: 20,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.625rem',
                          fontWeight: 600,
                          ml: 1
                        }}
                      >
                        {item.badge}
                      </Box>
                    )}
                  </Box>
                  {item.subtitle && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: '0.875rem'
                      }}
                    >
                      {item.subtitle}
                    </Typography>
                  )}
                </Box>

                {/* Action */}
                {item.hasSwitch ? (
                  <Switch
                    checked={item.switchValue}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#1e40af'
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#1e40af'
                      }
                    }}
                  />
                ) : item.path ? (
                  <ChevronRight sx={{ 
                    color: '#1e40af', 
                    fontSize: '1.25rem',
                    opacity: 0.7
                  }} />
                ) : null}
              </Box>
              {index < items.length - 1 && (
                <Divider sx={{ mx: 2, my: 1 }} />
              )}
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)',
      maxWidth: '100vw',
      overflow: 'hidden'
    }}>
      {/* Mobile Status Bar Safe Area */}
      <Box sx={{ height: '44px', backgroundColor: 'transparent' }} />
      
      {/* Header */}
      <Box 
        sx={{ 
          px: 3,
          py: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: 2,
              backgroundColor: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 1.5
            }}
          >
            <Person sx={{ color: 'white', fontSize: '1rem' }} />
          </Box>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'white',
              fontWeight: 700,
              fontSize: '1.25rem'
            }}
          >
            Profile
          </Typography>
        </Box>
      </Box>

      {/* Profile Header */}
      <Box sx={{ px: 2, mb: 3 }}>
        <Box sx={{ 
          backgroundColor: 'white', 
          borderRadius: 3,
          p: 4,
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid rgba(255,255,255,0.8)'
        }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              mx: 'auto',
              mb: 2,
              backgroundColor: '#1e40af',
              color: 'white',
              fontSize: '2rem',
              fontWeight: 700
            }}
          >
            JD
          </Avatar>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: '#1e293b',
              mb: 0.5,
              fontSize: '1.375rem'
            }}
          >
            John Doe
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: '1rem', fontWeight: 500, mb: 2 }}
          >
            john.doe@email.com
          </Typography>
          
          {/* Quick Stats */}
          <Stack direction="row" spacing={3} justifyContent="center">
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e40af', fontSize: '1.25rem' }}>
                3
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                Vehicles
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#22c55e', fontSize: '1.25rem' }}>
                12
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                Services
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#f59e0b', fontSize: '1.25rem' }}>
                4.8
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                Rating
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ px: 2, pb: 12 }}>
        {renderMenuSection('Account', accountItems)}
        {renderMenuSection('Activity', activityItems)}
        {renderMenuSection('Settings', settingsItems)}
      </Box>

      {/* Bottom Safe Area */}
      <Box sx={{ height: '34px', backgroundColor: 'transparent' }} />
    </Box>
  );
}