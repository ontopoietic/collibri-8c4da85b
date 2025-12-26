import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTour } from "@/contexts/TourContext";
import { TourTooltip } from "./TourTooltip";
import { cn } from "@/lib/utils";

interface TooltipPosition {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}

export const GuidedTour: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    isActive,
    currentStep,
    currentStepData,
    steps,
    nextStep,
    prevStep,
    skipTour,
  } = useTour();

  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({});
  const [spotlightRect, setSpotlightRect] = useState<DOMRect | null>(null);
  const [isPositioned, setIsPositioned] = useState(false);

  const calculatePosition = useCallback(() => {
    if (!currentStepData) return;

    // Modal-only step (no target)
    if (!currentStepData.targetSelector) {
      setSpotlightRect(null);
      setTooltipPosition({
        top: window.innerHeight / 2 - 100,
        left: window.innerWidth / 2 - 160,
      });
      setIsPositioned(true);
      return;
    }

    const target = document.querySelector(currentStepData.targetSelector);
    if (!target) {
      // Target not found, center the tooltip
      setSpotlightRect(null);
      setTooltipPosition({
        top: window.innerHeight / 2 - 100,
        left: window.innerWidth / 2 - 160,
      });
      setIsPositioned(true);
      return;
    }

    const rect = target.getBoundingClientRect();
    setSpotlightRect(rect);

    // Scroll element into view if needed
    const isInView =
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= window.innerHeight &&
      rect.right <= window.innerWidth;

    if (!isInView) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      // Recalculate after scroll
      setTimeout(() => {
        const newRect = target.getBoundingClientRect();
        setSpotlightRect(newRect);
        calculateTooltipPosition(newRect);
      }, 300);
      return;
    }

    calculateTooltipPosition(rect);
  }, [currentStepData]);

  const calculateTooltipPosition = (rect: DOMRect) => {
    if (!currentStepData) return;

    const tooltipWidth = 320;
    const tooltipHeight = 200;
    const padding = 16;
    const arrowOffset = 12;

    let position: TooltipPosition = {};

    switch (currentStepData.position) {
      case "top":
        position = {
          top: rect.top - tooltipHeight - arrowOffset,
          left: Math.max(
            padding,
            Math.min(
              rect.left + rect.width / 2 - tooltipWidth / 2,
              window.innerWidth - tooltipWidth - padding
            )
          ),
        };
        break;
      case "bottom":
        position = {
          top: rect.bottom + arrowOffset,
          left: Math.max(
            padding,
            Math.min(
              rect.left + rect.width / 2 - tooltipWidth / 2,
              window.innerWidth - tooltipWidth - padding
            )
          ),
        };
        break;
      case "left":
        position = {
          top: Math.max(
            padding,
            Math.min(
              rect.top + rect.height / 2 - tooltipHeight / 2,
              window.innerHeight - tooltipHeight - padding
            )
          ),
          left: rect.left - tooltipWidth - arrowOffset,
        };
        break;
      case "right":
        position = {
          top: Math.max(
            padding,
            Math.min(
              rect.top + rect.height / 2 - tooltipHeight / 2,
              window.innerHeight - tooltipHeight - padding
            )
          ),
          left: rect.right + arrowOffset,
        };
        break;
    }

    // Ensure tooltip stays within viewport
    if (position.top !== undefined && position.top < padding) {
      position.top = padding;
    }
    if (position.left !== undefined && position.left < padding) {
      position.left = padding;
    }

    setTooltipPosition(position);
    setIsPositioned(true);
  };

  // Navigate to required route for current step
  useEffect(() => {
    if (!isActive || !currentStepData) return;

    if (currentStepData.route && location.pathname !== currentStepData.route) {
      navigate(currentStepData.route);
    }
  }, [isActive, currentStepData, location.pathname, navigate]);

  // Calculate position when step changes or route changes
  useEffect(() => {
    if (!isActive) {
      setIsPositioned(false);
      return;
    }

    // Small delay to ensure DOM is ready after navigation
    const timeout = setTimeout(() => {
      calculatePosition();
    }, 100);

    return () => clearTimeout(timeout);
  }, [isActive, currentStep, location.pathname, calculatePosition]);

  // Recalculate on resize
  useEffect(() => {
    if (!isActive) return;

    const handleResize = () => calculatePosition();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isActive, calculatePosition]);

  if (!isActive || !currentStepData) return null;

  return (
    <div className="fixed inset-0 z-[10000]">
      {/* Overlay with spotlight cutout */}
      <div
        className="absolute inset-0 transition-all duration-300"
        style={{
          background: spotlightRect
            ? `radial-gradient(circle at ${spotlightRect.left + spotlightRect.width / 2}px ${spotlightRect.top + spotlightRect.height / 2}px, transparent ${Math.max(spotlightRect.width, spotlightRect.height) / 2 + 8}px, rgba(0, 0, 0, 0.75) ${Math.max(spotlightRect.width, spotlightRect.height) / 2 + 40}px)`
            : "rgba(0, 0, 0, 0.75)",
        }}
        onClick={(e) => {
          // Allow clicking through to spotlight target
          if (spotlightRect) {
            const x = e.clientX;
            const y = e.clientY;
            if (
              x >= spotlightRect.left &&
              x <= spotlightRect.right &&
              y >= spotlightRect.top &&
              y <= spotlightRect.bottom
            ) {
              return;
            }
          }
        }}
      />

      {/* Spotlight border highlight */}
      {spotlightRect && (
        <div
          className="absolute border-2 border-primary rounded-lg pointer-events-none transition-all duration-300"
          style={{
            top: spotlightRect.top - 4,
            left: spotlightRect.left - 4,
            width: spotlightRect.width + 8,
            height: spotlightRect.height + 8,
            boxShadow: "0 0 0 4px hsl(var(--primary) / 0.3)",
          }}
        />
      )}

      {/* Tooltip */}
      {isPositioned && (
        <div
          className="absolute transition-all duration-300"
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
          }}
        >
          <TourTooltip
            title={currentStepData.title}
            description={currentStepData.description}
            currentStep={currentStep}
            totalSteps={steps.length}
            position={currentStepData.position}
            onNext={nextStep}
            onPrev={prevStep}
            onSkip={skipTour}
            isFirst={currentStep === 0}
            isLast={currentStep === steps.length - 1}
          />
        </div>
      )}
    </div>
  );
};
