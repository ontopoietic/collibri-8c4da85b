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
import useEmblaCarousel from 'embla-carousel-react';
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
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: false, 
    align: 'start',
    dragFree: false,
    containScroll: 'trimSnaps'
  });
  const [selectedCarouselIndex, setSelectedCarouselIndex] = useState(0);
  const currentIndex = phases.findIndex((p) => p.key === currentPhase);
  const today = new Date();
  const actualDaysPassed = Math.floor((today.getTime() - phaseStartDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Use slider value when simulating, persisted day when available, otherwise default to day 29
  const daysPassed = isSimulating 
    ? Math.min(Math.floor((sliderValue / 100) * phaseDurationDays), phaseDurationDays - 1)
    : persistedDay !== null 
      ? persistedDay
      : 29; // Default to day 29 (end of class phase)
  
  // Find current main phase for tracking changes
  const currentMainPhase = mainPhases.find(p => daysPassed >= p.deliberationStart && daysPassed < p.votingEnd);
  const currentMainPhaseKey = currentMainPhase?.key || null;
  
  // Reset viewed phase when simulation moves to a different phase
  useEffect(() => {
    setViewedPhase(null);
  }, [currentMainPhaseKey]);
  
  // Update carousel selected index when embla changes
  useEffect(() => {
    if (emblaApi) {
      emblaApi.on('select', () => {
        setSelectedCarouselIndex(emblaApi.selectedScrollSnap());
      });
    }
  }, [emblaApi]);
    
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
  } else {
    // Day 95+ - all phases complete
    daysUntilNextPhase = 0;
    nextPhaseName = "";
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
        <div className="flex items-center justify-between w-full sm:w-auto gap-2">
          <h3 className="text-base md:text-lg font-semibold text-foreground">
            Current Interval
          </h3>
          {/* Simulation button next to title on all screen sizes */}
          {onSimulationToggle && (
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
            {/* Current Phase Card - Swipeable Carousel */}
            <div className="overflow-hidden touch-pan-x" ref={emblaRef}>
              <div className="flex">
                {mainPhases.map((phase, index) => {
                  const isCompleted = daysPassed >= phase.votingEnd;
                  const isCurrent = daysPassed >= phase.deliberationStart && daysPassed < phase.votingEnd;
                  const isFuture = daysPassed < phase.deliberationStart;
                  const daysUntilStart = Math.ceil(phase.deliberationStart - daysPassed);
                  
                  // Calculate progress for this specific phase
                  const deliberationDuration = phase.deliberationEnd - phase.deliberationStart;
                  const votingDuration = phase.votingEnd - phase.deliberationEnd;
                  
                  let phaseDeliberationProgress = 0;
                  let phaseVotingProgress = 0;
                  let phaseIsInDeliberation = false;
                  let phaseIsInVoting = false;
                  let phaseDeliberationDaysIn = 0;
                  let phaseVotingDaysIn = 0;
                  let phaseIsVotingComplete = false;
                  
                  if (isCompleted) {
                    phaseDeliberationProgress = 100;
                    phaseVotingProgress = 100;
                    phaseIsVotingComplete = true;
                  } else if (isCurrent) {
                    if (daysPassed < phase.deliberationEnd) {
                      phaseIsInDeliberation = true;
                      phaseDeliberationDaysIn = daysPassed - phase.deliberationStart;
                      phaseDeliberationProgress = (phaseDeliberationDaysIn / deliberationDuration) * 100;
                    } else {
                      phaseDeliberationProgress = 100;
                      phaseIsInVoting = true;
                      phaseVotingDaysIn = daysPassed - phase.deliberationEnd;
                      phaseVotingProgress = (phaseVotingDaysIn / votingDuration) * 100;
                    }
                  }
                  
                  // Render future phase with "Starts in X days" message
                  if (isFuture) {
                    return (
                      <div 
                        key={phase.key} 
                        className="flex-[0_0_100%] min-w-0 px-1"
                      >
                        <div className="rounded-xl p-4 border bg-muted/30 border-border">
                          <div className="flex flex-col items-center justify-center py-2 text-center">
                            <phase.icon className="h-5 w-5 text-muted-foreground/50 mb-1" />
                            <span className="text-sm font-medium text-muted-foreground/70">{phase.label} Phase</span>
                            <span className="text-base font-bold text-muted-foreground mt-1">
                              Starts in {daysUntilStart} {daysUntilStart === 1 ? 'day' : 'days'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  
                  return (
                    <div 
                      key={phase.key} 
                      className="flex-[0_0_100%] min-w-0 px-1"
                      onClick={() => {
                        if (isCompleted || daysPassed >= 95) {
                          navigate(`/leaderboard/${phase.key}`);
                        }
                      }}
                    >
                      <div className={cn(
                        "rounded-xl p-4 border",
                        (isCompleted || daysPassed >= 95) && "cursor-pointer hover:shadow-md transition-shadow",
                        isCompleted
                          ? "bg-muted/50 border-muted-foreground/20" 
                          : "bg-primary/10 border-primary/20"
                      )}>
                        <div className="flex items-center gap-3">
                          {/* Deliberation Phase Section */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 h-7">
                              <phase.icon className={cn(
                                "h-4 w-4",
                                isCompleted ? "text-muted-foreground" : "text-primary"
                              )} />
                              <span className={cn(
                                "text-sm font-bold",
                                isCompleted ? "text-muted-foreground" : "text-foreground"
                              )}>{phase.label}</span>
                            </div>
                            <Progress value={phaseDeliberationProgress} className="h-2 mb-1" />
                            <span className="text-xs text-muted-foreground">
                              {isCompleted ? "Complete" : phaseIsInDeliberation ? `Day ${Math.floor(phaseDeliberationDaysIn) + 1} of 30` : "Complete"}
                            </span>
                          </div>
                          
                          {/* Arrow indicator */}
                          <ChevronRight className="h-3 w-3 text-muted-foreground flex-shrink-0 self-start mt-[34px]" />
                          
                          {/* Variant Selection Section */}
                          <div className="w-24" data-tour="review-phase">
                            <div className="flex items-center gap-1.5 mb-2 px-2 py-1 rounded-md h-7 bg-muted border border-border">
                              <CheckSquare className="h-4 w-4 text-foreground" />
                              <span className="text-xs font-medium text-foreground">Review</span>
                            </div>
                            <Progress value={phaseVotingProgress} className="h-2 mb-1 [&>div]:bg-[#A8BDFF]" />
                            <span className="text-[10px] text-muted-foreground">
                              {isCompleted ? "Done" : phaseIsInVoting ? `Day ${Math.floor(phaseVotingDaysIn) + 1}/5` : phaseIsVotingComplete ? "Done" : "Soon"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Three Dots Navigation - Only for main phases */}
            <div className="flex justify-center items-center gap-4">
              {mainPhases.map((phase, index) => {
                const isCompleted = daysPassed >= phase.votingEnd;
                const isCurrent = daysPassed >= phase.deliberationStart && daysPassed < phase.votingEnd;
                const isViewing = viewedPhase === phase.key;
                
                const isFuture = daysPassed < phase.deliberationStart;
                
                return (
                  <button
                    key={phase.key}
                    onClick={() => {
                      // Scroll carousel to this phase
                      emblaApi?.scrollTo(index);
                      // Update viewed phase state
                      if (isCurrent) {
                        setViewedPhase(null);
                      } else {
                        setViewedPhase(phase.key);
                      }
                      // Navigate to leaderboard for completed phases or at day 95+
                      if (isCompleted || daysPassed >= 95) {
                        navigate(`/leaderboard/${phase.key}`);
                      }
                    }}
                    className={cn(
                      "w-4 h-4 rounded-full transition-all cursor-pointer hover:scale-110",
                      selectedCarouselIndex === index && "ring-2 ring-primary ring-offset-2 ring-offset-card",
                      (isCompleted || isCurrent) ? "bg-primary" : "bg-muted"
                    )}
                    aria-label={`${phase.label} phase${isCurrent ? " (current)" : ""}${isCompleted ? " (completed)" : ""}${isFuture ? " (upcoming)" : ""}`}
                  />
                );
              })}
            </div>
            
          </div>
        ) : !isMobile ? (
          /* Desktop View - 3 Phase Cards */
          <div className="grid grid-cols-3 gap-4">
            {mainPhases.map((phase) => {
              const isCompleted = daysPassed >= phase.votingEnd;
              const isCurrent = daysPassed >= phase.deliberationStart && daysPassed < phase.votingEnd;
              const isUpcoming = daysPassed < phase.deliberationStart;
              
              // Calculate progress for this specific phase
              const deliberationDuration = phase.deliberationEnd - phase.deliberationStart;
              const votingDuration = phase.votingEnd - phase.deliberationEnd;
              
              let phaseDeliberationProgress = 0;
              let phaseVotingProgress = 0;
              let phaseIsInDeliberation = false;
              let phaseIsInVoting = false;
              let phaseDeliberationDaysIn = 0;
              let phaseVotingDaysIn = 0;
              
              if (isCompleted) {
                phaseDeliberationProgress = 100;
                phaseVotingProgress = 100;
              } else if (isCurrent) {
                if (daysPassed < phase.deliberationEnd) {
                  phaseIsInDeliberation = true;
                  phaseDeliberationDaysIn = daysPassed - phase.deliberationStart;
                  phaseDeliberationProgress = (phaseDeliberationDaysIn / deliberationDuration) * 100;
                } else {
                  phaseDeliberationProgress = 100;
                  phaseIsInVoting = true;
                  phaseVotingDaysIn = daysPassed - phase.deliberationEnd;
                  phaseVotingProgress = (phaseVotingDaysIn / votingDuration) * 100;
                }
              }
              
              const daysUntilStart = Math.ceil(phase.deliberationStart - daysPassed);
              
              // Render future phase with "Starts in X days" message
              if (isUpcoming) {
                return (
                  <div 
                    key={phase.key}
                    className="rounded-xl p-4 border transition-all bg-muted/30 border-border"
                  >
                    <div className="h-5 mb-2" /> {/* Spacer to match other cards */}
                    <div className="flex flex-col items-center justify-center py-1 text-center">
                      <phase.icon className="h-5 w-5 text-muted-foreground/50 mb-1" />
                      <span className="text-sm font-medium text-muted-foreground/70">{phase.label} Phase</span>
                      <span className="text-base font-bold text-muted-foreground mt-1">
                        Starts in {daysUntilStart} {daysUntilStart === 1 ? 'day' : 'days'}
                      </span>
                    </div>
                  </div>
                );
              }
              
              return (
                <div 
                  key={phase.key}
                  className={cn(
                    "rounded-xl p-4 border transition-all",
                    isCompleted ? "bg-muted/50 border-muted-foreground/20 cursor-pointer hover:shadow-md" :
                    "bg-primary/10 border-primary/20"
                  )}
                  onClick={() => {
                    // Allow clicking if phase is completed OR if we're at day 95+
                    if (isCompleted || daysPassed >= 95) {
                      navigate(`/leaderboard/${phase.key}`);
                    }
                  }}
                >
                  {/* Status badge - always reserve space for consistent alignment */}
                  <div className="h-5 mb-2 flex items-center">
                    {isCompleted && (
                      <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Complete</span>
                      </div>
                    )}
                    {isCurrent && (
                      <div className="flex items-center gap-1 text-xs font-medium text-primary">
                        <Play className="h-3 w-3 fill-current" />
                        <span>Active</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {/* Deliberation */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 h-7">
                        <phase.icon className={cn(
                          "h-4 w-4",
                          isCompleted ? "text-muted-foreground" : "text-primary"
                        )} />
                        <span className={cn(
                          "text-sm font-bold",
                          isCompleted ? "text-muted-foreground" : "text-foreground"
                        )}>{phase.label}</span>
                      </div>
                      <Progress value={phaseDeliberationProgress} className="h-2 mb-1" />
                      <span className="text-xs text-muted-foreground">
                        {isCompleted ? "Complete" : 
                         phaseIsInDeliberation ? `Day ${Math.floor(phaseDeliberationDaysIn) + 1} of 30` : 
                         isCurrent ? "Complete" : "Upcoming"}
                      </span>
                    </div>
                    
                    <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 self-start mt-[34px]" />
                    
                    {/* Selection */}
                    <div className="w-24" data-tour="review-phase">
                      <div className="flex items-center gap-1.5 mb-2 px-2 py-1 rounded-md h-7 bg-muted border border-border">
                        <CheckSquare className="h-4 w-4 text-foreground" />
                        <span className="text-xs font-medium text-foreground">Review</span>
                      </div>
                      <Progress value={phaseVotingProgress} className="h-2 mb-1 [&>div]:bg-[#A8BDFF]" />
                      <span className="text-[10px] text-muted-foreground">
                        {isCompleted ? "Done" : 
                         phaseIsInVoting ? `Day ${Math.floor(phaseVotingDaysIn) + 1}/5` : 
                         phaseDeliberationProgress === 100 ? "Done" : "Soon"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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
