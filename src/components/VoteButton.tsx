import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface VoteButtonProps {
  initialVotes: number;
  onVote?: (isAdding: boolean) => void;
  remainingVotes?: number;
  hasVotedInitially?: boolean;
}

export const VoteButton = ({ 
  initialVotes, 
  onVote, 
  remainingVotes,
  hasVotedInitially = false 
}: VoteButtonProps) => {
  const [votes, setVotes] = useState(initialVotes);
  const [hasVoted, setHasVoted] = useState(hasVotedInitially);

  const handleVote = () => {
    if (hasVoted) {
      // Remove vote
      setVotes(votes - 1);
      setHasVoted(false);
      onVote?.(false);
      
      const newRemaining = remainingVotes !== undefined ? remainingVotes + 1 : undefined;
      toast.success("Vote removed", {
        description: newRemaining !== undefined 
          ? `You have ${newRemaining} vote${newRemaining !== 1 ? 's' : ''} remaining`
          : undefined,
        duration: 2000,
      });
    } else {
      // Add vote
      setVotes(votes + 1);
      setHasVoted(true);
      onVote?.(true);
      
      const newRemaining = remainingVotes !== undefined ? remainingVotes - 1 : undefined;
      toast.success("Vote added", {
        description: newRemaining !== undefined 
          ? `You have ${newRemaining} vote${newRemaining !== 1 ? 's' : ''} remaining`
          : undefined,
        duration: 2000,
      });
    }
  };

  return (
    <Button
      variant="vote"
      size="sm"
      onClick={handleVote}
      className={cn(
        "gap-1 px-2 h-8",
        hasVoted 
          ? "bg-vote text-vote-foreground hover:bg-vote" 
          : "bg-transparent text-muted-foreground hover:bg-vote hover:text-vote-foreground border border-muted-foreground/30"
      )}
    >
      <ThumbsUp className="h-4 w-4" />
      <span className="font-semibold text-sm">{votes}</span>
    </Button>
  );
};
