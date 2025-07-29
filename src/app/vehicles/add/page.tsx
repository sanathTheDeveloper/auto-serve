'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Stack,
  Slide,
  Dialog
} from '@mui/material';
import {
  ArrowBack,
  DirectionsCar,
  Check
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface NewVehicle {
  make: string;
  model: string;
  year: string;
  odometer: string;
  color: string;
  licensePlate: string;
}

interface TransitionProps {
  children: React.ReactElement;
  in?: boolean;
  onEnter?: (node: HTMLElement, isAppearing: boolean) => void;
  onExited?: (node: HTMLElement) => void;
}

const Transition = React.forwardRef<unknown, TransitionProps>(function Transition(
  props,
  ref,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddVehicle() {
  const router = useRouter();
  const [vehicle, setVehicle] = useState<NewVehicle>({
    make: '',
    model: '',
    year: '',
    odometer: '',
    color: '',
    licensePlate: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (field: keyof NewVehicle, value: string) => {
    setVehicle(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!vehicle.make.trim()) {
      newErrors.make = 'Make is required';
    }

    if (!vehicle.model.trim()) {
      newErrors.model = 'Model is required';
    }

    if (!vehicle.year.trim()) {
      newErrors.year = 'Year is required';
    } else {
      const yearNum = parseInt(vehicle.year);
      const currentYear = new Date().getFullYear();
      if (yearNum < 1900 || yearNum > currentYear + 1) {
        newErrors.year = `Year must be between 1900 and ${currentYear + 1}`;
      }
    }

    if (!vehicle.odometer.trim()) {
      newErrors.odometer = 'Odometer reading is required';
    } else {
      const odometerNum = parseInt(vehicle.odometer);
      if (odometerNum < 0) {
        newErrors.odometer = 'Odometer reading must be positive';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const canSave = () => {
    return vehicle.make.trim() && 
           vehicle.model.trim() && 
           vehicle.year.trim() && 
           vehicle.odometer.trim();
  };

  const handleSave = () => {
    if (validateForm()) {
      console.log('Saving vehicle:', vehicle);
      setShowSuccess(true);
      
      setTimeout(() => {
        router.push('/vehicles');
      }, 2000);
    }
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
            Add Vehicle
          </Typography>
        </Box>
        
        <IconButton
          onClick={handleSave}
          disabled={!canSave()}
          sx={{ 
            color: canSave() ? 'white' : 'rgba(255,255,255,0.3)',
            p: 1,
            backgroundColor: canSave() ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)',
            '&:hover': canSave() ? {
              backgroundColor: 'rgba(255,255,255,0.2)'
            } : {}
          }}
        >
          <Check />
        </IconButton>
      </Box>

      {/* Content */}
      <Box sx={{ px: 2, pb: 6 }}>
        {/* Hero Section */}
        <Box sx={{ 
          backgroundColor: 'white', 
          borderRadius: 3,
          p: 4,
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid rgba(255,255,255,0.8)',
          mb: 2
        }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: 3,
              backgroundColor: '#1e40af',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              mx: 'auto',
              mb: 3,
              boxShadow: '0 4px 12px rgba(30, 64, 175, 0.3)'
            }}
          >
            <DirectionsCar sx={{ fontSize: '2rem' }} />
          </Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#1e293b',
              mb: 2,
              fontSize: '1.5rem'
            }}
          >
            Add Your Vehicle
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ 
              lineHeight: 1.6, 
              fontSize: '1rem',
              fontWeight: 500,
              maxWidth: '300px',
              mx: 'auto'
            }}
          >
            Enter your vehicle details to start tracking maintenance and services
          </Typography>
        </Box>

        {/* Form Section */}
        <Box sx={{ 
          backgroundColor: 'white', 
          borderRadius: 3,
          p: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid rgba(255,255,255,0.8)',
          mb: 2
        }}>
        <Stack spacing={4}>
          <Box>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: '#475569',
                mb: 1.5,
                fontSize: '0.875rem'
              }}
            >
              Make *
            </Typography>
            <TextField
              fullWidth
              placeholder="Toyota, Honda, Ford..."
              value={vehicle.make}
              onChange={(e) => handleInputChange('make', e.target.value)}
              error={!!errors.make}
              helperText={errors.make}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#f8fafc',
                  fontSize: '1rem',
                  '&.Mui-focused': {
                    backgroundColor: 'white'
                  }
                }
              }}
            />
          </Box>

          <Box>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: '#475569',
                mb: 1.5,
                fontSize: '0.875rem'
              }}
            >
              Model *
            </Typography>
            <TextField
              fullWidth
              placeholder="Camry, Civic, F-150..."
              value={vehicle.model}
              onChange={(e) => handleInputChange('model', e.target.value)}
              error={!!errors.model}
              helperText={errors.model}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#f8fafc',
                  fontSize: '1rem',
                  '&.Mui-focused': {
                    backgroundColor: 'white'
                  }
                }
              }}
            />
          </Box>

          <Box>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: '#475569',
                mb: 1.5,
                fontSize: '0.875rem'
              }}
            >
              Year *
            </Typography>
            <TextField
              fullWidth
              type="number"
              placeholder="2020"
              value={vehicle.year}
              onChange={(e) => handleInputChange('year', e.target.value)}
              error={!!errors.year}
              helperText={errors.year}
              variant="outlined"
              inputProps={{ min: 1900, max: new Date().getFullYear() + 1 }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#f8fafc',
                  fontSize: '1rem',
                  '&.Mui-focused': {
                    backgroundColor: 'white'
                  }
                }
              }}
            />
          </Box>

          <Box>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: '#475569',
                mb: 1.5,
                fontSize: '0.875rem'
              }}
            >
              Current Mileage *
            </Typography>
            <TextField
              fullWidth
              type="number"
              placeholder="45,000"
              value={vehicle.odometer}
              onChange={(e) => handleInputChange('odometer', e.target.value)}
              error={!!errors.odometer}
              helperText={errors.odometer || 'Current odometer reading'}
              variant="outlined"
              inputProps={{ min: 0 }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#f8fafc',
                  fontSize: '1rem',
                  '&.Mui-focused': {
                    backgroundColor: 'white'
                  }
                }
              }}
            />
          </Box>

          <Box>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: '#475569',
                mb: 1.5,
                fontSize: '0.875rem'
              }}
            >
              Color (Optional)
            </Typography>
            <TextField
              fullWidth
              placeholder="Silver, Blue, Black..."
              value={vehicle.color}
              onChange={(e) => handleInputChange('color', e.target.value)}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#f8fafc',
                  fontSize: '1rem',
                  '&.Mui-focused': {
                    backgroundColor: 'white'
                  }
                }
              }}
            />
          </Box>

          <Box>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: '#475569',
                mb: 1.5,
                fontSize: '0.875rem'
              }}
            >
              License Plate (Optional)
            </Typography>
            <TextField
              fullWidth
              placeholder="ABC 123"
              value={vehicle.licensePlate}
              onChange={(e) => handleInputChange('licensePlate', e.target.value.toUpperCase())}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#f8fafc',
                  fontSize: '1rem',
                  '&.Mui-focused': {
                    backgroundColor: 'white'
                  }
                }
              }}
            />
          </Box>
        </Stack>
      </Box>

        {/* Bottom CTA */}
        <Box sx={{ 
          mt: 3
        }}>
          <Box
            onClick={canSave() ? handleSave : undefined}
            sx={{
              backgroundColor: canSave() ? '#ef4444' : '#e2e8f0',
              color: canSave() ? 'white' : '#9ca3af',
              borderRadius: 3,
              py: 2.5,
              textAlign: 'center',
              cursor: canSave() ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease',
              boxShadow: canSave() ? '0 4px 16px rgba(239, 68, 68, 0.3)' : 'none',
              '&:active': canSave() ? {
                transform: 'scale(0.98)',
                backgroundColor: '#dc2626'
              } : {}
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                fontSize: '1.125rem'
              }}
            >
              Add Vehicle
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Success Dialog */}
      <Dialog
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            backgroundColor: '#22c55e',
            color: 'white',
            borderRadius: 3,
            m: 2,
            minWidth: 0,
            boxShadow: '0 10px 40px rgba(34, 197, 94, 0.3)'
          }
        }}
      >
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Check sx={{ fontSize: '4rem', mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
            Vehicle Added!
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Redirecting to your vehicles...
          </Typography>
        </Box>
      </Dialog>

      {/* Bottom Safe Area for Navigation */}
      <Box sx={{ height: '100px', backgroundColor: 'transparent' }} />
    </Box>
  );
}