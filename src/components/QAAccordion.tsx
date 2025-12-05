import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Reply } from "@/types/concern";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface QAAccordionProps {
  questions: Reply[];
}

const QAAccordion = ({ questions }: QAAccordionProps) => {
  if (!questions || questions.length === 0) {
    return null;
  }

  return (
    <Accordion type="multiple" className="space-y-2">
      {questions.map((question) => (
        <AccordionItem 
          key={question.id} 
          value={question.id}
          className="border border-border rounded-lg overflow-hidden"
        >
          <AccordionTrigger 
            className={cn(
              "flex-row-reverse justify-end gap-3 p-4",
              "hover:no-underline hover:bg-muted/50",
              "[&>svg]:rotate-0 [&[data-state=open]>svg]:rotate-90"
            )}
          >
            <div className="flex flex-1 items-center justify-between">
              <span className="font-medium text-foreground text-left">
                {question.text}
              </span>
              <span className="text-sm text-muted-foreground shrink-0 ml-4">
                {formatDistanceToNow(question.timestamp, { addSuffix: true })}
              </span>
            </div>
          </AccordionTrigger>
          
          <AccordionContent className="px-4 pb-4 pt-0">
            {question.replies && question.replies.length > 0 ? (
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
                      <span>
                        {formatDistanceToNow(answer.timestamp, { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm pl-8">
                No answers yet.
              </p>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default QAAccordion;
