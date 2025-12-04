import { Switch } from "@/components/ui/switch";
import { useAdmin } from "@/contexts/AdminContext";
import { Eye } from "lucide-react";

export const AdminModeToggle = () => {
  const { isAdmin, adminModeEnabled, toggleAdminMode } = useAdmin();

  if (!isAdmin) return null;

  return (
    <div className="flex items-center gap-1.5">
      <Eye className="h-4 w-4 text-muted-foreground" />
      <Switch
        id="admin-mode"
        checked={adminModeEnabled}
        onCheckedChange={toggleAdminMode}
      />
    </div>
  );
};
