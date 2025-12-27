import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TourTooltipProps {
  title: string;
  description: string;
  currentStep: number;
  totalSteps: number;
  position: "top" | "bottom" | "left" | "right";
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  isFirst: boolean;
  isLast: boolean;
  style?: React.CSSProperties;
}

export const TourTooltip: React.FC<TourTooltipProps> = ({
  title,
  description,
  currentStep,
  totalSteps,
  position,
  onNext,
  onPrev,
  onSkip,
  isFirst,
  isLast,
  style,
}) => {
  const getArrowClasses = () => {
    const base = "absolute w-3 h-3 bg-card border rotate-45";
    switch (position) {
      case "top":
        return cn(base, "bottom-[-7px] left-1/2 -translate-x-1/2 border-t-0 border-l-0");
      case "bottom":
        return cn(base, "top-[-7px] left-1/2 -translate-x-1/2 border-b-0 border-r-0");
      case "left":
        return cn(base, "right-[-7px] top-1/2 -translate-y-1/2 border-l-0 border-b-0");
      case "right":
        return cn(base, "left-[-7px] top-1/2 -translate-y-1/2 border-r-0 border-t-0");
      default:
        return base;
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('TourTooltip: Next button clicked');
    onNext();
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('TourTooltip: Prev button clicked');
    onPrev();
  };

  const handleSkip = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('TourTooltip: Skip button clicked');
    onSkip();
  };

  return (
    <Card
      className="w-80 shadow-xl border-primary/20 bg-card z-[10001] relative pointer-events-auto"
      style={style}
    >
      {/* Arrow pointer */}
      <div className={getArrowClasses()} />
      
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">
            {title}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 -mr-2 -mt-1 pointer-events-auto"
            onClick={handleSkip}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pb-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </CardContent>
      
      <CardFooter className="flex items-center justify-between pt-0">
        <span className="text-xs text-muted-foreground">
          {currentStep + 1} of {totalSteps}
        </span>
        
        <div className="flex items-center gap-2">
          {!isFirst && (
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrev}
              className="gap-1 pointer-events-auto"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleNext}
            className="gap-1 pointer-events-auto"
          >
            {isLast ? "Finish" : "Next"}
            {!isLast && <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
