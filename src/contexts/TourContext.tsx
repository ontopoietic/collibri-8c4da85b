import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export type TourAction = 'openEndorseForm' | 'openObjectForm' | 'closeForm';

export interface AlternativeContent {
  targetSelector: string | null;
  title: string;
  description: string;
  position: "top" | "bottom" | "left" | "right";
}

export interface TourStep {
  id: string;
  targetSelector: string | null;
  title: string;
  description: string;
  position: "top" | "bottom" | "left" | "right";
  route?: string;
  action?: TourAction;
  alternativeContent?: AlternativeContent;
}

interface TourContextType {
  isActive: boolean;
  currentStep: number;
  hasCompleted: boolean;
  steps: TourStep[];
  currentPhase: string;
  setCurrentPhase: (phase: string) => void;
  startTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  endTour: () => void;
  currentStepData: TourStep | null;
  getEffectiveStepData: () => TourStep | null;
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
    position: "top",
    route: "/",
  },
  {
    id: "new-concern",
    targetSelector: '[data-tour="new-concern"]',
    title: "Create New Concerns",
    description: "Click here to submit a new problem you've noticed or propose a solution. In the Class phase, you can create new concerns.",
    position: "bottom",
    route: "/",
    // Alternative step when not in class phase
    alternativeContent: {
      targetSelector: '[data-tour="navigation"]',
      title: "Creating New Concerns",
      description: "New concerns can only be created during the Class phase. Once the discussion moves to Grade or School phase, the focus shifts to refining and voting on existing proposals.",
      position: "bottom" as const,
    },
  },
  {
    id: "vote-button",
    targetSelector: '[data-tour="vote-button"]',
    title: "Voting",
    description: "Vote on concerns to show your support. The most-voted concerns advance to the next phase.",
    position: "right",
    route: "/concern/c10a-1",
  },
  {
    id: "endorse-action",
    targetSelector: '[data-tour="endorse-button"]',
    title: "Endorse Proposals",
    description: "Use the Target icon to endorse proposals you support. Let's open the endorse form to see the response types.",
    position: "top",
    route: "/concern/c10a-1",
  },
  {
    id: "endorse-form",
    targetSelector: '[data-tour="reply-form"]',
    title: "The Endorse Form",
    description: "When you endorse, you have three ways to show support: create a Proposal with a new solution, add a Pro-Argument to strengthen the case, or suggest a Variant with modifications.",
    position: "top",
    route: "/concern/c10a-1",
    action: "openEndorseForm",
  },
  {
    id: "reply-proposal",
    targetSelector: '[data-tour="reply-type-proposal"]',
    title: "Proposal Reply",
    description: "A Proposal suggests a concrete solution. If responding to a problem, propose how to fix it. If there's already a proposal, suggest a refined or alternative approach.",
    position: "right",
    route: "/concern/c10a-1",
  },
  {
    id: "reply-pro-argument",
    targetSelector: '[data-tour="reply-type-pro-argument"]',
    title: "Pro-Argument",
    description: "Pro-Arguments support an idea with reasoning or evidence. They explain WHY a proposal is good – its benefits, feasibility, or positive outcomes.",
    position: "right",
    route: "/concern/c10a-1",
  },
  {
    id: "reply-variant",
    targetSelector: '[data-tour="reply-type-variant"]',
    title: "Variant",
    description: "A Variant modifies the original proposal while keeping its core idea. The variant can also act as a synthesis by referencing other replies which it incorporates.",
    position: "right",
    route: "/concern/c10a-1",
  },
  {
    id: "object-action",
    targetSelector: '[data-tour="object-button"]',
    title: "Raise Objections",
    description: "Use the Ban icon to raise an objection if you see a significant flaw. Let's see what options the objection form provides.",
    position: "top",
    route: "/concern/c10a-1",
    action: "closeForm",
  },
  {
    id: "objection-form",
    targetSelector: '[data-tour="reply-form"]',
    title: "The Objection Form",
    description: "Objections raise significant concerns or flaws. Unlike simple disagreement, constructive objections should be specific and actionable. You can optionally attach a counter-proposal.",
    position: "top",
    route: "/concern/c10a-1",
    action: "openObjectForm",
  },
  {
    id: "reply-categories",
    targetSelector: '[data-tour="reply-tabs"]',
    title: "Reply Categories",
    description: "Replies are organized into tabs: Responses for endorsements and objections, Q&A for questions and answers. This keeps conversations structured.",
    position: "top",
    route: "/concern/c10a-1",
    action: "closeForm",
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
  const [currentPhase, setCurrentPhase] = useState<string>("class");
  const [hasCompleted, setHasCompleted] = useState(() => {
    return localStorage.getItem(TOUR_COMPLETED_KEY) === "true";
  });

  const startTour = useCallback(() => {
    setCurrentStep(0);
    setIsActive(true);
    // Dispatch event to reset simulation to class phase for tour
    window.dispatchEvent(new CustomEvent('tour-reset-simulation'));
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

  // Get effective step data, applying alternative content when target not available
  const getEffectiveStepData = useCallback((): TourStep | null => {
    if (!isActive || !currentStepData) return null;
    
    // Check if this step has alternative content and if we're not in class phase
    if (currentStepData.id === "new-concern" && currentPhase !== "class" && currentStepData.alternativeContent) {
      return {
        ...currentStepData,
        targetSelector: currentStepData.alternativeContent.targetSelector,
        title: currentStepData.alternativeContent.title,
        description: currentStepData.alternativeContent.description,
        position: currentStepData.alternativeContent.position,
      };
    }
    
    return currentStepData;
  }, [isActive, currentStepData, currentPhase]);

  return (
    <TourContext.Provider
      value={{
        isActive,
        currentStep,
        hasCompleted,
        steps: tourSteps,
        currentPhase,
        setCurrentPhase,
        startTour,
        nextStep,
        prevStep,
        skipTour,
        endTour,
        currentStepData,
        getEffectiveStepData,
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
