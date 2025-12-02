import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { UserQuota } from "@/types/concern";
import { AlertCircle, Lightbulb, ThumbsUp, GitBranch, Flag, HelpCircle } from "lucide-react";

interface QuotaDisplayProps {
  quota: UserQuota;
}

const QuotaItem = ({ 
  config, 
  quotaData, 
  isLarge = false 
}: { 
  config: { label: string; icon: any; color: string }; 
  quotaData: { used: number; total: number };
  isLarge?: boolean;
}) => {
  const percentage = (quotaData.used / quotaData.total) * 100;
  const isLow = quotaData.used >= quotaData.total;
  
  return (
    <div className={`space-y-2 ${isLarge ? 'py-2' : ''}`}>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <config.icon className={`${isLarge ? 'h-5 w-5' : 'h-4 w-4'} ${config.color}`} />
          <span className={`font-medium text-foreground ${isLarge ? 'text-base' : ''}`}>{config.label}</span>
        </div>
        <span className={`font-semibold ${isLarge ? 'text-base' : ''} ${isLow ? "text-destructive" : "text-muted-foreground"}`}>
          {quotaData.used}/{quotaData.total}
        </span>
      </div>
      <Progress 
        value={percentage} 
        className={isLarge ? 'h-3' : 'h-2'}
      />
    </div>
  );
};

export const QuotaDisplay = ({ quota }: QuotaDisplayProps) => {
  return (
    <Card className="p-6 bg-card border border-border min-w-[340px]">
      <h3 className="text-lg font-semibold mb-6 text-foreground">Your Phase Quota</h3>
      
      <div className="space-y-6">
        {/* First row: Votes */}
        <div className="pb-6 border-b border-border">
          <QuotaItem 
            config={{ label: "Votes", icon: ThumbsUp, color: "text-vote" }}
            quotaData={quota.votes}
            isLarge={true}
          />
        </div>

        {/* Second row: Concerns, Proposals */}
        <div className="grid grid-cols-2 gap-6 pb-6 border-b border-border">
          <QuotaItem
            config={{ label: "Concerns", icon: AlertCircle, color: "text-destructive" }}
            quotaData={quota.concerns}
          />
          <QuotaItem
            config={{ label: "Proposals", icon: Lightbulb, color: "text-proposal" }}
            quotaData={quota.proposals}
          />
        </div>

        {/* Third row: Objections, Pro-Arguments */}
        <div className="grid grid-cols-2 gap-6 pb-6 border-b border-border">
          <QuotaItem
            config={{ label: "Objections", icon: AlertCircle, color: "text-objection" }}
            quotaData={quota.objections}
          />
          <QuotaItem
            config={{ label: "Pro-Arguments", icon: Flag, color: "text-pro-argument" }}
            quotaData={quota.proArguments}
          />
        </div>

        {/* Fourth row: Variants, Questions */}
        <div className="grid grid-cols-2 gap-6">
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
