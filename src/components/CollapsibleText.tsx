import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CollapsibleTextProps {
  text: string;
  maxHeight?: number;
  className?: string;
}

export const CollapsibleText = ({ text, maxHeight = 120, className }: CollapsibleTextProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsCollapse, setNeedsCollapse] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      setNeedsCollapse(textRef.current.scrollHeight > maxHeight);
    }
  }, [text, maxHeight]);

  return (
    <div className="relative">
      <div 
        ref={textRef}
        style={{ maxHeight: !isExpanded && needsCollapse ? `${maxHeight}px` : undefined }}
        className={cn(
          "transition-all duration-300 overflow-hidden",
          className
        )}
      >
        {text}
      </div>
      {needsCollapse && !isExpanded && (
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-card to-transparent pointer-events-none" />
      )}
      {needsCollapse && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-6 w-6 p-0 mt-1 text-muted-foreground hover:text-foreground"
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  );
};
