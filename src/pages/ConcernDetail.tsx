import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VoteButton } from "@/components/VoteButton";
import { ReplyThread } from "@/components/ReplyThread";
import { ReplyForm } from "@/components/ReplyForm";
import { ArrowLeft, MessageSquare, AlertCircle, Lightbulb } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ReplyCategory } from "@/types/concern";
import { mockConcerns } from "@/data/mockData";

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
  both: {
    label: "Problem & Proposal",
    icon: Lightbulb,
    className: "bg-primary/10 text-primary border-primary/20",
  },
};

const ConcernDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showReplyForm, setShowReplyForm] = useState(false);
  
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

  const handleReply = (category: ReplyCategory, text: string) => {
    console.log("New reply:", { category, text });
    setShowReplyForm(false);
  };

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
            <Badge variant="outline" className={config.className}>
              <Icon className="mr-1 h-3 w-3" />
              {config.label}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(concern.timestamp, { addSuffix: true })}
            </span>
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-4 text-foreground">{concern.title}</h1>
            <p className="text-foreground leading-relaxed text-lg">{concern.description}</p>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-border">
            <VoteButton initialVotes={concern.votes} />
            <Button
              variant="outline"
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Add Response
            </Button>
          </div>

          {showReplyForm && (
            <ReplyForm
              onSubmit={handleReply}
              onCancel={() => setShowReplyForm(false)}
            />
          )}
        </div>

        {concern.replies.length > 0 && (
          <div className="mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Responses</h2>
            <ReplyThread
              replies={concern.replies}
              onReply={(parentId) => {
                console.log("Reply to:", parentId);
                setShowReplyForm(true);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ConcernDetail;
