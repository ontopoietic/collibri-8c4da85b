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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, MessageSquare, AlertTriangle, Lightbulb, Scale, HelpCircle, Handshake, Zap, ExternalLink, Filter, ArrowUpDown, Check, Trash2, User } from "lucide-react";
import { SolutionLevelBadge } from "@/components/SolutionLevelBadge";
import { TypeIconPrefix } from "@/components/TypeIconPrefix";
import { formatDistanceToNow } from "date-fns";
import { ReplyCategory, Reply, ReplyReference, SolutionLevel } from "@/types/concern";
import { mockConcerns } from "@/data/mockData";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { GlassOverlay } from "@/components/GlassOverlay";
import { MobileFormDrawer } from "@/components/MobileFormDrawer";
import { useAdmin } from "@/contexts/AdminContext";
import QAAccordion from "@/components/QAAccordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const { adminModeEnabled } = useAdmin();
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

  // Handle scroll to reply on mount if specified, otherwise scroll to top
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
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [id, location.state]);

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
            <span className="hidden sm:inline">
              {navigationHistory.length <= 1 || (navigationHistory.length > 1 && navigationHistory[navigationHistory.length - 2] === "/") ? "Back to Forum" : "Back"}
            </span>
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-8">

        <div className="bg-card rounded-lg p-4 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-start justify-between gap-4">
            {/* Hide aspect badges when inline type icons will be shown */}
            {!((concern.problemText || concern.aspects?.includes("problem")) || (concern.proposalText || concern.aspects?.includes("proposal"))) && (
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
            )}
            <span className="text-xs text-muted-foreground ml-auto">
              {formatDistanceToNow(concern.timestamp, { addSuffix: true })}
            </span>
          </div>

          {adminModeEnabled && concern.authorName && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-2 py-1 rounded-md w-fit">
              <User className="h-3.5 w-3.5" />
              <span>{concern.authorName}</span>
              {concern.authorClass && (
                <Badge variant="outline" className="text-xs px-1.5 py-0">
                  {concern.authorClass.toUpperCase()}
                </Badge>
              )}
            </div>
          )}

          <div>
            <h1 className="text-3xl font-bold text-foreground mb-4">{concern.title}</h1>
            
            {/* Show inline sections based on available content */}
            {(concern.problemText || concern.aspects?.includes("problem")) || (concern.proposalText || concern.aspects?.includes("proposal")) ? (
              <div className="space-y-4">
                {/* Problem Section - show if problemText exists OR has problem aspect */}
                {(concern.problemText || concern.aspects?.includes("problem")) && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <TypeIconPrefix type="problem" size="sm" />
                      <h2 className="text-base font-semibold text-foreground">Problem</h2>
                    </div>
                    <p className="text-foreground leading-relaxed">
                      {concern.problemText || concern.description}
                    </p>
                  </div>
                )}
                
                {/* Proposal Section - show if proposalText exists OR has proposal aspect */}
                {(concern.proposalText || concern.aspects?.includes("proposal")) && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <TypeIconPrefix type="proposal" size="sm" />
                      <h2 className="text-base font-semibold text-foreground">Proposal</h2>
                    </div>
                    <p className="text-foreground leading-relaxed">
                      {concern.proposalText || concern.description}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* Fallback for concerns without aspects - show type icon with description */
              <div className="flex items-start gap-2">
                <TypeIconPrefix type={concern.type} size="sm" />
                <p className="text-foreground leading-relaxed text-lg">{concern.description}</p>
              </div>
            )}
          </div>

          {concern.solutionLevel && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Solution Level:</span>
              <SolutionLevelBadge level={concern.solutionLevel} />
            </div>
          )}

          {(concern.referencedOriginalPostId || concern.referencedObjectionId) && (
            <div className="bg-muted p-4 rounded-lg space-y-3 overflow-hidden">
              <p className="text-sm font-medium">References:</p>
              <div className="flex flex-wrap gap-2 max-w-full">
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
                          <span className="max-w-[150px] sm:max-w-[200px] truncate">{content.title}</span>
                        </>
                      ) : (
                        <>
                          <CategoryBadge category={content.category} />
                          <span className="max-w-[150px] sm:max-w-[200px] truncate">{content.text}</span>
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
                          <span className="max-w-[150px] sm:max-w-[200px] truncate">{content.title}</span>
                        </>
                      ) : (
                        <>
                          <CategoryBadge category={content.category} />
                          <span className="max-w-[150px] sm:max-w-[200px] truncate">{content.text}</span>
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
            <Button
              variant="endorse"
              size={isMobile ? "sm" : "default"}
              onClick={() => {
                setReplyType('endorse');
                setShowReplyForm(!(showReplyForm && replyType === 'endorse'));
                setReplyToId(null);
              }}
              className={cn(
                "gap-2",
                showReplyForm && replyType === 'endorse'
                  ? "bg-endorse-hover text-endorse-foreground"
                  : ""
              )}
            >
            <Handshake className="h-4 w-4" />
            {!isMobile && "Endorse"}
            </Button>
            <Button
              variant="object"
              size={isMobile ? "sm" : "default"}
              onClick={() => {
                setReplyType('object');
                setShowReplyForm(!(showReplyForm && replyType === 'object'));
                setReplyToId(null);
              }}
              className={cn(
                "gap-2",
                showReplyForm && replyType === 'object'
                  ? "bg-object text-object-foreground"
                  : ""
              )}
            >
            <Zap className="h-4 w-4" />
            {!isMobile && "Object"}
            </Button>
            <Button
              variant="question"
              size={isMobile ? "sm" : "default"}
              onClick={() => {
                setReplyType('question');
                setShowReplyForm(!(showReplyForm && replyType === 'question'));
                setReplyToId(null);
              }}
              className={cn(
                "gap-2",
                showReplyForm && replyType === 'question'
                  ? "bg-question hover:bg-question"
                  : ""
              )}
            >
              <HelpCircle className="h-4 w-4" />
              {!isMobile && "Ask Question"}
            </Button>
            {adminModeEnabled && (
              <Button
                variant="destructive"
                size="sm"
                className="gap-2 ml-auto"
                onClick={() => {
                  console.log("Delete concern:", concern.id);
                  // In production, this would call an API to delete the concern
                }}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            )}
          </div>

          {/* Reply Form - inline on desktop, drawer on mobile */}
          {showReplyForm && !isMobile && (
            <ReplyForm
              onSubmit={handleReply}
              onCancel={() => {
                setShowReplyForm(false);
                setReplyToId(null);
                setActiveAction(null);
              }}
              replyType={replyType}
              originalText={replyToTarget?.text ?? concern.description}
              availableReplies={availableReplies}
              parentConcernType={concern.type}
            />
          )}
        </div>

        {/* Mobile Reply Form Drawer */}
        {isMobile && (
          <MobileFormDrawer
            isOpen={showReplyForm}
            onClose={() => {
              setShowReplyForm(false);
              setReplyToId(null);
              setActiveAction(null);
            }}
            title={replyType === 'endorse' ? 'Endorse' : replyType === 'object' ? 'Object' : 'Ask Question'}
          >
            <ReplyForm
              onSubmit={(category, text, referencedReplies, counterProposal) => {
                handleReply(category, text, referencedReplies, counterProposal);
                setActiveAction(null);
              }}
              onCancel={() => {
                setShowReplyForm(false);
                setReplyToId(null);
                setActiveAction(null);
              }}
              replyType={replyType}
              originalText={replyToTarget?.text ?? concern.description}
              availableReplies={availableReplies}
              parentConcernType={concern.type}
            />
          </MobileFormDrawer>
        )}

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
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <h2 className="text-2xl font-bold text-foreground">Responses</h2>
                  <div className="flex gap-2">
                    {isMobile ? (
                      <>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                              <Filter className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setFilterCategory("all")}>
                              {filterCategory === "all" && <Check className="h-4 w-4 mr-2" />}
                              <span className={cn(filterCategory !== "all" && "ml-6")}>All Categories</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterCategory("objection")}>
                              {filterCategory === "objection" && <Check className="h-4 w-4 mr-2" />}
                              <span className={cn(filterCategory !== "objection" && "ml-6")}>Objections</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterCategory("proposal")}>
                              {filterCategory === "proposal" && <Check className="h-4 w-4 mr-2" />}
                              <span className={cn(filterCategory !== "proposal" && "ml-6")}>Proposals</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterCategory("pro-argument")}>
                              {filterCategory === "pro-argument" && <Check className="h-4 w-4 mr-2" />}
                              <span className={cn(filterCategory !== "pro-argument" && "ml-6")}>Pro-Arguments</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterCategory("variant")}>
                              {filterCategory === "variant" && <Check className="h-4 w-4 mr-2" />}
                              <span className={cn(filterCategory !== "variant" && "ml-6")}>Variants</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                              <ArrowUpDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSortBy("newest")}>
                              {sortBy === "newest" && <Check className="h-4 w-4 mr-2" />}
                              <span className={cn(sortBy !== "newest" && "ml-6")}>Newest</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortBy("oldest")}>
                              {sortBy === "oldest" && <Check className="h-4 w-4 mr-2" />}
                              <span className={cn(sortBy !== "oldest" && "ml-6")}>Oldest</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortBy("popularity")}>
                              {sortBy === "popularity" && <Check className="h-4 w-4 mr-2" />}
                              <span className={cn(sortBy !== "popularity" && "ml-6")}>Popularity</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </>
                    ) : (
                      <>
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
                      </>
                    )}
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
                    concernType={concern.type}
                    concernId={concern.id}
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
                  <QAAccordion questions={questions} />
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
        currentPhase={concern.phase}
        onNewConcern={() => setShowReplyForm(true)}
        isNewConcernOpen={showReplyForm}
        onViewLeaderboard={() => navigate('/leaderboard')}
      />
    </div>
  );
};

export default ConcernDetail;
