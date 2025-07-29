'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Stack,
  Chip
} from '@mui/material';
import {
  Search,
  Map,
  List,
  DirectionsCar,
  Star,
  LocationOn,
  Schedule,
  ChevronRight,
  Tune
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface Mechanic {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  distance: string;
  address: string;
  services: string[];
  priceRange: string;
  availability: string;
  image?: string;
  specialties: string[];
}

const mockMechanics: Mechanic[] = [
  {
    id: '1',
    name: 'AutoCare Plus',
    rating: 4.8,
    reviewCount: 127,
    distance: '0.8 km',
    address: '123 Collins Street, Melbourne',
    services: ['Basic Service', 'Full Service', 'Brake Service'],
    priceRange: '$80-150',
    availability: 'Available Today',
    specialties: ['European Cars', 'Quick Service']
  },
  {
    id: '2',
    name: 'Melbourne Motor Works',
    rating: 4.6,
    reviewCount: 89,
    distance: '1.2 km',
    address: '456 Flinders Lane, Melbourne',
    services: ['Full Service', 'Tire Service', 'Engine Repair'],
    priceRange: '$100-200',
    availability: 'Tomorrow',
    specialties: ['Premium Service', 'Diagnostics']
  },
  {
    id: '3',
    name: 'Quick Fix Automotive',
    rating: 4.4,
    reviewCount: 203,
    distance: '2.1 km',
    address: '789 Bourke Street, Melbourne',
    services: ['Basic Service', 'Oil Change', 'Brake Service'],
    priceRange: '$60-120',
    availability: 'Available Today',
    specialties: ['Fast Service', 'Budget Friendly']
  }
];

export default function Mechanics() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [mechanics] = useState<Mechanic[]>(mockMechanics);

  const handleMechanicClick = (mechanicId: string) => {
    router.push(`/mechanics/${mechanicId}`);
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
            <Search sx={{ color: 'white', fontSize: '1rem' }} />
          </Box>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'white',
              fontWeight: 700,
              fontSize: '1.25rem'
            }}
          >
            Find Mechanics
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
            sx={{ 
              color: 'white',
              p: 1,
              backgroundColor: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)'
            }}
          >
            {viewMode === 'list' ? <Map /> : <List />}
          </IconButton>
          
          <IconButton
            sx={{ 
              color: 'white',
              p: 1,
              backgroundColor: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Tune />
          </IconButton>
        </Box>
      </Box>

      {/* Search and Filters */}
      <Box sx={{ px: 2, mb: 2 }}>
        <Box sx={{ 
          backgroundColor: 'white', 
          borderRadius: 3,
          p: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid rgba(255,255,255,0.8)'
        }}>
          <TextField
            fullWidth
            placeholder="Search by location, service type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#9ca3af' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: '#f8fafc',
                border: 'none',
                '& fieldset': {
                  border: 'none'
                }
              }
            }}
          />
          
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
            <Chip 
              label="Available Today" 
              size="small" 
              sx={{ 
                backgroundColor: '#22c55e15', 
                color: '#22c55e',
                fontWeight: 600,
                border: '1px solid #22c55e30'
              }} 
            />
            <Chip 
              label="Under $100" 
              size="small" 
              sx={{ 
                backgroundColor: '#1e40af15', 
                color: '#1e40af',
                fontWeight: 600,
                border: '1px solid #1e40af30'
              }} 
            />
            <Chip 
              label="High Rated" 
              size="small" 
              sx={{ 
                backgroundColor: '#f59e0b15', 
                color: '#f59e0b',
                fontWeight: 600,
                border: '1px solid #f59e0b30'
              }} 
            />
          </Stack>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ px: 2, pb: 12 }}>
        {viewMode === 'map' ? (
          // Map View Placeholder
          <Box sx={{ 
            backgroundColor: 'white', 
            borderRadius: 3,
            p: 6,
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid rgba(255,255,255,0.8)'
          }}>
            <Map sx={{ fontSize: '4rem', color: '#9ca3af', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 600 }}>
              Map View
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Interactive map showing nearby mechanics
            </Typography>
          </Box>
        ) : (
          // List View
          <Box sx={{ 
            backgroundColor: 'white', 
            borderRadius: 3,
            p: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid rgba(255,255,255,0.8)'
          }}>
            <Stack spacing={1}>
              {mechanics.map((mechanic) => (
                <Box
                  key={mechanic.id}
                  onClick={() => handleMechanicClick(mechanic.id)}
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
                  {/* Mechanic Avatar */}
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: 3,
                      backgroundColor: '#1e40af',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      mr: 3,
                      boxShadow: '0 4px 12px rgba(30, 64, 175, 0.3)',
                      flexShrink: 0
                    }}
                  >
                    <DirectionsCar sx={{ fontSize: '1.5rem' }} />
                  </Box>

                  {/* Mechanic Info */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 700,
                          color: '#1e293b',
                          fontSize: '1.125rem',
                          lineHeight: 1.2
                        }}
                      >
                        {mechanic.name}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                        <Star sx={{ fontSize: '1rem', color: '#f59e0b', mr: 0.5 }} />
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: '#1e293b',
                            fontSize: '0.875rem'
                          }}
                        >
                          {mechanic.rating}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#9ca3af',
                            fontSize: '0.75rem',
                            ml: 0.5
                          }}
                        >
                          ({mechanic.reviewCount})
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOn sx={{ fontSize: '0.875rem', color: '#64748b', mr: 0.5 }} />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ 
                          fontSize: '0.875rem',
                          mr: 2
                        }}
                      >
                        {mechanic.distance}
                      </Typography>
                      
                      <Schedule sx={{ fontSize: '0.875rem', color: '#64748b', mr: 0.5 }} />
                      <Typography
                        variant="body2"
                        sx={{
                          color: mechanic.availability === 'Available Today' ? '#22c55e' : '#f59e0b',
                          fontSize: '0.875rem',
                          fontWeight: 600
                        }}
                      >
                        {mechanic.availability}
                      </Typography>
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ 
                        fontSize: '0.8125rem',
                        mb: 1,
                        lineHeight: 1.3
                      }}
                    >
                      {mechanic.address}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                        {mechanic.specialties.slice(0, 2).map((specialty, index) => (
                          <Chip
                            key={index}
                            label={specialty}
                            size="small"
                            sx={{
                              backgroundColor: '#1e40af15',
                              color: '#1e40af',
                              fontSize: '0.625rem',
                              fontWeight: 600,
                              height: '20px'
                            }}
                          />
                        ))}
                      </Stack>
                      
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#059669',
                          fontSize: '0.875rem',
                          fontWeight: 700
                        }}
                      >
                        {mechanic.priceRange}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Chevron */}
                  <ChevronRight sx={{ 
                    color: '#1e40af', 
                    fontSize: '1.5rem',
                    opacity: 0.7,
                    ml: 1,
                    flexShrink: 0
                  }} />
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