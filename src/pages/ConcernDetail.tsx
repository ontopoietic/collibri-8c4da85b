import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VoteButton } from "@/components/VoteButton";
import { ReplyThread } from "@/components/ReplyThread";
import { ReplyForm } from "@/components/ReplyForm";
import { AspectBadges } from "@/components/AspectBadges";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, MessageSquare, AlertCircle, Lightbulb, Scale, HelpCircle, ThumbsUp, ThumbsDown } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ReplyCategory, Reply, ReplyReference, SolutionLevel } from "@/types/concern";
import { mockConcerns } from "@/data/mockData";
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
    icon: AlertCircle,
    className: "bg-destructive/10 text-destructive border-destructive/20",
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
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyType, setReplyType] = useState<'endorse' | 'object' | 'question'>('endorse');
  const [filterCategory, setFilterCategory] = useState<ReplyCategory | "all">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "popularity">("newest");
  
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
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Feed
        </Button>

        <div className="bg-card rounded-lg p-8 shadow-sm space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className={config.className}>
                <Icon className="mr-1 h-3 w-3" />
                {config.label}
              </Badge>
              {concern.aspects && concern.aspects.length > 0 && (
                <AspectBadges aspects={concern.aspects} />
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

          {(concern.referencedProblemId || concern.referencedObjectionId) && (
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p className="text-sm font-medium">References:</p>
              {concern.referencedOriginalPostId && (
                <p className="text-sm text-muted-foreground">
                  Original post: #{concern.referencedOriginalPostId}
                </p>
              )}
              {concern.referencedObjectionId && (
                <p className="text-sm text-muted-foreground">
                  In response to objection: #{concern.referencedObjectionId}
                </p>
              )}
            </div>
          )}

          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <VoteButton initialVotes={concern.votes} />
            <Button
              variant="default"
              onClick={() => {
                setReplyType('endorse');
                setShowReplyForm(true);
                setReplyToId(null);
              }}
              className="gap-2"
            >
              <ThumbsUp className="h-4 w-4" />
              Endorse
            </Button>
            <Button
              variant="outline"
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
              variant="ghost"
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
    </div>
  );
};

export default ConcernDetail;
