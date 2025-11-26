import { Badge } from "@/components/ui/badge";
import { ConcernType } from "@/types/concern";
import { AlertTriangle, Lightbulb, GitCompare } from "lucide-react";

interface TypeBadgeProps {
  type: ConcernType;
}

const typeConfig = {
  problem: {
    label: "Problem",
    icon: AlertTriangle,
    className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  },
  proposal: {
    label: "Proposal",
    icon: Lightbulb,
    className: "bg-proposal text-proposal-foreground hover:bg-proposal/90",
  },
  "counter-proposal": {
    label: "Counter-Proposal",
    icon: GitCompare,
    className: "bg-primary text-primary-foreground hover:bg-primary/90",
  },
};

export const TypeBadge = ({ type }: TypeBadgeProps) => {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <Badge className={config.className}>
      <Icon className="mr-1 h-3 w-3" />
      {config.label}
    </Badge>
  );
};
