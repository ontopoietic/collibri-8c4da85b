import { Phase } from "@/types/concern";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";

interface PhaseTimelineProps {
  currentPhase: Phase;
  onPhaseClick: (phase: Phase) => void;
  phaseStartDate?: Date;
  phaseEndDate?: Date;
  phaseDurationDays?: number;
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
  phaseDurationDays = 30
}: PhaseTimelineProps) => {
  const currentIndex = phases.findIndex((p) => p.key === currentPhase);
  const today = new Date();
  const daysPassed = Math.floor((today.getTime() - phaseStartDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.max(0, phaseDurationDays - daysPassed);
  const progressPercentage = Math.min(100, (daysPassed / phaseDurationDays) * 100);

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          {phases[currentIndex].label}
        </h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span className="font-medium">
            {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining
          </span>
        </div>
      </div>

      <div className="space-y-3">
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

        {/* Day progress bar */}
        <div className="relative">
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          
          {/* Day markers */}
          <div className="flex justify-between mt-2 px-1">
            {Array.from({ length: Math.min(phaseDurationDays, 10) }, (_, i) => {
              const dayNumber = Math.floor((i / 9) * (phaseDurationDays - 1)) + 1;
              const isPassed = dayNumber <= daysPassed;
              
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
          Day {Math.min(daysPassed + 1, phaseDurationDays)} of {phaseDurationDays}
        </div>
      </div>
    </div>
  );
};
