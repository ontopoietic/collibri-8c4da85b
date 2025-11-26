import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { UserQuota } from "@/types/concern";
import { AlertCircle, Lightbulb, MessageSquare, ThumbsUp, HelpCircle, Scale } from "lucide-react";

interface QuotaDisplayProps {
  quota: UserQuota;
}

const quotaConfig = [
  { key: "concerns", label: "Concerns", icon: AlertCircle, color: "text-destructive" },
  { key: "votes", label: "Votes", icon: ThumbsUp, color: "text-primary" },
  { key: "proposals", label: "Proposals", icon: Lightbulb, color: "text-proposal" },
  { key: "variants", label: "Variants", icon: Scale, color: "text-muted-foreground" },
  { key: "proArguments", label: "Pro-Arguments", icon: ThumbsUp, color: "text-green-600" },
  { key: "objections", label: "Objections", icon: AlertCircle, color: "text-orange-600" },
  { key: "questions", label: "Questions", icon: HelpCircle, color: "text-blue-600" },
];

export const QuotaDisplay = ({ quota }: QuotaDisplayProps) => {
  return (
    <Card className="p-4 bg-card border border-border h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Your Phase Quota</h3>
      <div className="space-y-3">
        {quotaConfig.map((config) => {
          const quotaData = quota[config.key as keyof UserQuota];
          const percentage = (quotaData.used / quotaData.total) * 100;
          const isLow = quotaData.used >= quotaData.total;
          
          return (
            <div key={config.key} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <config.icon className={`h-4 w-4 ${config.color}`} />
                  <span className="font-medium">{config.label}</span>
                </div>
                <span className={`font-semibold ${isLow ? "text-destructive" : "text-muted-foreground"}`}>
                  {quotaData.used}/{quotaData.total}
                </span>
              </div>
              <Progress 
                value={percentage} 
                className="h-2"
              />
            </div>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground mt-4">
        Quotas reset at the end of each phase
      </p>
    </Card>
  );
};
