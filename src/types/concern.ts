export type ConcernType = "problem" | "proposal" | "both";

export type ReplyCategory = "objection" | "proposal" | "pro-argument" | "variant";

export interface Reply {
  id: string;
  category: ReplyCategory;
  text: string;
  votes: number;
  replies: Reply[];
  timestamp: Date;
}

export interface Concern {
  id: string;
  type: ConcernType;
  title: string;
  description: string;
  votes: number;
  replies: Reply[];
  timestamp: Date;
}
