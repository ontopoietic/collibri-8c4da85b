import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, Save, RotateCcw, Clock, Trophy, Vote } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import { QuotaConfig, PhaseTimingConfig, WinnerConfig, VariantVotingConfig } from "@/types/concern";

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

const PhaseTimingEditor = ({
  timing,
  onChange,
}: {
  timing: PhaseTimingConfig;
  onChange: (timing: Partial<PhaseTimingConfig>) => void;
}) => {
  const fields: { key: keyof PhaseTimingConfig; label: string }[] = [
    { key: "classDuration", label: "Class Duration (days)" },
    { key: "classVotingDuration", label: "Class Voting (days)" },
    { key: "gradeDuration", label: "Grade Duration (days)" },
    { key: "gradeVotingDuration", label: "Grade Voting (days)" },
    { key: "schoolDuration", label: "School Duration (days)" },
    { key: "finalSelectionDuration", label: "Final Selection (days)" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {fields.map(({ key, label }) => (
          <div key={key} className="space-y-2">
            <Label htmlFor={`timing-${key}`} className="text-sm text-muted-foreground">
              {label}
            </Label>
            <Input
              id={`timing-${key}`}
              type="number"
              min={1}
              max={365}
              value={timing[key]}
              onChange={(e) => onChange({ [key]: parseInt(e.target.value) || 1 })}
              className="h-9"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const WinnerEditor = ({
  winners,
  onChange,
}: {
  winners: WinnerConfig;
  onChange: (winners: Partial<WinnerConfig>) => void;
}) => {
  const fields: { key: keyof WinnerConfig; label: string; description: string }[] = [
    { key: "classToGradeWinners", label: "Class → Grade", description: "Winners promoted from each class" },
    { key: "gradeToSchoolWinners", label: "Grade → School", description: "Winners promoted from each grade" },
    { key: "finalSchoolWinners", label: "Final Winners", description: "Final school-wide winners" },
  ];

  return (
    <div className="space-y-4">
      {fields.map(({ key, label, description }) => (
        <div key={key} className="space-y-2">
          <Label htmlFor={`winners-${key}`} className="text-sm font-medium">
            {label}
          </Label>
          <p className="text-xs text-muted-foreground">{description}</p>
          <Input
            id={`winners-${key}`}
            type="number"
            min={1}
            max={20}
            value={winners[key]}
            onChange={(e) => onChange({ [key]: parseInt(e.target.value) || 1 })}
            className="h-9 w-24"
          />
        </div>
      ))}
    </div>
  );
};

const VariantVotingEditor = ({
  voting,
  onChange,
}: {
  voting: VariantVotingConfig;
  onChange: (voting: Partial<VariantVotingConfig>) => void;
}) => {
  const fields: { key: keyof VariantVotingConfig; label: string; description: string }[] = [
    { key: "votingDurationDays", label: "Voting Duration", description: "Days for variant voting" },
    { key: "topConcernsForVoting", label: "Top Concerns", description: "Number of concerns that enter voting" },
    { key: "votesPerUser", label: "Votes per User", description: "How many votes each user gets" },
  ];

  return (
    <div className="space-y-4">
      {fields.map(({ key, label, description }) => (
        <div key={key} className="space-y-2">
          <Label htmlFor={`voting-${key}`} className="text-sm font-medium">
            {label}
          </Label>
          <p className="text-xs text-muted-foreground">{description}</p>
          <Input
            id={`voting-${key}`}
            type="number"
            min={1}
            max={30}
            value={voting[key]}
            onChange={(e) => onChange({ [key]: parseInt(e.target.value) || 1 })}
            className="h-9 w-24"
          />
        </div>
      ))}
    </div>
  );
};

export const AdminPanel = () => {
  const navigate = useNavigate();
  const { config, updatePhaseQuota, updatePhaseTiming, updateWinners, updateVariantVoting } = useAdmin();
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

  const handleTimingChange = (timing: Partial<PhaseTimingConfig>) => {
    setLocalConfig((prev) => ({
      ...prev,
      phaseTiming: { ...prev.phaseTiming, ...timing },
    }));
    setHasChanges(true);
  };

  const handleWinnersChange = (winners: Partial<WinnerConfig>) => {
    setLocalConfig((prev) => ({
      ...prev,
      winners: { ...prev.winners, ...winners },
    }));
    setHasChanges(true);
  };

  const handleVotingChange = (voting: Partial<VariantVotingConfig>) => {
    setLocalConfig((prev) => ({
      ...prev,
      variantVoting: { ...prev.variantVoting, ...voting },
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    updatePhaseQuota('class', localConfig.quotas.class);
    updatePhaseQuota('grade', localConfig.quotas.grade);
    updatePhaseQuota('school', localConfig.quotas.school);
    updatePhaseTiming(localConfig.phaseTiming);
    updateWinners(localConfig.winners);
    updateVariantVoting(localConfig.variantVoting);
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
          <TabsList className="grid w-full grid-cols-5 h-auto">
            <TabsTrigger value="quotas" className="text-xs px-2 py-2">Quotas</TabsTrigger>
            <TabsTrigger value="timing" className="text-xs px-2 py-2">Timing</TabsTrigger>
            <TabsTrigger value="winners" className="text-xs px-2 py-2">Winners</TabsTrigger>
            <TabsTrigger value="voting" className="text-xs px-2 py-2">Voting</TabsTrigger>
            <TabsTrigger value="users" className="text-xs px-2 py-2">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="quotas" className="space-y-6 mt-6">
            <p className="text-sm text-muted-foreground">
              Configure the maximum quotas for each phase.
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
          </TabsContent>

          <TabsContent value="timing" className="space-y-6 mt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <Clock className="h-4 w-4" />
              <p className="text-sm">Configure phase durations</p>
            </div>
            <PhaseTimingEditor
              timing={localConfig.phaseTiming}
              onChange={handleTimingChange}
            />
          </TabsContent>

          <TabsContent value="winners" className="space-y-6 mt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <Trophy className="h-4 w-4" />
              <p className="text-sm">Configure winner promotion settings</p>
            </div>
            <WinnerEditor
              winners={localConfig.winners}
              onChange={handleWinnersChange}
            />
          </TabsContent>

          <TabsContent value="voting" className="space-y-6 mt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <Vote className="h-4 w-4" />
              <p className="text-sm">Configure variant voting rules</p>
            </div>
            <VariantVotingEditor
              voting={localConfig.variantVoting}
              onChange={handleVotingChange}
            />
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

        <div className="flex gap-2 pt-4 mt-6 border-t">
          <Button onClick={handleSave} disabled={!hasChanges} className="flex-1 gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
          <Button variant="outline" onClick={handleReset} disabled={!hasChanges} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};