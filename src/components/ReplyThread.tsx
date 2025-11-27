import { Reply, ReplyCategory, ReplyReference, SolutionLevel } from "@/types/concern";
import { CategoryBadge } from "./CategoryBadge";
import { AspectBadges } from "./AspectBadges";
import { VoteButton } from "./VoteButton";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { MessageSquare, ExternalLink, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { ReplyForm } from "./ReplyForm";

interface ReplyThreadProps {
  replies: Reply[];
  onReply: (parentId: string, replyType?: 'endorse' | 'object' | 'question') => void;
  availableReplies?: Reply[];
  openFormId?: string | null;
  onFormToggle?: (replyId: string | null) => void;
}

const getAllRepliesFlat = (replies: Reply[]): Reply[] => {
  const allReplies: Reply[] = [];
  const traverse = (replyList: Reply[]) => {
    replyList.forEach((reply) => {
      allReplies.push(reply);
      if (reply.replies.length > 0) {
        traverse(reply.replies);
      }
    });
  };
  traverse(replies);
  return allReplies;
};

const ReplyItem = ({ 
  reply, 
  onReply, 
  availableReplies,
  openFormId,
  onFormToggle
}: { 
  reply: Reply; 
  onReply: (parentId: string, replyType?: 'endorse' | 'object' | 'question') => void;
  availableReplies: Reply[];
  openFormId?: string | null;
  onFormToggle?: (replyId: string | null) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [replyType, setReplyType] = useState<'endorse' | 'object' | 'question'>('endorse');
  const hasReplies = reply.replies.length > 0;
  const showReplyForm = openFormId === reply.id;

  const handleReplySubmit = (
    category: ReplyCategory,
    text: string,
    referencedReplies?: ReplyReference[],
    counterProposal?: { text: string; postedAsConcern?: boolean; solutionLevel?: SolutionLevel }
  ) => {
    console.log("New reply to", reply.id, ":", { category, text, referencedReplies, counterProposal });
    onFormToggle?.(null);
  };

  const handleFormOpen = (type: 'endorse' | 'object' | 'question') => {
    setReplyType(type);
    onFormToggle?.(reply.id);
  };

  return (
    <div id={`reply-${reply.id}`} className="pl-6 border-l-2 border-border">
      <div className="bg-card rounded-lg p-4 space-y-3 transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                <CategoryBadge category={reply.category} />
                {reply.aspects && reply.aspects.length > 0 && (
                  <AspectBadges aspects={reply.aspects} />
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(reply.timestamp, { addSuffix: true })}
              </span>
            </div>
            
            <p className="text-foreground leading-relaxed">{reply.text}</p>
            
            {reply.referencedReplies && reply.referencedReplies.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-sm font-medium text-muted-foreground">References:</p>
                <div className="flex flex-wrap gap-2">
                  {reply.referencedReplies.map((ref) => (
                    <Badge
                      key={ref.id}
                      variant="outline"
                      className="cursor-pointer hover:bg-muted transition-colors gap-1"
                      onClick={() => {
                        const element = document.getElementById(`reply-${ref.id}`);
                        if (element) {
                          element.scrollIntoView({ behavior: "smooth", block: "center" });
                          element.classList.add("ring-2", "ring-primary");
                          setTimeout(() => {
                            element.classList.remove("ring-2", "ring-primary");
                          }, 2000);
                        }
                      }}
                    >
                      <CategoryBadge category={ref.category} />
                      <span className="max-w-[200px] truncate">{ref.text}</span>
                      <ExternalLink className="h-3 w-3" />
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {reply.counterProposal && reply.category === "objection" && (
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
            
            <div className="flex items-center gap-2 flex-wrap">
              <VoteButton initialVotes={reply.votes} />
              <Button
                variant="endorse"
                size="sm"
                onClick={() => handleFormOpen('endorse')}
                className="gap-1 text-xs bg-endorse text-endorse-foreground hover:bg-endorse-hover"
              >
                <ThumbsUp className="h-3 w-3" />
                Endorse
              </Button>
              <Button
                variant="object"
                size="sm"
                onClick={() => handleFormOpen('object')}
                className="gap-1 text-xs"
              >
                <ThumbsDown className="h-3 w-3" />
                Object
              </Button>
              {hasReplies && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="gap-1 text-xs"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="h-3 w-3" />
                      Hide Replies ({reply.replies.length})
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3" />
                      Show Replies ({reply.replies.length})
                    </>
                  )}
                </Button>
              )}
            </div>

            {showReplyForm && (
              <div className="mt-4">
                <ReplyForm
                  onSubmit={handleReplySubmit}
                  onCancel={() => onFormToggle?.(null)}
                  replyType={replyType}
                  originalText={reply.text}
                  availableReplies={availableReplies}
                />
              </div>
            )}

            {hasReplies && isExpanded && (
              <div className="mt-4">
                <ReplyThread 
                  replies={reply.replies} 
                  onReply={onReply} 
                  availableReplies={availableReplies}
                  openFormId={openFormId}
                  onFormToggle={onFormToggle}
                />
              </div>
            )}
          </div>
        </div>
  );
};

export const ReplyThread = ({ replies, onReply, availableReplies, openFormId, onFormToggle }: ReplyThreadProps) => {
  const [localOpenFormId, setLocalOpenFormId] = useState<string | null>(null);
  
  if (replies.length === 0) return null;

  // If availableReplies not provided, compute it from current replies
  const allReplies = availableReplies || getAllRepliesFlat(replies);
  
  // Use parent's state if provided, otherwise use local state
  const activeFormId = openFormId !== undefined ? openFormId : localOpenFormId;
  const handleFormToggle = onFormToggle || setLocalOpenFormId;

  return (
    <div className="space-y-4">
      {replies.map((reply) => (
        <ReplyItem 
          key={reply.id} 
          reply={reply} 
          onReply={onReply} 
          availableReplies={allReplies}
          openFormId={activeFormId}
          onFormToggle={handleFormToggle}
        />
      ))}
    </div>
  );
};
