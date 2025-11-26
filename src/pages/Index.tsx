import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConcernCard } from "@/components/ConcernCard";
import { NewConcernDialog } from "@/components/NewConcernDialog";
import { Button } from "@/components/ui/button";
import { Concern, ConcernType, Phase } from "@/types/concern";
import { mockConcerns } from "@/data/mockData";
import { Scale, BarChart3 } from "lucide-react";
import { PhaseTimeline } from "@/components/PhaseTimeline";

const Index = () => {
  const navigate = useNavigate();
  const [concerns, setConcerns] = useState<Concern[]>(mockConcerns);
  const [activeTab, setActiveTab] = useState<"all" | "problems" | "proposals">("all");
  const [currentPhase] = useState<Phase>("school");

  const handleNewConcern = (type: ConcernType, title: string, description: string) => {
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
    };
    setConcerns([newConcern, ...concerns]);
  };

  const handlePhaseClick = (phase: Phase) => {
    navigate(`/leaderboard/${phase}`);
  };

  const phaseConcerns = concerns.filter((c) => c.phase === currentPhase);

  const filteredConcerns = phaseConcerns.filter((concern) => {
    if (activeTab === "all") return true;
    if (activeTab === "problems") return concern.type === "problem";
    if (activeTab === "proposals") return concern.type === "proposal" || concern.type === "counter-proposal";
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Scale className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">Democratic Forum</h1>
            </div>
            <div className="flex items-center gap-3">
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
        <PhaseTimeline currentPhase={currentPhase} onPhaseClick={handlePhaseClick} />
        
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            School Phase Concerns
          </h2>
          <div className="flex gap-2 mb-4">
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
            <p className="text-muted-foreground text-lg mb-4">No concerns in this category yet.</p>
            <p className="text-muted-foreground">Be the first to share a concern!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
