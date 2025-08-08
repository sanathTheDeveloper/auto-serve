"use client";

import React from "react";
import { Mechanic } from "@/types/mechanic";
import { Car, Star, MapPin, ChevronRight, Shield, Heart } from "lucide-react";

interface MechanicCardProps {
  mechanic: Mechanic;
  onClick: (mechanicId: string) => void;
  variant?: "default" | "compact";
  className?: string;
}

const MechanicCard: React.FC<MechanicCardProps> = ({
  mechanic,
  onClick,
  className = "",
}) => {
  const handleClick = () => {
    onClick(mechanic.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className={`card-elevated cursor-pointer hover:shadow-lg active:scale-[0.98] transition-all duration-200 p-4 ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${mechanic.name}`}
    >
      <div className="flex gap-4">
        {/* Mechanic Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 tile-brand rounded-xl flex items-center justify-center shadow-sm">
            <Car className="w-6 h-6" />
          </div>
          {mechanic.verified && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
              <Shield className="w-2 h-2 text-white" />
            </div>
          )}
        </div>

        {/* Mechanic Info */}
        <div className="flex-1 min-w-0">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-gray-900 text-base truncate">
                  {mechanic.name}
                </h3>
                {mechanic.familyFriendly && (
                  <div className="w-5 h-5 bg-pink-50 rounded-full flex items-center justify-center">
                    <Heart className="w-3 h-3 text-pink-500" />
                  </div>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(mechanic.rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-200 fill-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-gray-900 text-sm">
                    {mechanic.rating}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  ({mechanic.reviewCount} reviews)
                </span>
              </div>
            </div>

            <div className="text-right flex-shrink-0 ml-3">
              <div className="text-xs text-gray-500 mb-1">
                {mechanic.distance}
              </div>
              <div className="bg-green-50 px-2 py-1 rounded-full">
                <span className="text-sm font-bold text-green-700">
                  {mechanic.priceRange}
                </span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {mechanic.services.slice(0, 2).map((service, index) => (
              <div
                key={index}
                className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium"
              >
                {service}
              </div>
            ))}
            {mechanic.services.length > 2 && (
              <div className="bg-gray-50 text-gray-600 text-xs px-2.5 py-1 rounded-full font-medium">
                +{mechanic.services.length - 2}
              </div>
            )}
          </div>

          {/* Location and Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-sm text-gray-600 truncate max-w-[140px]">
                {mechanic.address.split(",")[0]}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <div
                  className={`w-2 h-2 rounded-full ${
                    mechanic.openingHours.isOpen ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <span className="text-xs font-medium text-gray-600">
                  {mechanic.openingHours.isOpen ? "Open" : "Closed"}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MechanicCard;
