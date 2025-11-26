import { Badge } from "@/components/ui/badge";
import { ReplyCategory } from "@/types/concern";
import { AlertCircle, Lightbulb, ThumbsUp, GitBranch } from "lucide-react";

interface CategoryBadgeProps {
  category: ReplyCategory;
}

const categoryConfig = {
  objection: {
    label: "Objection",
    icon: AlertCircle,
    className: "bg-objection text-objection-foreground hover:bg-objection/90",
  },
  proposal: {
    label: "Proposal",
    icon: Lightbulb,
    className: "bg-proposal text-proposal-foreground hover:bg-proposal/90",
  },
  "pro-argument": {
    label: "Pro-Argument",
    icon: ThumbsUp,
    className: "bg-pro-argument text-pro-argument-foreground hover:bg-pro-argument/90",
  },
  variant: {
    label: "Variant",
    icon: GitBranch,
    className: "bg-variant text-variant-foreground hover:bg-variant/90",
  },
};

export const CategoryBadge = ({ category }: CategoryBadgeProps) => {
  const config = categoryConfig[category];
  const Icon = config.icon;

  return (
    <Badge className={config.className}>
      <Icon className="mr-1 h-3 w-3" />
      {config.label}
    </Badge>
  );
};
