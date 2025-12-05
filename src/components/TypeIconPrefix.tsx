import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { AlertTriangle, Lightbulb, Scale } from "lucide-react";
import { ConcernType } from "@/types/concern";

const typeConfig = {
  problem: {
    label: "Problem",
    icon: AlertTriangle,
    iconColor: "text-problem-aspect",
    bgColor: "bg-problem-aspect/10",
    borderColor: "border-problem-aspect/30",
  },
  proposal: {
    label: "Proposal",
    icon: Lightbulb,
    iconColor: "text-proposal",
    bgColor: "bg-proposal/10",
    borderColor: "border-proposal/30",
  },
  "counter-proposal": {
    label: "Counter-Proposal",
    icon: Scale,
    iconColor: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/30",
  },
};

interface TypeIconPrefixProps {
  type: ConcernType;
  size?: "sm" | "md" | "lg";
  variant?: "plain" | "styled";
}

export const TypeIconPrefix = ({ type, size = "md", variant = "plain" }: TypeIconPrefixProps) => {
  const config = typeConfig[type];
  const Icon = config.icon;

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const containerSizes = {
    sm: "p-1",
    md: "p-1.5",
    lg: "p-2",
  };

  const containerClass = variant === "styled"
    ? `inline-flex items-center justify-center rounded-full border flex-shrink-0 ${containerSizes[size]} ${config.bgColor} ${config.borderColor}`
    : "inline-flex items-center justify-center flex-shrink-0";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={containerClass}>
            <Icon className={`${sizeClasses[size]} ${config.iconColor}`} />
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{config.label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
