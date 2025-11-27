import { useState, useEffect } from "react";
import { Phase } from "@/types/concern";
import { cn } from "@/lib/utils";
import { Calendar, Trophy, User, Users, School, CheckSquare, ChevronRight, Play, Pause, CheckCircle2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
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
  persistedDay?: number | null;
  onSimulationToggle?: () => void;
}

const phases: { key: Phase; label: string }[] = [
  { key: "class", label: "Class Phase" },
  { key: "grade", label: "Grade Phase" },
  { key: "school", label: "School Phase" },
];

// Extended phases array including voting phases
const allPhases = [
  { key: "class" as Phase, label: "Class", icon: User, dayStart: 0, dayEnd: 30, isVoting: false },
  { key: "class-voting", label: "Variant Selection", icon: CheckSquare, dayStart: 30, dayEnd: 35, isVoting: true },
  { key: "grade" as Phase, label: "Grade", icon: Users, dayStart: 35, dayEnd: 60, isVoting: false },
  { key: "grade-voting", label: "Variant Selection", icon: CheckSquare, dayStart: 60, dayEnd: 65, isVoting: true },
  { key: "school" as Phase, label: "School", icon: School, dayStart: 65, dayEnd: 90, isVoting: false },
  { key: "school-voting", label: "Final Selection", icon: CheckSquare, dayStart: 90, dayEnd: 95, isVoting: true },
];

// Main phases for mobile 3-dot navigation
const mainPhases = [
  { 
    key: "class" as Phase, 
    label: "Class", 
    icon: User, 
    deliberationStart: 0, 
    deliberationEnd: 30, 
    votingEnd: 35 
  },
  { 
    key: "grade" as Phase, 
    label: "Grade", 
    icon: Users, 
    deliberationStart: 35, 
    deliberationEnd: 60, 
    votingEnd: 65 
  },
  { 
    key: "school" as Phase, 
    label: "School", 
    icon: School, 
    deliberationStart: 65, 
    deliberationEnd: 90, 
    votingEnd: 95 
  },
];

