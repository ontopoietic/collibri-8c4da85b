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
    className: "bg-problem text-problem-foreground hover:bg-problem/90",
  },
  proposal: {
    label: "Proposal",
    icon: Lightbulb,
    className: "bg-concern-type text-concern-type-foreground hover:bg-concern-type/90",
  },
  "counter-proposal": {
    label: "Counter-Proposal",
    icon: GitCompare,
    className: "bg-concern-type text-concern-type-foreground hover:bg-concern-type/90",
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
