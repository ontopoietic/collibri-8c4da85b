import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConcernCard } from "@/components/ConcernCard";
import { NewConcernDialog } from "@/components/NewConcernDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Concern, ConcernType, Phase, SolutionLevel, Reply, UserQuota } from "@/types/concern";
import { mockConcerns } from "@/data/mockData";
import { BarChart3, Bell, Search, Network } from "lucide-react";
import collibriLogo from "@/assets/collibri-logo.png";
import { PhaseTimeline } from "@/components/PhaseTimeline";
import { QuotaDisplay } from "@/components/QuotaDisplay";
import { GlassOverlay } from "@/components/GlassOverlay";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Index = () => {
  const navigate = useNavigate();
  const [concerns, setConcerns] = useState<Concern[]>(mockConcerns);
  const [currentPhase] = useState<Phase>("school");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState<"all" | "my-posts" | "followed" | "unnoticed" | "problems" | "proposals">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "popularity">("newest");
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<Phase>("school");
  
  // Mock user quota - in production, this would come from backend
  const [userQuota] = useState<UserQuota>({
    concerns: { used: 2, total: 3 },
    votes: { used: 7, total: 10 },
    variants: { used: 1, total: 3 },
    proposals: { used: 2, total: 3 },
    proArguments: { used: 3, total: 5 },
    objections: { used: 4, total: 5 },
    questions: { used: 1, total: 3 },
  });

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
    setSelectedPhase(phase);
    setShowLeaderboard(true);
  };

  const phaseConcerns = concerns.filter((c) => c.phase === currentPhase);

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
      // Note: "my-posts" would require user authentication
      
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "popularity") return b.votes - a.votes;
      if (sortBy === "oldest") return a.timestamp.getTime() - b.timestamp.getTime();
      return b.timestamp.getTime() - a.timestamp.getTime(); // newest
    });

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50">
        <GlassOverlay direction="down" />
        <div className="relative max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={collibriLogo} alt="Collibri" className="h-10 w-10" />
              <h1 className="text-3xl font-bold text-foreground">Collibri</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="secondary-action"
                onClick={() => navigate("/notifications")}
                className="gap-2"
              >
                <Bell className="h-4 w-4" />
                Notifications
              </Button>
              <Button
                variant="statistics"
                onClick={() => navigate("/statistics")}
                className="gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Statistics
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate("/graph")}
                className="gap-2"
              >
                <Network className="h-4 w-4" />
                Graph
              </Button>
              <NewConcernDialog onSubmit={handleNewConcern} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-3 flex flex-col">
            <PhaseTimeline currentPhase={currentPhase} onPhaseClick={handlePhaseClick} />
          </div>
          <div className="lg:col-span-1 flex flex-col items-center">
            <QuotaDisplay quota={userQuota} currentPhase={currentPhase} />
          </div>
        </div>
        
        {showLeaderboard ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-foreground">
                {selectedPhase.charAt(0).toUpperCase() + selectedPhase.slice(1)} Phase Leaderboard
              </h2>
              <Button
                variant="outline"
                onClick={() => setShowLeaderboard(false)}
                className="gap-2"
              >
                Back to Forum
              </Button>
            </div>
            <p className="text-muted-foreground">
              Top concerns ranked by community votes
            </p>
            
            <div className="space-y-4">
              {mockConcerns
                .filter((c) => c.phase === selectedPhase)
                .sort((a, b) => b.votes - a.votes)
                .map((concern, index) => {
                  const isTopThree = index < 3;
                  const getMedalIcon = () => {
                    if (index === 0) return "🥇";
                    if (index === 1) return "🥈";
                    if (index === 2) return "🥉";
                    return null;
                  };

                  return (
                    <div
                      key={concern.id}
                      className={`bg-card border rounded-lg p-6 transition-all hover:shadow-lg cursor-pointer ${
                        isTopThree ? "border-2 border-primary bg-primary/5" : "border-border"
                      }`}
                      onClick={() => navigate(`/concern/${concern.id}`)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center gap-1 min-w-[60px]">
                          {getMedalIcon() ? (
                            <div className="text-3xl">{getMedalIcon()}</div>
                          ) : (
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
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 space-y-4">
              <h2 className="text-3xl font-bold text-foreground">
                School Phase Concerns
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
                <p className="text-muted-foreground text-lg mb-4">No concerns in this category yet.</p>
                <p className="text-muted-foreground">Be the first to share a concern!</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
