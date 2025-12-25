import { Badge } from "@/components/ui/badge";
import { ReplyCategory } from "@/types/concern";
import { Ban, Lightbulb, GitBranch, HelpCircle, BicepsFlexed } from "lucide-react";

interface CategoryBadgeProps {
  category: ReplyCategory;
  isAnswerToQuestion?: boolean;
}

const categoryConfig = {
  objection: {
    label: "Objection",
    icon: Ban,
    className: "bg-transparent text-objection-foreground border-objection",
  },
  proposal: {
    label: "Proposal",
    icon: Lightbulb,
    className: "bg-proposal text-proposal-foreground hover:bg-proposal/90",
  },
  "pro-argument": {
    label: "Pro Argument",
    icon: BicepsFlexed,
    className: "bg-pro-argument text-pro-argument-foreground hover:bg-pro-argument/90",
  },
  variant: {
    label: "Variant",
    icon: GitBranch,
    className: "bg-variant text-variant-foreground hover:bg-variant/90",
  },
  question: {
    label: "Question",
    icon: HelpCircle,
    className: "bg-muted text-muted-foreground hover:bg-muted/90",
  },
};

export const CategoryBadge = ({ category, isAnswerToQuestion }: CategoryBadgeProps) => {
  const config = categoryConfig[category];
  const Icon = config.icon;
  
  // Override label for proposal and pro-argument when they're answers to questions
  const label = isAnswerToQuestion && (category === "pro-argument" || category === "proposal") 
    ? "Answer" 
    : config.label;

  return (
    <Badge className={config.className} variant={category === "objection" ? "outline" : undefined}>
      <Icon className="mr-1 h-3 w-3" />
      {label}
    </Badge>
  );
};
