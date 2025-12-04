import { createContext, useContext, useState, ReactNode } from "react";
import { AdminConfig, QuotaConfig, PhaseTimingConfig, WinnerConfig, VariantVotingConfig } from "@/types/concern";

const defaultQuota: QuotaConfig = {
  concerns: 3,
  votes: 10,
  variants: 3,
  proposals: 3,
  proArguments: 5,
  objections: 5,
  questions: 3,
};

const defaultPhaseTiming: PhaseTimingConfig = {
  classDuration: 30,
  classVotingDuration: 5,
  gradeDuration: 25,
  gradeVotingDuration: 5,
  schoolDuration: 25,
  finalSelectionDuration: 5,
};

const defaultWinners: WinnerConfig = {
  classToGradeWinners: 3,
  gradeToSchoolWinners: 2,
  finalSchoolWinners: 3,
};

const defaultVariantVoting: VariantVotingConfig = {
  votingDurationDays: 5,
  topConcernsForVoting: 3,
  votesPerUser: 1,
};

const defaultConfig: AdminConfig = {
  quotas: {
    class: { ...defaultQuota },
    grade: { ...defaultQuota },
    school: { ...defaultQuota },
  },
  phaseTiming: { ...defaultPhaseTiming },
  winners: { ...defaultWinners },
  variantVoting: { ...defaultVariantVoting },
};

interface AdminContextType {
  isAdmin: boolean;
  adminModeEnabled: boolean;
  toggleAdminMode: () => void;
  config: AdminConfig;
  updateConfig: (config: Partial<AdminConfig>) => void;
  updatePhaseQuota: (phase: 'class' | 'grade' | 'school', quota: Partial<QuotaConfig>) => void;
  updatePhaseTiming: (timing: Partial<PhaseTimingConfig>) => void;
  updateWinners: (winners: Partial<WinnerConfig>) => void;
  updateVariantVoting: (voting: Partial<VariantVotingConfig>) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin] = useState(true); // For demo, current user is admin
  const [adminModeEnabled, setAdminModeEnabled] = useState(false);
  const [config, setConfig] = useState<AdminConfig>(defaultConfig);

  const toggleAdminMode = () => {
    setAdminModeEnabled((prev) => !prev);
  };

  const updateConfig = (newConfig: Partial<AdminConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  const updatePhaseQuota = (phase: 'class' | 'grade' | 'school', quota: Partial<QuotaConfig>) => {
    setConfig((prev) => ({
      ...prev,
      quotas: {
        ...prev.quotas,
        [phase]: { ...prev.quotas[phase], ...quota },
      },
    }));
  };

  const updatePhaseTiming = (timing: Partial<PhaseTimingConfig>) => {
    setConfig((prev) => ({
      ...prev,
      phaseTiming: { ...prev.phaseTiming, ...timing },
    }));
  };

  const updateWinners = (winners: Partial<WinnerConfig>) => {
    setConfig((prev) => ({
      ...prev,
      winners: { ...prev.winners, ...winners },
    }));
  };

  const updateVariantVoting = (voting: Partial<VariantVotingConfig>) => {
    setConfig((prev) => ({
      ...prev,
      variantVoting: { ...prev.variantVoting, ...voting },
    }));
  };

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        adminModeEnabled,
        toggleAdminMode,
        config,
        updateConfig,
        updatePhaseQuota,
        updatePhaseTiming,
        updateWinners,
        updateVariantVoting,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
