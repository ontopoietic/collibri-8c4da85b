import { Button } from "@/components/ui/button";
import { MessageSquare, BarChart3, Plus, ThumbsUp, ThumbsDown, HelpCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface MobileBottomNavProps {
  // Main navigation context
  onNewConcern?: () => void;
  isNewConcernOpen?: boolean;
  
  // Concern detail context
  concernDetailMode?: boolean;
  activeAction?: 'endorse' | 'object' | 'vote' | null;
  onEndorse?: () => void;
  onObject?: () => void;
  onVote?: () => void;
  onAskQuestion?: () => void;
}

export const MobileBottomNav = ({
  onNewConcern,
  isNewConcernOpen = false,
  concernDetailMode = false,
  activeAction = null,
  onEndorse,
  onObject,
  onVote,
  onAskQuestion,
}: MobileBottomNavProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  const isForumActive = location.pathname === '/';
  const isStatisticsActive = location.pathname === '/statistics';

  if (concernDetailMode) {
    // Concern detail context: show action buttons
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-t border-border">
        <div className="flex items-center justify-around px-4 py-3 gap-2">
          <Button
            variant={activeAction === 'endorse' ? 'endorse' : 'ghost'}
            size="sm"
            onClick={onEndorse}
            className={activeAction === 'endorse' 
              ? "gap-1.5 bg-endorse text-endorse-foreground hover:bg-endorse-hover rounded-full px-4" 
              : "flex-col h-auto py-2 gap-1"
            }
          >
            <ThumbsUp className="h-5 w-5" />
            {activeAction === 'endorse' && <span className="text-sm font-medium">Endorse</span>}
          </Button>

          <Button
            variant={activeAction === 'object' ? 'object' : 'ghost'}
            size="sm"
            onClick={onObject}
            className={activeAction === 'object' 
              ? "gap-1.5 bg-object text-object-foreground hover:bg-object rounded-full px-4" 
              : "flex-col h-auto py-2 gap-1"
            }
          >
            <ThumbsDown className="h-5 w-5" />
            {activeAction === 'object' && <span className="text-sm font-medium">Object</span>}
          </Button>

          <Button
            variant={activeAction === 'vote' ? 'vote' : 'ghost'}
            size="sm"
            onClick={onVote}
            className={activeAction === 'vote' 
              ? "gap-1.5 bg-vote text-vote-foreground hover:bg-vote rounded-full px-4" 
              : "flex-col h-auto py-2 gap-1"
            }
          >
            <HelpCircle className="h-5 w-5" />
            {activeAction === 'vote' && <span className="text-sm font-medium">Ask</span>}
          </Button>
        </div>
      </div>
    );
  }

  // Main navigation context: show forum, statistics, new concern
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-t border-border">
      <div className="flex items-center justify-around px-4 py-3 gap-2">
        <Button
          variant={isForumActive ? 'default' : 'ghost'}
          size="sm"
          onClick={() => navigate('/')}
          className={isForumActive 
            ? "gap-1.5 bg-primary text-primary-foreground hover:bg-primary rounded-full px-4" 
            : "flex-col h-auto py-2 gap-1"
          }
        >
          <MessageSquare className="h-5 w-5" />
          {isForumActive && <span className="text-sm font-medium">Forum</span>}
        </Button>

        <Button
          variant={isStatisticsActive ? 'statistics' : 'ghost'}
          size="sm"
          onClick={() => navigate('/statistics')}
          className={isStatisticsActive 
            ? "gap-1.5 bg-statistics text-statistics-foreground hover:bg-statistics rounded-full px-4" 
            : "flex-col h-auto py-2 gap-1"
          }
        >
          <BarChart3 className="h-5 w-5" />
          {isStatisticsActive && <span className="text-sm font-medium">Statistics</span>}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onNewConcern}
          className="flex-col h-auto py-2 gap-1 relative"
        >
          <div className={cn(
            "rounded-full p-1.5 transition-colors",
            isNewConcernOpen 
              ? "bg-new-concern" 
              : "bg-transparent"
          )}>
            <Plus className={cn(
              "h-5 w-5",
              isNewConcernOpen 
                ? "text-new-concern-foreground" 
                : "text-new-concern"
            )} />
          </div>
        </Button>
      </div>
    </div>
  );
};
