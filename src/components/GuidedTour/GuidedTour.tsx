import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTour } from "@/contexts/TourContext";
import { TourTooltip } from "./TourTooltip";
import { useIsMobile } from "@/hooks/use-mobile";

// Spotlight padding constant
const SPOTLIGHT_PADDING = 8;

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
    getEffectiveStepData,
  } = useTour();

  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({});
  const [spotlightRect, setSpotlightRect] = useState<DOMRect | null>(null);
  const [isPositioned, setIsPositioned] = useState(false);

  // Get the effective step data (may use alternative content based on phase)
  const effectiveStepData = getEffectiveStepData();

  const calculatePosition = useCallback(() => {
    if (!effectiveStepData) return;

    // Modal-only step (no target)
    if (!effectiveStepData.targetSelector) {
      setSpotlightRect(null);
      setTooltipPosition({
        top: window.innerHeight / 2 - 100,
        left: window.innerWidth / 2 - 160,
      });
      setIsPositioned(true);
      return;
    }

    const target = document.querySelector(effectiveStepData.targetSelector);
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
  }, [effectiveStepData]);

  const isMobile = useIsMobile();

  const calculateTooltipPosition = (rect: DOMRect) => {
    if (!effectiveStepData) return;

    const tooltipWidth = 320;
    const tooltipHeight = 200;
    const padding = 16;
    // Larger offset on mobile for bottom-positioned tooltips to avoid overlap with forms
    const arrowOffset = isMobile ? 28 : 12;
    const bottomMargin = 100; // Safe margin for bottom nav and button visibility

    let position: TooltipPosition = {};
    
    // Use mobilePosition if on mobile and it's defined, otherwise use default position
    let effectivePosition = (isMobile && effectiveStepData.mobilePosition) 
      ? effectiveStepData.mobilePosition 
      : effectiveStepData.position;

    // Smart position flipping when there's not enough space
    const spaceRight = window.innerWidth - rect.right;
    const spaceLeft = rect.left;
    const spaceTop = rect.top;
    const spaceBottom = window.innerHeight - rect.bottom - bottomMargin;

    // Flip horizontal positions if not enough space
    if (effectivePosition === "right" && spaceRight < tooltipWidth + arrowOffset + padding) {
      effectivePosition = spaceBottom > spaceTop ? "bottom" : "top";
    } else if (effectivePosition === "left" && spaceLeft < tooltipWidth + arrowOffset + padding) {
      effectivePosition = spaceBottom > spaceTop ? "bottom" : "top";
    }
    
    // Flip vertical positions if not enough space
    if (effectivePosition === "top" && spaceTop < tooltipHeight + arrowOffset + padding) {
      effectivePosition = "bottom";
    } else if (effectivePosition === "bottom" && spaceBottom < tooltipHeight + arrowOffset) {
      effectivePosition = "top";
    }

    switch (effectivePosition) {
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
              window.innerHeight - tooltipHeight - bottomMargin
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
              window.innerHeight - tooltipHeight - bottomMargin
            )
          ),
          left: rect.right + arrowOffset,
        };
        break;
    }

    // Ensure tooltip stays within viewport - top edge
    if (position.top !== undefined && position.top < padding) {
      position.top = padding;
    }
    // Ensure tooltip stays within viewport - bottom edge
    if (position.top !== undefined) {
      const maxTop = window.innerHeight - tooltipHeight - bottomMargin;
      if (position.top > maxTop) {
        position.top = maxTop;
      }
    }
    // Ensure tooltip stays within viewport - left edge
    if (position.left !== undefined && position.left < padding) {
      position.left = padding;
    }
    // Ensure tooltip stays within viewport - right edge
    if (position.left !== undefined) {
      const maxLeft = window.innerWidth - tooltipWidth - padding;
      if (position.left > maxLeft) {
        position.left = maxLeft;
      }
    }

    setTooltipPosition(position);
    setIsPositioned(true);
  };

  // Navigate to required route for current step and dispatch actions
  useEffect(() => {
    if (!isActive || !currentStepData) return;

    if (currentStepData.route && location.pathname !== currentStepData.route) {
      navigate(currentStepData.route);
    }

    // Dispatch tour action events for form control
    if (currentStepData.action) {
      const event = new CustomEvent('tour-action', { 
        detail: { action: currentStepData.action } 
      });
      window.dispatchEvent(event);
    }
  }, [isActive, currentStepData, location.pathname, navigate]);

  // Calculate position when step changes or route changes
  useEffect(() => {
    if (!isActive) {
      setIsPositioned(false);
      return;
    }

    // Reset state immediately when step changes to prevent stale positions
    setIsPositioned(false);
    setSpotlightRect(null);

    // Use requestAnimationFrame + setTimeout for reliable DOM measurement
    const timeout = setTimeout(() => {
      requestAnimationFrame(() => {
        calculatePosition();
      });
    }, 150);

    return () => clearTimeout(timeout);
  }, [isActive, currentStep, location.pathname, calculatePosition]);

  // Secondary recalculation for mobile to handle layout shifts
  useEffect(() => {
    if (!isActive || !isMobile) return;

    // Extra recalculation after layout stabilizes on mobile
    const timeout = setTimeout(() => {
      requestAnimationFrame(() => {
        calculatePosition();
      });
    }, 400);

    return () => clearTimeout(timeout);
  }, [isActive, currentStep, isMobile, calculatePosition]);

  // Re-calculate position after actions that trigger dynamic elements (forms, modals)
  useEffect(() => {
    if (!isActive || !currentStepData?.action) return;

    // Wait for animation to complete before recalculating
    const timeout = setTimeout(() => {
      requestAnimationFrame(() => {
        calculatePosition();
      });
    }, 350);

    return () => clearTimeout(timeout);
  }, [isActive, currentStepData?.action, calculatePosition]);

  // Recalculate on resize
  useEffect(() => {
    if (!isActive) return;

    const handleResize = () => calculatePosition();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isActive, calculatePosition]);

  if (!isActive || !effectiveStepData) return null;

  return (
    <div className="fixed inset-0 z-[10000]">
      {/* 4-panel rectangular overlay for precise spotlight cutout */}
      {isPositioned && spotlightRect ? (
        <>
          {/* Top panel - from top of screen to top of target */}
          <div 
            className="absolute left-0 right-0 top-0 bg-black/75 transition-all duration-300"
            style={{ height: Math.max(0, spotlightRect.top - SPOTLIGHT_PADDING) }}
          />
          {/* Bottom panel - from bottom of target to bottom of screen */}
          <div 
            className="absolute left-0 right-0 bottom-0 bg-black/75 transition-all duration-300"
            style={{ top: spotlightRect.bottom + SPOTLIGHT_PADDING }}
          />
          {/* Left panel - from left edge to left of target (between top/bottom panels) */}
          <div 
            className="absolute bg-black/75 transition-all duration-300"
            style={{ 
              top: Math.max(0, spotlightRect.top - SPOTLIGHT_PADDING),
              left: 0,
              width: Math.max(0, spotlightRect.left - SPOTLIGHT_PADDING),
              height: spotlightRect.height + SPOTLIGHT_PADDING * 2
            }}
          />
          {/* Right panel - from right of target to right edge */}
          <div 
            className="absolute bg-black/75 transition-all duration-300"
            style={{
              top: Math.max(0, spotlightRect.top - SPOTLIGHT_PADDING),
              left: spotlightRect.right + SPOTLIGHT_PADDING,
              right: 0,
              height: spotlightRect.height + SPOTLIGHT_PADDING * 2
            }}
          />
        </>
      ) : (
        /* Full overlay during transition or when no target */
        <div className="absolute inset-0 bg-black/75" />
      )}

      {/* Spotlight border highlight */}
      {isPositioned && spotlightRect && (
        <div
          className="absolute border-2 border-primary rounded-lg pointer-events-none transition-all duration-300"
          style={{
            top: spotlightRect.top - SPOTLIGHT_PADDING,
            left: spotlightRect.left - SPOTLIGHT_PADDING,
            width: spotlightRect.width + SPOTLIGHT_PADDING * 2,
            height: spotlightRect.height + SPOTLIGHT_PADDING * 2,
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
            title={effectiveStepData.title}
            description={effectiveStepData.description}
            currentStep={currentStep}
            totalSteps={steps.length}
            position={effectiveStepData.position}
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
