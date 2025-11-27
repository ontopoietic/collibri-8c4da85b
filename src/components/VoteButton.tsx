import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
      variant={hasVoted ? "vote" : "vote"}
      size="sm"
      onClick={handleVote}
      className={`gap-1 ${hasVoted ? 'bg-accent text-accent-foreground hover:bg-accent' : ''}`}
    >
      <ChevronUp className="h-4 w-4" />
      <span className="font-semibold">{votes}</span>
    </Button>
  );
};
