import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Concern, ConcernVariant } from "@/types/concern";
import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { format } from "date-fns";

interface VariantVotingProps {
  concerns: Concern[];
  onVote: (concernId: string, variantId: string) => void;
  dayIntoPhase?: number;
  interimDuration?: number;
}

export const VariantVoting = ({ concerns, onVote, dayIntoPhase = 1, interimDuration = 5 }: VariantVotingProps) => {
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [votedConcerns, setVotedConcerns] = useState<Set<string>>(new Set());
  const [selectedForDetail, setSelectedForDetail] = useState<{concern: Concern, variant: ConcernVariant} | null>(null);

  // Get top 3 concerns from previous phase with variants
  const topConcerns = concerns
    .filter((c) => c.variants && c.variants.length > 0)
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 3);

  const handleVariantSelect = (concernId: string, variantId: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [concernId]: variantId
    }));
  };

  const handleVote = (concernId: string) => {
    const variantId = selectedVariants[concernId];
    if (variantId) {
      onVote(concernId, variantId);
      setVotedConcerns(prev => new Set(prev).add(concernId));
    }
  };

  const hasVoted = (concernId: string) => votedConcerns.has(concernId);
  const isSelected = (concernId: string, variantId: string) => 
    selectedVariants[concernId] === variantId;

  const getSortedVariants = (concern: Concern) => {
    if (!concern.variants) return [];
    if (hasVoted(concern.id)) {
      return [...concern.variants].sort((a, b) => b.votes - a.votes);
    }
    return concern.variants;
  };

  const getMaxVotes = (variants: ConcernVariant[]) => {
    return Math.max(...variants.map(v => v.votes), 1);
  };

  const getTotalVotes = (variants: ConcernVariant[]) => {
    return Math.max(variants.reduce((sum, v) => sum + v.votes, 0), 1);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold text-foreground">Variant Voting Phase</h2>
          <p className="text-muted-foreground">
            Vote for your preferred version of each top concern from the previous phase
          </p>
          <div className="bg-muted/50 border border-border rounded-lg p-4 max-w-md mx-auto">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">Variant voting duration:</span>
                <span className="text-primary font-semibold">{interimDuration} days</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">Current day:</span>
                <span className="font-semibold">{dayIntoPhase} of {interimDuration}</span>
              </div>
              <div className="pt-2 border-t border-border">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium">Forum opens in:</span>
                  <span className="text-primary font-bold text-lg">
                    {Math.max(0, interimDuration - dayIntoPhase + 1)} day{Math.max(0, interimDuration - dayIntoPhase + 1) !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topConcerns.map((concern) => {
            const variants = getSortedVariants(concern);
            const maxVotes = getMaxVotes(variants);
            const totalVotes = getTotalVotes(variants);
            const voted = hasVoted(concern.id);

            return (
              <Card key={concern.id} className="p-6 flex flex-col">
                <h3 className="font-semibold mb-1 text-foreground">{concern.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {concern.votes} votes from previous phase
                </p>

                <div className="space-y-3 flex-1 mb-4">
                  {variants.map((variant) => (
                    <div
                      key={variant.id}
                      className="group relative"
                    >
                      <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                        {!voted && (
                          <Checkbox
                            checked={isSelected(concern.id, variant.id)}
                            onCheckedChange={() => handleVariantSelect(concern.id, variant.id)}
                            className="flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <button
                            onClick={() => setSelectedForDetail({concern, variant})}
                            className="text-left w-full"
                          >
                            <p className="text-sm font-semibold text-foreground line-clamp-1">
                              {variant.title}
                            </p>
                            <p className="text-xs text-foreground/70 line-clamp-1">
                              {variant.text}
                            </p>
                          </button>
                          
                          {voted && (
                            <div className="mt-2 space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-medium text-foreground">{variant.votes} votes</span>
                                <span className="text-foreground/80">
                                  {Math.round((variant.votes / totalVotes) * 100)}%
                                </span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary transition-all duration-500"
                                  style={{ width: `${(variant.votes / totalVotes) * 100}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {!voted && (
                  <Button
                    onClick={() => handleVote(concern.id)}
                    disabled={!selectedVariants[concern.id]}
                    className="w-full"
                  >
                    Submit Vote
                  </Button>
                )}
                {voted && (
                  <div className="text-center text-sm text-muted-foreground">
                    Vote submitted
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      <Dialog open={!!selectedForDetail} onOpenChange={() => setSelectedForDetail(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedForDetail && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedForDetail.variant.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Original concern: {selectedForDetail.concern.title}
                </p>
                <div className="prose prose-sm max-w-none">
                  <p>{selectedForDetail.variant.text}</p>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4 border-t">
                  <span>{format(selectedForDetail.concern.timestamp, "PPP")}</span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    {selectedForDetail.concern.replies.length} replies
                  </span>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
