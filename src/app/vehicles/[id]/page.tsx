'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Stack,
  Divider,
  Slide,
  Dialog
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Check,
  Close,
  DirectionsCar,
  Build,
  LocalGasStation,
  Speed
} from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  odometer: number;
  color?: string;
  licensePlate?: string;
  nextService?: string;
  fuelLevel?: number;
}

const mockVehicles: Record<string, Vehicle> = {
  '1': {
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
  '2': {
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
  '3': {
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
};

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

export default function VehicleDetails() {
  const router = useRouter();
  const params = useParams();
  const vehicleId = params.id as string;

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedVehicle, setEditedVehicle] = useState<Vehicle | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const foundVehicle = mockVehicles[vehicleId];
    if (foundVehicle) {
      setVehicle(foundVehicle);
      setEditedVehicle(foundVehicle);
    }
  }, [vehicleId]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedVehicle(vehicle);
    setIsEditing(false);
  };

  const handleSave = () => {
    if (editedVehicle) {
      setVehicle(editedVehicle);
      setIsEditing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  const handleInputChange = (field: keyof Vehicle, value: string | number) => {
    if (editedVehicle) {
      setEditedVehicle({
        ...editedVehicle,
        [field]: value
      });
    }
  };

  if (!vehicle) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <Box sx={{ height: '44px', backgroundColor: '#1e40af' }} />
        <Box 
          sx={{ 
            backgroundColor: '#1e40af',
            px: 2,
            py: 1.5,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <IconButton onClick={() => router.back()} sx={{ color: 'white', p: 1 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, ml: 1 }}>
            Vehicle Details
          </Typography>
        </Box>
        <Box sx={{ p: 3, textAlign: 'center', mt: 8 }}>
          <Typography variant="h6" color="text.secondary">
            Vehicle not found
          </Typography>
        </Box>
      </Box>
    );
  }

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
            Vehicle Details
          </Typography>
        </Box>
        
        {isEditing ? (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              onClick={handleCancel}
              sx={{ 
                color: 'white', 
                p: 1,
                backgroundColor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Close />
            </IconButton>
            <IconButton
              onClick={handleSave}
              sx={{ 
                color: 'white', 
                p: 1,
                backgroundColor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Check />
            </IconButton>
          </Box>
        ) : (
          <IconButton
            onClick={handleEdit}
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
            <Edit />
          </IconButton>
        )}
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
              mb: 1,
              fontSize: '1.5rem'
            }}
          >
            {vehicle.year} {vehicle.make} {vehicle.model}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: '1rem', fontWeight: 500 }}
          >
            {vehicle.licensePlate} • {vehicle.color}
          </Typography>
        </Box>

        {/* Quick Stats */}
        <Box sx={{ 
          backgroundColor: 'white', 
          borderRadius: 3,
          p: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid rgba(255,255,255,0.8)',
          mb: 2
        }}>
          <Stack direction="row" spacing={2}>
            <Box sx={{ textAlign: 'center', flex: 1 }}>
              <Box sx={{ 
                backgroundColor: '#f1f5f9', 
                borderRadius: 2.5, 
                p: 2.5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1
              }}>
                <Speed sx={{ color: '#1e40af', fontSize: '1.5rem' }} />
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#1e293b' }}>
                  {vehicle.odometer.toLocaleString()}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                  Miles
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ textAlign: 'center', flex: 1 }}>
              <Box sx={{ 
                backgroundColor: '#f0fdf4', 
                borderRadius: 2.5, 
                p: 2.5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1
              }}>
                <LocalGasStation sx={{ color: '#059669', fontSize: '1.5rem' }} />
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#1e293b' }}>
                  {vehicle.fuelLevel}%
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                  Fuel Level
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ textAlign: 'center', flex: 1 }}>
              <Box sx={{ 
                backgroundColor: vehicle.nextService?.includes('Due') ? '#fef2f2' : '#f0fdf4', 
                borderRadius: 2.5, 
                p: 2.5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1
              }}>
                <Build sx={{ 
                  color: vehicle.nextService?.includes('Due') ? '#ef4444' : '#22c55e', 
                  fontSize: '1.5rem' 
                }} />
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: vehicle.nextService?.includes('Due') ? '#ef4444' : '#22c55e',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textAlign: 'center',
                    lineHeight: 1.2
                  }}
                >
                  {vehicle.nextService}
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Box>

        {/* Vehicle Details Form */}
        <Box sx={{ 
          backgroundColor: 'white', 
          borderRadius: 3,
          p: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid rgba(255,255,255,0.8)'
        }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600, 
            mb: 3, 
            color: '#1e293b',
            fontSize: '1.125rem'
          }}
        >
          Vehicle Information
        </Typography>
        
        <Stack spacing={3}>
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
              Make
            </Typography>
            {isEditing ? (
              <TextField
                fullWidth
                value={editedVehicle?.make || ''}
                onChange={(e) => handleInputChange('make', e.target.value)}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#f8fafc',
                    fontSize: '1rem'
                  }
                }}
              />
            ) : (
              <Typography
                variant="body1"
                sx={{ 
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: '#1e293b',
                  py: 1
                }}
              >
                {vehicle.make}
              </Typography>
            )}
          </Box>

          <Divider />

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
              Model
            </Typography>
            {isEditing ? (
              <TextField
                fullWidth
                value={editedVehicle?.model || ''}
                onChange={(e) => handleInputChange('model', e.target.value)}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#f8fafc',
                    fontSize: '1rem'
                  }
                }}
              />
            ) : (
              <Typography
                variant="body1"
                sx={{ 
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: '#1e293b',
                  py: 1
                }}
              >
                {vehicle.model}
              </Typography>
            )}
          </Box>

          <Divider />

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
              Year
            </Typography>
            {isEditing ? (
              <TextField
                fullWidth
                type="number"
                value={editedVehicle?.year || ''}
                onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                variant="outlined"
                inputProps={{ min: 1900, max: new Date().getFullYear() + 1 }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#f8fafc',
                    fontSize: '1rem'
                  }
                }}
              />
            ) : (
              <Typography
                variant="body1"
                sx={{ 
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: '#1e293b',
                  py: 1
                }}
              >
                {vehicle.year}
              </Typography>
            )}
          </Box>

          <Divider />

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
              Current Odometer (miles)
            </Typography>
            {isEditing ? (
              <TextField
                fullWidth
                type="number"
                value={editedVehicle?.odometer || ''}
                onChange={(e) => handleInputChange('odometer', parseInt(e.target.value))}
                variant="outlined"
                inputProps={{ min: 0 }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#f8fafc',
                    fontSize: '1rem'
                  }
                }}
              />
            ) : (
              <Typography
                variant="body1"
                sx={{ 
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: '#1e293b',
                  py: 1
                }}
              >
                {vehicle.odometer.toLocaleString()} miles
              </Typography>
            )}
          </Box>
        </Stack>
        </Box>
      </Box>

      {/* Success Notification */}
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
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Check sx={{ fontSize: '3rem', mb: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Changes Saved!
          </Typography>
        </Box>
      </Dialog>

      {/* Bottom Safe Area for Navigation */}
      <Box sx={{ height: '100px', backgroundColor: 'transparent' }} />
    </Box>
  );
}