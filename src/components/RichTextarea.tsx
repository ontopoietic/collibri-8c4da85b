import { useRef, forwardRef, useImperativeHandle } from "react";
import { Textarea } from "@/components/ui/textarea";
import { FormattingToolbar } from "./FormattingToolbar";
import { cn } from "@/lib/utils";

interface RichTextareaProps extends Omit<React.ComponentProps<typeof Textarea>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
}

export const RichTextarea = forwardRef<HTMLTextAreaElement, RichTextareaProps>(
  ({ value, onChange, className, ...props }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    
    useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement);

    return (
      <div className="w-full min-w-0 max-w-full">
        <FormattingToolbar 
          textareaRef={textareaRef} 
          value={value} 
          onChange={onChange} 
        />
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn("rounded-t-none", className)}
          {...props}
        />
      </div>
    );
  }
);

RichTextarea.displayName = "RichTextarea";
