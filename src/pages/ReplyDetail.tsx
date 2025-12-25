import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CategoryBadge } from "@/components/CategoryBadge";
import { CategoryIconPrefix } from "@/components/CategoryIconPrefix";
import { VoteButton } from "@/components/VoteButton";
import { ReplyThread } from "@/components/ReplyThread";
import { ReplyForm } from "@/components/ReplyForm";
import { AspectBadges } from "@/components/AspectBadges";
import { SolutionLevelBadge } from "@/components/SolutionLevelBadge";
import { RichText } from "@/components/RichText";
import { ArrowLeft, Target, AlertCircle, HelpCircle, User, ExternalLink, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ReplyCategory, Reply, ReplyReference, SolutionLevel } from "@/types/concern";
import { mockConcerns } from "@/data/mockData";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { GlassOverlay } from "@/components/GlassOverlay";
import { MobileFormDrawer } from "@/components/MobileFormDrawer";
import { useAdmin } from "@/contexts/AdminContext";

const ReplyDetail = () => {
  const { concernId, replyId } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { adminModeEnabled } = useAdmin();

  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyType, setReplyType] = useState<'endorse' | 'object' | 'question'>('endorse');
  const [isNewConcernOpen, setIsNewConcernOpen] = useState(false);

  const concern = mockConcerns.find((c) => c.id === concernId);

  // Find a reply by ID recursively
  const findReplyById = (replies: Reply[], id: string): Reply | null => {
    for (const reply of replies) {
      if (reply.id === id) return reply;
      const found = findReplyById(reply.replies, id);
      if (found) return found;
    }
    return null;
  };

  // Find the parent of a reply
  const findParentReply = (replies: Reply[], targetId: string, parent: Reply | null = null): Reply | null => {
    for (const reply of replies) {
      if (reply.id === targetId) return parent;
      const found = findParentReply(reply.replies, targetId, reply);
      if (found !== null) return found;
    }
    return null;
  };

  // Get all replies flat for references
  const getAllReplies = (replies: Reply[]): Reply[] => {
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

  const reply = concern ? findReplyById(concern.replies, replyId || "") : null;
  const parentReply = concern ? findParentReply(concern.replies, replyId || "") : null;
  const availableReplies = concern ? getAllReplies(concern.replies) : [];

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [replyId]);

  if (!concern || !reply) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Reply not found</h2>
          <Button onClick={() => navigate("/")}>Return to Feed</Button>
        </div>
      </div>
    );
  }

  const handleBackNavigation = () => {
    if (parentReply) {
      // Navigate to parent reply
      navigate(`/reply/${concernId}/${parentReply.id}`);
    } else {
      // This is a top-level reply, go back to concern
      navigate(`/concern/${concernId}`);
    }
  };

  const handleReply = (
    category: ReplyCategory,
    text: string,
    referencedReplies?: ReplyReference[],
    counterProposal?: { text: string; postedAsConcern?: boolean; solutionLevel?: SolutionLevel }
  ) => {
    console.log("New reply:", { category, text, referencedReplies, counterProposal });
    setShowReplyForm(false);
    setReplyToId(null);
  };

  const handleFormOpen = (type: 'endorse' | 'object' | 'question') => {
    setReplyType(type);
    setShowReplyForm(true);
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Sticky back button */}
      <div className="sticky top-0 z-10">
        <GlassOverlay direction="down" />
        <div className="relative max-w-4xl mx-auto px-2 sm:px-4 py-3">
          <Button
            variant="ghost"
            onClick={handleBackNavigation}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-8">
        {/* Main Reply Card */}
        <div className="bg-card rounded-lg p-4 sm:p-8 shadow-sm space-y-6">
          {/* Badges row */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <CategoryBadge category={reply.category} />
              {reply.solutionLevel && (
                <SolutionLevelBadge level={reply.solutionLevel} />
              )}
              {reply.aspects && reply.aspects.length > 0 && (
                <AspectBadges aspects={reply.aspects} />
              )}
            </div>
            <span className="text-xs text-muted-foreground ml-auto">
              {formatDistanceToNow(reply.timestamp, { addSuffix: true })}
            </span>
          </div>

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

          {/* Reply Content */}
          <div className="flex items-start gap-2">
            <CategoryIconPrefix category={reply.category} />
            <RichText content={reply.text} className="text-foreground leading-relaxed text-lg" />
          </div>

          {/* Counter Proposal */}
          {reply.counterProposal && reply.category === "objection" && (
            <div className="bg-primary/5 border border-primary/20 p-3 rounded-md space-y-2">
              <p className="text-xs font-medium text-foreground">Counter-Proposal:</p>
              <RichText content={reply.counterProposal.text} className="text-sm text-foreground" />
              {reply.counterProposal.postedAsConcern && (
                <p className="text-xs text-muted-foreground italic">
                  Posted as a forum concern
                </p>
              )}
            </div>
          )}

          {/* References */}
          {reply.referencedReplies && reply.referencedReplies.length > 0 && (
            <div className="bg-muted p-4 rounded-lg space-y-3">
              <p className="text-sm font-medium">References:</p>
              <div className="flex flex-wrap gap-2">
                {reply.referencedReplies.map((ref) => (
                  <Badge
                    key={ref.id}
                    variant="outline"
                    className="cursor-pointer hover:bg-muted transition-colors gap-1"
                  >
                    <CategoryBadge category={ref.category} />
                    <span className="max-w-[200px] truncate">{ref.text}</span>
                    <ExternalLink className="h-3 w-3" />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons - same style as ReplyThread */}
          <div className="flex items-center gap-2 pt-4 border-t border-border flex-wrap">
            <VoteButton initialVotes={reply.votes} />
            {reply.category !== "question" && (
              <>
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
                  <AlertCircle className="h-4 w-4" />
                </button>
              </>
            )}
            {/* Reply count indicator */}
            {reply.replies.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>{reply.replies.length}</span>
              </div>
            )}
          </div>

          {/* Desktop Reply Form */}
          {showReplyForm && !isMobile && (
            <div className="mt-4">
              <ReplyForm
                onSubmit={handleReply}
                onCancel={() => {
                  setShowReplyForm(false);
                  setReplyToId(null);
                }}
                replyType={replyType}
                originalText={reply.text}
                availableReplies={availableReplies}
                parentConcernType={concern.type}
              />
            </div>
          )}
        </div>

        {/* Nested Replies */}
        {reply.replies.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">
              Replies ({reply.replies.length})
            </h2>
            <ReplyThread
              replies={reply.replies}
              onReply={(parentId, type) => {
                setReplyToId(parentId);
                if (type) setReplyType(type);
                setShowReplyForm(true);
              }}
              availableReplies={availableReplies}
              concernType={concern.type}
              concernId={concernId}
            />
          </div>
        )}

        {reply.replies.length === 0 && (
          <div className="mt-8 text-center text-muted-foreground py-8">
            No replies yet
          </div>
        )}
      </div>

      {/* Mobile Bottom Nav - Regular navigation */}
      {isMobile && (
        <MobileBottomNav
          onNewConcern={() => setIsNewConcernOpen(true)}
          isNewConcernOpen={isNewConcernOpen}
          currentPhase={concern.phase}
          onViewLeaderboard={() => navigate('/leaderboard')}
        />
      )}

      {/* Mobile Form Drawer */}
      {isMobile && (
        <MobileFormDrawer
          isOpen={showReplyForm}
          onClose={() => setShowReplyForm(false)}
          title={replyType === 'endorse' ? 'Endorse' : replyType === 'object' ? 'Object' : 'Ask Question'}
        >
          <ReplyForm
            onSubmit={handleReply}
            onCancel={() => setShowReplyForm(false)}
            replyType={replyType}
            originalText={reply.text}
            availableReplies={availableReplies}
            parentConcernType={concern.type}
          />
        </MobileFormDrawer>
      )}
    </div>
  );
};

export default ReplyDetail;
