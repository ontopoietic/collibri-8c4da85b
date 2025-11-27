import { Concern } from "@/types/concern";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AspectBadges } from "@/components/AspectBadges";
import { MessageSquare, AlertCircle, Lightbulb, Scale, ThumbsUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

interface ConcernCardProps {
  concern: Concern;
}

const typeConfig = {
  problem: {
    label: "Problem",
    icon: AlertCircle,
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

export const ConcernCard = ({ concern }: ConcernCardProps) => {
  const navigate = useNavigate();
  const config = typeConfig[concern.type];
  const Icon = config.icon;
  const totalReplies = concern.replies.reduce((acc, reply) => {
    const countReplies = (r: typeof reply): number => {
      return 1 + r.replies.reduce((sum, child) => sum + countReplies(child), 0);
    };
    return acc + countReplies(reply);
  }, 0);

  return (
    <Card
      className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => navigate(`/concern/${concern.id}`)}
    >
      <div className="space-y-4">
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
          <h3 className="text-xl font-semibold mb-2 text-foreground">{concern.title}</h3>
          <p className="text-muted-foreground line-clamp-3">{concern.description}</p>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <div className="flex items-center gap-1 text-muted-foreground">
            <ThumbsUp className="h-4 w-4" />
            <span className="text-sm font-semibold">{concern.votes}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <MessageSquare className="h-4 w-4" />
            <span className="text-sm">{totalReplies}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
