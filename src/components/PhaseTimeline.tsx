import { Phase } from "@/types/concern";
import { cn } from "@/lib/utils";
import { Calendar, Trophy, User, Users, School, CheckSquare } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
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
}

const phases: { key: Phase; label: string }[] = [
  { key: "class", label: "Class Phase" },
  { key: "grade", label: "Grade Phase" },
  { key: "school", label: "School Phase" },
];

// Extended phases array including voting phases for mobile view
const allPhases = [
  { key: "class" as Phase, label: "Class", icon: User, dayStart: 0, dayEnd: 30, isVoting: false },
  { key: "class-voting", label: "Variant Selection", icon: CheckSquare, dayStart: 30, dayEnd: 35, isVoting: true },
  { key: "grade" as Phase, label: "Grade", icon: Users, dayStart: 35, dayEnd: 60, isVoting: false },
  { key: "grade-voting", label: "Variant Selection", icon: CheckSquare, dayStart: 60, dayEnd: 65, isVoting: true },
  { key: "school" as Phase, label: "School", icon: School, dayStart: 65, dayEnd: 90, isVoting: false },
];

export const PhaseTimeline = ({ 
  currentPhase, 
  onPhaseClick,
  phaseStartDate = new Date(2024, 0, 1),
  phaseEndDate = new Date(2024, 0, 31),
  phaseDurationDays = 90,
  sliderValue = 100,
  onSliderChange,
  isSimulating = false,
  persistedDay = null
}: PhaseTimelineProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const currentIndex = phases.findIndex((p) => p.key === currentPhase);
  const today = new Date();
  const actualDaysPassed = Math.floor((today.getTime() - phaseStartDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Use slider value when simulating, persisted day when available, otherwise use actual days
  const daysPassed = isSimulating 
    ? Math.min(Math.floor((sliderValue / 100) * phaseDurationDays), phaseDurationDays - 1)
    : persistedDay !== null 
      ? persistedDay
      : actualDaysPassed;
    
  // Calculate overall progress percentage (0-100% across all 90 days)
  const overallProgressPercentage = (daysPassed / phaseDurationDays) * 100;
  
  // Determine which phase we're currently in based on day
  const isInClassPhase = daysPassed >= 0 && daysPassed < 30;
  const isInClassVoting = daysPassed >= 30 && daysPassed < 35;
  const isInGradePhase = daysPassed >= 35 && daysPassed < 60;
  const isInGradeVoting = daysPassed >= 60 && daysPassed < 65;
  const isInSchoolPhase = daysPassed >= 65 && daysPassed <= 90;
  
  // Calculate days until next phase
  let daysUntilText = "";
  if (isInClassPhase || isInClassVoting) {
    const daysUntilGrade = Math.round(35 - daysPassed);
    daysUntilText = `${daysUntilGrade} days until Grade Level`;
  } else if (isInGradePhase || isInGradeVoting) {
    const daysUntilSchool = Math.round(65 - daysPassed);
    daysUntilText = `${daysUntilSchool} days until School Level`;
  } else if (isInSchoolPhase) {
    const daysRemaining = Math.round(90 - daysPassed);
    daysUntilText = `${daysRemaining} days left in School Level`;
  }
  
  // Check if in interim phase (first 5 days)
  const currentPhaseDayStart = currentIndex * 30;
  const daysIntoCurrentPhase = Math.max(0, Math.min(30, daysPassed - currentPhaseDayStart));
  const isInInterim = daysIntoCurrentPhase < 5;

  // Determine current phase index in allPhases array
  const currentPhaseInAllPhases = allPhases.findIndex((phase) => {
    return daysPassed >= phase.dayStart && daysPassed < phase.dayEnd;
  });

  // Calculate progress within current phase for mobile view
  const currentPhaseObj = allPhases[currentPhaseInAllPhases];
  const daysIntoPhase = currentPhaseObj ? daysPassed - currentPhaseObj.dayStart : 0;
  const phaseDuration = currentPhaseObj ? currentPhaseObj.dayEnd - currentPhaseObj.dayStart : 1;
  const phaseProgress = (daysIntoPhase / phaseDuration) * 100;

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
        <h3 className="text-base md:text-lg font-semibold text-foreground">
          Timeline Overview
        </h3>
        <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
          <Calendar className="h-3 w-3 md:h-4 md:w-4" />
          <span className="font-medium">
            {isSimulating 
              ? `Day ${daysPassed + 1} of ${phaseDurationDays}` 
              : daysUntilText}
          </span>
        </div>
      </div>

      <div className="space-y-6 flex-1">
        {/* Mobile View - Focus + Context */}
        {isMobile ? (
          <div className="space-y-4">
            {/* Current Phase Card */}
            <div className="bg-primary/10 rounded-xl p-4 text-center border border-primary/20">
              <div className="flex items-center justify-center gap-2 mb-3">
                {currentPhaseObj && (
                  <>
                    <currentPhaseObj.icon className="h-5 w-5 text-primary" />
                    <span className="text-lg font-bold text-foreground">{currentPhaseObj.label}</span>
                  </>
                )}
              </div>
              <Progress value={phaseProgress} className="h-2 mb-2" />
              <span className="text-sm text-muted-foreground">
                Day {daysIntoPhase + 1} of {phaseDuration}
              </span>
            </div>
            
            {/* Dot Navigation */}
            <div className="flex justify-center items-center gap-2">
              {allPhases.map((phase, idx) => {
                const isCompleted = daysPassed >= phase.dayEnd;
                const isCurrent = idx === currentPhaseInAllPhases;
                
                return (
                  <button
                    key={`${phase.key}-${idx}`}
                    onClick={() => {
                      if (isCompleted && !phase.isVoting && phase.key !== "class-voting" && phase.key !== "grade-voting") {
                        onPhaseClick(phase.key as Phase);
                      }
                    }}
                    className={cn(
                      "rounded-full transition-all",
                      phase.isVoting ? "w-2 h-2" : "w-3 h-3",
                      isCurrent && "ring-2 ring-primary ring-offset-2 ring-offset-card",
                      isCompleted ? "bg-primary" : "bg-muted",
                      isCompleted && !phase.isVoting && "cursor-pointer hover:scale-110"
                    )}
                  />
                );
              })}
            </div>
            
            {/* Phase Labels Row */}
            <div className="flex justify-between text-xs text-muted-foreground px-2">
              <span>Class</span>
              <span>Grade</span>
              <span>School</span>
            </div>
          </div>
        ) : (
          /* Desktop/Tablet View - Scrollable Timeline */
          <ScrollArea className="w-full">
            <div className="min-w-[500px]">
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
                            "relative rounded-lg transition-all duration-300 group",
                            "h-8 sm:h-10 md:h-12 lg:h-14",
                            daysPassed >= 30 
                              ? "cursor-pointer hover:opacity-100" 
                              : "cursor-not-allowed opacity-50",
                            !isInClassPhase && !isInClassVoting && "opacity-60"
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

                  {/* Grade Voting Phase */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "relative rounded-lg transition-all duration-300 cursor-default",
                            "h-8 sm:h-10 md:h-12 lg:h-14"
                          )}
                          style={{ width: "5.56%" }}
                        >
                          <div className="absolute inset-0 rounded-lg overflow-hidden transition-all duration-300" style={{ backgroundColor: '#3B3C4C' }}>
                            <div
                              className="h-full transition-all duration-500"
                              style={{ 
                                width: `${Math.max(0, Math.min(100, ((overallProgressPercentage - 33.33) / 5.56) * 100))}%`,
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

                  {/* Grade Phase Button */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => daysPassed >= 65 && onPhaseClick("grade")}
                          disabled={daysPassed < 65}
                          className={cn(
                            "relative rounded-lg transition-all duration-300 group",
                            "h-8 sm:h-10 md:h-12 lg:h-14",
                            daysPassed >= 65 
                              ? "cursor-pointer hover:opacity-100" 
                              : "cursor-not-allowed opacity-50",
                            !isInGradePhase && !isInGradeVoting && "opacity-60"
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
                          <div className="relative flex items-center justify-center h-full gap-1 md:gap-2 px-2 md:px-4">
                            <Users className="h-3 w-3 md:h-4 md:w-4 text-foreground flex-shrink-0" />
                            <span className="text-xs md:text-sm font-semibold text-foreground truncate">Grade</span>
                          </div>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{daysPassed >= 65 ? "View Grade Leaderboard" : "Available when phase is complete"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* School Voting Phase */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "relative rounded-lg transition-all duration-300 cursor-default",
                            "h-8 sm:h-10 md:h-12 lg:h-14"
                          )}
                          style={{ width: "5.56%" }}
                        >
                          <div className="absolute inset-0 rounded-lg overflow-hidden transition-all duration-300" style={{ backgroundColor: '#3B3C4C' }}>
                            <div
                              className="h-full transition-all duration-500"
                              style={{ 
                                width: `${Math.max(0, Math.min(100, ((overallProgressPercentage - 66.67) / 5.56) * 100))}%`,
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

                  {/* School Phase Button */}
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
                            !isInSchoolPhase && "opacity-60"
                          )}
                          style={{ width: "27.77%" }}
                        >
                          <div className={cn(
                            "absolute inset-0 rounded-lg transition-all duration-300",
                            daysPassed >= 90 
                              ? "bg-school/20 group-hover:bg-school/30" 
                              : "bg-muted"
                          )}>
                            <div
                              className="h-full bg-school transition-all duration-500 rounded-lg"
                              style={{ width: `${Math.max(0, Math.min(100, ((overallProgressPercentage - 72.23) / 27.77) * 100))}%` }}
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
                </div>

                {/* Date/Day Indicators */}
                <div className="relative h-6 text-xs text-muted-foreground mt-2">
                  <div className="absolute whitespace-nowrap" style={{ left: "0%" }}>Day 1</div>
                  <div className="absolute whitespace-nowrap" style={{ left: "33.33%", transform: "translateX(-50%)" }}>Day 30</div>
                  <div className="absolute whitespace-nowrap" style={{ left: "38.89%", transform: "translateX(-50%)" }}>Day 35</div>
                  <div className="absolute whitespace-nowrap" style={{ left: "66.67%", transform: "translateX(-50%)" }}>Day 60</div>
                  <div className="absolute whitespace-nowrap" style={{ left: "72.23%", transform: "translateX(-50%)" }}>Day 65</div>
                  <div className="absolute whitespace-nowrap" style={{ left: "100%", transform: "translateX(-100%)" }}>Day 90</div>
                </div>

                {/* Simulation Status and Slider */}
                {isSimulating && (
                  <div className="space-y-3 mt-4">
                    <Slider
                      value={[sliderValue]}
                      onValueChange={(value) => onSliderChange?.(value[0])}
                      min={0}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-xs text-muted-foreground text-center">
                      Simulating: Day {Math.min(daysPassed + 1, phaseDurationDays)} of {phaseDurationDays} (
                        {phases[currentIndex].label}
                        {isInInterim && currentPhase !== "class" ? " - Variant Voting" : ""}
                      )
                    </div>
                  </div>
                )}
              </div>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}

        {/* Simulation Slider for Mobile */}
        {isSimulating && isMobile && (
          <div className="space-y-3 mt-4">
            <Slider
              value={[sliderValue]}
              onValueChange={(value) => onSliderChange?.(value[0])}
              min={0}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="text-xs text-muted-foreground text-center">
              Simulating: Day {Math.min(daysPassed + 1, phaseDurationDays)} of {phaseDurationDays}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
