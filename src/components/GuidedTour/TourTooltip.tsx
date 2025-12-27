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
      <CardHeader className="pb-1">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base font-medium text-foreground">
            {title}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 -mr-2 -mt-1 pointer-events-auto"
            onClick={handleSkip}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <p className="text-xs text-muted-foreground leading-normal">
          {description}
        </p>
      </CardContent>
      
      <CardFooter className="flex items-center justify-between pt-0 pb-2">
        <span className="text-[10px] text-muted-foreground">
          {currentStep + 1} of {totalSteps}
        </span>
        
        <div className="flex items-center gap-1.5">
          {!isFirst && (
            <Button
              variant="outline"
              onClick={handlePrev}
              className="h-7 px-2 text-xs gap-1 pointer-events-auto"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            className="h-7 px-2 text-xs gap-1 pointer-events-auto"
          >
            {isLast ? "Finish" : "Next"}
            {!isLast && <ChevronRight className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
