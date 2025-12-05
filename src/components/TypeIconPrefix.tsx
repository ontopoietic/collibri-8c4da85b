import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { AlertTriangle, Lightbulb, Scale } from "lucide-react";
import { ConcernType } from "@/types/concern";

const typeConfig = {
  problem: {
    label: "Problem",
    icon: AlertTriangle,
    className: "text-problem-aspect",
  },
  proposal: {
    label: "Proposal",
    icon: Lightbulb,
    className: "text-proposal",
  },
  "counter-proposal": {
    label: "Counter-Proposal",
    icon: Scale,
    className: "text-primary",
  },
};

interface TypeIconPrefixProps {
  type: ConcernType;
  size?: "sm" | "md" | "lg";
}

export const TypeIconPrefix = ({ type, size = "md" }: TypeIconPrefixProps) => {
  const config = typeConfig[type];
  const Icon = config.icon;

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center">
            <Icon className={`${sizeClasses[size]} ${config.className} flex-shrink-0`} />
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{config.label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
