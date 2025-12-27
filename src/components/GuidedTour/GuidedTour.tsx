import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTour, TourStep } from "@/contexts/TourContext";
import { TourTooltip } from "./TourTooltip";
import { useIsMobile } from "@/hooks/use-mobile";

// Spotlight and tooltip constants
const SPOTLIGHT_PADDING = 8;
const TOOLTIP_GAP = 12; // Gap between spotlight border and tooltip
const TOOLTIP_HEIGHT = 200;
const HEADER_HEIGHT = 80; // Space for sticky header
const REQUIRED_SPACE_TOP = TOOLTIP_HEIGHT + TOOLTIP_GAP + SPOTLIGHT_PADDING + 20;
const REQUIRED_SPACE_BOTTOM = TOOLTIP_HEIGHT + TOOLTIP_GAP + SPOTLIGHT_PADDING + 100; // Extra for bottom nav

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
  const [spotlightBorderRadius, setSpotlightBorderRadius] = useState<number>(8);
  const [isPositioned, setIsPositioned] = useState(false);

  // Get the effective step data (may use alternative content based on phase)
  const effectiveStepData = getEffectiveStepData();
  const isMobile = useIsMobile();

  // Calculate tooltip position - accepts stepData as parameter to avoid stale closure
  const calculateTooltipPosition = useCallback((rect: DOMRect, stepData: TourStep) => {
    const tooltipWidth = 320;
    const tooltipHeight = 200;
    const padding = 16;
    const bottomMargin = 100; // Safe margin for bottom nav and button visibility

    // Create expanded rect that accounts for spotlight padding
    const expandedRect = {
      top: rect.top - SPOTLIGHT_PADDING,
      left: rect.left - SPOTLIGHT_PADDING,
      right: rect.right + SPOTLIGHT_PADDING,
      bottom: rect.bottom + SPOTLIGHT_PADDING,
      width: rect.width + SPOTLIGHT_PADDING * 2,
      height: rect.height + SPOTLIGHT_PADDING * 2,
    };

    let position: TooltipPosition = {};
    
    // Use mobilePosition if on mobile and it's defined, otherwise use default position
    let effectivePosition = (isMobile && stepData.mobilePosition) 
      ? stepData.mobilePosition 
      : stepData.position;

    // Smart position flipping when there's not enough space - use expanded rect
    const spaceRight = window.innerWidth - expandedRect.right;
    const spaceLeft = expandedRect.left;
    const spaceTop = expandedRect.top;
    const spaceBottom = window.innerHeight - expandedRect.bottom - bottomMargin;

    // Flip horizontal positions if not enough space
    if (effectivePosition === "right" && spaceRight < tooltipWidth + TOOLTIP_GAP + padding) {
      effectivePosition = spaceBottom > spaceTop ? "bottom" : "top";
    } else if (effectivePosition === "left" && spaceLeft < tooltipWidth + TOOLTIP_GAP + padding) {
      effectivePosition = spaceBottom > spaceTop ? "bottom" : "top";
    }
    
    // Flip vertical positions if not enough space
    if (effectivePosition === "top" && spaceTop < tooltipHeight + TOOLTIP_GAP + padding) {
      effectivePosition = "bottom";
    } else if (effectivePosition === "bottom" && spaceBottom < tooltipHeight + TOOLTIP_GAP) {
      effectivePosition = "top";
    }

    switch (effectivePosition) {
      case "top":
        position = {
          top: expandedRect.top - tooltipHeight - TOOLTIP_GAP,
          left: Math.max(
            padding,
            Math.min(
              expandedRect.left + expandedRect.width / 2 - tooltipWidth / 2,
              window.innerWidth - tooltipWidth - padding
            )
          ),
        };
        break;
      case "bottom":
        position = {
          top: expandedRect.bottom + TOOLTIP_GAP,
          left: Math.max(
            padding,
            Math.min(
              expandedRect.left + expandedRect.width / 2 - tooltipWidth / 2,
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
              expandedRect.top + expandedRect.height / 2 - tooltipHeight / 2,
              window.innerHeight - tooltipHeight - bottomMargin
            )
          ),
          left: expandedRect.left - tooltipWidth - TOOLTIP_GAP,
        };
        break;
      case "right":
        position = {
          top: Math.max(
            padding,
            Math.min(
              expandedRect.top + expandedRect.height / 2 - tooltipHeight / 2,
              window.innerHeight - tooltipHeight - bottomMargin
            )
          ),
          left: expandedRect.right + TOOLTIP_GAP,
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
  }, [isMobile]);

  // Smart scroll function that positions element optimally based on tooltip placement
  const scrollToOptimalPosition = useCallback((target: HTMLElement, stepData: TourStep): Promise<void> => {
    return new Promise((resolve) => {
      const rect = target.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const elementHeight = rect.height + SPOTLIGHT_PADDING * 2;
      
      // Determine the intended tooltip position
      const tooltipPosition = (isMobile && stepData.mobilePosition) 
        ? stepData.mobilePosition 
        : stepData.position;
      
      let targetScrollTop: number;
      let needsScroll = false;
      
      if (tooltipPosition === "top") {
        // Tooltip goes above: position element toward bottom of viewport
        // Leave REQUIRED_SPACE_TOP at top for tooltip
        const idealTop = REQUIRED_SPACE_TOP;
        const currentTop = rect.top;
        
        if (currentTop < idealTop) {
          // Element is too high, need to scroll down to create space above
          targetScrollTop = window.scrollY - (idealTop - currentTop);
          needsScroll = true;
        } else if (rect.bottom > viewportHeight - 50) {
          // Element is partially off-screen at bottom
          targetScrollTop = window.scrollY + (rect.bottom - viewportHeight + 100);
          needsScroll = true;
        }
      } else if (tooltipPosition === "bottom") {
        // Tooltip goes below: position element toward top of viewport
        // Leave space at bottom for tooltip
        const idealTop = HEADER_HEIGHT + 20;
        const maxTop = viewportHeight - elementHeight - REQUIRED_SPACE_BOTTOM;
        const currentTop = rect.top;
        
        if (currentTop < HEADER_HEIGHT) {
          // Element is behind header
          targetScrollTop = window.scrollY + (currentTop - idealTop);
          needsScroll = true;
        } else if (currentTop > maxTop) {
          // Element is too low, not enough space for tooltip below
          targetScrollTop = window.scrollY - (maxTop - currentTop);
          needsScroll = true;
        }
      } else {
        // left/right: ensure element is vertically visible with some padding
        const idealTop = HEADER_HEIGHT + 20;
        const maxTop = viewportHeight - elementHeight - 100;
        const currentTop = rect.top;
        
        if (currentTop < HEADER_HEIGHT || currentTop > maxTop) {
          // Center vertically, but ensure within bounds
          const centeredTop = (viewportHeight - elementHeight) / 2;
          targetScrollTop = window.scrollY + (currentTop - Math.max(idealTop, Math.min(centeredTop, maxTop)));
          needsScroll = true;
        }
      }
      
      // Also check if element is horizontally out of view
      const isHorizontallyVisible = rect.left >= 0 && rect.right <= window.innerWidth;
      
      if (needsScroll && targetScrollTop !== undefined) {
        window.scrollTo({ top: Math.max(0, targetScrollTop), behavior: 'smooth' });
        // Wait for scroll to complete
        setTimeout(resolve, 350);
      } else if (!isHorizontallyVisible) {
        target.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        setTimeout(resolve, 350);
      } else {
        resolve();
      }
    });
  }, [isMobile]);

  // Calculate position - accepts stepData as parameter to avoid stale closure
  const calculatePosition = useCallback(async (stepData: TourStep | null) => {
    if (!stepData) return;

    // Modal-only step (no target)
    if (!stepData.targetSelector) {
      setSpotlightRect(null);
      setTooltipPosition({
        top: window.innerHeight / 2 - 100,
        left: window.innerWidth / 2 - 160,
      });
      setIsPositioned(true);
      return;
    }

    const target = document.querySelector(stepData.targetSelector) as HTMLElement;
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

    // Get the computed border-radius from the target element
    const computedStyle = window.getComputedStyle(target);
    const borderRadius = parseFloat(computedStyle.borderRadius) || 8;
    setSpotlightBorderRadius(borderRadius);

    // Smart scroll to optimal position based on tooltip placement
    await scrollToOptimalPosition(target, stepData);
    
    // Get fresh rect after potential scroll
    const finalRect = target.getBoundingClientRect();
    setSpotlightRect(finalRect);
    calculateTooltipPosition(finalRect, stepData);
  }, [calculateTooltipPosition, scrollToOptimalPosition]);

  // Navigation effect - remains unchanged

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
    // Pass fresh step data to avoid stale closure
    const timeout = setTimeout(() => {
      requestAnimationFrame(() => {
        calculatePosition(getEffectiveStepData());
      });
    }, 150);

    return () => clearTimeout(timeout);
  }, [isActive, currentStep, location.pathname, calculatePosition, getEffectiveStepData]);

  // Secondary recalculation for mobile to handle layout shifts
  useEffect(() => {
    if (!isActive || !isMobile) return;

    // Extra recalculation after layout stabilizes on mobile
    // Pass fresh step data to avoid stale closure
    const timeout = setTimeout(() => {
      requestAnimationFrame(() => {
        calculatePosition(getEffectiveStepData());
      });
    }, 400);

    return () => clearTimeout(timeout);
  }, [isActive, currentStep, isMobile, calculatePosition, getEffectiveStepData]);

  // Re-calculate position after actions that trigger dynamic elements (forms, modals)
  useEffect(() => {
    if (!isActive || !currentStepData?.action) return;

    // Wait for animation to complete before recalculating
    // Pass fresh step data to avoid stale closure
    const timeout = setTimeout(() => {
      requestAnimationFrame(() => {
        calculatePosition(getEffectiveStepData());
      });
    }, 350);

    return () => clearTimeout(timeout);
  }, [isActive, currentStepData?.action, calculatePosition, getEffectiveStepData]);

  // Recalculate on resize
  useEffect(() => {
    if (!isActive) return;

    const handleResize = () => calculatePosition(getEffectiveStepData());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isActive, calculatePosition, getEffectiveStepData]);

  // Disable scrolling while tour is active
  useEffect(() => {
    if (isActive) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isActive]);

  if (!isActive || !effectiveStepData) return null;

  return (
    <div className="fixed inset-0 z-[10000] pointer-events-none">
      {/* Overlay with rounded cutout using box-shadow technique */}
      {isPositioned && spotlightRect ? (
        <div 
          className="absolute border-2 border-primary pointer-events-none transition-all duration-300"
          style={{
            top: spotlightRect.top - SPOTLIGHT_PADDING,
            left: spotlightRect.left - SPOTLIGHT_PADDING,
            width: spotlightRect.width + SPOTLIGHT_PADDING * 2,
            height: spotlightRect.height + SPOTLIGHT_PADDING * 2,
            borderRadius: spotlightBorderRadius,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.75), 0 0 0 4px hsl(var(--primary) / 0.3)',
          }}
        />
      ) : (
        /* Full overlay during transition or when no target */
        <div className="absolute inset-0 bg-black/75" />
      )}

      {/* Tooltip */}
      {isPositioned && (
        <div
          className="absolute transition-all duration-300 pointer-events-auto"
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
