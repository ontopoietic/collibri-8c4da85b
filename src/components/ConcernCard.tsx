import { Concern } from "@/types/concern";
import { Card } from "@/components/ui/card";
import { AspectBadges } from "@/components/AspectBadges";
import { SolutionLevelBadge } from "@/components/SolutionLevelBadge";
import { TypeIconPrefix } from "@/components/TypeIconPrefix";
import { MessageSquare, ThumbsUp, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";

interface ConcernCardProps {
  concern: Concern;
}


export const ConcernCard = ({ concern }: ConcernCardProps) => {
  const navigate = useNavigate();
  const { adminModeEnabled } = useAdmin();
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
            {concern.aspects && concern.aspects.length > 0 && (
              <AspectBadges aspects={concern.aspects} />
            )}
            {concern.solutionLevel && (
              <SolutionLevelBadge level={concern.solutionLevel} />
            )}
          </div>
          <span className="text-xs text-muted-foreground">
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
          <div className="flex items-start gap-2 mb-2">
            <TypeIconPrefix type={concern.type} />
            <h3 className="text-xl font-semibold text-foreground">{concern.title}</h3>
          </div>
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
