import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RichText } from "@/components/RichText";

interface CollapsibleTextProps {
  text: string;
  maxHeight?: number;
  className?: string;
  inline?: boolean;
}

export const CollapsibleText = ({ text, maxHeight = 120, className, inline = false }: CollapsibleTextProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsCollapse, setNeedsCollapse] = useState(false);
  const textRef = useRef<HTMLDivElement | HTMLSpanElement>(null);

  useEffect(() => {
    if (textRef.current) {
      setNeedsCollapse(textRef.current.scrollHeight > maxHeight);
    }
  }, [text, maxHeight]);

  if (inline) {
    return (
      <>
        <span 
          ref={textRef as React.RefObject<HTMLSpanElement>}
          style={{ 
            maxHeight: !isExpanded && needsCollapse ? `${maxHeight}px` : undefined,
            display: 'inline',
            overflow: !isExpanded && needsCollapse ? 'hidden' : undefined,
            WebkitMaskImage: !isExpanded && needsCollapse 
              ? 'linear-gradient(to bottom, black 60%, transparent 100%)' 
              : undefined,
            maskImage: !isExpanded && needsCollapse 
              ? 'linear-gradient(to bottom, black 60%, transparent 100%)' 
              : undefined,
          }}
          className={cn(className)}
        >
          <RichText content={text} />
        </span>
        {needsCollapse && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="h-5 w-5 p-0 ml-1 text-muted-foreground hover:text-foreground inline-flex align-middle"
          >
            {isExpanded ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </Button>
        )}
      </>
    );
  }

  return (
    <div className="relative">
      <div 
        ref={textRef as React.RefObject<HTMLDivElement>}
        style={{ 
          maxHeight: !isExpanded && needsCollapse ? `${maxHeight}px` : undefined,
          WebkitMaskImage: !isExpanded && needsCollapse 
            ? 'linear-gradient(to bottom, black 70%, transparent 100%)' 
            : undefined,
          maskImage: !isExpanded && needsCollapse 
            ? 'linear-gradient(to bottom, black 70%, transparent 100%)' 
            : undefined,
        }}
        className={cn(
          "transition-all duration-300 overflow-hidden",
        className
        )}
      >
        <RichText content={text} />
      </div>
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
