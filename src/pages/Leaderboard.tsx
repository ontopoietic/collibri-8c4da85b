import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Trophy, Medal } from "lucide-react";
import { mockConcerns } from "@/data/mockData";
import { Phase } from "@/types/concern";
import { TypeBadge } from "@/components/TypeBadge";
import { AspectBadges } from "@/components/AspectBadges";
import { cn } from "@/lib/utils";

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

  const getMedalIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (index === 1) return <Medal className="h-6 w-6 text-gray-400" />;
    if (index === 2) return <Medal className="h-6 w-6 text-amber-700" />;
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Feed
        </Button>

        <h1 className="text-4xl font-bold mb-2 text-foreground">
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
            >
              {phaseLabels[p]}
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          {phaseConcerns.map((concern, index) => {
            const isTopThree = index < 3;

            return (
              <Card
                key={concern.id}
                className={cn(
                  "transition-all hover:shadow-lg cursor-pointer",
                  isTopThree && "border-2 border-primary bg-primary/5"
                )}
                onClick={() => navigate(`/concern/${concern.id}`)}
              >
                <CardHeader>
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
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <TypeBadge type={concern.type} />
                        {concern.aspects && concern.aspects.length > 0 && (
                          <AspectBadges aspects={concern.aspects} />
                        )}
                        {concern.group && (
                          <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                            {concern.group}
                          </span>
                        )}
                      </div>
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
    </div>
  );
};

export default Leaderboard;
