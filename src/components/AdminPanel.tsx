import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, Save, RotateCcw } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import { QuotaConfig } from "@/types/concern";

const QuotaEditor = ({ 
  phase, 
  quota, 
  onChange 
}: { 
  phase: string; 
  quota: QuotaConfig; 
  onChange: (quota: Partial<QuotaConfig>) => void;
}) => {
  const fields: { key: keyof QuotaConfig; label: string }[] = [
    { key: "concerns", label: "Concerns" },
    { key: "votes", label: "Votes" },
    { key: "variants", label: "Variants" },
    { key: "proposals", label: "Proposals" },
    { key: "proArguments", label: "Pro-Arguments" },
    { key: "objections", label: "Objections" },
    { key: "questions", label: "Questions" },
  ];

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-foreground capitalize">{phase} Phase</h4>
      <div className="grid grid-cols-2 gap-4">
        {fields.map(({ key, label }) => (
          <div key={key} className="space-y-2">
            <Label htmlFor={`${phase}-${key}`} className="text-sm text-muted-foreground">
              {label}
            </Label>
            <Input
              id={`${phase}-${key}`}
              type="number"
              min={1}
              max={100}
              value={quota[key]}
              onChange={(e) => onChange({ [key]: parseInt(e.target.value) || 1 })}
              className="h-9"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export const AdminPanel = () => {
  const navigate = useNavigate();
  const { config, updatePhaseQuota } = useAdmin();
  const [localConfig, setLocalConfig] = useState(config);
  const [hasChanges, setHasChanges] = useState(false);

  const handleQuotaChange = (phase: 'class' | 'grade' | 'school', quota: Partial<QuotaConfig>) => {
    setLocalConfig((prev) => ({
      ...prev,
      quotas: {
        ...prev.quotas,
        [phase]: { ...prev.quotas[phase], ...quota },
      },
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    updatePhaseQuota('class', localConfig.quotas.class);
    updatePhaseQuota('grade', localConfig.quotas.grade);
    updatePhaseQuota('school', localConfig.quotas.school);
    setHasChanges(false);
  };

  const handleReset = () => {
    setLocalConfig(config);
    setHasChanges(false);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="gap-2">
          <Shield className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Admin Panel
          </SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="quotas" className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="quotas">Quota Settings</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
          </TabsList>

          <TabsContent value="quotas" className="space-y-6 mt-6">
            <p className="text-sm text-muted-foreground">
              Configure the maximum quotas for each phase. These limits apply to all users.
            </p>

            <div className="space-y-8">
              <QuotaEditor
                phase="class"
                quota={localConfig.quotas.class}
                onChange={(q) => handleQuotaChange('class', q)}
              />
              <QuotaEditor
                phase="grade"
                quota={localConfig.quotas.grade}
                onChange={(q) => handleQuotaChange('grade', q)}
              />
              <QuotaEditor
                phase="school"
                quota={localConfig.quotas.school}
                onChange={(q) => handleQuotaChange('school', q)}
              />
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button onClick={handleSave} disabled={!hasChanges} className="flex-1 gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleReset} disabled={!hasChanges} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4 mt-6">
            <p className="text-sm text-muted-foreground">
              View and manage all users in the system.
            </p>
            <Button 
              onClick={() => navigate('/admin/users')} 
              className="w-full gap-2"
            >
              <Users className="h-4 w-4" />
              Open User Management
            </Button>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};
