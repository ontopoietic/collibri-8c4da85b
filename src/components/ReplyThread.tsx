import { Reply, ReplyCategory, ReplyReference, SolutionLevel } from "@/types/concern";
import { CategoryBadge } from "./CategoryBadge";
import { CategoryIconPrefix } from "./CategoryIconPrefix";
import { AspectBadges } from "./AspectBadges";
import { SolutionLevelBadge } from "./SolutionLevelBadge";
import { VoteButton } from "./VoteButton";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { MessageSquare, ExternalLink, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown, Trash2, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { ReplyForm } from "./ReplyForm";
import { MobileFormDrawer } from "./MobileFormDrawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/contexts/AdminContext";

interface ReplyThreadProps {
  replies: Reply[];
  onReply: (parentId: string, replyType?: 'endorse' | 'object' | 'question') => void;
  availableReplies?: Reply[];
  openFormId?: string | null;
  onFormToggle?: (replyId: string | null) => void;
  parentCategory?: ReplyCategory;
  concernType?: "problem" | "proposal" | "counter-proposal";
  depth?: number;
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
  onFormToggle,
  parentCategory,
  concernType,
  depth = 0
}: { 
  reply: Reply; 
  onReply: (parentId: string, replyType?: 'endorse' | 'object' | 'question') => void;
  availableReplies: Reply[];
  openFormId?: string | null;
  onFormToggle?: (replyId: string | null) => void;
  parentCategory?: ReplyCategory;
  concernType?: "problem" | "proposal" | "counter-proposal";
  depth?: number;
}) => {
  const isMobile = useIsMobile();
  const { adminModeEnabled } = useAdmin();
  const [isExpanded, setIsExpanded] = useState(depth === 0);
  const [replyType, setReplyType] = useState<'endorse' | 'object' | 'question'>('endorse');
  const hasReplies = reply.replies.length > 0;
  const showReplyForm = openFormId === reply.id;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Delete reply:", reply.id);
    // In production, this would call an API to delete the reply
  };

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
    <div id={`reply-${reply.id}`}>
      <div className="bg-card rounded-lg p-4 space-y-2 transition-all">
            {/* Badges row - only show if there are badges */}
            {((reply.category === "proposal" && (reply.solutionLevel || reply.counterProposal?.solutionLevel)) || 
              (reply.aspects && reply.aspects.length > 0)) && (
              <div className="flex items-center gap-2 flex-wrap">
                {reply.category === "proposal" && reply.solutionLevel && (
                  <SolutionLevelBadge level={reply.solutionLevel} />
                )}
                {reply.category === "proposal" && reply.counterProposal?.solutionLevel && !reply.solutionLevel && (
                  <SolutionLevelBadge level={reply.counterProposal.solutionLevel} />
                )}
                {reply.aspects && reply.aspects.length > 0 && (
                  <AspectBadges aspects={reply.aspects} />
                )}
              </div>
            )}

            {adminModeEnabled && reply.authorName && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-2 py-1 rounded-md w-fit">
                <User className="h-3.5 w-3.5" />
                <span>{reply.authorName}</span>
                {reply.authorClass && (
                  <Badge variant="outline" className="text-xs px-1.5 py-0">
                    {reply.authorClass.toUpperCase()}
                  </Badge>
                )}
              </div>
            )}
            
            {/* Main content row with timestamp on the right */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-2">
                <CategoryIconPrefix category={reply.category} />
                <p className="text-foreground leading-relaxed">{reply.text}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
                {formatDistanceToNow(reply.timestamp, { addSuffix: true })}
              </span>
            </div>
            
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
                <p className="text-xs font-medium text-white">Counter-Proposal:</p>
                <p className="text-sm text-foreground">{reply.counterProposal.text}</p>
                {reply.counterProposal.postedAsConcern && (
                  <p className="text-xs text-muted-foreground italic">
                    Posted as a forum concern
                  </p>
                )}
              </div>
            )}
            
            <div className="flex items-center gap-2 flex-wrap">
              {/* Hide voting buttons for questions and answers to questions */}
              {reply.category !== "question" && parentCategory !== "question" && (
                <>
                  <VoteButton initialVotes={reply.votes} />
                  <button
                    onClick={() => handleFormOpen('endorse')}
                    className={cn(
                      "p-2 rounded-md transition-colors",
                      showReplyForm && replyType === 'endorse'
                        ? "bg-endorse-hover text-white"
                        : "text-muted-foreground hover:bg-endorse-hover hover:text-white"
                    )}
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleFormOpen('object')}
                    className={cn(
                      "p-2 rounded-md transition-colors",
                      showReplyForm && replyType === 'object'
                        ? "bg-object text-white"
                        : "text-muted-foreground hover:bg-object hover:text-white"
                    )}
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </button>
                </>
              )}
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
              {adminModeEnabled && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="gap-1 text-xs ml-auto"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </Button>
              )}
            </div>

            {/* Reply Form - inline on desktop, drawer on mobile */}
            {showReplyForm && !isMobile && (
              <div className="mt-4">
                <ReplyForm
                  onSubmit={handleReplySubmit}
                  onCancel={() => onFormToggle?.(null)}
                  replyType={replyType}
                  originalText={reply.text}
                  availableReplies={availableReplies}
                  parentConcernType={concernType}
                />
              </div>
            )}

            {/* Mobile Reply Form Drawer */}
            {isMobile && (
              <MobileFormDrawer
                isOpen={showReplyForm}
                onClose={() => onFormToggle?.(null)}
                title={replyType === 'endorse' ? 'Endorse' : replyType === 'object' ? 'Object' : 'Ask Question'}
              >
                <ReplyForm
                  onSubmit={handleReplySubmit}
                  onCancel={() => onFormToggle?.(null)}
                  replyType={replyType}
                  originalText={reply.text}
                  availableReplies={availableReplies}
                  parentConcernType={concernType}
                />
              </MobileFormDrawer>
            )}

            {hasReplies && isExpanded && (
              <div className="mt-4">
                <ReplyThread 
                  replies={reply.replies} 
                  onReply={onReply} 
                  availableReplies={availableReplies}
                  openFormId={openFormId}
                  onFormToggle={onFormToggle}
                  parentCategory={reply.category}
                  concernType={concernType}
                  depth={depth + 1}
                />
              </div>
            )}
          </div>
        </div>
  );
};

export const ReplyThread = ({ replies, onReply, availableReplies, openFormId, onFormToggle, parentCategory, concernType, depth = 0 }: ReplyThreadProps) => {
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
          parentCategory={parentCategory}
          concernType={concernType}
          depth={depth}
        />
      ))}
    </div>
  );
};

export default ReplyThread;
