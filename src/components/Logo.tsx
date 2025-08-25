"use client";

import { cn } from "@/lib/utils";

type LogoSize = "sm" | "md" | "lg" | "xl" | "2xl" | "hero";

interface LogoProps {
  size?: LogoSize;
  className?: string;
}

const sizeMap: Record<LogoSize, { w: number; h: number; tw: string }> = {
  sm:  { w: 24,  h: 24,  tw: "w-6 h-6" },
  md:  { w: 32,  h: 32,  tw: "w-8 h-8" },
  lg:  { w: 40,  h: 40,  tw: "w-10 h-10" },
  xl:  { w: 48,  h: 48,  tw: "w-12 h-12" },
  "2xl": { w: 64,  h: 64,  tw: "w-16 h-16" },
  hero:  { w: 160, h: 160, tw: "w-40 h-40" }, // ideal for intro screen
};

export const Logo: React.FC<LogoProps> = ({
  size = "md",
  className = "",
}) => {
  const { tw } = sizeMap[size];

  return (
    <div
      style={{
        backgroundImage: `url(/images/autoserve-logo-symbol@512.png)`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      }}
      className={cn(tw, className)}
      role="img"
      aria-label="Auto Serve logo"
    />
  );
  
};

export default Logo;
