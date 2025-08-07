"use client";

import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import mapboxgl from "mapbox-gl";
import { Mechanic } from "@/types/mechanic";
import {
  List,
  Map,
  SlidersHorizontal,
  ChevronUp,
  ChevronDown,
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
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [isDrawerExpanded, setIsDrawerExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "map">("map");
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

      // Create modern popup with enhanced design
      const popup = new mapboxgl.Popup({
        offset: [0, -20],
        closeButton: true,
        closeOnClick: true,
        className: "custom-popup",
      }).setHTML(`
        <div class="p-4 min-w-[240px] bg-white rounded-2xl shadow-xl border border-gray-100">
          <div class="flex items-start gap-3 mb-3">
            <div class="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="font-bold text-gray-900 text-base mb-1 truncate">${
                mechanic.name
              }</h4>
              <div class="flex items-center gap-2 mb-2">
                <div class="flex items-center">
                  ${[...Array(5)]
                    .map(
                      (_, i) => `
                    <svg class="w-3 h-3 ${
                      i < Math.floor(mechanic.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-200 fill-gray-200"
                    }" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  `
                    )
                    .join("")}
                </div>
                <span class="font-bold text-gray-900 text-sm">${
                  mechanic.rating
                }</span>
                <span class="text-xs text-gray-500">(${
                  mechanic.reviewCount
                })</span>
              </div>
            </div>
          </div>
          <p class="text-sm text-gray-600 mb-3 line-clamp-2">${
            mechanic.address
          }</p>
          <div class="pt-3 border-t border-gray-100">
            <button class="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold py-2 px-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm" onclick="window.selectMechanic('${
              mechanic.id
            }')">
              View Details
            </button>
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

  const handleViewModeChange = (mode: "list" | "map") => {
    setViewMode(mode);
    if (mode === "list") {
      onToggleView();
    }
  };

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

      {/* Refined Map Controls */}
      <div
        className={`absolute top-28 right-6 z-20 transition-all duration-300 ${
          isDrawerExpanded ? "opacity-40 scale-95" : "opacity-100 scale-100"
        }`}
      >
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-2 flex flex-col gap-1.5">
          <button
            className="w-10 h-10 flex items-center justify-center hover:bg-blue-50 transition-colors rounded-xl group"
            onClick={() => map.current?.zoomIn()}
          >
            <span className="text-lg font-light text-gray-700 group-hover:text-blue-600">
              +
            </span>
          </button>
          <div className="w-6 h-px bg-gray-200 mx-auto"></div>
          <button
            className="w-10 h-10 flex items-center justify-center hover:bg-blue-50 transition-colors rounded-xl group"
            onClick={() => map.current?.zoomOut()}
          >
            <span className="text-lg font-light text-gray-700 group-hover:text-blue-600">
              −
            </span>
          </button>
        </div>
      </div>

      {/* Premium Location Button */}
      <div
        className={`absolute right-6 z-20 transition-all duration-300 ${
          isDrawerExpanded ? "bottom-[calc(70vh+32px)]" : "bottom-[180px]"
        }`}
      >
        <button
          className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl border border-white/20 flex items-center justify-center hover:from-blue-600 hover:to-blue-700 transition-all duration-200 active:scale-95 backdrop-blur-sm"
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
            className="w-5 h-5 text-white"
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

      {/* Elegant Search Bar */}
      <div className="absolute top-6 left-6 right-6 z-20">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Find mechanics near you..."
              className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-500 outline-none font-medium"
            />
          </div>
        </div>
      </div>

      {/* Premium Mobile Drawer */}
      <div
        ref={drawerRef}
        className={`absolute bottom-0 left-0 right-0 bg-white/98 backdrop-blur-md rounded-t-3xl shadow-2xl transition-all duration-500 ease-out z-30 ${
          isDrawerExpanded ? "h-[75vh]" : "h-[140px]"
        } ${isDragging ? "transition-none" : ""}`}
        style={{
          boxShadow:
            "0 -12px 40px -4px rgba(0, 0, 0, 0.12), 0 -8px 16px -4px rgba(0, 0, 0, 0.06)",
          transform: isDragging
            ? `translateY(${Math.min(
                0,
                Math.max(-150, dragCurrentY - dragStartY)
              )}px)`
            : "translateY(0)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        {/* Premium Drawer Handle */}
        <div
          className="w-full flex justify-center py-4 cursor-pointer"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onClick={toggleDrawer}
        >
          <div
            className={`w-12 h-1.5 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full transition-all duration-200 ${
              isDragging
                ? "from-blue-400 to-blue-500 w-16 h-2"
                : "hover:from-gray-400 hover:to-gray-500"
            }`}
          ></div>
        </div>

        {/* Simplified Header */}
        <div className="px-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-lg">
              Nearby Mechanics ({mechanics.length})
            </h3>
            <button
              onClick={toggleDrawer}
              className="text-blue-600 text-sm font-semibold px-3 py-1.5 hover:bg-blue-50 rounded-full transition-colors flex items-center gap-1.5"
            >
              {isDrawerExpanded ? "Collapse" : "View All"}
              {isDrawerExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Streamlined Toggle Buttons */}
          <div className="flex bg-gray-50 rounded-xl p-1">
            <button
              onClick={() => handleViewModeChange("list")}
              className={`flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                viewMode === "list"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600"
              }`}
            >
              <List className="w-4 h-4 mr-1.5" />
              List
            </button>
            <button
              className={`flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                viewMode === "map"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600"
              }`}
            >
              <Map className="w-4 h-4 mr-1.5" />
              Map
            </button>
            <button
              onClick={onFilterClick}
              className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg transition-all hover:bg-gray-100"
            >
              <SlidersHorizontal className="w-4 h-4 mr-1.5" />
              Filter
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
