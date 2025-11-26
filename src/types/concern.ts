export type ConcernType = "problem" | "proposal" | "counter-proposal";

export type ReplyCategory = "objection" | "proposal" | "pro-argument" | "variant" | "question";

export type SolutionLevel = "school" | "ministries";

export interface ReplyReference {
  id: string;
  text: string;
  category: ReplyCategory;
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
}

export type Phase = "class" | "grade" | "school";

export interface ConcernVariant {
  id: string;
  title: string;
  text: string;
  votes: number;
  authorId?: string;
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