export const PhaseTimeline = ({ 
  currentPhase, 
  onPhaseClick,
  phaseStartDate = new Date(2024, 0, 1),
  phaseEndDate = new Date(2024, 0, 31),
  phaseDurationDays = 95,
  sliderValue = 100,
  onSliderChange,
  isSimulating = false,
  persistedDay = null,
  onSimulationToggle,
}: PhaseTimelineProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [viewedPhase, setViewedPhase] = useState<Phase | null>(null);
  const currentIndex = phases.findIndex((p) => p.key === currentPhase);
  const today = new Date();
  const actualDaysPassed = Math.floor((today.getTime() - phaseStartDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Use slider value when simulating, persisted day when available, otherwise use actual days
  const daysPassed = isSimulating 
    ? Math.min(Math.floor((sliderValue / 100) * phaseDurationDays), phaseDurationDays - 1)
    : persistedDay !== null 
      ? persistedDay
      : actualDaysPassed;
  
  // Find current main phase for tracking changes
  const currentMainPhase = mainPhases.find(p => daysPassed >= p.deliberationStart && daysPassed < p.votingEnd);
  const currentMainPhaseKey = currentMainPhase?.key || null;
  
  // Reset viewed phase when simulation moves to a different phase
  useEffect(() => {
    setViewedPhase(null);
  }, [currentMainPhaseKey]);
    
  // Calculate overall progress percentage (0-100% across all 95 days)
  const overallProgressPercentage = (daysPassed / phaseDurationDays) * 100;
  
  // Display the viewed phase if user clicked on a completed phase dot, otherwise show current
  const displayedPhase = viewedPhase 
    ? mainPhases.find(p => p.key === viewedPhase) 
    : currentMainPhase;
  
  const isViewingCompletedPhase = viewedPhase && displayedPhase && daysPassed >= displayedPhase.votingEnd;

  // Calculate progress for mobile combined view
  let deliberationProgress = 0;
  let votingProgress = 0;
  let isInDeliberation = false;
  let isInVoting = false;
  let deliberationDaysIn = 0;
  let votingDaysIn = 0;
  let isVotingComplete = false;

  if (displayedPhase) {
    const deliberationDuration = displayedPhase.deliberationEnd - displayedPhase.deliberationStart;
    const votingDuration = displayedPhase.votingEnd - displayedPhase.deliberationEnd;
    
    if (isViewingCompletedPhase) {
      // Viewing a completed phase - show 100% for both
      deliberationProgress = 100;
      votingProgress = 100;
      isVotingComplete = true;
    } else if (daysPassed < displayedPhase.deliberationEnd) {
      // In deliberation phase
      isInDeliberation = true;
      deliberationDaysIn = Math.floor(daysPassed - displayedPhase.deliberationStart);
      deliberationProgress = (deliberationDaysIn / deliberationDuration) * 100;
      votingProgress = 0;
    } else {
      // In voting phase or completed
      deliberationProgress = 100;
      isInVoting = daysPassed < displayedPhase.votingEnd;
      isVotingComplete = daysPassed >= displayedPhase.votingEnd;
      votingDaysIn = Math.floor(daysPassed - displayedPhase.deliberationEnd);
      votingProgress = isInVoting ? (votingDaysIn / votingDuration) * 100 : 100;
    }
  }

  // Calculate days until next major phase for header
  let daysUntilNextPhase = 0;
  let nextPhaseName = "";
  
  if (daysPassed < 30) {
    daysUntilNextPhase = 30 - daysPassed;
    nextPhaseName = "Variant Selection";
  } else if (daysPassed < 35) {
    daysUntilNextPhase = 35 - daysPassed;
    nextPhaseName = "Grade Level";
  } else if (daysPassed < 60) {
    daysUntilNextPhase = 60 - daysPassed;
    nextPhaseName = "Variant Selection";
  } else if (daysPassed < 65) {
    daysUntilNextPhase = 65 - daysPassed;
    nextPhaseName = "School Level";
  } else if (daysPassed < 90) {
    daysUntilNextPhase = 90 - daysPassed;
    nextPhaseName = "Final Selection";
  } else if (daysPassed < 95) {
    daysUntilNextPhase = 95 - daysPassed;
    nextPhaseName = "Completion";
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
        <div className="flex items-center justify-between w-full sm:w-auto gap-2">
          <h3 className="text-base md:text-lg font-semibold text-foreground">
            Current Interval
          </h3>
          {/* Simulation button on mobile */}
          {isMobile && onSimulationToggle && (
            <Button
              variant={isSimulating ? "default" : "secondary-action"}
              onClick={onSimulationToggle}
              size="sm"
              className="gap-1"
            >
              {isSimulating ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
              {isSimulating ? "Stop" : "Simulate"}
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
          <Calendar className="h-3 w-3 md:h-4 md:w-4" />
          <span className="font-medium">
            Day {Math.floor(daysPassed) + 1} • {daysUntilNextPhase > 0 ? `${Math.ceil(daysUntilNextPhase)} days until ${nextPhaseName}` : 'Timeline Complete'}
          </span>
        </div>
      </div>

      <div className="space-y-6 flex-1">
        {/* Mobile View - Combined Phase + Voting Display */}
        {isMobile && displayedPhase ? (
          <div className="space-y-4">
            {/* Current Phase Card - Shows deliberation + voting together */}
            <div className={cn(
              "rounded-xl p-4 border relative",
              isViewingCompletedPhase 
                ? "bg-muted/50 border-muted-foreground/20" 
                : "bg-primary/10 border-primary/20"
            )}>
              {isViewingCompletedPhase && (
                <div className="absolute top-2 right-2 flex items-center gap-1 text-xs font-medium text-muted-foreground bg-background/80 rounded-full px-2 py-1">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Complete</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                {/* Deliberation Phase Section */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <displayedPhase.icon className={cn(
                      "h-4 w-4",
                      isViewingCompletedPhase ? "text-muted-foreground" : "text-primary"
                    )} />
                    <span className={cn(
                      "text-sm font-bold",
                      isViewingCompletedPhase ? "text-muted-foreground" : "text-foreground"
                    )}>{displayedPhase.label}</span>
                  </div>
                  <Progress value={deliberationProgress} className="h-2 mb-1" />
                  <span className="text-xs text-muted-foreground">
                    {isViewingCompletedPhase ? "Complete" : isInDeliberation ? `Day ${Math.floor(deliberationDaysIn) + 1} of 30` : "Complete"}
                  </span>
                </div>
                
                {/* Arrow indicator */}
                <ChevronRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                
                {/* Variant Selection Section - Smaller with desktop styling */}
                <div className="w-20">
                  <div 
                    className="flex items-center gap-1.5 mb-2 px-2 py-1 rounded-md"
                    style={{ backgroundColor: '#3B3C4C' }}
                  >
                    <CheckSquare className="h-3 w-3 text-white" />
                    <span className="text-xs font-medium text-white">Selection</span>
                  </div>
                  <Progress value={votingProgress} className="h-2 mb-1" />
                  <span className="text-[10px] text-muted-foreground">
                    {isViewingCompletedPhase ? "Done" : isInVoting ? `Day ${Math.floor(votingDaysIn) + 1}/5` : isVotingComplete ? "Done" : "Soon"}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Three Dots Navigation - Only for main phases */}
            <div className="flex justify-center items-center gap-4">
              {mainPhases.map((phase) => {
                const isCompleted = daysPassed >= phase.votingEnd;
                const isCurrent = daysPassed >= phase.deliberationStart && daysPassed < phase.votingEnd;
                const isViewing = viewedPhase === phase.key;
                
                return (
                  <button
                    key={phase.key}
                    onClick={() => {
                      // Allow clicking current phase to reset to live view
                      if (isCurrent || isViewing) {
                        setViewedPhase(null);
                      } else if (isCompleted) {
                        setViewedPhase(phase.key);
                      }
                      // Also trigger the leaderboard toggle for completed phases
                      if (isCompleted) {
                        onPhaseClick(phase.key);
                      }
                    }}
                    className={cn(
                      "w-4 h-4 rounded-full transition-all",
                      isCurrent && !isViewing && "ring-2 ring-primary ring-offset-2 ring-offset-card",
                      isViewing && "ring-2 ring-foreground ring-offset-2 ring-offset-card",
                      // Make current phase clickable too
                      (isCompleted || isCurrent) ? "bg-primary cursor-pointer hover:scale-110" : "bg-muted cursor-default"
                    )}
                    aria-label={`${phase.label} phase${isCurrent ? " (current)" : ""}${isCompleted ? " (completed)" : ""}`}
                  />
                );
              })}
            </div>
            
            {/* Phase Labels */}
            <div className="flex justify-between text-xs text-muted-foreground px-4">
              <span>Class</span>
              <span>Grade</span>
              <span>School</span>
            </div>
          </div>
        ) : !isMobile ? (
          /* Desktop/Tablet View - Scrollable Timeline */
          <ScrollArea className="w-full">
            <div className="min-w-[500px]">
              <div className="space-y-4">
                <div className="flex gap-1 items-center">
                  {/* Class Phase Button - 30 days = 31.58% */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => daysPassed >= 30 && onPhaseClick("class")}
                          disabled={daysPassed < 30}
                          className={cn(
                            "relative rounded-lg transition-all duration-300 group",
                            "h-8 sm:h-10 md:h-12 lg:h-14",
                            daysPassed >= 30 
                              ? "cursor-pointer hover:opacity-100" 
                              : "cursor-not-allowed opacity-50",
                            daysPassed < 30 || daysPassed >= 35 ? "opacity-60" : ""
                          )}
                          style={{ width: "31.58%" }}
                        >
                          <div className={cn(
                            "absolute inset-0 rounded-lg transition-all duration-300",
                            daysPassed >= 30 
                              ? "bg-primary/20 group-hover:bg-primary/30" 
                              : "bg-muted"
                          )}>
                            <div
                              className="h-full bg-primary transition-all duration-500 rounded-lg"
                              style={{ width: `${Math.min(100, (overallProgressPercentage / 31.58) * 100)}%` }}
                            />
                          </div>
                          <div className="relative flex items-center justify-center h-full gap-1 md:gap-2 px-2 md:px-4">
                            <User className="h-3 w-3 md:h-4 md:w-4 text-foreground flex-shrink-0" />
                            <span className="text-xs md:text-sm font-semibold text-foreground truncate">Class</span>
                          </div>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{daysPassed >= 30 ? "View Class Leaderboard" : "Available when phase is complete"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* Class Voting Phase - 5 days = 5.26% */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "relative rounded-lg transition-all duration-300 cursor-default",
                            "h-8 sm:h-10 md:h-12 lg:h-14"
                          )}
                          style={{ width: "5.26%" }}
                        >
                          <div className="absolute inset-0 rounded-lg overflow-hidden transition-all duration-300" style={{ backgroundColor: '#3B3C4C' }}>
                            <div
                              className="h-full transition-all duration-500"
                              style={{ 
                                width: `${Math.max(0, Math.min(100, ((overallProgressPercentage - 31.58) / 5.26) * 100))}%`,
                                backgroundColor: '#2A2B37'
                              }}
                            />
                          </div>
                          <div className="relative flex items-center justify-center h-full">
                            <CheckSquare className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5" color="white" />
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Variant Selection Phase (5 days)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* Grade Phase Button - 25 days = 26.32% */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => daysPassed >= 60 && onPhaseClick("grade")}
                          disabled={daysPassed < 60}
                          className={cn(
                            "relative rounded-lg transition-all duration-300 group",
                            "h-8 sm:h-10 md:h-12 lg:h-14",
                            daysPassed >= 60 
                              ? "cursor-pointer hover:opacity-100" 
                              : "cursor-not-allowed opacity-50",
                            daysPassed < 35 || daysPassed >= 65 ? "opacity-60" : ""
                          )}
                          style={{ width: "26.32%" }}
                        >
                          <div className={cn(
                            "absolute inset-0 rounded-lg transition-all duration-300",
                            daysPassed >= 60 
                              ? "bg-primary/20 group-hover:bg-primary/30" 
                              : "bg-muted"
                          )}>
                            <div
                              className="h-full bg-primary transition-all duration-500 rounded-lg"
                              style={{ width: `${Math.max(0, Math.min(100, ((overallProgressPercentage - 36.84) / 26.32) * 100))}%` }}
                            />
                          </div>
                          <div className="relative flex items-center justify-center h-full gap-1 md:gap-2 px-2 md:px-4">
                            <Users className="h-3 w-3 md:h-4 md:w-4 text-foreground flex-shrink-0" />
                            <span className="text-xs md:text-sm font-semibold text-foreground truncate">Grade</span>
                          </div>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{daysPassed >= 60 ? "View Grade Leaderboard" : "Available when phase is complete"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* Grade Voting Phase - 5 days = 5.26% */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "relative rounded-lg transition-all duration-300 cursor-default",
                            "h-8 sm:h-10 md:h-12 lg:h-14"
                          )}
                          style={{ width: "5.26%" }}
                        >
                          <div className="absolute inset-0 rounded-lg overflow-hidden transition-all duration-300" style={{ backgroundColor: '#3B3C4C' }}>
                            <div
                              className="h-full transition-all duration-500"
                              style={{ 
                                width: `${Math.max(0, Math.min(100, ((overallProgressPercentage - 63.16) / 5.26) * 100))}%`,
                                backgroundColor: '#2A2B37'
                              }}
                            />
                          </div>
                          <div className="relative flex items-center justify-center h-full">
                            <CheckSquare className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5" color="white" />
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Variant Selection Phase (5 days)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* School Phase Button - 25 days = 26.32% */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => daysPassed >= 90 && onPhaseClick("school")}
                          disabled={daysPassed < 90}
                          className={cn(
                            "relative rounded-lg transition-all duration-300 group",
                            "h-8 sm:h-10 md:h-12 lg:h-14",
                            daysPassed >= 90
                              ? "cursor-pointer hover:scale-[1.02]"
                              : "cursor-not-allowed opacity-50",
                            daysPassed < 65 || daysPassed >= 95 ? "opacity-60" : ""
                          )}
                          style={{ width: "26.32%" }}
                        >
                          <div className={cn(
                            "absolute inset-0 rounded-lg transition-all duration-300",
                            daysPassed >= 90 
                              ? "bg-school/20 group-hover:bg-school/30" 
                              : "bg-muted"
                          )}>
                            <div
                              className="h-full bg-school transition-all duration-500 rounded-lg"
                              style={{ width: `${Math.max(0, Math.min(100, ((overallProgressPercentage - 68.42) / 26.32) * 100))}%` }}
                            />
                          </div>
                          <div className="relative flex items-center justify-center h-full gap-1 md:gap-2 px-2 md:px-4">
                            <School className="h-3 w-3 md:h-4 md:w-4 text-foreground flex-shrink-0" />
                            <span className="text-xs md:text-sm font-semibold text-foreground truncate">School</span>
                          </div>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{daysPassed >= 90 ? "View School Leaderboard" : "Available when phase is complete"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* School Voting Phase - 5 days = 5.26% */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "relative rounded-lg transition-all duration-300 cursor-default",
                            "h-8 sm:h-10 md:h-12 lg:h-14"
                          )}
                          style={{ width: "5.26%" }}
                        >
                          <div className="absolute inset-0 rounded-lg overflow-hidden transition-all duration-300" style={{ backgroundColor: '#3B3C4C' }}>
                            <div
                              className="h-full transition-all duration-500"
                              style={{ 
                                width: `${Math.max(0, Math.min(100, ((overallProgressPercentage - 94.74) / 5.26) * 100))}%`,
                                backgroundColor: '#2A2B37'
                              }}
                            />
                          </div>
                          <div className="relative flex items-center justify-center h-full">
                            <CheckSquare className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5" color="white" />
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Final Selection Phase (5 days)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {/* Date/Day Indicators */}
                <div className="relative h-6 text-xs text-muted-foreground mt-2">
                  <div className="absolute whitespace-nowrap" style={{ left: "0%" }}>Day 1</div>
                  <div className="absolute whitespace-nowrap" style={{ left: "31.58%", transform: "translateX(-50%)" }}>Day 30</div>
                  <div className="absolute whitespace-nowrap" style={{ left: "36.84%", transform: "translateX(-50%)" }}>Day 35</div>
                  <div className="absolute whitespace-nowrap" style={{ left: "63.16%", transform: "translateX(-50%)" }}>Day 60</div>
                  <div className="absolute whitespace-nowrap" style={{ left: "68.42%", transform: "translateX(-50%)" }}>Day 65</div>
                  <div className="absolute whitespace-nowrap" style={{ left: "94.74%", transform: "translateX(-50%)" }}>Day 90</div>
                  <div className="absolute whitespace-nowrap" style={{ left: "100%" }}>Day 95</div>
                </div>
              </div>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        ) : null}
      </div>

      {/* Simulation Slider - Always at bottom when simulating */}
      {isSimulating && onSliderChange && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              Day {Math.floor(daysPassed) + 1}
            </span>
            <Slider
              value={[sliderValue]}
              onValueChange={(vals) => onSliderChange(vals[0])}
              max={100}
              step={0.1}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              Day {phaseDurationDays}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
