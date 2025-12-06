import { useIsMobile } from "@/hooks/use-mobile";
import { ReplyForm } from "@/components/ReplyForm";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { Reply, ReplyCategory, ReplyReference, SolutionLevel } from "@/types/concern";

interface ReplyFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  replyType: 'endorse' | 'object' | 'question';
  onSubmit: (
    category: ReplyCategory,
    text: string,
    referencedReplies?: ReplyReference[],
    counterProposal?: { text: string; postedAsConcern?: boolean; solutionLevel?: SolutionLevel },
    variantSolutionLevel?: SolutionLevel
  ) => void;
  originalText?: string;
  availableReplies?: Reply[];
  parentConcernType?: "problem" | "proposal" | "counter-proposal";
}

const titleMap = {
  endorse: "Endorse This Concern",
  object: "Object to This Concern",
  question: "Ask a Question"
};

export const ReplyFormSheet = ({
  open,
  onOpenChange,
  replyType,
  onSubmit,
  originalText,
  availableReplies,
  parentConcernType,
}: ReplyFormSheetProps) => {
  const isMobile = useIsMobile();

  const handleSubmit = (
    category: ReplyCategory,
    text: string,
    referencedReplies?: ReplyReference[],
    counterProposal?: { text: string; postedAsConcern?: boolean; solutionLevel?: SolutionLevel },
    variantSolutionLevel?: SolutionLevel
  ) => {
    onSubmit(category, text, referencedReplies, counterProposal, variantSolutionLevel);
    onOpenChange(false);
  };

  if (!isMobile) {
    // Desktop: render inline (current behavior)
    return open ? (
      <ReplyForm
        onSubmit={handleSubmit}
        onCancel={() => onOpenChange(false)}
        replyType={replyType}
        originalText={originalText}
        availableReplies={availableReplies}
        parentConcernType={parentConcernType}
      />
    ) : null;
  }

  // Mobile: render in full-page drawer
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[100dvh] max-h-[100dvh] rounded-none">
        <DrawerHeader className="border-b border-border relative">
          <DrawerTitle>{titleMap[replyType]}</DrawerTitle>
          <DrawerClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DrawerClose>
        </DrawerHeader>
        <ScrollArea className="flex-1 px-4 py-4">
          <ReplyForm
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
            replyType={replyType}
            originalText={originalText}
            availableReplies={availableReplies}
            parentConcernType={parentConcernType}
          />
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};
