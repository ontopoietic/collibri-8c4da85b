import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Ban, Lightbulb, BicepsFlexed, GitBranch, HelpCircle } from "lucide-react";
import { ReplyCategory } from "@/types/concern";

const categoryConfig = {
  objection: {
    label: "Objection",
    icon: Ban,
    iconColor: "text-objection",
    bgColor: "bg-objection/10",
    borderColor: "border-objection/30",
  },
  proposal: {
    label: "Proposal",
    icon: Lightbulb,
    iconColor: "text-proposal",
    bgColor: "bg-proposal/10",
    borderColor: "border-proposal/30",
  },
  "pro-argument": {
    label: "Pro Argument",
    icon: BicepsFlexed,
    iconColor: "text-pro-argument",
    bgColor: "bg-pro-argument/10",
    borderColor: "border-pro-argument/30",
  },
  variant: {
    label: "Variant",
    icon: GitBranch,
    iconColor: "text-variant",
    bgColor: "bg-variant/10",
    borderColor: "border-variant/30",
  },
  question: {
    label: "Question",
    icon: HelpCircle,
    iconColor: "text-muted-foreground",
    bgColor: "bg-muted/10",
    borderColor: "border-muted/30",
  },
};

interface CategoryIconPrefixProps {
  category: ReplyCategory;
  size?: "sm" | "md";
}

export const CategoryIconPrefix = ({ category, size = "sm" }: CategoryIconPrefixProps) => {
  const config = categoryConfig[category];
  const Icon = config.icon;
  const sizeClass = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const containerSize = size === "sm" ? "p-1.5" : "p-2";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={`inline-flex items-center justify-center rounded-full border flex-shrink-0 ${containerSize} ${config.bgColor} ${config.borderColor}`}>
            <Icon className={`${sizeClass} ${config.iconColor}`} />
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{config.label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
