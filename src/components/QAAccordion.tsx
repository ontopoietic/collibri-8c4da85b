import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Reply } from "@/types/concern";
import { useAdmin } from "@/contexts/AdminContext";

interface QAAccordionProps {
  questions: Reply[];
}

const QAAccordion = ({ questions }: QAAccordionProps) => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const { adminModeEnabled } = useAdmin();

  const toggleItem = (id: string) => {
    setOpenItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (!questions || questions.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No questions yet.</p>;
  }

  return (
    <div className="space-y-2">
      {questions.map((question) => {
        const isOpen = openItems.has(question.id);
        
        return (
          <div 
            key={question.id}
            className="border border-border rounded-lg overflow-hidden bg-card"
          >
            <button
              onClick={() => toggleItem(question.id)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50"
            >
              <ChevronRight 
                className={cn(
                  "h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200",
                  isOpen && "rotate-90"
                )}
              />
              <span className="flex-1 font-medium text-foreground">
                {question.text}
              </span>
              <span className="text-sm text-muted-foreground shrink-0">
                {formatDistanceToNow(new Date(question.timestamp), { addSuffix: true })}
              </span>
            </button>

            {isOpen && (
              <div className="border-t border-border bg-card px-4 py-3">
                {question.replies && question.replies.length > 0 ? (
                  <div className="space-y-3">
                    {question.replies.map((answer) => (
                      <div 
                        key={answer.id}
                        className="p-3 bg-muted/30 rounded-lg border border-border/50"
                      >
                        <p className="text-foreground">{answer.text}</p>
                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                          {adminModeEnabled && answer.authorName && (
                            <>
                              <span>{answer.authorName}</span>
                              <span>•</span>
                            </>
                          )}
                          <span>{formatDistanceToNow(new Date(answer.timestamp), { addSuffix: true })}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No answers yet.</p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default QAAccordion;
