import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";
import { useState } from "react";

interface VoteButtonProps {
  initialVotes: number;
  onVote?: () => void;
}

export const VoteButton = ({ initialVotes, onVote }: VoteButtonProps) => {
  const [votes, setVotes] = useState(initialVotes);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = () => {
    if (!hasVoted) {
      setVotes(votes + 1);
      setHasVoted(true);
      onVote?.();
    }
  };

  return (
    <Button
      variant={hasVoted ? "default" : "outline"}
      size="sm"
      onClick={handleVote}
      className="gap-1"
    >
      <ChevronUp className="h-4 w-4" />
      <span className="font-semibold">{votes}</span>
    </Button>
  );
};
