export type ConcernType = "problem" | "proposal" | "counter-proposal";
export type ConcernAspect = "problem" | "proposal";

export type ReplyCategory = "objection" | "proposal" | "pro-argument" | "variant" | "question";

export type SolutionLevel = "class" | "school" | "ministries";

export interface ReplyReference {
  id: string;
  text: string;
  category: ReplyCategory;
}

export interface User {
  id: string;
  name: string;
  class: string; // e.g., "6a", "6b", "7c"
  role: 'student' | 'admin';
}

export interface QuotaConfig {
  concerns: number;
  votes: number;
  variants: number;
  proposals: number;
  proArguments: number;
  objections: number;
  questions: number;
}

export interface PhaseTimingConfig {
  classDuration: number;
  classVotingDuration: number;
  gradeDuration: number;
  gradeVotingDuration: number;
  schoolDuration: number;
  finalSelectionDuration: number;
}

export interface WinnerConfig {
  classToGradeWinners: number;
  gradeToSchoolWinners: number;
  finalSchoolWinners: number;
}

export interface VariantVotingConfig {
  votingDurationDays: number;
  topConcernsForVoting: number;
  votesPerUser: number;
}

export interface AdminConfig {
  quotas: {
    class: QuotaConfig;
    grade: QuotaConfig;
    school: QuotaConfig;
  };
  phaseTiming: PhaseTimingConfig;
  winners: WinnerConfig;
  variantVoting: VariantVotingConfig;
}

export interface Reply {
  id: string;
  category: ReplyCategory;
  text: string;
  votes: number;
  replies: Reply[];
  timestamp: Date;
  referencedReplies?: ReplyReference[];
  counterProposal?: {
    text: string;
    postedAsConcern?: boolean;
    solutionLevel?: SolutionLevel;
  };
  aspects?: ConcernAspect[];
  authorId?: string;
  authorName?: string;
  authorClass?: string;
}

export type Phase = "class" | "grade" | "school";

export interface ConcernVariant {
  id: string;
  title: string;
  text: string;
  votes: number;
  authorId?: string;
  aspects?: ConcernAspect[];
}

export interface Concern {
  id: string;
  type: ConcernType;
  title: string;
  description: string;
  votes: number;
  replies: Reply[];
  timestamp: Date;
  referencedProblemId?: string;
  referencedObjectionId?: string;
  referencedOriginalPostId?: string;
  phase: Phase;
  group?: string; // class name or grade name
  solutionLevel?: SolutionLevel;
  phaseStartDate?: Date;
  phaseEndDate?: Date;
  variants?: ConcernVariant[];
  selectedVariantId?: string;
  aspects?: ConcernAspect[];
  isWinner?: boolean;
  promotedFrom?: Phase;
  originalGroup?: string;
  winnerRank?: number;
  authorId?: string;
  authorName?: string;
  authorClass?: string;
}

export interface UserQuota {
  concerns: { used: number; total: number };
  votes: { used: number; total: number };
  variants: { used: number; total: number };
  proposals: { used: number; total: number };
  proArguments: { used: number; total: number };
  objections: { used: number; total: number };
  questions: { used: number; total: number };
}
