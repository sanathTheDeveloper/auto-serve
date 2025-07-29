'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Stack,
  Badge
} from '@mui/material';
import {
  Add,
  DirectionsCar,
  ArrowBack,
  ChevronRight,
  Build
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  image?: string;
  odometer?: number;
  color?: string;
  licensePlate?: string;
  nextService?: string;
  fuelLevel?: number;
}

const mockVehicles: Vehicle[] = [
  {
    id: '1',
    make: 'Toyota',
    model: 'Camry',
    year: 2020,
    odometer: 45000,
    color: 'Silver',
    licensePlate: 'XYZ 123',
    nextService: 'Oil Change Due',
    fuelLevel: 75
  },
  {
    id: '2',
    make: 'Honda',
    model: 'Civic',
    year: 2019,
    odometer: 32000,
    color: 'Blue',
    licensePlate: 'ABC 456',
    nextService: 'Inspection Due',
    fuelLevel: 40
  },
  {
    id: '3',
    make: 'Ford',
    model: 'F-150',
    year: 2021,
    odometer: 28000,
    color: 'Black',
    licensePlate: 'DEF 789',
    nextService: 'Tire Rotation',
    fuelLevel: 90
  }
];

export default function MyVehicles() {
  const [vehicles] = useState<Vehicle[]>(mockVehicles);
  const router = useRouter();

  const handleVehicleClick = (vehicleId: string) => {
    router.push(`/vehicles/${vehicleId}`);
  };

  const handleAddVehicle = () => {
    router.push('/vehicles/add');
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
          justifyContent: 'space-between'
        }}
      >
        <IconButton
          onClick={() => router.back()}
          sx={{ 
            color: 'white',
            p: 1,
            backgroundColor: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.2)'
            }
          }}
        >
          <ArrowBack />
        </IconButton>
        
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
            <DirectionsCar sx={{ color: 'white', fontSize: '1rem' }} />
          </Box>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'white',
              fontWeight: 700,
              fontSize: '1.25rem'
            }}
          >
            My Vehicles
          </Typography>
        </Box>
        
        <Box sx={{ width: 40 }} /> {/* Spacer for center alignment */}
      </Box>

      {/* Content */}
      <Box sx={{ px: 2, pb: 6 }}>
        {vehicles.length === 0 ? (
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
              <DirectionsCar sx={{ fontSize: '2rem' }} />
            </Avatar>
            <Typography 
              variant="h5" 
              color="text.primary"
              gutterBottom
              sx={{ fontWeight: 700, mb: 2, fontSize: '1.375rem' }}
            >
              No vehicles yet
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ lineHeight: 1.6, fontSize: '1rem', fontWeight: 500 }}
            >
              Add your first vehicle to start tracking maintenance and services
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
              {vehicles.map((vehicle) => (
                <Box
                  key={vehicle.id}
                  onClick={() => handleVehicleClick(vehicle.id)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 2.5,
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
                      backgroundColor: '#1e40af',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      mr: 3,
                      boxShadow: '0 4px 12px rgba(30, 64, 175, 0.3)'
                    }}
                  >
                    <DirectionsCar sx={{ fontSize: '1.5rem' }} />
                  </Box>

                  {/* Vehicle Info */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 700,
                        color: '#1e293b',
                        fontSize: '1.125rem',
                        mb: 0.5,
                        lineHeight: 1.2
                      }}
                    >
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </Typography>
                    
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ 
                        fontSize: '0.875rem',
                        mb: 1,
                        fontWeight: 500
                      }}
                    >
                      {vehicle.licensePlate} • {vehicle.color} • {vehicle.odometer?.toLocaleString()} mi
                    </Typography>

                    {/* Service Status */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Badge
                        variant="dot"
                        sx={{
                          '& .MuiBadge-dot': {
                            backgroundColor: vehicle.nextService?.includes('Due') ? '#ef4444' : '#22c55e',
                            width: 8,
                            height: 8
                          }
                        }}
                      >
                        <Build sx={{ fontSize: '1rem', color: '#64748b' }} />
                      </Badge>
                      <Typography
                        variant="caption"
                        sx={{
                          color: vehicle.nextService?.includes('Due') ? '#ef4444' : '#22c55e',
                          fontSize: '0.8125rem',
                          fontWeight: 600
                        }}
                      >
                        {vehicle.nextService}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Chevron */}
                  <ChevronRight sx={{ 
                    color: '#1e40af', 
                    fontSize: '1.5rem',
                    opacity: 0.7
                  }} />
                </Box>
              ))}
            </Stack>
          </Box>
        )}
      </Box>

      {/* Mobile FAB */}
      <Box
        onClick={handleAddVehicle}
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 24,
          width: 64,
          height: 64,
          borderRadius: '50%',
          backgroundColor: '#ef4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 8px 32px rgba(239, 68, 68, 0.4)',
          transition: 'all 0.2s ease',
          border: '2px solid white',
          '&:active': {
            transform: 'scale(0.95)',
            boxShadow: '0 4px 16px rgba(239, 68, 68, 0.3)'
          }
        }}
      >
        <Add sx={{ color: 'white', fontSize: '2rem' }} />
      </Box>

      {/* Bottom Safe Area for Navigation */}
      <Box sx={{ height: '100px', backgroundColor: 'transparent' }} />
    </Box>
  );
}