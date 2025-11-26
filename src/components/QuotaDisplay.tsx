import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { UserQuota } from "@/types/concern";
import { AlertCircle, Lightbulb, ThumbsUp, HelpCircle, Scale, ThumbsDown } from "lucide-react";

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
          <span className={`font-medium ${isLarge ? 'text-base' : ''}`}>{config.label}</span>
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
  const quotaPairs = [
    [
      { key: "concerns", label: "Concerns", icon: AlertCircle, color: "text-destructive" },
      { key: "proposals", label: "Proposals", icon: Lightbulb, color: "text-proposal" }
    ],
    [
      { key: "objections", label: "Objections", icon: ThumbsDown, color: "text-orange-600" },
      { key: "proArguments", label: "Pro-Arguments", icon: ThumbsUp, color: "text-green-600" }
    ],
    [
      { key: "variants", label: "Variants", icon: Scale, color: "text-muted-foreground" },
      { key: "questions", label: "Questions", icon: HelpCircle, color: "text-blue-600" }
    ]
  ];

  return (
    <Card className="p-6 bg-card border border-border">
      <h3 className="text-lg font-semibold mb-6 text-foreground">Your Phase Quota</h3>
      
      {/* Votes - Prominent first row */}
      <div className="mb-6 pb-6 border-b border-border">
        <QuotaItem 
          config={{ label: "Votes", icon: ThumbsUp, color: "text-primary" }}
          quotaData={quota.votes}
          isLarge={true}
        />
      </div>

      {/* Paired quotas in 3 rows */}
      <div className="space-y-6">
        {quotaPairs.map((pair, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-2 gap-6">
            {pair.map((config) => (
              <QuotaItem
                key={config.key}
                config={config}
                quotaData={quota[config.key as keyof UserQuota]}
              />
            ))}
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-6 pt-6 border-t border-border">
        Quotas reset at the end of each phase
      </p>
    </Card>
  );
};
