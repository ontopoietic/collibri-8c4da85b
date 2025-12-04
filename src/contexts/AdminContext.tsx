import { createContext, useContext, useState, ReactNode } from "react";
import { AdminConfig, QuotaConfig } from "@/types/concern";

const defaultQuota: QuotaConfig = {
  concerns: 3,
  votes: 10,
  variants: 3,
  proposals: 3,
  proArguments: 5,
  objections: 5,
  questions: 3,
};

const defaultConfig: AdminConfig = {
  quotas: {
    class: { ...defaultQuota },
    grade: { ...defaultQuota },
    school: { ...defaultQuota },
  },
};

interface AdminContextType {
  isAdmin: boolean;
  adminModeEnabled: boolean;
  toggleAdminMode: () => void;
  config: AdminConfig;
  updateConfig: (config: Partial<AdminConfig>) => void;
  updatePhaseQuota: (phase: 'class' | 'grade' | 'school', quota: Partial<QuotaConfig>) => void;
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

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        adminModeEnabled,
        toggleAdminMode,
        config,
        updateConfig,
        updatePhaseQuota,
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
