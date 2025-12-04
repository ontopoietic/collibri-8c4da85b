import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { UserQuota, Phase } from "@/types/concern";
import { AlertCircle, Lightbulb, ThumbsUp, GitBranch, Flag, HelpCircle } from "lucide-react";

interface QuotaDisplayProps {
  quota: UserQuota;
  currentPhase?: Phase;
}

const QuotaItem = ({ 
  config, 
  quotaData, 
  isLarge = false,
  disabled = false
}: { 
  config: { label: string; icon: any; color: string }; 
  quotaData: { used: number; total: number };
  isLarge?: boolean;
  disabled?: boolean;
}) => {
  const percentage = (quotaData.used / quotaData.total) * 100;
  const isLow = quotaData.used >= quotaData.total;
  
  return (
    <div className={`space-y-1.5 sm:space-y-2 ${isLarge ? 'py-2' : ''} ${disabled ? 'opacity-40' : ''}`}>
      <div className="flex items-center justify-between text-xs sm:text-sm gap-3">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <config.icon className={`${isLarge ? 'h-4 w-4 sm:h-5 sm:w-5' : 'h-3.5 w-3.5 sm:h-4 sm:w-4'} ${disabled ? 'text-muted-foreground' : config.color}`} />
          <span className={`font-medium whitespace-nowrap ${isLarge ? 'text-sm sm:text-base' : ''} ${disabled ? 'text-muted-foreground' : 'text-foreground'}`}>{config.label}</span>
        </div>
        <span className={`font-semibold ${isLarge ? 'text-sm sm:text-base' : ''} ${disabled ? 'text-muted-foreground' : isLow ? "text-destructive" : "text-muted-foreground"}`}>
          {quotaData.used}/{quotaData.total}
        </span>
      </div>
      <Progress 
        value={percentage} 
        className={`${isLarge ? 'h-2.5 sm:h-3' : 'h-1.5 sm:h-2'} ${disabled ? '[&>div]:bg-muted-foreground' : ''}`}
      />
    </div>
  );
};

export const QuotaDisplay = ({ quota, currentPhase = "class" }: QuotaDisplayProps) => {
  const isConcernsDisabled = currentPhase === "grade" || currentPhase === "school";
  
  return (
    <Card className="p-4 sm:p-6 bg-card border border-border w-full max-w-[340px] sm:max-w-[400px] mx-auto">
      <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-foreground text-center">Your Phase Quota</h3>
      
      <div className="space-y-4 sm:space-y-6">
        {/* First row: Votes */}
        <div className="pb-4 sm:pb-6 border-b border-border">
          <QuotaItem 
            config={{ label: "Votes", icon: ThumbsUp, color: "text-vote" }}
            quotaData={quota.votes}
            isLarge={true}
          />
        </div>

        {/* Second row: Concerns, Proposals */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 pb-4 sm:pb-6 border-b border-border">
          <QuotaItem
            config={{ label: "Concerns", icon: AlertCircle, color: "text-destructive" }}
            quotaData={quota.concerns}
            disabled={isConcernsDisabled}
          />
          <QuotaItem
            config={{ label: "Proposals", icon: Lightbulb, color: "text-proposal" }}
            quotaData={quota.proposals}
          />
        </div>

        {/* Third row: Objections, Pro-Arguments */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 pb-4 sm:pb-6 border-b border-border">
          <QuotaItem
            config={{ label: "Objections", icon: AlertCircle, color: "text-objection" }}
            quotaData={quota.objections}
          />
          <QuotaItem
            config={{ label: "Pro-Args", icon: Flag, color: "text-pro-argument" }}
            quotaData={quota.proArguments}
          />
        </div>

        {/* Fourth row: Variants, Questions */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          <QuotaItem
            config={{ label: "Variants", icon: GitBranch, color: "text-variant" }}
            quotaData={quota.variants}
          />
          <QuotaItem
            config={{ label: "Questions", icon: HelpCircle, color: "text-question" }}
            quotaData={quota.questions}
          />
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-6 pt-6 border-t border-border">
        Quotas reset at the end of each phase
      </p>
    </Card>
  );
};
