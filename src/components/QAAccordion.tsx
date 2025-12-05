import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Reply } from "@/types/concern";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";

interface QAAccordionProps {
  questions: Reply[];
}

const QAAccordion = ({ questions }: QAAccordionProps) => {
  return (
    <Accordion type="multiple" className="space-y-2">
      {questions.map((question) => (
        <AccordionItem 
          key={question.id} 
          value={question.id}
          className="border border-border rounded-lg overflow-hidden"
        >
          <AccordionPrimitive.Header className="flex">
            <AccordionPrimitive.Trigger
              className={cn(
                "w-full flex items-center gap-3 p-4 text-left hover:bg-muted/50 transition-colors",
                "[&[data-state=open]>svg]:rotate-90"
              )}
            >
              <ChevronRight 
                className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200"
              />
              <span className="flex-1 font-medium text-foreground">
                {question.text}
              </span>
              <span className="text-sm text-muted-foreground shrink-0">
                {formatDistanceToNow(question.timestamp, { addSuffix: true })}
              </span>
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>

          <AccordionContent className="px-4 pb-4 pt-0">
            {question.replies?.length > 0 ? (
              <div className="space-y-3 pl-8">
                {question.replies.map((answer) => (
                  <div 
                    key={answer.id}
                    className="p-3 bg-muted/30 rounded-lg border border-border/50"
                  >
                    <p className="text-foreground">{answer.text}</p>
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      {answer.authorName && (
                        <span>{answer.authorName}</span>
                      )}
                      <span>•</span>
                      <span>{formatDistanceToNow(answer.timestamp, { addSuffix: true })}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm pl-8">No answers yet.</p>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default QAAccordion;
