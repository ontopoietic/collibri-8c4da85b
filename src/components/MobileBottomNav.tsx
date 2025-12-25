import { Button } from "@/components/ui/button";
import { MessageSquare, BarChart3, Plus, Target, Ban, HelpCircle, Trophy } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Phase } from "@/types/concern";
import { GlassOverlay } from "@/components/GlassOverlay";

interface MobileBottomNavProps {
  // Main navigation context
  onNewConcern?: () => void;
  isNewConcernOpen?: boolean;
  currentPhase?: Phase;
  onViewLeaderboard?: () => void;
  
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
  currentPhase,
  onViewLeaderboard,
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

  const isForumActive = location.pathname === '/' || 
    location.pathname.startsWith('/concern/') || 
    location.pathname.startsWith('/reply/');
  const isStatisticsActive = location.pathname === '/statistics';
  const isLeaderboardActive = location.pathname.startsWith('/leaderboard');

  if (concernDetailMode) {
    // Concern detail context: show action buttons
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <GlassOverlay direction="up" />
        <div className="relative flex items-center justify-around px-4 py-3 gap-2">
          <Button
            variant={activeAction === 'endorse' ? 'endorse' : 'ghost'}
            size="sm"
            onClick={onEndorse}
            className={activeAction === 'endorse' 
              ? "gap-1.5 bg-endorse text-endorse-foreground hover:bg-endorse-hover rounded-full px-4" 
              : "flex-col h-auto py-2 gap-1 text-white"
            }
          >
            <Target className="h-5 w-5" />
            {activeAction === 'endorse' && <span className="text-sm font-medium">Endorse</span>}
          </Button>

          <Button
            variant={activeAction === 'object' ? 'object' : 'ghost'}
            size="sm"
            onClick={onObject}
            className={activeAction === 'object' 
              ? "gap-1.5 bg-object text-object-foreground hover:bg-object rounded-full px-4" 
              : "flex-col h-auto py-2 gap-1 text-white"
            }
          >
            <Ban className="h-5 w-5" />
            {activeAction === 'object' && <span className="text-sm font-medium">Object</span>}
          </Button>

          <Button
            variant={activeAction === 'vote' ? 'question' : 'ghost'}
            size="sm"
            onClick={onAskQuestion}
            className={activeAction === 'vote' 
              ? "gap-1.5 bg-question text-question-foreground hover:bg-question rounded-full px-4" 
              : "flex-col h-auto py-2 gap-1 text-white"
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
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <GlassOverlay direction="up" />
      <div className="relative flex items-center justify-around px-4 py-3 gap-2">
        <Button
          variant={isForumActive ? 'default' : 'ghost'}
          size="sm"
          onClick={() => navigate('/')}
          className={isForumActive 
            ? "gap-1.5 bg-primary text-white hover:bg-primary rounded-full px-4" 
            : "flex-col h-auto py-2 gap-1 text-white"
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
            : "flex-col h-auto py-2 gap-1 text-white"
          }
        >
          <BarChart3 className="h-5 w-5" />
          {isStatisticsActive && <span className="text-sm font-medium">Statistics</span>}
        </Button>

        {currentPhase === 'class' ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={onNewConcern}
            className={cn(
              "h-auto py-2 gap-1.5",
              isNewConcernOpen 
                ? "bg-new-concern rounded-full px-4 flex-row" 
                : "flex-col text-white"
            )}
          >
            <Plus className={cn(
              "h-5 w-5",
              isNewConcernOpen 
                ? "text-new-concern-foreground" 
                : "text-white"
            )} />
            {isNewConcernOpen && <span className="text-sm font-medium text-new-concern-foreground">New</span>}
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewLeaderboard}
            className={cn(
              "h-auto py-2 gap-1.5",
              isLeaderboardActive 
                ? "bg-amber-600 rounded-full px-4 flex-row" 
                : "flex-col text-white"
            )}
          >
            <Trophy className={cn(
              "h-5 w-5",
              isLeaderboardActive 
                ? "text-white" 
                : "text-white"
            )} />
            {isLeaderboardActive && <span className="text-sm font-medium text-white">Leaders</span>}
          </Button>
        )}
      </div>
    </div>
  );
};
