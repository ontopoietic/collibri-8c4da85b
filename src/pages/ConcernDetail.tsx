import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CategoryBadge } from "@/components/CategoryBadge";
import { VoteButton } from "@/components/VoteButton";
import { ReplyThread } from "@/components/ReplyThread";
import { ReplyForm } from "@/components/ReplyForm";
import { AspectBadges } from "@/components/AspectBadges";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, MessageSquare, AlertTriangle, Lightbulb, Scale, HelpCircle, ThumbsUp, ThumbsDown, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ReplyCategory, Reply, ReplyReference, SolutionLevel } from "@/types/concern";
import { mockConcerns } from "@/data/mockData";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const location = useLocation();
  const isMobile = useIsMobile();
  const [navigationHistory, setNavigationHistory] = useState<string[]>([]);

  useEffect(() => {
    // Track navigation history for nested back navigation
    const currentPath = location.pathname;
    setNavigationHistory((prev) => {
      const lastPath = prev[prev.length - 1];
      if (lastPath !== currentPath) {
        return [...prev, currentPath];
      }
      return prev;
    });
  }, [location.pathname]);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyType, setReplyType] = useState<'endorse' | 'object' | 'question'>('endorse');
  const [activeAction, setActiveAction] = useState<'endorse' | 'object' | 'vote' | null>(null);
  const [filterCategory, setFilterCategory] = useState<ReplyCategory | "all">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "popularity">("newest");
  const [hasVoted, setHasVoted] = useState(false);
  const [remainingVotes, setRemainingVotes] = useState(10);
  
  const concern = mockConcerns.find((c) => c.id === id);

  if (!concern) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Concern not found</h2>
          <Button onClick={() => navigate("/")}>Return to Feed</Button>
        </div>
      </div>
    );
  }

  const config = typeConfig[concern.type];
  const Icon = config.icon;

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

  const findReplyById = (replies: Reply[], id: string): Reply | null => {
    for (const reply of replies) {
      if (reply.id === id) return reply;
      const found = findReplyById(reply.replies, id);
      if (found) return found;
    }
    return null;
  };

  const replyToTarget = replyToId ? findReplyById(concern.replies, replyToId) : null;
  const availableReplies = getAllReplies(concern.replies);

  const handleBackNavigation = () => {
    if (navigationHistory.length > 1) {
      // Remove current page and go to previous
      const newHistory = [...navigationHistory];
      newHistory.pop(); // Remove current
      const previousPath = newHistory[newHistory.length - 1];
      if (previousPath && previousPath !== location.pathname) {
        setNavigationHistory(newHistory);
        navigate(previousPath);
        return;
      }
    }
    // Fallback to forum
    navigate("/");
  };

  const getReferencedContent = (refId: string) => {
    // Try to find in concerns first
    const referencedConcern = mockConcerns.find(c => c.id === refId);
    if (referencedConcern) {
      return {
        type: 'concern' as const,
        title: referencedConcern.title,
        id: refId
      };
    }
    
    // Try to find in replies
    const findInReplies = (replies: Reply[]): Reply | null => {
      for (const reply of replies) {
        if (reply.id === refId) return reply;
        const found = findReplyById(reply.replies, refId);
        if (found) return found;
      }
      return null;
    };

    // Search in all concerns' replies
    for (const c of mockConcerns) {
      const reply = findInReplies(c.replies);
      if (reply) {
        return {
          type: 'reply' as const,
          text: reply.text,
          category: reply.category,
          concernId: c.id,
          replyId: refId
        };
      }
    }
    
    return null;
  };

  const handleReferenceClick = (refId: string) => {
    const content = getReferencedContent(refId);
    if (!content) return;

    if (content.type === 'concern') {
      navigate(`/concern/${content.id}`);
    } else {
      // Navigate to the concern and scroll to the reply
      navigate(`/concern/${content.concernId}`, { state: { scrollToReply: content.replyId } });
    }
  };

  // Handle scroll to reply on mount if specified
  useEffect(() => {
    const state = location.state as { scrollToReply?: string } | undefined;
    if (state?.scrollToReply) {
      setTimeout(() => {
        const element = document.getElementById(`reply-${state.scrollToReply}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.classList.add("ring-2", "ring-primary");
          setTimeout(() => {
            element.classList.remove("ring-2", "ring-primary");
          }, 2000);
        }
      }, 100);
    }
  }, [location.state]);

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

  const sortReplies = (replies: Reply[]): Reply[] => {
    const sorted = [...replies].sort((a, b) => {
      if (sortBy === "popularity") return b.votes - a.votes;
      if (sortBy === "oldest") return a.timestamp.getTime() - b.timestamp.getTime();
      return b.timestamp.getTime() - a.timestamp.getTime();
    });
    
    return sorted.map(reply => ({
      ...reply,
      replies: sortReplies(reply.replies)
    }));
  };

  const filterReplies = (replies: Reply[], excludeCategory?: ReplyCategory): Reply[] => {
    return replies
      .filter(reply => {
        if (excludeCategory && reply.category === excludeCategory) return false;
        return filterCategory === "all" || reply.category === filterCategory;
      })
      .map(reply => ({
        ...reply,
        replies: filterReplies(reply.replies, excludeCategory)
      }));
  };

  const regularReplies = sortReplies(filterReplies(concern?.replies || [], "question"));
  const questions = sortReplies(concern?.replies.filter(r => r.category === "question") || []);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={handleBackNavigation}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {navigationHistory.length <= 1 || (navigationHistory.length > 1 && navigationHistory[navigationHistory.length - 2] === "/") ? "Back to Forum" : "Back"}
        </Button>

        <div className="bg-card rounded-lg p-8 shadow-sm space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              {concern.aspects && concern.aspects.length > 0 ? (
                <AspectBadges aspects={concern.aspects} />
              ) : (
                <Badge variant="outline" className={config.className}>
                  <Icon className="mr-1 h-3 w-3" />
                  {config.label}
                </Badge>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(concern.timestamp, { addSuffix: true })}
            </span>
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-4 text-foreground">{concern.title}</h1>
            <p className="text-foreground leading-relaxed text-lg">{concern.description}</p>
          </div>

          {concern.solutionLevel && (
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm font-medium">
                Solution Level: <Badge variant="outline">{concern.solutionLevel === "school" ? "School" : "Ministries"}</Badge>
              </p>
            </div>
          )}

          {(concern.referencedOriginalPostId || concern.referencedObjectionId) && (
            <div className="bg-muted p-4 rounded-lg space-y-3">
              <p className="text-sm font-medium">References:</p>
              <div className="flex flex-wrap gap-2">
                {concern.referencedOriginalPostId && (() => {
                  const content = getReferencedContent(concern.referencedOriginalPostId);
                  if (!content) return null;
                  
                  return (
                    <Badge
                      variant="outline"
                      className="cursor-pointer hover:bg-muted transition-colors gap-1"
                      onClick={() => handleReferenceClick(concern.referencedOriginalPostId!)}
                    >
                      {content.type === 'concern' ? (
                        <>
                          <span className="text-xs font-medium">Original:</span>
                          <span className="max-w-[200px] truncate">{content.title}</span>
                        </>
                      ) : (
                        <>
                          <CategoryBadge category={content.category} />
                          <span className="max-w-[200px] truncate">{content.text}</span>
                        </>
                      )}
                      <ExternalLink className="h-3 w-3" />
                    </Badge>
                  );
                })()}
                {concern.referencedObjectionId && (() => {
                  const content = getReferencedContent(concern.referencedObjectionId);
                  if (!content) return null;
                  
                  return (
                    <Badge
                      variant="outline"
                      className="cursor-pointer hover:bg-muted transition-colors gap-1"
                      onClick={() => handleReferenceClick(concern.referencedObjectionId!)}
                    >
                      {content.type === 'concern' ? (
                        <>
                          <span className="text-xs font-medium">Objection:</span>
                          <span className="max-w-[200px] truncate">{content.title}</span>
                        </>
                      ) : (
                        <>
                          <CategoryBadge category={content.category} />
                          <span className="max-w-[200px] truncate">{content.text}</span>
                        </>
                      )}
                      <ExternalLink className="h-3 w-3" />
                    </Badge>
                  );
                })()}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <VoteButton 
              initialVotes={concern.votes} 
              hasVotedInitially={hasVoted}
              remainingVotes={remainingVotes}
              onVote={(isAdding) => {
                setHasVoted(isAdding);
                setRemainingVotes(prev => isAdding ? prev - 1 : prev + 1);
              }}
            />
            {!isMobile && (
              <>
                <Button
                  variant="endorse"
                  onClick={() => {
                    setReplyType('endorse');
                    setShowReplyForm(true);
                    setReplyToId(null);
                  }}
                  className="gap-2 bg-endorse text-endorse-foreground hover:bg-endorse-hover"
                >
                  <ThumbsUp className="h-4 w-4" />
                  Endorse
                </Button>
                <Button
                  variant="object"
                  onClick={() => {
                    setReplyType('object');
                    setShowReplyForm(true);
                    setReplyToId(null);
                  }}
                  className="gap-2"
                >
                  <ThumbsDown className="h-4 w-4" />
                  Object
                </Button>
                <Button
                  variant="question"
                  size="sm"
                  onClick={() => {
                    setReplyType('question');
                    setShowReplyForm(true);
                    setReplyToId(null);
                  }}
                  className="gap-2"
                >
                  <HelpCircle className="h-4 w-4" />
                  Ask Question
                </Button>
              </>
            )}
          </div>

          {showReplyForm && (
            <ReplyForm
              onSubmit={handleReply}
              onCancel={() => {
                setShowReplyForm(false);
                setReplyToId(null);
              }}
              replyType={replyType}
              originalText={replyToTarget?.text ?? concern.description}
              availableReplies={availableReplies}
            />
          )}
        </div>

        {concern.replies.length > 0 && (
          <div className="mt-8">
            <Tabs defaultValue="responses" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="responses">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Responses ({regularReplies.length})
                </TabsTrigger>
                <TabsTrigger value="questions">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Q&A ({questions.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="responses" className="space-y-4 mt-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-foreground">Responses</h2>
                  <div className="flex gap-2">
                    <Select value={filterCategory} onValueChange={(value: any) => setFilterCategory(value)}>
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Filter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="objection">Objections</SelectItem>
                        <SelectItem value="proposal">Proposals</SelectItem>
                        <SelectItem value="pro-argument">Pro-Arguments</SelectItem>
                        <SelectItem value="variant">Variants</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Sort" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="oldest">Oldest</SelectItem>
                        <SelectItem value="popularity">Popularity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {regularReplies.length > 0 ? (
                  <ReplyThread
                    replies={regularReplies}
                    onReply={(parentId, type = 'question') => {
                      setReplyToId(parentId);
                      setReplyType(type);
                      setShowReplyForm(true);
                    }}
                    availableReplies={availableReplies}
                  />
                ) : (
                  <p className="text-muted-foreground text-center py-8">No responses yet. Be the first to respond!</p>
                )}
              </TabsContent>

              <TabsContent value="questions" className="space-y-4 mt-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-foreground">Questions & Answers</h2>
                  <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Sort" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="oldest">Oldest</SelectItem>
                      <SelectItem value="popularity">Popularity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {questions.length > 0 ? (
                  <ReplyThread
                    replies={questions}
                    onReply={(parentId, type = 'question') => {
                      setReplyToId(parentId);
                      setReplyType(type);
                      setShowReplyForm(true);
                    }}
                    availableReplies={availableReplies}
                  />
                ) : (
                  <p className="text-muted-foreground text-center py-8">No questions yet. Ask the first question!</p>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        concernDetailMode={true}
        activeAction={activeAction}
        onEndorse={() => {
          setActiveAction(activeAction === 'endorse' ? null : 'endorse');
          setReplyType('endorse');
          setShowReplyForm(activeAction !== 'endorse');
          setReplyToId(null);
        }}
        onObject={() => {
          setActiveAction(activeAction === 'object' ? null : 'object');
          setReplyType('object');
          setShowReplyForm(activeAction !== 'object');
          setReplyToId(null);
        }}
        onAskQuestion={() => {
          setActiveAction(activeAction === 'vote' ? null : 'vote');
          setReplyType('question');
          setShowReplyForm(activeAction !== 'vote');
          setReplyToId(null);
        }}
      />
    </div>
  );
};

export default ConcernDetail;
