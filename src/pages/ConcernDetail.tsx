import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, AlertTriangle, Lightbulb, Scale, ThumbsUp, ThumbsDown, HelpCircle, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { mockConcerns } from "@/data/mockData";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { GlassOverlay } from "@/components/GlassOverlay";
import { ReplyThread } from "@/components/ReplyThread";
import { ReplyForm } from "@/components/ReplyForm";
import QAAccordion from "@/components/QAAccordion";
import { VoteButton } from "@/components/VoteButton";
import { AspectBadges } from "@/components/AspectBadges";
import { SolutionLevelBadge } from "@/components/SolutionLevelBadge";
import { useAdmin } from "@/contexts/AdminContext";
import { Reply, ReplyCategory, ReplyReference, SolutionLevel } from "@/types/concern";

const typeConfig = {
  problem: {
    label: "Problem",
    icon: AlertTriangle,
    className: "bg-transparent text-problem-aspect border-problem-aspect",
  },
  proposal: {
    label: "Proposal",
    icon: Lightbulb,
    className: "bg-proposal/10 text-proposal border-proposal/20",
  },
  "counter-proposal": {
    label: "Counter-Proposal",
    icon: Scale,
    className: "bg-primary/10 text-primary border-primary/20",
  },
};

const ConcernDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { adminModeEnabled } = useAdmin();
  
  const [activeAction, setActiveAction] = useState<'endorse' | 'object' | 'question' | null>(null);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [openReplyFormId, setOpenReplyFormId] = useState<string | null>(null);
  
  const concern = mockConcerns.find((c) => c.id === id);

  if (!concern) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2 text-foreground">Concern not found</h2>
          <Button onClick={() => navigate("/")}>Return to Feed</Button>
        </div>
      </div>
    );
  }

  const config = typeConfig[concern.type];
  const Icon = config.icon;

  // Filter questions from other replies
  const questions = concern.replies.filter(r => r.category === 'question');
  const nonQuestionReplies = concern.replies.filter(r => r.category !== 'question');

  // Get all replies flattened for reference selection
  const getAllRepliesFlat = (replies: Reply[]): Reply[] => {
    return replies.reduce((acc: Reply[], reply) => {
      return [...acc, reply, ...getAllRepliesFlat(reply.replies)];
    }, []);
  };
  const allRepliesFlat = getAllRepliesFlat(concern.replies);

  const handleActionClick = (action: 'endorse' | 'object' | 'question') => {
    if (activeAction === action) {
      setActiveAction(null);
      setShowReplyForm(false);
    } else {
      setActiveAction(action);
      setShowReplyForm(true);
    }
  };

  const handleReplySubmit = (
    category: ReplyCategory,
    text: string,
    referencedReplies?: ReplyReference[],
    counterProposal?: { text: string; postedAsConcern?: boolean; solutionLevel?: SolutionLevel },
    variantSolutionLevel?: SolutionLevel
  ) => {
    console.log('Reply submitted:', { category, text, referencedReplies, counterProposal, variantSolutionLevel });
    setShowReplyForm(false);
    setActiveAction(null);
  };

  const handleNestedReply = (parentId: string, replyType?: 'endorse' | 'object' | 'question') => {
    console.log('Nested reply to', parentId, 'type:', replyType);
    setOpenReplyFormId(parentId);
  };

  const handleVote = (isAdding: boolean) => {
    console.log('Vote:', isAdding ? 'added' : 'removed');
  };

  const getReplyType = (): 'endorse' | 'object' | 'question' => {
    return activeAction || 'endorse';
  };

  // Map activeAction to MobileBottomNav's expected type
  const getMobileActiveAction = (): 'endorse' | 'object' | 'vote' | null => {
    if (activeAction === 'question') return 'vote';
    return activeAction;
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Header */}
      <div className="sticky top-0 z-10">
        <GlassOverlay direction="down" />
        <div className="relative max-w-4xl mx-auto px-2 sm:px-4 py-3">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Forum</span>
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-8 space-y-6">
        {/* Main Concern Card */}
        <div className="bg-card rounded-lg p-4 sm:p-8 shadow-sm space-y-6">
          {/* Header row */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className={config.className}>
                <Icon className="mr-1 h-3 w-3" />
                {config.label}
              </Badge>
              {concern.solutionLevel && (
                <SolutionLevelBadge level={concern.solutionLevel} />
              )}
              {concern.aspects && concern.aspects.length > 0 && (
                <AspectBadges aspects={concern.aspects} />
              )}
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {formatDistanceToNow(concern.timestamp, { addSuffix: true })}
            </span>
          </div>

          {/* Author info (admin mode) */}
          {adminModeEnabled && concern.authorName && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{concern.authorName}</span>
              {concern.authorClass && (
                <Badge variant="secondary" className="text-xs">
                  {concern.authorClass}
                </Badge>
              )}
            </div>
          )}

          {/* Title and description */}
          <div>
            <h1 className="text-3xl font-bold mb-4 text-foreground">{concern.title}</h1>
            <p className="text-foreground leading-relaxed text-lg">{concern.description}</p>
          </div>

          {/* Vote and stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <VoteButton
                initialVotes={concern.votes}
                onVote={handleVote}
              />
              <span className="text-muted-foreground">
                {concern.replies.length} replies
              </span>
            </div>

            {/* Desktop action buttons */}
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant={activeAction === 'endorse' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleActionClick('endorse')}
                className="gap-1"
              >
                <ThumbsUp className="h-4 w-4" />
                Endorse
              </Button>
              <Button
                variant={activeAction === 'object' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleActionClick('object')}
                className="gap-1"
              >
                <ThumbsDown className="h-4 w-4" />
                Object
              </Button>
              <Button
                variant={activeAction === 'question' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleActionClick('question')}
                className="gap-1"
              >
                <HelpCircle className="h-4 w-4" />
                Ask Question
              </Button>
            </div>
          </div>
        </div>

        {/* Reply Form */}
        {showReplyForm && (
          <div className="bg-card rounded-lg p-4 sm:p-6 shadow-sm">
            <ReplyForm
              replyType={getReplyType()}
              onSubmit={handleReplySubmit}
              onCancel={() => {
                setShowReplyForm(false);
                setActiveAction(null);
              }}
              availableReplies={allRepliesFlat}
              parentConcernType={concern.type}
            />
          </div>
        )}

        {/* Replies Section */}
        {nonQuestionReplies.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Replies</h2>
            <ReplyThread
              replies={nonQuestionReplies}
              onReply={handleNestedReply}
              availableReplies={allRepliesFlat}
              openFormId={openReplyFormId}
              onFormToggle={setOpenReplyFormId}
              concernType={concern.type}
            />
          </div>
        )}

        {/* Q&A Section */}
        {questions.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Questions & Answers</h2>
            <QAAccordion questions={questions} />
          </div>
        )}

        {/* Empty state */}
        {concern.replies.length === 0 && !showReplyForm && (
          <div className="bg-card rounded-lg p-8 text-center text-muted-foreground">
            <p>No replies yet. Be the first to respond!</p>
          </div>
        )}
      </div>

      {/* Mobile Bottom Nav */}
      <MobileBottomNav
        concernDetailMode={true}
        activeAction={getMobileActiveAction()}
        onEndorse={() => handleActionClick('endorse')}
        onObject={() => handleActionClick('object')}
        onAskQuestion={() => handleActionClick('question')}
      />
    </div>
  );
};

export default ConcernDetail;
