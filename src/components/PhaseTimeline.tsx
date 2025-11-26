import { Phase } from "@/types/concern";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

interface PhaseTimelineProps {
  currentPhase: Phase;
  onPhaseClick: (phase: Phase) => void;
}

const phases: { key: Phase; label: string; description: string }[] = [
  { key: "class", label: "Class Phase", description: "Classes discuss and vote" },
  { key: "grade", label: "Grade Phase", description: "Top posts visible to grades" },
  { key: "school", label: "School Phase", description: "Top posts visible to whole school" },
];

export const PhaseTimeline = ({ currentPhase, onPhaseClick }: PhaseTimelineProps) => {
  const currentIndex = phases.findIndex((p) => p.key === currentPhase);

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Participation Timeline</h3>
      <div className="flex items-center justify-between relative">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-border" />
        <div
          className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500"
          style={{ width: `${(currentIndex / (phases.length - 1)) * 100}%` }}
        />

        {phases.map((phase, index) => {
          const isActive = index <= currentIndex;
          const isCurrent = phase.key === currentPhase;

          return (
            <button
              key={phase.key}
              onClick={() => onPhaseClick(phase.key)}
              className={cn(
                "relative flex flex-col items-center group cursor-pointer transition-all",
                "hover:scale-105"
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2 transition-all",
                  "bg-background z-10",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground",
                  isCurrent && "ring-4 ring-primary/20"
                )}
              >
                {isActive ? <CheckCircle2 className="h-5 w-5" /> : <span>{index + 1}</span>}
              </div>
              <div className="text-center">
                <div
                  className={cn(
                    "text-sm font-medium mb-1",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {phase.label}
                </div>
                <div className="text-xs text-muted-foreground max-w-[120px]">
                  {phase.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
