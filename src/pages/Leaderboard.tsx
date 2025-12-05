import { useNavigate, useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Medal } from "lucide-react";
import { mockConcerns } from "@/data/mockData";
import { Phase } from "@/types/concern";
import { cn } from "@/lib/utils";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { NavigationHeader } from "@/components/NavigationHeader";

const Leaderboard = () => {
  const navigate = useNavigate();
  const { phase } = useParams<{ phase: Phase }>();

  const phaseConcerns = mockConcerns
    .filter((c) => c.phase === phase)
    .sort((a, b) => b.votes - a.votes);

  const phaseLabels = {
    class: "Class Phase",
    grade: "Grade Phase",
    school: "School Phase",
  };
  
  const phases: Phase[] = ["class", "grade", "school"];

  const getWinnerCount = (phase: Phase) => {
    switch (phase) {
      case 'class': return 3;
      case 'grade': return 2;
      case 'school': return 3;
      default: return 3;
    }
  };

  const getMedalIcon = (index: number, currentPhase: Phase) => {
    const winnerCount = getWinnerCount(currentPhase);
    if (index >= winnerCount) return null;
    if (index === 0) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (index === 1) return <Medal className="h-6 w-6 text-gray-400" />;
    if (index === 2 && winnerCount === 3) return <Medal className="h-6 w-6 text-amber-700" />;
    return null;
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <NavigationHeader currentPhase={phase as Phase} />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2 text-white">
          {phaseLabels[phase as Phase]} Leaderboard
        </h1>
        <p className="text-muted-foreground mb-4">
          Top concerns ranked by community votes
        </p>
        
        <div className="flex gap-2 mb-8">
          {phases.map((p) => (
            <Button
              key={p}
              variant={p === phase ? "default" : "outline"}
              onClick={() => navigate(`/leaderboard/${p}`)}
              className={p === phase ? "text-white" : ""}
            >
              {phaseLabels[p]}
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          {phaseConcerns.map((concern, index) => {
            const winnerCount = getWinnerCount(phase as Phase);
            const isTopWinner = index < winnerCount;

            return (
              <Card
                key={concern.id}
                className={cn(
                  "transition-all hover:shadow-lg cursor-pointer",
                  isTopWinner && "border-2 border-primary bg-primary/5"
                )}
                onClick={() => navigate(`/concern/${concern.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center gap-1 min-w-[60px]">
                      {getMedalIcon(index, phase as Phase) || (
                        <div className="text-2xl font-bold text-muted-foreground">
                          #{index + 1}
                        </div>
                      )}
                      <div className="text-sm text-muted-foreground">
                        {concern.votes} votes
                      </div>
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{concern.title}</CardTitle>
                      <p className="text-muted-foreground line-clamp-2">
                        {concern.description}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                        <span>{concern.replies.length} replies</span>
                        <span>
                          {new Date(concern.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}

          {phaseConcerns.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                No concerns in this phase yet.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav 
        currentPhase={phase as Phase}
        onViewLeaderboard={() => {}}
      />
    </div>
  );
};

export default Leaderboard;
