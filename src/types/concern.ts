export type ConcernType = "problem" | "proposal" | "counter-proposal";

export type ReplyCategory = "objection" | "proposal" | "pro-argument" | "variant";

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
}
