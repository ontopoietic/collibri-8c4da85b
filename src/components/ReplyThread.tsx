import { Reply } from "@/types/concern";
import { CategoryBadge } from "./CategoryBadge";
import { VoteButton } from "./VoteButton";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ReplyThreadProps {
  replies: Reply[];
  onReply: (parentId: string) => void;
}

export const ReplyThread = ({ replies, onReply }: ReplyThreadProps) => {
  if (replies.length === 0) return null;

  return (
    <div className="space-y-4">
      {replies.map((reply) => (
        <div key={reply.id} className="pl-6 border-l-2 border-border">
          <div className="bg-card rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <CategoryBadge category={reply.category} />
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(reply.timestamp, { addSuffix: true })}
              </span>
            </div>
            
            <p className="text-foreground leading-relaxed">{reply.text}</p>
            
            {reply.referencedReplies && reply.referencedReplies.length > 0 && (
              <div className="bg-muted p-3 rounded-md space-y-2">
                <p className="text-xs font-medium text-muted-foreground">References:</p>
                {reply.referencedReplies.map((ref) => (
                  <div key={ref.id} className="text-xs flex items-center gap-2">
                    <CategoryBadge category={ref.category} />
                    <span className="text-muted-foreground truncate">{ref.text}</span>
                  </div>
                ))}
              </div>
            )}

            {reply.counterProposal && (
              <div className="bg-primary/5 border border-primary/20 p-3 rounded-md space-y-2">
                <p className="text-xs font-medium text-primary">Counter-Proposal:</p>
                <p className="text-sm text-foreground">{reply.counterProposal.text}</p>
                {reply.counterProposal.postedAsConcern && (
                  <p className="text-xs text-muted-foreground italic">
                    Posted as a forum concern
                  </p>
                )}
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <VoteButton initialVotes={reply.votes} />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReply(reply.id)}
                className="gap-1"
              >
                <MessageSquare className="h-4 w-4" />
                Reply
              </Button>
            </div>

            {reply.replies.length > 0 && (
              <div className="mt-4">
                <ReplyThread replies={reply.replies} onReply={onReply} />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
