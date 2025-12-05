import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BarChart3, Bell, ChartNoAxesCombined, Network, Trophy, User, UserCircle, Settings, LogOut, FileText, MessageSquare, HelpCircle } from "lucide-react";
import collibriLogo from "@/assets/collibri-logo.png";
import { QuotaDisplay } from "@/components/QuotaDisplay";
import { AdminPanel } from "@/components/AdminPanel";
import { AdminModeToggle } from "@/components/AdminModeToggle";
import { useAdmin } from "@/contexts/AdminContext";
import { NewConcernDialog } from "@/components/NewConcernDialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { GlassOverlay } from "@/components/GlassOverlay";
import { cn } from "@/lib/utils";
import { Phase, ConcernType, SolutionLevel, UserQuota } from "@/types/concern";

interface NavigationHeaderProps {
  currentPhase?: Phase;
  quota?: UserQuota;
  onNewConcern?: (type: ConcernType, title: string, description: string, solutionLevel?: SolutionLevel) => void;
  showNewConcernButton?: boolean;
}

export const NavigationHeader = ({ 
  currentPhase = "class",
  quota,
  onNewConcern,
  showNewConcernButton = false,
}: NavigationHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { isAdmin, adminModeEnabled } = useAdmin();
  
  const pathname = location.pathname;
  const isOnLeaderboard = pathname.startsWith("/leaderboard");
  const isOnStatistics = pathname === "/statistics";
  const isOnGraph = pathname === "/graph";
  const isOnNotifications = pathname === "/notifications";

  const defaultQuota: UserQuota = quota || {
    concerns: { used: 0, total: 3 },
    votes: { used: 0, total: 10 },
    variants: { used: 0, total: 3 },
    proposals: { used: 0, total: 3 },
    proArguments: { used: 0, total: 5 },
    objections: { used: 0, total: 5 },
    questions: { used: 0, total: 3 },
  };

  return (
    <header className="sticky top-0 z-50">
      <GlassOverlay direction="down" />
      <div className="relative max-w-6xl mx-auto px-4 py-4 md:py-6">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center gap-2 md:gap-3 cursor-pointer" 
            onClick={() => navigate("/")}
          >
            <img src={collibriLogo} alt="Collibri" className="h-10 w-10 md:h-12 md:w-12" />
            <h1 className="text-xl md:text-3xl font-bold text-foreground">Collibri</h1>
          </div>
          
          {/* Mobile Header Icons */}
          {isMobile && (
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <ChartNoAxesCombined className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto max-w-[calc(100vw-2rem)] p-0" align="end" withOverlay>
                  <QuotaDisplay quota={defaultQuota} currentPhase={currentPhase} />
                </PopoverContent>
              </Popover>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate("/notifications")}
                className={cn(isOnNotifications && "bg-muted")}
              >
                <Bell className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate("/graph")}
                className={cn(isOnGraph && "bg-secondary-action text-secondary-action-foreground")}
              >
                <Network className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    <UserCircle className="mr-2 h-4 w-4" />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Help
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Send feedback
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileText className="mr-2 h-4 w-4" />
                    Terms of use
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="flex items-center gap-2">
              {isAdmin && (
                <div className="flex items-center gap-2 mr-6">
                  {adminModeEnabled && <AdminPanel />}
                  <AdminModeToggle />
                </div>
              )}
              {showNewConcernButton && onNewConcern && currentPhase === 'class' && (
                <NewConcernDialog onSubmit={onNewConcern} />
              )}
              <Button
                variant="leaderboard"
                onClick={() => navigate(`/leaderboard/${currentPhase}`)}
                className={cn(
                  "gap-2",
                  isOnLeaderboard && "bg-leaderboard text-leaderboard-foreground hover:bg-leaderboard/90"
                )}
              >
                <Trophy className="h-4 w-4" />
                <span className="hidden lg:inline">Leaderboard</span>
              </Button>
              <Button
                variant="statistics"
                onClick={() => navigate("/statistics")}
                className={cn(
                  "gap-2",
                  isOnStatistics && "bg-statistics text-statistics-foreground hover:bg-statistics/90"
                )}
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden lg:inline">Statistics</span>
              </Button>
              <Button
                variant="secondary-action"
                onClick={() => navigate("/graph")}
                className={cn(
                  "gap-2",
                  isOnGraph && "bg-secondary-action text-secondary-action-foreground hover:bg-secondary-action/90"
                )}
              >
                <Network className="h-4 w-4" />
                <span className="hidden lg:inline">Graph</span>
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="secondary-action" className="gap-2">
                    <ChartNoAxesCombined className="h-4 w-4" />
                    <span className="hidden lg:inline">My Quota</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end" withOverlay>
                  <QuotaDisplay quota={defaultQuota} currentPhase={currentPhase} />
                </PopoverContent>
              </Popover>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/notifications")}
                className={cn(isOnNotifications && "bg-muted")}
              >
                <Bell className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    <UserCircle className="mr-2 h-4 w-4" />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Help
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Send feedback
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileText className="mr-2 h-4 w-4" />
                    Terms of use
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
