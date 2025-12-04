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
    className: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
  },
  school: {
    label: "School",
    icon: School,
    className: "bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400",
  },
  ministries: {
    label: "Ministries",
    icon: Building2,
    className: "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400",
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
