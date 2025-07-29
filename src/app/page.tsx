'use client';

import { Box, Typography, Avatar, Stack, Badge } from '@mui/material';
import { 
  DirectionsCar, 
  Build, 
  Schedule, 
  Search,
  ChevronRight,
  Person,
  Notifications,
  CalendarMonth
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hour = now.getHours();
      let greeting = 'Good morning';
      if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
      if (hour >= 17) greeting = 'Good evening';
      setCurrentTime(greeting);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const upcomingServices = [
    {
      vehicle: '2020 Toyota Camry',
      service: 'Basic Service',
      date: 'Tomorrow, 2:00 PM',
      mechanic: 'AutoCare Plus',
      status: 'confirmed'
    },
    {
      vehicle: '2019 Honda Civic',
      service: 'Oil Change Due',
      dueDate: 'Due in 3 days',
      status: 'reminder'
    }
  ];

  const quickActions = [
    {
      title: 'Find Mechanics',
      description: 'Search nearby mechanics',
      icon: <Search sx={{ fontSize: '1.5rem' }} />,
      color: '#1e40af',
      path: '/mechanics'
    },
    {
      title: 'Book Service',
      description: 'Schedule maintenance',
      icon: <CalendarMonth sx={{ fontSize: '1.5rem' }} />,
      color: '#059669',
      path: '/mechanics'
    },
    {
      title: 'My Vehicles',
      description: 'Manage fleet',
      icon: <DirectionsCar sx={{ fontSize: '1.5rem' }} />,
      color: '#7c3aed',
      path: '/vehicles'
    }
  ];

  const recentActivity = [
    {
      title: 'Service Completed',
      description: '2020 Toyota Camry - Basic Service at AutoCare Plus',
      time: '2 days ago',
      type: 'completed'
    },
    {
      title: 'Payment Processed',
      description: '$180 for Honda Civic oil change',
      time: '1 week ago',
      type: 'payment'
    }
  ];

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
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 2,
                backgroundColor: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2
              }}
            >
              <DirectionsCar sx={{ color: 'white', fontSize: '1.25rem' }} />
            </Box>
            <Typography 
              variant="h4" 
              sx={{ 
                color: 'white',
                fontWeight: 800,
                fontSize: '1.625rem',
                letterSpacing: '-0.02em'
              }}
            >
              Auto Serve
            </Typography>
          </Box>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'rgba(255,255,255,0.85)',
              fontSize: '0.875rem',
              fontWeight: 500,
              ml: 5
            }}
          >
            Vehicle Management Hub
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Badge
            badgeContent={2}
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: '#ef4444',
                color: 'white',
                fontSize: '0.625rem',
                fontWeight: 600,
                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
              }
            }}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <Notifications sx={{ fontSize: '1.125rem' }} />
            </Avatar>
          </Badge>
          
          <Avatar
            sx={{
              width: 40,
              height: 40,
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              ml: 0.5,
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <Person sx={{ fontSize: '1.125rem' }} />
          </Avatar>
        </Box>
      </Box>

      {/* Welcome Section */}
      <Box sx={{ 
        backgroundColor: 'white', 
        mx: 2,
        mt: 1,
        borderRadius: 3,
        p: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid rgba(255,255,255,0.8)'
      }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: '#1e293b',
            mb: 1,
            fontSize: '1.5rem'
          }}
        >
          {currentTime}! 👋
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ 
            lineHeight: 1.6,
            fontSize: '1rem',
            fontWeight: 500
          }}
        >
          Ready to keep your vehicles in top condition?
        </Typography>
      </Box>

      {/* Upcoming Services */}
      {upcomingServices.length > 0 && (
        <Box sx={{ px: 2, mt: 2 }}>
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
            Upcoming Services
          </Typography>
          
          <Stack spacing={1}>
            {upcomingServices.map((service, index) => (
              <Box
                key={index}
                sx={{
                  backgroundColor: 'white',
                  borderRadius: 2.5,
                  p: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(255,255,255,0.8)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:active': {
                    transform: 'scale(0.98)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: service.status === 'confirmed' ? '#22c55e' : '#f59e0b',
                      mr: 1
                    }}
                  />
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 700,
                      color: '#1e293b',
                      fontSize: '1rem'
                    }}
                  >
                    {service.vehicle}
                  </Typography>
                </Box>
                
                <Typography
                  variant="body2"
                  sx={{
                    color: '#64748b',
                    fontSize: '0.875rem',
                    mb: 0.5
                  }}
                >
                  {service.service}
                </Typography>
                
                <Typography
                  variant="caption"
                  sx={{
                    color: service.status === 'confirmed' ? '#22c55e' : '#f59e0b',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}
                >
                  {service.date || service.dueDate}
                  {service.mechanic && ` • ${service.mechanic}`}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      {/* Quick Stats */}
      <Box sx={{ px: 2, mt: 2 }}>
        <Stack direction="row" spacing={1.5}>
          <Box sx={{ 
            flex: 1,
            backgroundColor: 'rgba(255,255,255,0.95)', 
            borderRadius: 2.5, 
            p: 2.5,
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.6)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
          }}>
            <Typography variant="h4" sx={{ 
              fontWeight: 800, 
              color: '#1e40af',
              fontSize: '1.75rem',
              mb: 0.5
            }}>
              3
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ 
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Vehicles
            </Typography>
          </Box>
          
          <Box sx={{ 
            flex: 1,
            backgroundColor: 'rgba(255,255,255,0.95)', 
            borderRadius: 2.5, 
            p: 2.5,
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.6)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
          }}>
            <Typography variant="h4" sx={{ 
              fontWeight: 800, 
              color: '#dc2626',
              fontSize: '1.75rem',
              mb: 0.5
            }}>
              2
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ 
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Due Soon
            </Typography>
          </Box>
          
          <Box sx={{ 
            flex: 1,
            backgroundColor: 'rgba(255,255,255,0.95)', 
            borderRadius: 2.5, 
            p: 2.5,
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.6)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
          }}>
            <Typography variant="h4" sx={{ 
              fontWeight: 800, 
              color: '#059669',
              fontSize: '1.75rem',
              mb: 0.5
            }}>
              $840
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ 
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              This Month
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Quick Actions */}
      <Box sx={{ px: 2, mt: 2 }}>
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
          Quick Actions
        </Typography>
        
        <Stack spacing={1}>
          {quickActions.map((action, index) => (
            <Box
              key={index}
              onClick={() => router.push(action.path)}
              sx={{
                backgroundColor: 'white',
                borderRadius: 2.5,
                p: 3,
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid rgba(255,255,255,0.8)',
                transition: 'all 0.2s ease',
                '&:active': {
                  transform: 'scale(0.98)'
                }
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2.5,
                  backgroundColor: action.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  mr: 3,
                  boxShadow: `0 4px 12px ${action.color}40`
                }}
              >
                {action.icon}
              </Box>
              
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    color: '#1e293b',
                    fontSize: '1rem',
                    mb: 0.5
                  }}
                >
                  {action.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: '0.875rem'
                  }}
                >
                  {action.description}
                </Typography>
              </Box>
              
              <ChevronRight sx={{ color: action.color, fontSize: '1.5rem', opacity: 0.7 }} />
            </Box>
          ))}
        </Stack>
      </Box>

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <Box sx={{ px: 2, mt: 2, mb: 3 }}>
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
            Recent Activity
          </Typography>
          
          <Box sx={{
            backgroundColor: 'white',
            borderRadius: 3,
            p: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid rgba(255,255,255,0.8)'
          }}>
            <Stack spacing={2}>
              {recentActivity.map((activity, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: activity.type === 'completed' ? '#22c55e15' : '#1e40af15',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                      mt: 0.5
                    }}
                  >
                    {activity.type === 'completed' ? (
                      <Build sx={{ fontSize: '1rem', color: '#22c55e' }} />
                    ) : (
                      <Schedule sx={{ fontSize: '1rem', color: '#1e40af' }} />
                    )}
                  </Box>
                  
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        color: '#1e293b',
                        fontSize: '0.875rem',
                        mb: 0.5
                      }}
                    >
                      {activity.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: '0.8125rem',
                        mb: 0.5
                      }}
                    >
                      {activity.description}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#9ca3af',
                        fontSize: '0.75rem'
                      }}
                    >
                      {activity.time}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>
        </Box>
      )}

      {/* Bottom Safe Area for Navigation */}
      <Box sx={{ height: '100px', backgroundColor: 'transparent' }} />
    </Box>
  );
}
