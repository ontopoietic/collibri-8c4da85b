import { cn } from "@/lib/utils";

interface GlassOverlayProps {
  direction: 'up' | 'down';
  className?: string;
}

export const GlassOverlay = ({ direction, className }: GlassOverlayProps) => (
  <div 
    className={cn(
      "absolute left-0 right-0 backdrop-blur-md pointer-events-none",
      direction === 'up' ? "-top-16 bottom-0" : "top-0 -bottom-16",
      className
    )}
    style={{
      maskImage: direction === 'up' 
        ? 'linear-gradient(to top, black 40%, transparent 100%)'
        : 'linear-gradient(to bottom, black 40%, transparent 100%)',
      WebkitMaskImage: direction === 'up'
        ? 'linear-gradient(to top, black 40%, transparent 100%)'
        : 'linear-gradient(to bottom, black 40%, transparent 100%)',
      background: direction === 'up'
        ? 'linear-gradient(to top, hsl(var(--card) / 0.5) 30%, transparent 100%)'
        : 'linear-gradient(to bottom, hsl(var(--card) / 0.5) 30%, transparent 100%)'
    }}
  />
);
