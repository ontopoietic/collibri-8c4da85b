import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTour } from "@/contexts/TourContext";
import { ConcernCard } from "@/components/ConcernCard";
import { NewConcernDialog } from "@/components/NewConcernDialog";
import { VariantVoting } from "@/components/VariantVoting";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichTextarea } from "@/components/RichTextarea";
import { Concern, ConcernType, Phase, SolutionLevel, Reply, UserQuota } from "@/types/concern";
import { mockConcerns } from "@/data/mockData";
import { Search, Play, Pause, AlertTriangle, Lightbulb, Filter, ArrowUpDown, Check, ListFilter, User, Heart, EyeOff, Clock, ArrowUp, TrendingUp, Users, School, Building2 } from "lucide-react";
import { PhaseTimeline } from "@/components/PhaseTimeline";
import { NavigationHeader } from "@/components/NavigationHeader";
import { useAdmin } from "@/contexts/AdminContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MobileFormDrawer } from "@/components/MobileFormDrawer";
import { cn } from "@/lib/utils";

const Index = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { isAdmin, adminModeEnabled } = useAdmin();
  const { setCurrentPhase } = useTour();
  const [concerns, setConcerns] = useState<Concern[]>(mockConcerns);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState<"all" | "my-posts" | "followed" | "unnoticed" | "problems" | "proposals">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "popularity">("newest");
  const [solutionLevelFilter, setSolutionLevelFilter] = useState<"all" | SolutionLevel>("all");
  const [showNewConcernDialog, setShowNewConcernDialog] = useState(false);
  
  // Mobile concern form state
  const [isProblem, setIsProblem] = useState(false);
  const [isSolution, setIsSolution] = useState(false);
  const [problemTitle, setProblemTitle] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [solutionTitle, setSolutionTitle] = useState("");
  const [solutionDescription, setSolutionDescription] = useState("");
  const [solutionLevel, setSolutionLevel] = useState<SolutionLevel | "">("");
  
  // Simulation state
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(30); // 0-100%, default to end of class phase
  const [persistedSimulationDay, setPersistedSimulationDay] = useState<number | null>(() => {
    const saved = localStorage.getItem('collibri-simulation-day');
    return saved ? parseFloat(saved) : null;
  });

  // Calculate the simulated "current time" and phase based on slider
  const now = new Date();
  const allPhasesStartDate = new Date(now.getTime() - 93 * 24 * 60 * 60 * 1000); // 93 days ago (close to 95)
  const totalDuration = 96; // days for all 3 phases + variant selection phases + completion day
  
  const getSimulatedTime = (progress: number): Date => {
    const simulatedDays = (progress / 100) * totalDuration;
    return new Date(allPhasesStartDate.getTime() + simulatedDays * 24 * 60 * 60 * 1000);
  };

  const getSimulatedPhase = (progress: number): Phase => {
    const simulatedDays = (progress / 100) * totalDuration;
    if (simulatedDays < 30) return "class";
    if (simulatedDays < 60) return "grade";
    return "school";
  };

  // Use persisted day if available, otherwise default to day 29
  const effectiveTime = persistedSimulationDay !== null
    ? new Date(allPhasesStartDate.getTime() + persistedSimulationDay * 24 * 60 * 60 * 1000)
    : new Date(allPhasesStartDate.getTime() + 29 * 24 * 60 * 60 * 1000);

  const simulatedCurrentTime = isSimulating ? getSimulatedTime(simulationProgress) : effectiveTime;
  
  const getCurrentPhase = (): Phase => {
    const daysPassed = isSimulating 
      ? (simulationProgress / 100) * totalDuration
      : persistedSimulationDay !== null 
        ? persistedSimulationDay 
        : 29; // Default to day 29
    
    if (daysPassed < 30) return "class";
    if (daysPassed < 60) return "grade";
    return "school";
  };
  
  const currentPhase: Phase = getCurrentPhase();

  // Sync current phase with tour context
  useEffect(() => {
    setCurrentPhase(currentPhase);
  }, [currentPhase, setCurrentPhase]);

  // Listen for tour reset event to reset simulation to class phase
  useEffect(() => {
    const handleTourReset = () => {
      setIsSimulating(false); // Stop simulation to ensure phase updates immediately
      setPersistedSimulationDay(null);
      localStorage.removeItem('collibri-simulation-day');
      setSimulationProgress(30); // End of class phase
    };
    
    window.addEventListener('tour-reset-simulation', handleTourReset);
    return () => window.removeEventListener('tour-reset-simulation', handleTourReset);
  }, []);

  const handleSimulationToggle = () => {
    if (isSimulating) {
      // Exiting simulation - persist the current simulated day
      const simulatedDays = (simulationProgress / 100) * totalDuration;
      setPersistedSimulationDay(simulatedDays);
      localStorage.setItem('collibri-simulation-day', String(simulatedDays));
    }
    setIsSimulating(!isSimulating);
  };

  const handleResetTimeline = () => {
    setPersistedSimulationDay(null);
    localStorage.removeItem('collibri-simulation-day');
    setSimulationProgress(30); // Reset to day 29
  };

  // Determine which variant selection phase we're in (if any)
  const variantVotingPhase = useMemo(() => {
    const simulatedDays = (simulationProgress / 100) * totalDuration;
    
    // Class voting: days 30-35
    if (simulatedDays >= 30 && simulatedDays < 35) {
      return { phase: "class" as Phase, dayIntoVoting: simulatedDays - 30 + 1 };
    }
    // Grade voting: days 60-65
    if (simulatedDays >= 60 && simulatedDays < 65) {
      return { phase: "grade" as Phase, dayIntoVoting: simulatedDays - 60 + 1 };
    }
    // School voting: days 90-95
    if (simulatedDays >= 90 && simulatedDays < 95) {
      return { phase: "school" as Phase, dayIntoVoting: simulatedDays - 90 + 1 };
    }
    
    return null;
  }, [simulationProgress, totalDuration]);

  const isInterimsPhase = isSimulating && variantVotingPhase !== null;

  const getPreviousPhase = (): Phase | null => {
    if (currentPhase === "grade") return "class";
    if (currentPhase === "school") return "grade";
    return null;
  };

  // Filter and adjust concerns based on simulated time
  const simulatedConcerns = useMemo(() => {
    if (!isSimulating) return concerns;

    return concerns
      .filter(c => c.timestamp <= simulatedCurrentTime)
      .map(concern => {
        // Calculate votes based on time (simulate gradual voting)
        const concernAge = (simulatedCurrentTime.getTime() - concern.timestamp.getTime()) / (1000 * 60 * 60 * 24);
        const totalAge = (now.getTime() - concern.timestamp.getTime()) / (1000 * 60 * 60 * 24);
        const voteRatio = Math.min(1, concernAge / totalAge);
        const simulatedVotes = Math.floor(concern.votes * voteRatio);

        // Filter and adjust replies based on time
        const filterReplies = (replies: Reply[]): Reply[] => {
          return replies
            .filter(r => r.timestamp <= simulatedCurrentTime)
            .map(reply => {
              const replyAge = (simulatedCurrentTime.getTime() - reply.timestamp.getTime()) / (1000 * 60 * 60 * 24);
              const replyTotalAge = (now.getTime() - reply.timestamp.getTime()) / (1000 * 60 * 60 * 24);
              const replyVoteRatio = Math.min(1, replyAge / replyTotalAge);
              
              return {
                ...reply,
                votes: Math.floor(reply.votes * replyVoteRatio),
                replies: filterReplies(reply.replies),
              };
            });
        };

        return {
          ...concern,
          votes: simulatedVotes,
          replies: filterReplies(concern.replies),
        };
      });
  }, [concerns, isSimulating, simulatedCurrentTime, now]);

  // Calculate simulated quota based on activity
  const simulatedQuota = useMemo((): UserQuota => {
    // Count activities up to simulated time from the simulated concerns
    const phaseConcerns = simulatedConcerns.filter(c => c.phase === currentPhase);
    const concernsCount = phaseConcerns.length;
    
    const getAllReplies = (replies: Reply[]): Reply[] => {
      let all: Reply[] = [];
      replies.forEach(r => {
        all.push(r);
        all = all.concat(getAllReplies(r.replies));
      });
      return all;
    };

    const allReplies = phaseConcerns.flatMap(c => getAllReplies(c.replies));
    const proposalsCount = allReplies.filter(r => r.category === 'proposal').length;
    const variantsCount = allReplies.filter(r => r.category === 'variant').length;
    const proArgsCount = allReplies.filter(r => r.category === 'pro-argument').length;
    const objectionsCount = allReplies.filter(r => r.category === 'objection').length;
    const questionsCount = allReplies.filter(r => r.category === 'question').length;
    
    // Sum votes from all concerns and their replies
    const sumVotes = (replies: Reply[]): number => {
      return replies.reduce((sum, r) => sum + r.votes + sumVotes(r.replies), 0);
    };
    const votesCount = phaseConcerns.reduce((sum, c) => sum + c.votes + sumVotes(c.replies), 0);

    return {
      concerns: { used: Math.min(concernsCount, 3), total: 3 },
      votes: { used: Math.min(votesCount, 10), total: 10 },
      variants: { used: Math.min(variantsCount, 3), total: 3 },
      proposals: { used: Math.min(proposalsCount, 3), total: 3 },
      proArguments: { used: Math.min(proArgsCount, 5), total: 5 },
      objections: { used: Math.min(objectionsCount, 5), total: 5 },
      questions: { used: Math.min(questionsCount, 3), total: 3 },
    };
  }, [simulatedConcerns, currentPhase]);

  const handleNewConcern = (type: ConcernType, title: string, description: string, solutionLevel?: SolutionLevel) => {
    const newConcern: Concern = {
      id: Date.now().toString(),
      type,
      title,
      description,
      votes: 0,
      replies: [],
      timestamp: new Date(),
      phase: currentPhase,
      group: "Whole School",
      solutionLevel,
    };
    setConcerns([newConcern, ...concerns]);
    setShowNewConcernDialog(false);
  };

  const handleMobileSubmit = () => {
    // Submit problem if selected
    if (isProblem && problemTitle.trim() && problemDescription.trim()) {
      handleNewConcern("problem", problemTitle, problemDescription);
    }
    
    // Submit solution if selected
    if (isSolution && solutionTitle.trim() && solutionDescription.trim()) {
      const solution = solutionLevel ? solutionLevel as SolutionLevel : undefined;
      handleNewConcern("proposal", solutionTitle, solutionDescription, solution);
    }
    
    // Reset form
    setIsProblem(false);
    setIsSolution(false);
    setProblemTitle("");
    setProblemDescription("");
    setSolutionTitle("");
    setSolutionDescription("");
    setSolutionLevel("");
    setShowNewConcernDialog(false);
  };

  const canSubmit = (isProblem && problemTitle.trim() && problemDescription.trim()) || 
                    (isSolution && solutionTitle.trim() && solutionDescription.trim());


  const handleVariantVote = (concernId: string, variantId: string) => {
    setConcerns(prevConcerns => 
      prevConcerns.map(c => {
        if (c.id === concernId && c.variants) {
          return {
            ...c,
            variants: c.variants.map(v => 
              v.id === variantId ? { ...v, votes: v.votes + 1 } : v
            ),
            selectedVariantId: variantId
          };
        }
        return c;
      })
    );
  };

  const phaseConcerns = simulatedConcerns.filter((c) => c.phase === currentPhase);

  // Helper function to search through replies recursively
  const searchInReplies = (replies: Reply[], query: string): boolean => {
    for (const reply of replies) {
      if (reply.text.toLowerCase().includes(query)) return true;
      if (searchInReplies(reply.replies, query)) return true;
    }
    return false;
  };

  const filteredConcerns = phaseConcerns
    .filter((concern) => {
      // Type filter based on filterBy dropdown
      if (filterBy === "problems" && concern.type !== "problem") return false;
      if (filterBy === "proposals" && concern.type !== "proposal" && concern.type !== "counter-proposal") return false;
      
      // Solution level filter
      if (solutionLevelFilter !== "all" && concern.solutionLevel !== solutionLevelFilter) return false;
      
      // Search filter - now includes replies
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const titleMatch = concern.title.toLowerCase().includes(query);
        const descriptionMatch = concern.description.toLowerCase().includes(query);
        const replyMatch = searchInReplies(concern.replies, query);
        
        if (!titleMatch && !descriptionMatch && !replyMatch) {
          return false;
        }
      }
      
      // Activity filter
      if (filterBy === "unnoticed" && (concern.votes > 0 || concern.replies.length > 0)) return false;
      if (filterBy === "followed" && concern.votes === 0) return false;
      
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "popularity") return b.votes - a.votes;
      if (sortBy === "oldest") return a.timestamp.getTime() - b.timestamp.getTime();
      return b.timestamp.getTime() - a.timestamp.getTime(); // newest
    });

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader 
        currentPhase={currentPhase}
        quota={simulatedQuota}
        onNewConcern={handleNewConcern}
        showNewConcernButton={currentPhase === 'class'}
      />

      <main className="max-w-6xl mx-auto px-4 py-8 pb-20 md:pb-8">
        <div className="mb-8" data-tour="phase-timeline">
          <PhaseTimeline 
            currentPhase={currentPhase} 
            onPhaseClick={() => {}}
            phaseStartDate={allPhasesStartDate}
            phaseDurationDays={totalDuration}
            sliderValue={simulationProgress}
            onSliderChange={setSimulationProgress}
            isSimulating={isSimulating}
            persistedDay={persistedSimulationDay}
            onSimulationToggle={handleSimulationToggle}
          />
        </div>
        
        {isInterimsPhase && variantVotingPhase ? (
          <div className="mb-8">
            <VariantVoting 
              concerns={simulatedConcerns.filter(c => {
                if (variantVotingPhase.phase === "class") {
                  // Only show winners from the user's class (Class 10A)
                  return c.phase === "class" && c.group === "Class 10A" && c.isWinner;
                }
                if (variantVotingPhase.phase === "grade") {
                  return c.phase === "grade" && c.isWinner;
                }
                if (variantVotingPhase.phase === "school") {
                  return c.phase === "school" && c.isWinner;
                }
                return false;
              })}
              onVote={handleVariantVote}
              dayIntoPhase={Math.floor(variantVotingPhase.dayIntoVoting)}
              interimDuration={5}
            />
          </div>
        ) : (
          <>
            <div className="mb-6 space-y-4">
              <h2 className="text-3xl font-bold text-foreground">
                {currentPhase === "class" ? "Class" : currentPhase === "grade" ? "Grade" : "School"} Phase Concerns
              </h2>
              
              <div className="flex gap-2 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search concerns..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                {/* Filter Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setFilterBy("all")}>
                      <ListFilter className="h-4 w-4 mr-2" />
                      All Concerns
                      {filterBy === "all" && <Check className="h-4 w-4 ml-auto" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterBy("my-posts")}>
                      <User className="h-4 w-4 mr-2" />
                      My Concerns
                      {filterBy === "my-posts" && <Check className="h-4 w-4 ml-auto" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterBy("followed")}>
                      <Heart className="h-4 w-4 mr-2" />
                      Followed
                      {filterBy === "followed" && <Check className="h-4 w-4 ml-auto" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterBy("unnoticed")}>
                      <EyeOff className="h-4 w-4 mr-2" />
                      Unnoticed
                      {filterBy === "unnoticed" && <Check className="h-4 w-4 ml-auto" />}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSolutionLevelFilter("all")}>
                      <ListFilter className="h-4 w-4 mr-2" />
                      All Levels
                      {solutionLevelFilter === "all" && <Check className="h-4 w-4 ml-auto" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSolutionLevelFilter("class")}>
                      <Users className="h-4 w-4 mr-2" />
                      Class Level
                      {solutionLevelFilter === "class" && <Check className="h-4 w-4 ml-auto" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSolutionLevelFilter("school")}>
                      <School className="h-4 w-4 mr-2" />
                      School Level
                      {solutionLevelFilter === "school" && <Check className="h-4 w-4 ml-auto" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSolutionLevelFilter("ministries")}>
                      <Building2 className="h-4 w-4 mr-2" />
                      Ministry Level
                      {solutionLevelFilter === "ministries" && <Check className="h-4 w-4 ml-auto" />}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* Sort Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSortBy("newest")}>
                      <Clock className="h-4 w-4 mr-2" />
                      Newest
                      {sortBy === "newest" && <Check className="h-4 w-4 ml-auto" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("oldest")}>
                      <ArrowUp className="h-4 w-4 mr-2" />
                      Oldest
                      {sortBy === "oldest" && <Check className="h-4 w-4 ml-auto" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("popularity")}>
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Popularity
                      {sortBy === "popularity" && <Check className="h-4 w-4 ml-auto" />}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="space-y-4" data-tour="concern-list">
              {filteredConcerns.map((concern, index) => (
                <div key={concern.id} data-tour={index === 0 ? "concern-card" : undefined}>
                  <ConcernCard concern={concern} />
                </div>
              ))}
            </div>

            {filteredConcerns.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg mb-4">
                  {isSimulating ? "No concerns posted yet at this point in time." : "No concerns in this category yet."}
                </p>
                {!isSimulating && <p className="text-muted-foreground">Be the first to share a concern!</p>}
              </div>
            )}
          </>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav 
        onNewConcern={() => setShowNewConcernDialog(true)} 
        isNewConcernOpen={showNewConcernDialog}
        currentPhase={currentPhase}
        onViewLeaderboard={() => {
          const prevPhase = getPreviousPhase();
          if (prevPhase) navigate(`/leaderboard/${prevPhase}`);
        }}
      />

      {/* New Concern Form - Drawer on mobile, Dialog on desktop */}
      {isMobile ? (
        <MobileFormDrawer
          isOpen={showNewConcernDialog}
          onClose={() => setShowNewConcernDialog(false)}
          title="New Concern"
        >
          <div className="space-y-6">
            {/* Problem Section */}
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setIsProblem(!isProblem)}
                className={cn(
                  "flex flex-col items-start gap-2 p-4 rounded-lg border-2 transition-all w-full text-left",
                  isProblem
                    ? "border-problem bg-problem/5"
                    : "border-border bg-card hover:bg-muted/50"
                )}
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-problem" />
                  <span className="font-medium">I want to describe a Problem</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  Share an issue that needs attention
                </span>
              </button>
              
              {isProblem && (
                <div className="space-y-3 p-1">
                  <Input
                    placeholder="Problem Title"
                    value={problemTitle}
                    onChange={(e) => setProblemTitle(e.target.value)}
                  />
                  <RichTextarea
                    placeholder="Describe the problem..."
                    value={problemDescription}
                    onChange={setProblemDescription}
                    className="min-h-[100px]"
                  />
                </div>
              )}
            </div>

            {/* Solution Section */}
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setIsSolution(!isSolution)}
                className={cn(
                  "flex flex-col items-start gap-2 p-4 rounded-lg border-2 transition-all w-full text-left",
                  isSolution
                    ? "border-proposal bg-proposal/5"
                    : "border-border bg-card hover:bg-muted/50"
                )}
              >
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-proposal" />
                  <span className="font-medium">I want to propose a Solution</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  Suggest an improvement or change
                </span>
              </button>
              
              {isSolution && (
                <div className="space-y-3 p-1">
                  <Input
                    placeholder="Solution Title"
                    value={solutionTitle}
                    onChange={(e) => setSolutionTitle(e.target.value)}
                  />
                  <RichTextarea
                    placeholder="Describe your solution..."
                    value={solutionDescription}
                    onChange={setSolutionDescription}
                    className="min-h-[100px]"
                  />
                  <Select value={solutionLevel} onValueChange={(value: SolutionLevel) => setSolutionLevel(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Solution Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="class">Class</SelectItem>
                      <SelectItem value="school">School</SelectItem>
                      <SelectItem value="ministries">Ministries</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNewConcernDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={handleMobileSubmit}
                disabled={!canSubmit}
                className="flex-1"
              >
                Submit Concern(s)
              </Button>
            </div>
          </div>
        </MobileFormDrawer>
      ) : (
        <Dialog open={showNewConcernDialog} onOpenChange={setShowNewConcernDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>New Concern</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Problem Section */}
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => setIsProblem(!isProblem)}
                  className={cn(
                    "flex flex-col items-start gap-2 p-4 rounded-lg border-2 transition-all w-full text-left",
                    isProblem
                      ? "border-problem bg-problem/5"
                      : "border-border bg-card hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-problem" />
                    <span className="font-medium">I want to describe a Problem</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Share an issue that needs attention
                  </span>
                </button>
                
                {isProblem && (
                  <div className="space-y-3 p-1">
                    <Input
                      placeholder="Problem Title"
                      value={problemTitle}
                      onChange={(e) => setProblemTitle(e.target.value)}
                    />
                    <RichTextarea
                      placeholder="Describe the problem..."
                      value={problemDescription}
                      onChange={setProblemDescription}
                      className="min-h-[100px]"
                    />
                  </div>
                )}
              </div>

              {/* Solution Section */}
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => setIsSolution(!isSolution)}
                  className={cn(
                    "flex flex-col items-start gap-2 p-4 rounded-lg border-2 transition-all w-full text-left",
                    isSolution
                      ? "border-proposal bg-proposal/5"
                      : "border-border bg-card hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-proposal" />
                    <span className="font-medium">I want to propose a Solution</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Suggest an improvement or change
                  </span>
                </button>
                
                {isSolution && (
                  <div className="space-y-3 p-1">
                    <Input
                      placeholder="Solution Title"
                      value={solutionTitle}
                      onChange={(e) => setSolutionTitle(e.target.value)}
                    />
                    <RichTextarea
                      placeholder="Describe your solution..."
                      value={solutionDescription}
                      onChange={setSolutionDescription}
                      className="min-h-[100px]"
                    />
                    <Select value={solutionLevel} onValueChange={(value: SolutionLevel) => setSolutionLevel(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Solution Level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="class">Class</SelectItem>
                        <SelectItem value="school">School</SelectItem>
                        <SelectItem value="ministries">Ministries</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewConcernDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  onClick={handleMobileSubmit}
                  disabled={!canSubmit}
                  className="flex-1"
                >
                  Submit Concern(s)
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Index;
