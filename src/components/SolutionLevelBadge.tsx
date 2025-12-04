import { Badge } from "@/components/ui/badge";
import { SolutionLevel } from "@/types/concern";
import { Users, School, Building2 } from "lucide-react";

interface SolutionLevelBadgeProps {
  level: SolutionLevel;
}

const levelConfig = {
  class: {
    label: "Class",
    icon: Users,
    className: "bg-muted/50 text-muted-foreground border-border",
  },
  school: {
    label: "School",
    icon: School,
    className: "bg-muted/50 text-muted-foreground border-border",
  },
  ministries: {
    label: "Ministries",
    icon: Building2,
    className: "bg-muted/50 text-muted-foreground border-border",
  },
};

export const SolutionLevelBadge = ({ level }: SolutionLevelBadgeProps) => {
  const config = levelConfig[level];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={config.className}>
      <Icon className="mr-1 h-3 w-3" />
      {config.label}
    </Badge>
  );
};
