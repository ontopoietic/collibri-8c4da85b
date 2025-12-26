import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BarChart3, Bell, Gauge, Network, Trophy, User, UserCircle, Settings, LogOut, FileText, MessageSquare, HelpCircle, Home, Eye, ShieldCheck, Compass } from "lucide-react";
import collibriLogo from "@/assets/collibri-logo.png";
import { QuotaDisplay } from "@/components/QuotaDisplay";
import { AdminPanel } from "@/components/AdminPanel";
import { useAdmin } from "@/contexts/AdminContext";
import { useTour } from "@/contexts/TourContext";
import { Switch } from "@/components/ui/switch";
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
  const { isAdmin, adminModeEnabled, toggleAdminMode } = useAdmin();
  const { startTour, hasCompleted, isActive: isTourActive } = useTour();
  const [quotaOpen, setQuotaOpen] = useState(false);

  // Listen for tour actions to control quota popover
  useEffect(() => {
    const handleTourAction = (event: CustomEvent<{ action: string }>) => {
      if (event.detail.action === 'openQuotaModal') {
        setQuotaOpen(true);
      } else if (event.detail.action === 'closeQuotaModal') {
        setQuotaOpen(false);
      }
    };

    window.addEventListener('tour-action', handleTourAction as EventListener);
    return () => window.removeEventListener('tour-action', handleTourAction as EventListener);
  }, []);

  // Close quota popover when tour ends
  useEffect(() => {
    if (!isTourActive) {
      setQuotaOpen(false);
    }
  }, [isTourActive]);
  
  const pathname = location.pathname;
  const isOnForum = pathname === "/";
  const isOnLeaderboard = pathname.startsWith("/leaderboard");
  const isOnStatistics = pathname === "/statistics";
  const isOnGraph = pathname === "/graph";
  const isOnNotifications = pathname === "/notifications";

  // Icon button accent color
  const iconButtonClass = "hover:bg-[#B3B9C7]/20 hover:text-[#B3B9C7]";
  const iconButtonActiveClass = "bg-[#B3B9C7]/20 text-[#B3B9C7]";

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
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className={iconButtonClass}
                  >
                    <Gauge className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto max-w-[calc(100vw-2rem)] p-0" align="end" withOverlay collisionPadding={16}>
                  <QuotaDisplay quota={defaultQuota} currentPhase={currentPhase} />
                </PopoverContent>
              </Popover>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate("/notifications")}
                className={cn(iconButtonClass, isOnNotifications && iconButtonActiveClass)}
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
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className={iconButtonClass}
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-popover">
                  {isAdmin && (
                    <>
                      <div className="flex items-center justify-between px-2 py-1.5">
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Admin Mode</span>
                        </div>
                        <Switch
                          checked={adminModeEnabled}
                          onCheckedChange={toggleAdminMode}
                          className="scale-75"
                        />
                      </div>
                      {adminModeEnabled && (
                        <div className="px-1 py-1">
                          <AdminPanel />
                        </div>
                      )}
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={startTour}>
                    <Compass className="mr-2 h-4 w-4" />
                    {hasCompleted ? "Restart Tour" : "Start Tour"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
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
            <div className="flex items-center gap-2" data-tour="navigation">
              {showNewConcernButton && onNewConcern && currentPhase === 'class' && (
                <div data-tour="new-concern">
                  <NewConcernDialog onSubmit={onNewConcern} />
                </div>
              )}
              {/* Forum */}
              <Button
                variant={isOnForum ? "default" : "outline"}
                onClick={() => navigate("/")}
                className={cn(
                  "gap-2 hover:text-white",
                  isOnForum && "bg-primary text-white hover:bg-primary/90"
                )}
              >
                <Home className="h-4 w-4" />
                <span className="hidden lg:inline">Forum</span>
              </Button>
              {/* Statistics */}
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
              {/* Leaderboard */}
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
              {/* Graph */}
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
              {/* My Quota - Icon only */}
              <Popover open={quotaOpen} onOpenChange={setQuotaOpen}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className={iconButtonClass}
                    data-tour="quota"
                  >
                    <Gauge className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end" withOverlay>
                  <QuotaDisplay quota={defaultQuota} currentPhase={currentPhase} />
                </PopoverContent>
              </Popover>
              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/notifications")}
                className={cn(iconButtonClass, isOnNotifications && iconButtonActiveClass)}
              >
                <Bell className="h-4 w-4" />
              </Button>
              {/* Profile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className={iconButtonClass}
                  >
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-popover">
                  {isAdmin && (
                    <>
                      <div className="flex items-center justify-between px-2 py-1.5">
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Admin Mode</span>
                        </div>
                        <Switch
                          checked={adminModeEnabled}
                          onCheckedChange={toggleAdminMode}
                          className="scale-75"
                        />
                      </div>
                      {adminModeEnabled && (
                        <div className="px-1 py-1">
                          <AdminPanel />
                        </div>
                      )}
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={startTour}>
                    <Compass className="mr-2 h-4 w-4" />
                    {hasCompleted ? "Restart Tour" : "Start Tour"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
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