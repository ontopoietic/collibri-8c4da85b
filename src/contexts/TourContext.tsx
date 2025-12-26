import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export interface TourStep {
  id: string;
  targetSelector: string | null;
  title: string;
  description: string;
  position: "top" | "bottom" | "left" | "right";
  route?: string;
}

interface TourContextType {
  isActive: boolean;
  currentStep: number;
  hasCompleted: boolean;
  steps: TourStep[];
  startTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  endTour: () => void;
  currentStepData: TourStep | null;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

const TOUR_COMPLETED_KEY = "collibri-tour-completed";

export const tourSteps: TourStep[] = [
  {
    id: "welcome",
    targetSelector: null,
    title: "Welcome to Collibri!",
    description: "Let's take a quick tour to help you understand how to participate in collaborative decision-making. This will only take a minute.",
    position: "bottom",
  },
  {
    id: "forum-overview",
    targetSelector: '[data-tour="concern-list"]',
    title: "The Forum",
    description: "This is where all concerns are displayed. Concerns can be problems that need solving or proposals for improvements.",
    position: "top",
    route: "/",
  },
  {
    id: "phase-timeline",
    targetSelector: '[data-tour="phase-timeline"]',
    title: "Phase Timeline",
    description: "Discussions progress through 3 phases: Class → Grade → School. Each phase expands the audience and refines the best ideas.",
    position: "bottom",
    route: "/",
  },
  {
    id: "concern-card",
    targetSelector: '[data-tour="concern-card"]',
    title: "Concern Cards",
    description: "Each card shows a concern with its title, description, votes, and reply count. Click on a card to see the full discussion.",
    position: "bottom",
    route: "/",
  },
  {
    id: "new-concern",
    targetSelector: '[data-tour="new-concern"]',
    title: "Create New Concerns",
    description: "Click here to submit a new problem you've noticed or propose a solution. In the Class phase, you can create new concerns.",
    position: "bottom",
    route: "/",
  },
  {
    id: "vote-button",
    targetSelector: '[data-tour="vote-button"]',
    title: "Voting",
    description: "Vote on concerns to show your support. The most-voted concerns advance to the next phase.",
    position: "right",
  },
  {
    id: "endorse-action",
    targetSelector: '[data-tour="endorse-button"]',
    title: "Endorse Proposals",
    description: "Use the Target icon to endorse proposals you support. Endorsements help good ideas gain visibility.",
    position: "top",
  },
  {
    id: "object-action",
    targetSelector: '[data-tour="object-button"]',
    title: "Raise Objections",
    description: "Use the Ban icon to raise an objection if you see a significant flaw. Constructive objections improve proposals.",
    position: "top",
  },
  {
    id: "reply-categories",
    targetSelector: '[data-tour="reply-tabs"]',
    title: "Reply Categories",
    description: "Replies are organized into tabs: Discussion for general comments, Q&A for questions and answers. This keeps conversations structured.",
    position: "top",
  },
  {
    id: "quota-display",
    targetSelector: '[data-tour="quota"]',
    title: "Your Quota",
    description: "You have a limited number of votes, concerns, and replies per phase. Use them wisely to make your voice count!",
    position: "bottom",
    route: "/",
  },
  {
    id: "navigation",
    targetSelector: '[data-tour="navigation"]',
    title: "Navigation",
    description: "Use these buttons to explore Statistics, Leaderboard, and the relationship Graph. Stay informed about the community's progress.",
    position: "bottom",
    route: "/",
  },
  {
    id: "complete",
    targetSelector: null,
    title: "You're Ready!",
    description: "That's it! You now know the basics. Start by exploring existing concerns or create your own. Happy collaborating!",
    position: "bottom",
  },
];

export const TourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(() => {
    return localStorage.getItem(TOUR_COMPLETED_KEY) === "true";
  });

  const startTour = useCallback(() => {
    setCurrentStep(0);
    setIsActive(true);
  }, []);

  const endTour = useCallback(() => {
    setIsActive(false);
    setCurrentStep(0);
    setHasCompleted(true);
    localStorage.setItem(TOUR_COMPLETED_KEY, "true");
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      endTour();
    }
  }, [currentStep, endTour]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const skipTour = useCallback(() => {
    setIsActive(false);
    setCurrentStep(0);
    setHasCompleted(true);
    localStorage.setItem(TOUR_COMPLETED_KEY, "true");
  }, []);

  const currentStepData = isActive ? tourSteps[currentStep] : null;

  return (
    <TourContext.Provider
      value={{
        isActive,
        currentStep,
        hasCompleted,
        steps: tourSteps,
        startTour,
        nextStep,
        prevStep,
        skipTour,
        endTour,
        currentStepData,
      }}
    >
      {children}
    </TourContext.Provider>
  );
};

export const useTour = () => {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error("useTour must be used within a TourProvider");
  }
  return context;
};
