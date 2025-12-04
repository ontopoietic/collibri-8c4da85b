import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAdmin } from "@/contexts/AdminContext";
import { Eye } from "lucide-react";

export const AdminModeToggle = () => {
  const { isAdmin, adminModeEnabled, toggleAdminMode } = useAdmin();

  if (!isAdmin) return null;

  return (
    <div className="flex items-center gap-2">
      <Switch
        id="admin-mode"
        checked={adminModeEnabled}
        onCheckedChange={toggleAdminMode}
      />
      <Label 
        htmlFor="admin-mode" 
        className="text-sm cursor-pointer flex items-center gap-1.5"
      >
        <Eye className="h-3.5 w-3.5" />
        <span className="hidden lg:inline">Admin Mode</span>
      </Label>
    </div>
  );
};
