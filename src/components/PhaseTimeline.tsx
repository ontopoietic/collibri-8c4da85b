import { Phase } from "@/types/concern";
import { cn } from "@/lib/utils";
import { Calendar, Trophy } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PhaseTimelineProps {
  currentPhase: Phase;
  onPhaseClick: (phase: Phase) => void;
  phaseStartDate?: Date;
  phaseEndDate?: Date;
  phaseDurationDays?: number;
  sliderValue?: number;
  onSliderChange?: (value: number) => void;
  isSimulating?: boolean;
}

const phases: { key: Phase; label: string }[] = [
  { key: "class", label: "Class Phase" },
  { key: "grade", label: "Grade Phase" },
  { key: "school", label: "School Phase" },
];

export const PhaseTimeline = ({ 
  currentPhase, 
  onPhaseClick,
  phaseStartDate = new Date(2024, 0, 1),
  phaseEndDate = new Date(2024, 0, 31),
  phaseDurationDays = 90,
  sliderValue = 100,
  onSliderChange,
  isSimulating = false
}: PhaseTimelineProps) => {
  const navigate = useNavigate();
  const currentIndex = phases.findIndex((p) => p.key === currentPhase);
  const today = new Date();
  const actualDaysPassed = Math.floor((today.getTime() - phaseStartDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Use slider value when simulating, otherwise use actual days
  const daysPassed = isSimulating 
    ? Math.floor((sliderValue / 100) * phaseDurationDays)
    : actualDaysPassed;
    
  // Calculate which phase we're in and its progress
  const currentPhaseDayStart = currentIndex * 30;
  const currentPhaseDayEnd = (currentIndex + 1) * 30;
  const daysIntoCurrentPhase = Math.max(0, Math.min(30, daysPassed - currentPhaseDayStart));
  const daysRemaining = Math.max(0, 30 - daysIntoCurrentPhase);
  const progressPercentage = (daysIntoCurrentPhase / 30) * 100;

  return (
    <div className="bg-card border border-border rounded-lg p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          {phases[currentIndex].label}
        </h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span className="font-medium">
              {isSimulating 
                ? `Day ${daysIntoCurrentPhase + 1} of 30` 
                : `${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} remaining`}
            </span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => navigate("/leaderboard/school")}
                  className="w-3 h-3 rounded-full bg-primary hover:bg-primary/80 transition-colors"
                  aria-label="View leaderboard"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>View School Leaderboard</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="space-y-4 flex-1">
        {/* Phase selector buttons */}
        <div className="flex gap-2">
          {phases.map((phase, index) => {
            const isActive = index <= currentIndex;
            const isCurrent = phase.key === currentPhase;

            return (
              <button
                key={phase.key}
                onClick={() => onPhaseClick(phase.key)}
                className={cn(
                  "flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all",
                  isCurrent
                    ? "bg-primary text-primary-foreground"
                    : isActive
                    ? "bg-primary/20 text-foreground hover:bg-primary/30"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {phase.label}
              </button>
            );
          })}
        </div>

        {/* Timeline slider when simulating */}
        {isSimulating && onSliderChange ? (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Class (Day 1)</span>
              <span className="text-center">Grade (Day 31)</span>
              <span>School (Day 90)</span>
            </div>
            <Slider
              value={[sliderValue]}
              onValueChange={(values) => onSliderChange(values[0])}
              min={0}
              max={100}
              step={0.5}
              className="w-full"
            />
            <div className="text-xs text-muted-foreground text-center mt-2">
              Simulating: Overall Day {daysPassed + 1} of {phaseDurationDays} ({phases[currentIndex].label})
            </div>
          </div>
        ) : (
          <>
            {/* Day progress bar */}
            <div className="relative">
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              
            {/* Day markers for current phase */}
              <div className="flex justify-between mt-2 px-1">
                {Array.from({ length: 10 }, (_, i) => {
                  const dayNumber = Math.floor((i / 9) * 29) + 1;
                  const isPassed = dayNumber <= daysIntoCurrentPhase;
                  
                  return (
                    <div key={i} className="flex flex-col items-center">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full transition-colors mb-1",
                          isPassed ? "bg-primary" : "bg-border"
                        )}
                      />
                      <span className={cn(
                        "text-[10px]",
                        isPassed ? "text-foreground font-medium" : "text-muted-foreground"
                      )}>
                        {dayNumber}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="text-xs text-muted-foreground text-center">
              Day {daysIntoCurrentPhase + 1} of 30 in {phases[currentIndex].label}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
