import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ConcernCard } from "@/components/ConcernCard";
import { NewConcernDialog } from "@/components/NewConcernDialog";
import { VariantVoting } from "@/components/VariantVoting";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Concern, ConcernType, Phase, SolutionLevel, Reply, UserQuota } from "@/types/concern";
import { mockConcerns } from "@/data/mockData";
import { BarChart3, Bell, Search, Play, Pause, ChartNoAxesCombined, Menu, Network } from "lucide-react";
import collibriLogo from "@/assets/collibri-logo.png";
import { PhaseTimeline } from "@/components/PhaseTimeline";
import { QuotaDisplay } from "@/components/QuotaDisplay";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [concerns, setConcerns] = useState<Concern[]>(mockConcerns);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState<"all" | "my-posts" | "followed" | "unnoticed" | "problems" | "proposals">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "popularity">("newest");
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardPhase, setLeaderboardPhase] = useState<Phase>("class");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Simulation state
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(100); // 0-100%
  const [persistedSimulationDay, setPersistedSimulationDay] = useState<number | null>(null);

  // Calculate the simulated "current time" and phase based on slider
  const now = new Date();
  const allPhasesStartDate = new Date(now.getTime() - 93 * 24 * 60 * 60 * 1000); // 93 days ago (close to 95)
  const totalDuration = 95; // days for all 3 phases + variant selection phases
  
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

  // Use persisted day if available, otherwise use current time
  const effectiveTime = persistedSimulationDay !== null
    ? new Date(allPhasesStartDate.getTime() + persistedSimulationDay * 24 * 60 * 60 * 1000)
    : now;

  const simulatedCurrentTime = isSimulating ? getSimulatedTime(simulationProgress) : effectiveTime;
  
  const getCurrentPhase = (): Phase => {
    const daysPassed = isSimulating 
      ? (simulationProgress / 100) * totalDuration
      : persistedSimulationDay !== null 
        ? persistedSimulationDay 
        : Math.floor((now.getTime() - allPhasesStartDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysPassed < 30) return "class";
    if (daysPassed < 60) return "grade";
    return "school";
  };
  
  const currentPhase: Phase = getCurrentPhase();

  const handleSimulationToggle = () => {
    if (isSimulating) {
      // Exiting simulation - persist the current simulated day
      const simulatedDays = (simulationProgress / 100) * totalDuration;
      setPersistedSimulationDay(simulatedDays);
    }
    setIsSimulating(!isSimulating);
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
  };

  const handlePhaseClick = (phase: Phase) => {
    // Toggle: if already viewing this phase's leaderboard, go back to forum
    if (showLeaderboard && leaderboardPhase === phase) {
      setShowLeaderboard(false);
    } else {
      setLeaderboardPhase(phase);
      setShowLeaderboard(true);
    }
  };

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

  // Leaderboard data
  const leaderboardConcerns = simulatedConcerns
    .filter((c) => c.phase === leaderboardPhase)
    .sort((a, b) => b.votes - a.votes);

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
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <img src={collibriLogo} alt="Collibri" className="h-10 w-10 md:h-12 md:w-12" />
              <h1 className="text-xl md:text-3xl font-bold text-foreground">Collibri</h1>
            </div>
            
            {/* Desktop Navigation */}
            {!isMobile && (
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="secondary-action" className="gap-2">
                      <ChartNoAxesCombined className="h-4 w-4" />
                      <span className="hidden lg:inline">My Quota</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[500px] p-0" align="end">
                    <QuotaDisplay quota={simulatedQuota} />
                  </PopoverContent>
                </Popover>
                <Button
                  variant="secondary-action"
                  onClick={() => navigate("/notifications")}
                  className="gap-2"
                >
                  <Bell className="h-4 w-4" />
                  <span className="hidden lg:inline">Notifications</span>
                </Button>
                <Button
                  variant="statistics"
                  onClick={() => navigate("/statistics")}
                  className="gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden lg:inline">Statistics</span>
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate("/graph")}
                  className="gap-2"
                >
                  <Network className="h-4 w-4" />
                  <span className="hidden lg:inline">Graph</span>
                </Button>
                <NewConcernDialog onSubmit={handleNewConcern} />
              </div>
            )}

            {/* Mobile Menu */}
            {isMobile && (
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px]">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-4 mt-6">
                    <Button
                      variant={isSimulating ? "default" : "secondary-action"}
                      onClick={() => {
                        handleSimulationToggle();
                        setMobileMenuOpen(false);
                      }}
                      className="gap-2 w-full justify-start"
                    >
                      {isSimulating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      {isSimulating ? "Stop Simulation" : "Simulate Timeline"}
                    </Button>
                    
                    <div className="border border-border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2 text-sm font-medium">
                        <ChartNoAxesCombined className="h-4 w-4" />
                        <span>My Quota</span>
                      </div>
                      <QuotaDisplay quota={simulatedQuota} />
                    </div>

                    <Button
                      variant="secondary-action"
                      onClick={() => {
                        navigate("/notifications");
                        setMobileMenuOpen(false);
                      }}
                      className="gap-2 w-full justify-start"
                    >
                      <Bell className="h-4 w-4" />
                      Notifications
                    </Button>
                    
                    <Button
                      variant="statistics"
                      onClick={() => {
                        navigate("/statistics");
                        setMobileMenuOpen(false);
                      }}
                      className="gap-2 w-full justify-start"
                    >
                      <BarChart3 className="h-4 w-4" />
                      Statistics
                    </Button>
                    
                    <Button
                      variant="secondary"
                      onClick={() => {
                        navigate("/graph");
                        setMobileMenuOpen(false);
                      }}
                      className="gap-2 w-full justify-start"
                    >
                      <Network className="h-4 w-4" />
                      Graph
                    </Button>
                    
                    <NewConcernDialog onSubmit={(type, title, desc, level) => {
                      handleNewConcern(type, title, desc, level);
                      setMobileMenuOpen(false);
                    }} />
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <PhaseTimeline 
            currentPhase={currentPhase} 
            onPhaseClick={handlePhaseClick}
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
              concerns={simulatedConcerns.filter(c => c.phase === variantVotingPhase.phase)} 
              onVote={handleVariantVote}
              dayIntoPhase={Math.floor(variantVotingPhase.dayIntoVoting)}
              interimDuration={5}
            />
          </div>
        ) : showLeaderboard ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-foreground">
                {leaderboardPhase === "class" ? "Class" : leaderboardPhase === "grade" ? "Grade" : "School"} Phase Leaderboard
              </h2>
              <Button
                variant="outline"
                onClick={() => setShowLeaderboard(false)}
              >
                Back to Forum
              </Button>
            </div>
            <p className="text-muted-foreground">
              Top concerns ranked by community votes
            </p>

            <div className="space-y-4">
              {leaderboardConcerns.map((concern, index) => {
                const isTopThree = index < 3;
                const getMedalIcon = (index: number) => {
                  if (index === 0) return <span className="text-4xl">🏆</span>;
                  if (index === 1) return <span className="text-4xl">🥈</span>;
                  if (index === 2) return <span className="text-4xl">🥉</span>;
                  return null;
                };

                return (
                  <div
                    key={concern.id}
                    className={`bg-card rounded-lg p-6 shadow-sm transition-all hover:shadow-lg cursor-pointer ${
                      isTopThree ? "border-2 border-primary bg-primary/5" : "border border-border"
                    }`}
                    onClick={() => navigate(`/concern/${concern.id}`)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center gap-1 min-w-[60px]">
                        {getMedalIcon(index) || (
                          <div className="text-2xl font-bold text-muted-foreground">
                            #{index + 1}
                          </div>
                        )}
                        <div className="text-sm text-muted-foreground">
                          {concern.votes} votes
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{concern.title}</h3>
                        <p className="text-muted-foreground line-clamp-2 mb-3">
                          {concern.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{concern.replies.length} replies</span>
                          <span>
                            {new Date(concern.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {leaderboardConcerns.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-muted-foreground text-lg">
                    No concerns in this phase yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 space-y-4">
              <h2 className="text-3xl font-bold text-foreground">
                {currentPhase === "class" ? "Class" : currentPhase === "grade" ? "Grade" : "School"} Phase Concerns
              </h2>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search concerns..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Concerns</SelectItem>
                    <SelectItem value="my-posts">My Concerns</SelectItem>
                    <SelectItem value="followed">Followed</SelectItem>
                    <SelectItem value="unnoticed">Unnoticed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="popularity">Popularity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredConcerns.map((concern) => (
                <ConcernCard key={concern.id} concern={concern} />
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
    </div>
  );
};

export default Index;
