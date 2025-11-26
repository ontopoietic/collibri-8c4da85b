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
    
  // Calculate overall progress percentage (0-100% across all 90 days)
  const overallProgressPercentage = (daysPassed / phaseDurationDays) * 100;
  
  // Calculate which phase we're in and its progress
  const currentPhaseDayStart = currentIndex * 30;
  const daysIntoCurrentPhase = Math.max(0, Math.min(30, daysPassed - currentPhaseDayStart));
  const daysRemaining = Math.max(0, 30 - daysIntoCurrentPhase);
  
  // Check if in interim phase (first 5 days)
  const isInInterim = daysIntoCurrentPhase < 5;

  return (
    <div className="bg-card border border-border rounded-lg p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          Timeline Overview
        </h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span className="font-medium">
            {isSimulating 
              ? `Day ${daysPassed + 1} of ${phaseDurationDays}` 
              : `${daysRemaining} days left in ${phases[currentIndex].label}`}
          </span>
        </div>
      </div>

      <div className="space-y-6 flex-1">
        {/* Timeline */}
        <div className="space-y-4">
          <div className="relative h-32">
            {/* All labels positioned at the top */}
            <div className="absolute top-0 left-0 right-12 flex gap-1">
              {/* Class Phase Label */}
              <div className="flex justify-center" style={{ width: "33.33%" }}>
                <button
                  onClick={() => onPhaseClick("class")}
                  className={cn(
                    "flex flex-col items-center gap-0",
                    currentPhase === "class" ? "z-10" : "z-0"
                  )}
                >
                  <div
                    className={cn(
                      "px-3 py-1.5 rounded-md text-sm font-semibold shadow-sm flex items-center gap-2 whitespace-nowrap",
                      currentPhase === "class"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border text-foreground hover:bg-accent"
                    )}
                  >
                    <Trophy className="h-4 w-4" />
                    <span>Class</span>
                  </div>
                  <div className={cn("w-0.5 h-8", currentPhase === "class" ? "bg-primary" : "bg-border")} />
                </button>
              </div>

              {/* Grade Voting Label */}
              <div className="flex justify-center" style={{ width: "5.56%" }}>
                <div className="flex flex-col items-center gap-0">
                  <div className="px-2 py-0.5 rounded-md text-[10px] font-medium text-muted-foreground bg-muted/50 border border-border whitespace-nowrap shadow-sm">
                    Variant Voting
                  </div>
                  <div className="w-0.5 h-8 bg-border" />
                </div>
              </div>

              {/* Grade Phase Label */}
              <div className="flex justify-center" style={{ width: "27.78%" }}>
                <button
                  onClick={() => onPhaseClick("grade")}
                  className={cn(
                    "flex flex-col items-center gap-0",
                    currentPhase === "grade" ? "z-10" : "z-0"
                  )}
                >
                  <div
                    className={cn(
                      "px-3 py-1.5 rounded-md text-sm font-semibold shadow-sm flex items-center gap-2 whitespace-nowrap",
                      currentPhase === "grade"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border text-foreground hover:bg-accent"
                    )}
                  >
                    <Trophy className="h-4 w-4" />
                    <span>Grade</span>
                  </div>
                  <div className={cn("w-0.5 h-8", currentPhase === "grade" ? "bg-primary" : "bg-border")} />
                </button>
              </div>

              {/* School Voting Label */}
              <div className="flex justify-center" style={{ width: "5.56%" }}>
                <div className="flex flex-col items-center gap-0">
                  <div className="px-2 py-0.5 rounded-md text-[10px] font-medium text-muted-foreground bg-muted/50 border border-border whitespace-nowrap shadow-sm">
                    Variant Voting
                  </div>
                  <div className="w-0.5 h-8 bg-border" />
                </div>
              </div>

              {/* School Phase Label */}
              <div className="flex justify-center" style={{ width: "27.77%" }}>
                <button
                  onClick={() => onPhaseClick("school")}
                  className={cn(
                    "flex flex-col items-center gap-0",
                    currentPhase === "school" ? "z-10" : "z-0"
                  )}
                >
                  <div
                    className={cn(
                      "px-3 py-1.5 rounded-md text-sm font-semibold shadow-sm flex items-center gap-2 whitespace-nowrap",
                      currentPhase === "school"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border text-foreground hover:bg-accent"
                    )}
                  >
                    <Trophy className="h-4 w-4" />
                    <span>School</span>
                  </div>
                  <div className={cn("w-0.5 h-8", currentPhase === "school" ? "bg-primary" : "bg-border")} />
                </button>
              </div>
            </div>

            {/* Timeline bar positioned below labels */}
            <div className="absolute top-10 left-0 right-0 flex items-center gap-4">
              <div className="flex-1 flex h-3 gap-1">
                {/* Class Phase */}
                <div className="relative bg-muted rounded-full overflow-hidden" style={{ width: "33.33%" }}>
                  <div
                    className="h-full bg-primary transition-all duration-500 rounded-full"
                    style={{ width: `${Math.min(100, (overallProgressPercentage / 33.33) * 100)}%` }}
                  />
                </div>
                {/* Grade Voting */}
                <div className="relative bg-muted/50 rounded-full overflow-hidden" style={{ width: "5.56%" }}>
                  <div
                    className="h-full bg-muted-foreground/40 transition-all duration-500 rounded-full"
                    style={{ width: `${Math.max(0, Math.min(100, ((overallProgressPercentage - 33.33) / 5.56) * 100))}%` }}
                  />
                </div>
                {/* Grade Phase */}
                <div className="relative bg-muted rounded-full overflow-hidden" style={{ width: "27.78%" }}>
                  <div
                    className="h-full bg-primary transition-all duration-500 rounded-full"
                    style={{ width: `${Math.max(0, Math.min(100, ((overallProgressPercentage - 38.89) / 27.78) * 100))}%` }}
                  />
                </div>
                {/* School Voting */}
                <div className="relative bg-muted/50 rounded-full overflow-hidden" style={{ width: "5.56%" }}>
                  <div
                    className="h-full bg-muted-foreground/40 transition-all duration-500 rounded-full"
                    style={{ width: `${Math.max(0, Math.min(100, ((overallProgressPercentage - 66.67) / 5.56) * 100))}%` }}
                  />
                </div>
                {/* School Phase */}
                <div className="relative bg-muted rounded-full overflow-hidden" style={{ width: "27.77%" }}>
                  <div
                    className="h-full bg-primary transition-all duration-500 rounded-full"
                    style={{ width: `${Math.max(0, Math.min(100, ((overallProgressPercentage - 72.23) / 27.77) * 100))}%` }}
                  />
                </div>
              </div>

              {/* Leaderboard button */}
              <button
                onClick={() => navigate("/leaderboard/school")}
                className="p-2 rounded-md bg-card border border-border hover:bg-accent transition-colors shadow-sm cursor-pointer flex-shrink-0"
                aria-label="View leaderboard"
              >
                <Trophy className="h-4 w-4 text-primary" />
              </button>
            </div>
          </div>

          {/* Simulation Status and Slider */}
          {isSimulating && (
            <div className="mt-6 space-y-3">
              <div className="text-xs text-muted-foreground text-center">
                Simulating: Day {Math.min(daysPassed + 1, phaseDurationDays)} of {phaseDurationDays} (
                  {phases[currentIndex].label}
                  {isInInterim && currentPhase !== "class" ? " - Variant Voting" : ""}
                )
              </div>
              <Slider
                value={[sliderValue]}
                onValueChange={(value) => onSliderChange?.(value[0])}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
