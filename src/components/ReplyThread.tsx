import { Reply, ReplyCategory, ReplyReference, SolutionLevel } from "@/types/concern";
import { CategoryBadge } from "./CategoryBadge";
import { CategoryIconPrefix } from "./CategoryIconPrefix";
import { AspectBadges } from "./AspectBadges";
import { SolutionLevelBadge } from "./SolutionLevelBadge";
import { CollapsibleText } from "./CollapsibleText";
import { VoteButton } from "./VoteButton";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { MessageSquare, ExternalLink, Target, Ban, Trash2, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  concernId?: string;
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
  concernId,
  depth = 0
}: { 
  reply: Reply; 
  onReply: (parentId: string, replyType?: 'endorse' | 'object' | 'question') => void;
  availableReplies: Reply[];
  openFormId?: string | null;
  onFormToggle?: (replyId: string | null) => void;
  parentCategory?: ReplyCategory;
  concernType?: "problem" | "proposal" | "counter-proposal";
  concernId?: string;
  depth?: number;
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { adminModeEnabled } = useAdmin();
  const [isExpanded, setIsExpanded] = useState(false);
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

  const handleCardClick = () => {
    if (isMobile && hasReplies && concernId) {
      navigate(`/reply/${concernId}/${reply.id}`);
    }
  };

  return (
    <div id={`reply-${reply.id}`}>
      <div 
        className={cn(
          "bg-card rounded-lg p-4 space-y-2 transition-all",
          isMobile && hasReplies && "cursor-pointer active:bg-muted/50"
        )}
        onClick={handleCardClick}
      >
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
            
            {/* Main content with flexbox for proper text alignment */}
            <div className="flex items-start gap-1.5">
              {/* Icon - fixed width, doesn't shrink */}
              <span className="flex-shrink-0 mt-0.5">
                <CategoryIconPrefix category={reply.category} />
              </span>
              
              {/* Text container - takes remaining width */}
              <div className="flex-1 min-w-0">
                <span className="float-right text-[10px] text-muted-foreground whitespace-nowrap ml-3 mb-1">
                  {formatDistanceToNow(reply.timestamp, { addSuffix: true })}
                </span>
                <CollapsibleText 
                  text={reply.text} 
                  maxHeight={100}
                  className="text-sm text-foreground leading-relaxed"
                  inline={true}
                />
              </div>
            </div>
            
            {reply.referencedReplies && reply.referencedReplies.length > 0 && (
              <div className="mt-3 space-y-2" onClick={(e) => e.stopPropagation()}>
                <p className="text-sm font-medium text-muted-foreground">References:</p>
                <div className="flex flex-wrap gap-2">
                  {reply.referencedReplies.map((ref) => (
                    <Badge
                      key={ref.id}
                      variant="outline"
                      className="cursor-pointer hover:bg-muted transition-colors gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
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
              <div className="pt-3 border-t border-border/50 pl-[34px]">
                <div className="flex items-center gap-2 mb-2">
                  <CategoryIconPrefix category="proposal" />
                  <h3 className="text-xs font-semibold text-foreground">Counter-Proposal</h3>
                  {reply.counterProposal.solutionLevel && (
                    <SolutionLevelBadge level={reply.counterProposal.solutionLevel} />
                  )}
                </div>
                <div className="pl-[34px]">
                  <CollapsibleText 
                    text={reply.counterProposal.text}
                    maxHeight={100}
                    className="text-sm text-foreground leading-relaxed"
                  />
                </div>
                {reply.counterProposal.postedAsConcern && (
                  <p className="text-xs text-muted-foreground italic pl-[34px] mt-1">
                    Posted as a forum concern
                  </p>
                )}
              </div>
            )}
            
            <div className="flex items-center gap-2 flex-wrap pl-[34px]" onClick={(e) => e.stopPropagation()}>
              {/* Hide voting buttons for questions and answers to questions */}
              {reply.category !== "question" && parentCategory !== "question" && (
                <>
                  <VoteButton initialVotes={reply.votes} />
                  {/* Unified conversation button - navigates on mobile, expands on desktop */}
                  {hasReplies && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => isMobile && concernId 
                        ? navigate(`/reply/${concernId}/${reply.id}`)
                        : setIsExpanded(!isExpanded)
                      }
                      className={cn(
                        "gap-1 px-2 h-8 border border-muted-foreground/30",
                        isExpanded && !isMobile
                          ? "bg-[#383649] text-white hover:bg-[#383649]"
                          : "bg-transparent text-muted-foreground hover:bg-[#383649] hover:text-white"
                      )}
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span className="font-semibold text-sm">{reply.replies.length}</span>
                    </Button>
                  )}
                  <button
                    onClick={() => handleFormOpen('endorse')}
                    className={cn(
                      "p-2 rounded-md transition-colors",
                      showReplyForm && replyType === 'endorse'
                        ? "bg-endorse-hover text-white"
                        : "text-muted-foreground hover:bg-endorse-hover hover:text-white"
                    )}
                  >
                    <Target className="h-4 w-4" />
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
                    <Ban className="h-4 w-4" />
                  </button>
                </>
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

            {hasReplies && isExpanded && !isMobile && (
              <div className="mt-4">
                <ReplyThread 
                  replies={reply.replies} 
                  onReply={onReply} 
                  availableReplies={availableReplies}
                  openFormId={openFormId}
                  onFormToggle={onFormToggle}
                  parentCategory={reply.category}
                  concernType={concernType}
                  concernId={concernId}
                  depth={depth + 1}
                />
              </div>
            )}
          </div>
        </div>
  );
};

export const ReplyThread = ({ replies, onReply, availableReplies, openFormId, onFormToggle, parentCategory, concernType, concernId, depth = 0 }: ReplyThreadProps) => {
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
          concernId={concernId}
          depth={depth}
        />
      ))}
    </div>
  );
};

export default ReplyThread;
