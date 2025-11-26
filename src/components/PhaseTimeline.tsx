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
        <div className="relative h-28">

          {/* Timeline bar with gaps aligned to exact separator positions */}
          {/* Bar + labels share the same width (exclude leaderboard button) */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              {/* Timeline bar */}
              <div className="relative h-3 flex w-full mt-4">
                {/* Class Phase: 30/90 = 33.33% */}
                <div className="relative bg-muted rounded-full overflow-hidden" style={{ width: "33.33%" }}>
                  <div
                    className="h-full bg-primary transition-all duration-500 rounded-full"
                    style={{ width: `${Math.min(100, (overallProgressPercentage / 33.33) * 100)}%` }}
                  />
                </div>
                {/* Grade Interim: 5/90 = 5.56% - Light gray */}
                <div className="relative bg-muted/50 rounded-full overflow-hidden" style={{ width: "5.56%" }}>
                  <div
                    className="h-full bg-muted-foreground/40 transition-all duration-500 rounded-full"
                    style={{ width: `${Math.max(0, Math.min(100, ((overallProgressPercentage - 33.33) / 5.56) * 100))}%` }}
                  />
                </div>
                {/* Grade Phase: 25/90 = 27.78% */}
                <div className="relative bg-muted rounded-full overflow-hidden" style={{ width: "27.78%" }}>
                  <div
                    className="h-full bg-primary transition-all duration-500 rounded-full"
                    style={{ width: `${Math.max(0, Math.min(100, ((overallProgressPercentage - 38.89) / 27.78) * 100))}%` }}
                  />
                </div>
                {/* School Interim: 5/90 = 5.56% - Light gray */}
                <div className="relative bg-muted/50 rounded-full overflow-hidden" style={{ width: "5.56%" }}>
                  <div
                    className="h-full bg-muted-foreground/40 transition-all duration-500 rounded-full"
                    style={{ width: `${Math.max(0, Math.min(100, ((overallProgressPercentage - 66.67) / 5.56) * 100))}%` }}
                  />
                </div>
                {/* School Phase: 25/90 = 27.77% */}
                <div className="relative bg-muted rounded-full overflow-hidden" style={{ width: "27.77%" }}>
                  <div
                    className="h-full bg-primary transition-all duration-500 rounded-full"
                    style={{ width: `${Math.max(0, Math.min(100, ((overallProgressPercentage - 72.23) / 27.77) * 100))}%` }}
                  />
                </div>
              </div>

              {/* Variant Voting labels connected to interim timeline segments (same width as bar) */}
              <div className="absolute left-0 right-0 top-0 -translate-y-full flex pointer-events-none">
                <div style={{ width: "33.33%" }} />
                <div className="relative flex justify-center" style={{ width: "5.56%" }}>
                  <div className="flex flex-col items-center gap-0.5">
                    <div className="px-2 py-0.5 rounded-md text-[10px] font-medium text-muted-foreground bg-muted/50 border border-border whitespace-nowrap shadow-sm">
                      Variant Voting
                    </div>
                    <div className="w-0.5 h-4 bg-border" />
                  </div>
                </div>
                <div style={{ width: "27.78%" }} />
                <div className="relative flex justify-center" style={{ width: "5.56%" }}>
                  <div className="flex flex-col items-center gap-0.5">
                    <div className="px-2 py-0.5 rounded-md text-[10px] font-medium text-muted-foreground bg-muted/50 border border-border whitespace-nowrap shadow-sm">
                      Variant Voting
                    </div>
                    <div className="w-0.5 h-4 bg-border" />
                  </div>
                </div>
              </div>

              {/* Phase buttons above the timeline, connecting directly */}
              <div className="absolute left-0 right-0 top-0 -translate-y-full flex">
                {/* Class Phase Button */}
                <button
                  onClick={() => onPhaseClick("class")}
                  className={cn(
                    "absolute flex flex-col items-center gap-0 transition-all",
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

                {/* Grade Phase Button */}
                <button
                  onClick={() => onPhaseClick("grade")}
                  className={cn(
                    "absolute flex flex-col items-center gap-0 transition-all",
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

                {/* School Phase Button */}
                <button
                  onClick={() => onPhaseClick("school")}
                  className={cn(
                    "absolute flex flex-col items-center gap-0 transition-all",
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
              </div>
            </div>

            {/* Leaderboard button - larger with more space */}
            <button
              onClick={() => navigate("/leaderboard/school")}
              className="p-2 rounded-md bg-card border border-border hover:bg-accent transition-colors shadow-sm cursor-pointer flex-shrink-0"
              aria-label="View leaderboard"
            >
              <Trophy className="h-4 w-4 text-primary" />
            </button>
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
