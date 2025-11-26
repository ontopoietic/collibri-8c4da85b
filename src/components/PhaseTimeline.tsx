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
        {/* Full timeline with phase indicators and phase buttons */}
        <div className="relative h-24">
          {/* Vertical separators (full height) */}
          <div className="absolute inset-0 pointer-events-none flex">
            {/* Class Phase (Day 1-30) */}
            <div style={{ width: "33.33%" }} className="border-r border-border" />
            {/* Grade Interim (Day 31-35) */}
            <div style={{ width: "5.56%" }} className="border-r border-border bg-amber-500/5" />
            {/* Grade Phase (Day 36-60) */}
            <div style={{ width: "27.78%" }} className="border-r border-border" />
            {/* School Interim (Day 61-65) */}
            <div style={{ width: "5.56%" }} className="border-r border-border bg-amber-500/5" />
            {/* School Phase (Day 66-90) */}
            <div style={{ width: "27.77%" }} />
          </div>

          {/* Timeline bar centered vertically */}
          <div className="absolute left-0 right-6 top-1/2 -translate-y-1/2">
            {isSimulating && onSliderChange ? (
              <Slider
                value={[sliderValue]}
                onValueChange={(values) => onSliderChange(values[0])}
                min={0}
                max={100}
                step={0.5}
                className="w-full"
              />
            ) : (
              <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500 rounded-full"
                  style={{ width: `${overallProgressPercentage}%` }}
                />
              </div>
            )}

            {/* Leaderboard button - visually attached to end of timeline */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => navigate("/leaderboard/school")}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full ml-2 p-1.5 rounded-md bg-card border border-border hover:bg-accent transition-colors shadow-sm"
                    aria-label="View leaderboard"
                  >
                    <Trophy className="h-3.5 w-3.5 text-primary" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View School Leaderboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Variant Voting labels above the timeline, consistent with phase button style */}
          <div className="absolute left-0 right-0 top-0 flex pointer-events-none">
            <div style={{ width: "33.33%" }} />
            <div className="relative flex items-start justify-center" style={{ width: "5.56%" }}>
              <div className="px-2 py-0.5 rounded-md text-[10px] font-medium text-amber-600 bg-amber-500/10 border border-amber-500/20 whitespace-nowrap shadow-sm">
                Variant Voting
              </div>
            </div>
            <div style={{ width: "27.78%" }} />
            <div className="relative flex items-start justify-center" style={{ width: "5.56%" }}>
              <div className="px-2 py-0.5 rounded-md text-[10px] font-medium text-amber-600 bg-amber-500/10 border border-amber-500/20 whitespace-nowrap shadow-sm">
                Variant Voting
              </div>
            </div>
          </div>

          {/* Phase buttons above the timeline, connected by small stems */}
          <div className="absolute left-0 right-0 top-6 h-full">
            {/* Class Phase Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onPhaseClick("class")}
                    className={cn(
                      "absolute flex flex-col items-center gap-0.5 transition-all group",
                      currentPhase === "class" ? "z-10" : "z-0"
                    )}
                    style={{ left: "16.67%", transform: "translateX(-50%)" }}
                  >
                    <div
                      className={cn(
                        "px-2.5 py-1 rounded-md text-xs font-semibold transition-all shadow-sm",
                        "flex items-center gap-1.5 whitespace-nowrap",
                        currentPhase === "class"
                          ? "bg-primary text-primary-foreground scale-110"
                          : "bg-card border border-border text-foreground hover:bg-accent"
                      )}
                    >
                      <Trophy className="h-3 w-3" />
                      <span>Class</span>
                    </div>
                    <div
                      className={cn(
                        "w-0.5 h-4 transition-all",
                        currentPhase === "class" ? "bg-primary" : "bg-border"
                      )}
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View Class Leaderboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Grade Phase Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onPhaseClick("grade")}
                    className={cn(
                      "absolute flex flex-col items-center gap-0.5 transition-all group",
                      currentPhase === "grade" ? "z-10" : "z-0"
                    )}
                    style={{ left: "50%", transform: "translateX(-50%)" }}
                  >
                    <div
                      className={cn(
                        "px-2.5 py-1 rounded-md text-xs font-semibold transition-all shadow-sm",
                        "flex items-center gap-1.5 whitespace-nowrap",
                        currentPhase === "grade"
                          ? "bg-primary text-primary-foreground scale-110"
                          : "bg-card border border-border text-foreground hover:bg-accent"
                      )}
                    >
                      <Trophy className="h-3 w-3" />
                      <span>Grade</span>
                    </div>
                    <div
                      className={cn(
                        "w-0.5 h-4 transition-all",
                        currentPhase === "grade" ? "bg-primary" : "bg-border"
                      )}
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View Grade Leaderboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* School Phase Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onPhaseClick("school")}
                    className={cn(
                      "absolute flex flex-col items-center gap-0.5 transition-all group",
                      currentPhase === "school" ? "z-10" : "z-0"
                    )}
                    style={{ left: "83.33%", transform: "translateX(-50%)" }}
                  >
                    <div
                      className={cn(
                        "px-2.5 py-1 rounded-md text-xs font-semibold transition-all shadow-sm",
                        "flex items-center gap-1.5 whitespace-nowrap",
                        currentPhase === "school"
                          ? "bg-primary text-primary-foreground scale-110"
                          : "bg-card border border-border text-foreground hover:bg-accent"
                      )}
                    >
                      <Trophy className="h-3 w-3" />
                      <span>School</span>
                    </div>
                    <div
                      className={cn(
                        "w-0.5 h-4 transition-all",
                        currentPhase === "school" ? "bg-primary" : "bg-border"
                      )}
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View School Leaderboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {isSimulating && (
          <div className="text-xs text-muted-foreground text-center">
            Simulating: Day {Math.min(daysPassed + 1, phaseDurationDays)} of {phaseDurationDays} (
              {phases[currentIndex].label}
              {isInInterim && currentPhase !== "class" ? " - Variant Voting" : ""}
            )
          </div>
        )}
      </div>
    </div>
  );
};
