"use client";

import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import mapboxgl from "mapbox-gl";
import { Mechanic } from "@/types/mechanic";
import {
  SlidersHorizontal,
  ChevronUp,
  ChevronDown,
  X,
  Search,
} from "lucide-react";
import MechanicCard from "@/components/MechanicCard";

// Import Mapbox CSS
import "mapbox-gl/dist/mapbox-gl.css";

interface MapboxMapProps {
  mechanics: Mechanic[];
  onMechanicClick: (mechanicId: string) => void;
  currentLocation: string;
  onToggleView: () => void;
  onFilterClick?: () => void;
  hasActiveFilters?: boolean;
}

// Mapbox access token
mapboxgl.accessToken =
  process.env.VITE_MAPBOX_TOKEN ||
  process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
  "pk.eyJ1Ijoic2FuYXRoMDAwIiwiYSI6ImNtZTBsYTI4ZjA2Zmcya29reWV4NzY1OG4ifQ.slvzWd3iTaMfbVxV2B24YQ";

const MapboxMap: React.FC<MapboxMapProps> = ({
  mechanics,
  onMechanicClick,
  onToggleView,
  onFilterClick,
  hasActiveFilters = false,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [isDrawerExpanded, setIsDrawerExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragCurrentY, setDragCurrentY] = useState(0);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Melbourne CBD coordinates
  const defaultCoordinates: [number, number] = useMemo(() => [144.9631, -37.8136], []);

  // Mock coordinates for mechanics (spread around Melbourne CBD)
  const mechanicCoordinates: { [key: string]: [number, number] } = useMemo(() => ({
    "1": [144.97, -37.81], // AutoCare Plus
    "2": [144.96, -37.815], // Melbourne Motor Works
    "3": [144.955, -37.82], // Quick Fix Automotive
  }), []);

  useEffect(() => {
    if (map.current) return; // Initialize map only once

    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11", // Clean light theme
      center: defaultCoordinates,
      zoom: 14, // Slightly closer zoom for better detail
      attributionControl: false, // Remove attribution for cleaner look
      logoPosition: "bottom-left", // Move logo to less prominent position
      pitch: 0, // Keep flat for clean mobile experience
      bearing: 0,
      antialias: true, // Smoother rendering
    });

    // Add custom user location marker with modern design
    const userLocationElement = document.createElement("div");
    userLocationElement.innerHTML = `
      <div class="relative">
        <div class="w-5 h-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full border-3 border-white shadow-xl relative z-10 flex items-center justify-center">
          <div class="w-2 h-2 bg-white rounded-full"></div>
        </div>
        <div class="absolute inset-0 w-5 h-5 bg-blue-500/40 rounded-full animate-pulse"></div>
        <div class="absolute inset-0 w-8 h-8 bg-blue-500/20 rounded-full animate-ping"></div>
      </div>
    `;

    new mapboxgl.Marker(userLocationElement)
      .setLngLat(defaultCoordinates)
      .addTo(map.current);

    // Remove all default navigation controls for clean design

    // Clean map - no default controls, using custom location button instead

    // Enhanced modern map styling once loaded
    map.current.on("load", () => {
      // Hide MapBox logo completely for cleaner look
      const mapboxLogo = map.current
        ?.getContainer()
        .querySelector(".mapboxgl-ctrl-logo");
      if (mapboxLogo) {
        (mapboxLogo as HTMLElement).style.display = "none";
      }

      // Modern map color scheme - using correct layer names
      map.current?.setPaintProperty("water", "fill-color", "#E8F4FD"); // Soft blue water
      map.current?.setPaintProperty("land", "background-color", "#F8FAFC"); // Very light gray land
      map.current?.setPaintProperty("building", "fill-color", "#F1F5F9"); // Soft building colors
      map.current?.setPaintProperty("poi-label", "text-color", "#64748B"); // Muted POI labels
    });
  }, [defaultCoordinates]);

  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    // Add mechanic markers with modern design
    mechanics.forEach((mechanic) => {
      const coordinates = mechanicCoordinates[mechanic.id] || [
        defaultCoordinates[0] + (Math.random() - 0.5) * 0.02,
        defaultCoordinates[1] + (Math.random() - 0.5) * 0.02,
      ];

      // Create modern mechanic marker - Clean and minimal (NO GREEN PRICING BADGE)
      const markerElement = document.createElement("div");
      markerElement.className = "mechanic-marker";
      markerElement.innerHTML = `
        <div class="relative cursor-pointer group transition-all duration-300 hover:scale-125">
          <div class="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full shadow-lg flex items-center justify-center border-3 border-white hover:shadow-xl hover:from-teal-600 hover:to-cyan-700">
            <div class="w-3 h-3 bg-white rounded-full"></div>
          </div>
          <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-teal-500 rotate-45 border-b border-r border-white"></div>
        </div>
      `;

      // Create marker
      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat(coordinates)
        .addTo(map.current!);

      // Create compact popup with essential navigation info only
      const popup = new mapboxgl.Popup({
        offset: [0, -15],
        closeButton: false,
        closeOnClick: true,
        className: "custom-popup-compact",
      }).setHTML(`
        <div class="relative w-64 bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden">
          <!-- Compact Header -->
          <div class="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 relative">
            <!-- Close button -->
            <button onclick="event.stopPropagation(); this.closest('.mapboxgl-popup').remove();" class="absolute top-2 right-2 w-6 h-6 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200">
              <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
            
            <!-- Name and rating -->
            <div class="pr-8">
              <h3 class="text-white font-bold text-base truncate mb-1">${mechanic.name}</h3>
              <div class="flex items-center gap-1">
                <div class="flex items-center">
                  ${[...Array(5)]
                    .map(
                      (_, i) => `
                    <svg class="w-2.5 h-2.5 ${
                      i < Math.floor(mechanic.rating)
                        ? "text-yellow-300 fill-yellow-300"
                        : "text-white/40 fill-white/40"
                    }" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  `
                    )
                    .join("")}
                </div>
                <span class="text-white/90 text-xs ml-1">${mechanic.rating} • ${mechanic.distance}</span>
              </div>
            </div>
          </div>

          <!-- Compact Content -->
          <div class="p-4">
            <!-- Navigation Info -->
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span class="text-sm text-gray-700">${mechanic.openingHours.today}</span>
              </div>
              <div class="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                ${mechanic.availability}
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-2">
              <!-- Get Directions Button -->
              <button 
                onclick="window.open('https://maps.google.com/?q=${encodeURIComponent(mechanic.address)}', '_blank')"
                class="flex-1 bg-white border border-blue-200 hover:border-blue-300 text-blue-600 hover:text-blue-700 font-medium py-2.5 px-3 rounded-xl transition-all duration-200 hover:bg-blue-50 flex items-center justify-center gap-1.5"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3"/>
                </svg>
                <span class="text-sm">Directions</span>
              </button>

              <!-- View Details Button -->
              <button 
                onclick="window.selectMechanic('${mechanic.id}')"
                class="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2.5 px-3 rounded-xl transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-1.5"
              >
                <span class="text-sm">View More</span>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      `);

      // Add click event to marker
      markerElement.addEventListener("click", () => {
        marker.setPopup(popup);
        popup.addTo(map.current!);
      });

      markers.current.push(marker);
    });
  }, [mechanics, defaultCoordinates, mechanicCoordinates]);

  // Expose function to global window for popup button clicks
  useEffect(() => {
    (
      window as Window & { selectMechanic?: (mechanicId: string) => void }
    ).selectMechanic = (mechanicId: string) => {
      onMechanicClick(mechanicId);
    };

    return () => {
      delete (
        window as Window & { selectMechanic?: (mechanicId: string) => void }
      ).selectMechanic;
    };
  }, [onMechanicClick]);

  // Enhanced drawer controls with smooth animations
  const toggleDrawer = useCallback(() => {
    setIsDrawerExpanded((prev) => !prev);
    // Haptic feedback simulation
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  }, []);


  // Touch/drag handlers for mobile drawer
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStartY(e.touches[0].clientY);
    setDragCurrentY(e.touches[0].clientY);
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      setDragCurrentY(e.touches[0].clientY);
    },
    [isDragging]
  );

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;

    const dragDistance = dragStartY - dragCurrentY;
    const threshold = 50;

    if (Math.abs(dragDistance) > threshold) {
      if (dragDistance > 0 && !isDrawerExpanded) {
        // Dragged up, expand drawer
        setIsDrawerExpanded(true);
      } else if (dragDistance < 0 && isDrawerExpanded) {
        // Dragged down, collapse drawer
        setIsDrawerExpanded(false);
      }

      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(75);
      }
    }

    setIsDragging(false);
    setDragStartY(0);
    setDragCurrentY(0);
  }, [isDragging, dragStartY, dragCurrentY, isDrawerExpanded]);

  // Handle mouse events for desktop
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartY(e.clientY);
    setDragCurrentY(e.clientY);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      setDragCurrentY(e.clientY);
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;

    const dragDistance = dragStartY - dragCurrentY;
    const threshold = 50;

    if (Math.abs(dragDistance) > threshold) {
      if (dragDistance > 0 && !isDrawerExpanded) {
        setIsDrawerExpanded(true);
      } else if (dragDistance < 0 && isDrawerExpanded) {
        setIsDrawerExpanded(false);
      }
    }

    setIsDragging(false);
    setDragStartY(0);
    setDragCurrentY(0);
  }, [isDragging, dragStartY, dragCurrentY, isDrawerExpanded]);

  // Add mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Clean up MapBox UI elements
  useEffect(() => {
    if (!map.current) return;

    const hideMapBoxElements = () => {
      const container = map.current?.getContainer();
      if (container) {
        // Hide all MapBox UI elements
        const elements = container.querySelectorAll(
          ".mapboxgl-ctrl-bottom-left, .mapboxgl-ctrl-bottom-right, .mapboxgl-ctrl-logo, .mapboxgl-ctrl-attrib"
        );
        elements.forEach((el) => {
          (el as HTMLElement).style.display = "none";
        });
      }
    };

    // Hide immediately and after load
    hideMapBoxElements();
    map.current.on("load", hideMapBoxElements);

    return () => {
      map.current?.off("load", hideMapBoxElements);
    };
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Modern Enhanced Map */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Overlay when drawer is expanded */}
      <div
        className={`absolute inset-0 bg-black/20 transition-opacity duration-500 pointer-events-none z-10 ${
          isDrawerExpanded ? "opacity-100" : "opacity-0"
        }`}
      ></div>

      {/* Modern Map Controls */}
      <div
        className={`absolute right-4 z-20 transition-all duration-300 ${
          isDrawerExpanded ? "opacity-60 scale-95 top-36" : "opacity-100 scale-100 top-32"
        }`}
      >
        <div 
          className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white/30 p-1.5 flex flex-col gap-1"
          style={{
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)'
          }}
        >
          <button
            className="group w-11 h-11 flex items-center justify-center hover:bg-blue-50 transition-all duration-200 rounded-xl hover:scale-105 active:scale-95"
            onClick={() => map.current?.zoomIn()}
          >
            <span className="text-xl font-light text-gray-700 group-hover:text-blue-600 transition-colors">
              +
            </span>
          </button>
          <div className="w-8 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-auto"></div>
          <button
            className="group w-11 h-11 flex items-center justify-center hover:bg-blue-50 transition-all duration-200 rounded-xl hover:scale-105 active:scale-95"
            onClick={() => map.current?.zoomOut()}
          >
            <span className="text-xl font-light text-gray-700 group-hover:text-blue-600 transition-colors">
              −
            </span>
          </button>
        </div>
      </div>

      {/* Premium Location Button */}
      <div
        className={`absolute right-4 z-20 transition-all duration-300 ${
          isDrawerExpanded ? "bottom-[calc(70vh+40px)]" : "bottom-[200px]"
        }`}
      >
        <button
          className="group w-14 h-14 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl shadow-2xl border border-white/30 flex items-center justify-center hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 transition-all duration-300 active:scale-95 backdrop-blur-xl hover:scale-105"
          style={{
            boxShadow: '0 12px 40px rgba(59, 130, 246, 0.3), 0 4px 16px rgba(0, 0, 0, 0.1)'
          }}
          onClick={() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                map.current?.flyTo({
                  center: [longitude, latitude],
                  zoom: 16,
                  duration: 1800,
                  curve: 1.2,
                });
              });
            }
            if (navigator.vibrate) navigator.vibrate(75);
          }}
        >
          <svg
            className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      </div>

      {/* Inline Top Controls */}
      <div className="absolute top-8 left-4 right-4 z-20">
        <div className="flex items-center gap-3">
          {/* Close Button */}
          <button
            onClick={onToggleView}
            className="group w-12 h-12 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 hover:bg-white hover:shadow-3xl transition-all duration-300 flex items-center justify-center hover:scale-105 active:scale-95 flex-shrink-0"
            style={{
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)'
            }}
          >
            <X className="w-5 h-5 text-gray-700 group-hover:text-gray-900 transition-colors" />
          </button>

          {/* Premium Search Bar */}
          <div 
            className="flex-1 bg-white/90 backdrop-blur-xl rounded-3xl border border-white/30 overflow-hidden transition-all duration-300 hover:shadow-3xl"
            style={{
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div className="flex items-center px-4 py-3">
              {/* Search Icon */}
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg mr-3 transition-all duration-300 hover:scale-105 flex-shrink-0">
                <Search className="w-4 h-4 text-white" />
              </div>
              
              {/* Search Input */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Find your service..."
                  className="w-full bg-transparent text-base text-gray-800 placeholder-gray-400 outline-none font-medium pr-2 transition-all duration-200 focus:placeholder-gray-300"
                />
              </div>
              
              {/* Filter Button */}
              <button
                onClick={onFilterClick}
                className={`group w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 relative shadow-lg hover:scale-105 active:scale-95 flex-shrink-0 ${
                  hasActiveFilters
                    ? "bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white shadow-blue-200"
                    : "bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                }`}
              >
                <SlidersHorizontal className="w-4 h-4 transition-all duration-200" />
                {hasActiveFilters && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Mobile Drawer */}
      <div
        ref={drawerRef}
        className={`absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-2xl rounded-t-3xl transition-all duration-500 ease-out z-30 ${
          isDrawerExpanded ? "h-[75vh]" : "h-[140px]"
        } ${isDragging ? "transition-none" : ""}`}
        style={{
          boxShadow: "0 -20px 60px rgba(0, 0, 0, 0.15), 0 -8px 25px rgba(0, 0, 0, 0.1), 0 -2px 10px rgba(0, 0, 0, 0.05)",
          transform: isDragging
            ? `translateY(${Math.min(
                0,
                Math.max(-150, dragCurrentY - dragStartY)
              )}px)`
            : "translateY(0)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          background: "linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%)",
        }}
      >
        {/* Modern Drawer Handle */}
        <div
          className="w-full flex justify-center py-5 cursor-pointer group"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onClick={toggleDrawer}
        >
          <div
            className={`w-12 h-1.5 rounded-full transition-all duration-300 ${
              isDragging
                ? "bg-gradient-to-r from-blue-400 to-indigo-500 w-16 h-2 shadow-lg"
                : "bg-gradient-to-r from-gray-300 to-gray-400 group-hover:from-blue-300 group-hover:to-indigo-400 group-hover:w-14"
            }`}
          ></div>
        </div>

        {/* Enhanced Header */}
        <div className="px-6 pb-5">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-bold text-gray-900 text-xl mb-1">
                Nearby Mechanics
              </h3>
              <p className="text-sm text-gray-500 font-medium">
                {mechanics.length} results found
              </p>
            </div>
            <button
              onClick={toggleDrawer}
              className="group bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-600 text-sm font-semibold px-4 py-2.5 rounded-2xl transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-md hover:scale-105"
            >
              {isDrawerExpanded ? "Collapse" : "View All"}
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                {isDrawerExpanded ? (
                  <ChevronDown className="w-3 h-3 text-white" />
                ) : (
                  <ChevronUp className="w-3 h-3 text-white" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Premium Drawer Content */}
        <div
          className={`overflow-y-auto transition-all duration-500 ease-out ${
            isDrawerExpanded
              ? "h-[calc(75vh-160px)] opacity-100"
              : "h-[30px] opacity-80"
          }`}
        >
          <div className="px-6 space-y-4 pb-6">
            {mechanics
              .slice(0, isDrawerExpanded ? mechanics.length : 1)
              .map((mechanic) => (
                <MechanicCard
                  key={mechanic.id}
                  mechanic={mechanic}
                  onClick={onMechanicClick}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapboxMap;
