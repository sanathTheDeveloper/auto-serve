'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Chip,
  Avatar,
  Tabs,
  Tab
} from '@mui/material';
import {
  DirectionsCar,
  Schedule,
  CheckCircle,
  Pending,
  History,
  LocationOn,
  Build
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface Booking {
  id: string;
  vehicle: string;
  service: string;
  mechanic: string;
  address: string;
  date: string;
  time: string;
  price: string;
  status: 'upcoming' | 'completed' | 'pending';
  paymentStatus: 'paid' | 'pending' | 'deposit';
}

const mockBookings: Booking[] = [
  {
    id: '1',
    vehicle: '2020 Toyota Camry',
    service: 'Basic Service',
    mechanic: 'AutoCare Plus',
    address: '123 Collins Street, Melbourne',
    date: 'Tomorrow',
    time: '2:00 PM',
    price: '$120',
    status: 'upcoming',
    paymentStatus: 'deposit'
  },
  {
    id: '2',
    vehicle: '2019 Honda Civic',
    service: 'Oil Change',
    mechanic: 'Quick Fix Automotive',
    address: '789 Bourke Street, Melbourne',
    date: 'Dec 28',
    time: '10:30 AM',
    price: '$80',
    status: 'completed',
    paymentStatus: 'paid'
  },
  {
    id: '3',
    vehicle: '2021 Ford F-150',
    service: 'Brake Service',
    mechanic: 'Melbourne Motor Works',
    address: '456 Flinders Lane, Melbourne',
    date: 'Jan 5',
    time: '3:00 PM',
    price: '$200',
    status: 'pending',
    paymentStatus: 'pending'
  }
];

export default function Bookings() {
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  const [bookings] = useState<Booking[]>(mockBookings);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return '#1e40af';
      case 'completed': return '#22c55e';
      case 'pending': return '#f59e0b';
      default: return '#64748b';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming': return <Schedule sx={{ fontSize: '1rem' }} />;
      case 'completed': return <CheckCircle sx={{ fontSize: '1rem' }} />;
      case 'pending': return <Pending sx={{ fontSize: '1rem' }} />;
      default: return <History sx={{ fontSize: '1rem' }} />;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (tabValue === 0) return booking.status === 'upcoming';
    if (tabValue === 1) return booking.status === 'completed';
    return true;
  });

  const handleBookingClick = (bookingId: string) => {
    router.push(`/bookings/${bookingId}`);
  };

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
            <Schedule sx={{ color: 'white', fontSize: '1rem' }} />
          </Box>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'white',
              fontWeight: 700,
              fontSize: '1.25rem'
            }}
          >
            My Bookings
          </Typography>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ px: 2, mb: 2 }}>
        <Box sx={{ 
          backgroundColor: 'white', 
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid rgba(255,255,255,0.8)'
        }}>
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.875rem',
                py: 2
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#1e40af'
              }
            }}
          >
            <Tab label="Upcoming" />
            <Tab label="Completed" />
            <Tab label="All" />
          </Tabs>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ px: 2, pb: 12 }}>
        {filteredBookings.length === 0 ? (
          <Box sx={{ 
            backgroundColor: 'white', 
            borderRadius: 3,
            p: 6,
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid rgba(255,255,255,0.8)'
          }}>
            <Avatar
              sx={{ 
                width: 80, 
                height: 80,
                mx: 'auto',
                mb: 3,
                backgroundColor: '#f1f5f9',
                color: '#64748b'
              }}
            >
              <Schedule sx={{ fontSize: '2rem' }} />
            </Avatar>
            <Typography 
              variant="h5" 
              color="text.primary"
              gutterBottom
              sx={{ fontWeight: 700, mb: 2, fontSize: '1.375rem' }}
            >
              No bookings yet
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ lineHeight: 1.6, fontSize: '1rem', fontWeight: 500 }}
            >
              When you book a service, it will appear here
            </Typography>
          </Box>
        ) : (
          <Box sx={{ 
            backgroundColor: 'white', 
            borderRadius: 3,
            p: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid rgba(255,255,255,0.8)'
          }}>
            <Stack spacing={1}>
              {filteredBookings.map((booking) => (
                <Box
                  key={booking.id}
                  onClick={() => handleBookingClick(booking.id)}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    p: 3,
                    borderRadius: 2.5,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    backgroundColor: '#fafafa',
                    border: '1px solid #f1f5f9',
                    '&:active': {
                      backgroundColor: '#f3f4f6',
                      transform: 'scale(0.98)'
                    }
                  }}
                >
                  {/* Vehicle Avatar */}
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: 3,
                      backgroundColor: getStatusColor(booking.status),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      mr: 3,
                      boxShadow: `0 4px 12px ${getStatusColor(booking.status)}40`,
                      flexShrink: 0
                    }}
                  >
                    <DirectionsCar sx={{ fontSize: '1.5rem' }} />
                  </Box>

                  {/* Booking Info */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 700,
                          color: '#1e293b',
                          fontSize: '1.125rem',
                          lineHeight: 1.2
                        }}
                      >
                        {booking.vehicle}
                      </Typography>
                      
                      <Chip
                        icon={getStatusIcon(booking.status)}
                        label={booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        size="small"
                        sx={{
                          backgroundColor: `${getStatusColor(booking.status)}15`,
                          color: getStatusColor(booking.status),
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          '& .MuiChip-icon': {
                            color: getStatusColor(booking.status)
                          }
                        }}
                      />
                    </Box>
                    
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#64748b',
                        fontSize: '0.875rem',
                        mb: 1,
                        fontWeight: 600
                      }}
                    >
                      {booking.service}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Build sx={{ fontSize: '0.875rem', color: '#64748b', mr: 0.5 }} />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ 
                          fontSize: '0.8125rem',
                          mr: 2
                        }}
                      >
                        {booking.mechanic}
                      </Typography>
                      
                      <LocationOn sx={{ fontSize: '0.875rem', color: '#64748b', mr: 0.5 }} />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ 
                          fontSize: '0.8125rem',
                          flex: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {booking.address}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#1e293b',
                          fontSize: '0.875rem',
                          fontWeight: 600
                        }}
                      >
                        {booking.date} at {booking.time}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          label={booking.paymentStatus === 'paid' ? 'Paid' : booking.paymentStatus === 'deposit' ? 'Deposit Paid' : 'Payment Due'}
                          size="small"
                          sx={{
                            backgroundColor: booking.paymentStatus === 'paid' ? '#22c55e15' : '#f59e0b15',
                            color: booking.paymentStatus === 'paid' ? '#22c55e' : '#f59e0b',
                            fontSize: '0.625rem',
                            fontWeight: 600,
                            height: '20px'
                          }}
                        />
                        
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#059669',
                            fontSize: '0.875rem',
                            fontWeight: 700
                          }}
                        >
                          {booking.price}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>
        )}
      </Box>

      {/* Bottom Safe Area */}
      <Box sx={{ height: '34px', backgroundColor: 'transparent' }} />
    </Box>
  );
}