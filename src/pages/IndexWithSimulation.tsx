import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ConcernCard } from "@/components/ConcernCard";
import { NewConcernDialog } from "@/components/NewConcernDialog";
import { VariantVoting } from "@/components/VariantVoting";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Concern, ConcernType, Phase, SolutionLevel, Reply, UserQuota } from "@/types/concern";
import { mockConcerns } from "@/data/mockData";
import { BarChart3, Bell, Search, Play, Pause, ChartNoAxesCombined } from "lucide-react";
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

const Index = () => {
  const navigate = useNavigate();
  const [concerns, setConcerns] = useState<Concern[]>(mockConcerns);
  const [activeTab, setActiveTab] = useState<"all" | "problems" | "proposals">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState<"all" | "my-posts" | "followed" | "unnoticed">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "popularity">("newest");
  
  // Simulation state
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(100); // 0-100%

  // Calculate the simulated "current time" and phase based on slider
  const now = new Date();
  const allPhasesStartDate = new Date(now.getTime() - 88 * 24 * 60 * 60 * 1000); // 88 days ago (close to 90)
  const totalDuration = 90; // days for all 3 phases
  
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

  const simulatedCurrentTime = isSimulating ? getSimulatedTime(simulationProgress) : now;
  const currentPhase: Phase = isSimulating ? getSimulatedPhase(simulationProgress) : "school";

  // Calculate if we're in the interims phase (first 5 days of any phase)
  const dayIntoPhase = useMemo(() => {
    const simulatedDays = (simulationProgress / 100) * totalDuration;
    if (simulatedDays < 30) return simulatedDays + 1; // Class phase (1-30)
    if (simulatedDays < 60) return (simulatedDays - 30) + 1; // Grade phase (1-30)
    return (simulatedDays - 60) + 1; // School phase (1-30)
  }, [simulationProgress, totalDuration]);

  const isInterimsPhase = isSimulating && dayIntoPhase <= 5;

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
    navigate(`/leaderboard/${phase}`);
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
      // Type filter
      if (activeTab === "problems" && concern.type !== "problem") return false;
      if (activeTab === "proposals" && concern.type !== "proposal" && concern.type !== "counter-proposal") return false;
      
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
      <header className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={collibriLogo} alt="Collibri" className="h-10 w-10" />
              <h1 className="text-3xl font-bold text-foreground">Collibri</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant={isSimulating ? "default" : "outline"}
                onClick={() => setIsSimulating(!isSimulating)}
                className="gap-2"
              >
                {isSimulating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isSimulating ? "Stop Simulation" : "Simulate Timeline"}
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <ChartNoAxesCombined className="h-4 w-4" />
                    My Quota
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[500px] p-0" align="end">
                  <QuotaDisplay quota={simulatedQuota} />
                </PopoverContent>
              </Popover>
              <Button
                variant="outline"
                onClick={() => navigate("/notifications")}
                className="gap-2"
              >
                <Bell className="h-4 w-4" />
                Notifications
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/statistics")}
                className="gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Statistics
              </Button>
              <NewConcernDialog onSubmit={handleNewConcern} />
            </div>
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
          />
        </div>
        
        {isInterimsPhase && getPreviousPhase() ? (
          <div className="mb-8">
            <VariantVoting 
              concerns={simulatedConcerns.filter(c => c.phase === getPreviousPhase())} 
              onVote={handleVariantVote}
            />
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
                    <SelectItem value="all">All Posts</SelectItem>
                    <SelectItem value="my-posts">My Posts</SelectItem>
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

              <div className="flex gap-2">
                <Button
                  variant={activeTab === "all" ? "default" : "outline"}
                  onClick={() => setActiveTab("all")}
                >
                  All
                </Button>
                <Button
                  variant={activeTab === "problems" ? "default" : "outline"}
                  onClick={() => setActiveTab("problems")}
                >
                  Problems
                </Button>
                <Button
                  variant={activeTab === "proposals" ? "default" : "outline"}
                  onClick={() => setActiveTab("proposals")}
                >
                  Proposals
                </Button>
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
