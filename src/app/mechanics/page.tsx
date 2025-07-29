'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search,
  Map,
  List,
  Car,
  Star,
  MapPin,
  Clock,
  ChevronRight,
  Settings
} from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
      {/* Status Bar Space */}
      <div className="h-11" />
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Find Mechanics</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
            className="h-9 w-9 p-0 bg-white/20 hover:bg-white/30 backdrop-blur-sm"
          >
            {viewMode === 'list' ? <Map className="w-4 h-4 text-white" /> : <List className="w-4 h-4 text-white" />}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 bg-white/20 hover:bg-white/30 backdrop-blur-sm"
          >
            <Settings className="w-4 h-4 text-white" />
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="px-4 mb-4">
        <Card>
          <CardContent className="p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by location, service type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-none"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge 
                variant="secondary" 
                className="bg-green-50 text-green-600 hover:bg-green-100 border border-green-200"
              >
                Available Today
              </Badge>
              <Badge 
                variant="secondary" 
                className="bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200"
              >
                Under $100
              </Badge>
              <Badge 
                variant="secondary" 
                className="bg-yellow-50 text-yellow-600 hover:bg-yellow-100 border border-yellow-200"
              >
                High Rated
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content */}
      <div className="px-4 pb-24">
        {viewMode === 'map' ? (
          // Map View Placeholder
          <Card>
            <CardContent className="p-8 text-center">
              <Map className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Map View
              </h3>
              <p className="text-sm text-muted-foreground">
                Interactive map showing nearby mechanics
              </p>
            </CardContent>
          </Card>
        ) : (
          // List View
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                {mechanics.map((mechanic) => (
                  <Card 
                    key={mechanic.id} 
                    className="cursor-pointer active:scale-95 transition-transform"
                    onClick={() => handleMechanicClick(mechanic.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Mechanic Avatar */}
                        <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                          <Car className="w-6 h-6 text-white" />
                        </div>

                        {/* Mechanic Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-bold text-gray-900 text-lg">
                              {mechanic.name}
                            </h3>
                            
                            <div className="flex items-center ml-2">
                              <Star className="w-4 h-4 text-yellow-500 mr-1" />
                              <span className="font-semibold text-sm text-gray-900">
                                {mechanic.rating}
                              </span>
                              <span className="text-xs text-gray-400 ml-1">
                                ({mechanic.reviewCount})
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center mb-2">
                            <MapPin className="w-4 h-4 text-gray-500 mr-1" />
                            <span className="text-sm text-muted-foreground mr-4">
                              {mechanic.distance}
                            </span>
                            
                            <Clock className="w-4 h-4 text-gray-500 mr-1" />
                            <span className={`text-sm font-semibold ${
                              mechanic.availability === 'Available Today' ? 'text-green-600' : 'text-yellow-600'
                            }`}>
                              {mechanic.availability}
                            </span>
                          </div>

                          <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
                            {mechanic.address}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-1">
                              {mechanic.specialties.slice(0, 2).map((specialty, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="bg-blue-50 text-blue-600 text-xs px-2 py-1 h-5"
                                >
                                  {specialty}
                                </Badge>
                              ))}
                            </div>
                            
                            <span className="text-sm font-bold text-green-600">
                              {mechanic.priceRange}
                            </span>
                          </div>
                        </div>

                        {/* Chevron */}
                        <ChevronRight className="w-5 h-5 text-blue-600 opacity-70 flex-shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Bottom Safe Area */}
      <div className="h-8" />
    </div>
  );
}