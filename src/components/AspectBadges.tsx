import { Badge } from "@/components/ui/badge";
import { ConcernAspect } from "@/types/concern";
import { AlertTriangle, Lightbulb } from "lucide-react";

interface AspectBadgesProps {
  aspects: ConcernAspect[];
}

const aspectConfig = {
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
};

export const AspectBadges = ({ aspects }: AspectBadgesProps) => {
  if (!aspects || aspects.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      {aspects.map((aspect) => {
        const config = aspectConfig[aspect];
        const Icon = config.icon;
        return (
          <Badge key={aspect} className={config.className}>
            <Icon className="mr-1 h-3 w-3" />
            {config.label}
          </Badge>
        );
      })}
    </div>
  );
};
