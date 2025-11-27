import { Phase } from "@/types/concern";
import { cn } from "@/lib/utils";
import { Calendar, Trophy, User, Users, School, CheckSquare } from "lucide-react";
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
        {/* New Redesigned Timeline */}
        <div className="space-y-4">
          <div className="flex gap-1 items-center">
            {/* Class Phase Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => daysPassed >= 30 && onPhaseClick("class")}
                    disabled={daysPassed < 30}
                    className={cn(
                      "relative h-12 rounded-lg transition-all duration-300 group",
                      daysPassed >= 30 
                        ? "cursor-pointer hover:scale-[1.02]" 
                        : "cursor-not-allowed opacity-50",
                      daysPassed >= 35 && "opacity-60"
                    )}
                    style={{ width: "33.33%" }}
                  >
                    <div className={cn(
                      "absolute inset-0 rounded-lg transition-all duration-300",
                      daysPassed >= 30 
                        ? "bg-primary/20 group-hover:bg-primary/30" 
                        : "bg-muted"
                    )}>
                      <div
                        className="h-full bg-primary transition-all duration-500 rounded-lg"
                        style={{ width: `${Math.min(100, (overallProgressPercentage / 33.33) * 100)}%` }}
                      />
                    </div>
                    <div className="relative flex items-center justify-center h-full gap-2 px-4">
                      <User className="h-4 w-4 text-foreground" />
                      <span className="text-sm font-semibold text-foreground">Class Level</span>
                    </div>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{daysPassed >= 30 ? "View Class Leaderboard" : "Available after 30 days"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Grade Voting Phase */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "relative h-12 rounded-lg transition-all duration-300 cursor-default",
                      overallProgressPercentage > 33.33 && overallProgressPercentage < 38.89 && "ring-2 ring-primary/50"
                    )}
                    style={{ width: "5.56%" }}
                  >
                    <div className="absolute inset-0 bg-variant/20 rounded-lg hover:bg-variant/30 transition-all duration-300">
                      <div
                        className="h-full bg-variant transition-all duration-500 rounded-lg"
                        style={{ width: `${Math.max(0, Math.min(100, ((overallProgressPercentage - 33.33) / 5.56) * 100))}%` }}
                      />
                    </div>
                    <div className="relative flex items-center justify-center h-full">
                      <CheckSquare className="h-3.5 w-3.5 text-foreground" />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Variant Selection Phase (5 days)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Grade Phase Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => daysPassed >= 65 && onPhaseClick("grade")}
                    disabled={daysPassed < 65}
                    className={cn(
                      "relative h-12 rounded-lg transition-all duration-300 group",
                      daysPassed >= 65 
                        ? "cursor-pointer hover:scale-[1.02]" 
                        : "cursor-not-allowed opacity-50",
                      daysPassed >= 65 && "opacity-60"
                    )}
                    style={{ width: "27.78%" }}
                  >
                    <div className={cn(
                      "absolute inset-0 rounded-lg transition-all duration-300",
                      daysPassed >= 65 
                        ? "bg-primary/20 group-hover:bg-primary/30" 
                        : "bg-muted"
                    )}>
                      <div
                        className="h-full bg-primary transition-all duration-500 rounded-lg"
                        style={{ width: `${Math.max(0, Math.min(100, ((overallProgressPercentage - 38.89) / 27.78) * 100))}%` }}
                      />
                    </div>
                    <div className="relative flex items-center justify-center h-full gap-2 px-4">
                      <Users className="h-4 w-4 text-foreground" />
                      <span className="text-sm font-semibold text-foreground">Grade Level</span>
                    </div>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{daysPassed >= 65 ? "View Grade Leaderboard" : "Available after 65 days"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* School Voting Phase */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "relative h-12 rounded-lg transition-all duration-300 cursor-default",
                      overallProgressPercentage > 66.67 && overallProgressPercentage < 72.23 && "ring-2 ring-primary/50"
                    )}
                    style={{ width: "5.56%" }}
                  >
                    <div className="absolute inset-0 bg-variant/20 rounded-lg hover:bg-variant/30 transition-all duration-300">
                      <div
                        className="h-full bg-variant transition-all duration-500 rounded-lg"
                        style={{ width: `${Math.max(0, Math.min(100, ((overallProgressPercentage - 66.67) / 5.56) * 100))}%` }}
                      />
                    </div>
                    <div className="relative flex items-center justify-center h-full">
                      <CheckSquare className="h-3.5 w-3.5 text-foreground" />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Variant Selection Phase (5 days)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* School Phase Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => daysPassed >= 90 && onPhaseClick("school")}
                    disabled={daysPassed < 90}
                    className={cn(
                      "relative h-12 rounded-lg transition-all duration-300 group",
                      daysPassed >= 90 
                        ? "cursor-pointer hover:scale-[1.02]" 
                        : "cursor-not-allowed opacity-50"
                    )}
                    style={{ width: "27.77%" }}
                  >
                    <div className={cn(
                      "absolute inset-0 rounded-lg transition-all duration-300",
                      daysPassed >= 90 
                        ? "bg-primary/20 group-hover:bg-primary/30" 
                        : "bg-muted"
                    )}>
                      <div
                        className="h-full bg-primary transition-all duration-500 rounded-lg"
                        style={{ width: `${Math.max(0, Math.min(100, ((overallProgressPercentage - 72.23) / 27.77) * 100))}%` }}
                      />
                    </div>
                    <div className="relative flex items-center justify-center h-full gap-2 px-4">
                      <School className="h-4 w-4 text-foreground" />
                      <span className="text-sm font-semibold text-foreground">School Level</span>
                    </div>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{daysPassed >= 90 ? "View School Leaderboard" : "Available after 90 days"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Date/Day Indicators */}
          <div className="relative text-xs text-muted-foreground mt-2">
            <div className="absolute whitespace-nowrap" style={{ left: "0%" }}>Day 1</div>
            <div className="absolute whitespace-nowrap" style={{ left: "33.33%", transform: "translateX(-50%)" }}>Day 30</div>
            <div className="absolute whitespace-nowrap" style={{ left: "38.89%", transform: "translateX(-50%)" }}>Day 35</div>
            <div className="absolute whitespace-nowrap" style={{ left: "66.67%", transform: "translateX(-50%)" }}>Day 60</div>
            <div className="absolute whitespace-nowrap" style={{ left: "72.23%", transform: "translateX(-50%)" }}>Day 65</div>
            <div className="absolute whitespace-nowrap" style={{ left: "100%", transform: "translateX(-100%)" }}>Day 90</div>
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
