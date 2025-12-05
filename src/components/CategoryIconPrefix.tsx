import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { AlertCircle, Lightbulb, BicepsFlexed, GitBranch, HelpCircle } from "lucide-react";
import { ReplyCategory } from "@/types/concern";

const categoryConfig = {
  objection: {
    label: "Objection",
    icon: AlertCircle,
    className: "text-objection-foreground",
  },
  proposal: {
    label: "Proposal",
    icon: Lightbulb,
    className: "text-pro-argument-foreground",
  },
  "pro-argument": {
    label: "Pro Argument",
    icon: BicepsFlexed,
    className: "text-pro-argument-foreground",
  },
  variant: {
    label: "Variant",
    icon: GitBranch,
    className: "text-variant-foreground",
  },
  question: {
    label: "Question",
    icon: HelpCircle,
    className: "text-muted-foreground",
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

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center flex-shrink-0">
            <Icon className={`${sizeClass} ${config.className}`} />
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{config.label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
