import { Bold, Italic, List, ListOrdered, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

interface FormattingToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  value: string;
  onChange: (value: string) => void;
}

type FormatType = "bold" | "italic" | "bullet" | "numbered" | "arrow";

const formatActions: { type: FormatType; icon: typeof Bold; label: string; shortcut: string }[] = [
  { type: "bold", icon: Bold, label: "Bold", shortcut: "**text**" },
  { type: "italic", icon: Italic, label: "Italic", shortcut: "*text*" },
  { type: "bullet", icon: List, label: "Bullet List", shortcut: "- item" },
  { type: "numbered", icon: ListOrdered, label: "Numbered List", shortcut: "1. item" },
  { type: "arrow", icon: ArrowRight, label: "Arrow", shortcut: "→" },
];

export const FormattingToolbar = ({ textareaRef, value, onChange }: FormattingToolbarProps) => {
  const applyFormat = (type: FormatType) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    let newText = value;
    let newCursorPos = start;

    switch (type) {
      case "bold":
        if (selectedText) {
          newText = value.substring(0, start) + `**${selectedText}**` + value.substring(end);
          newCursorPos = end + 4;
        } else {
          newText = value.substring(0, start) + "**text**" + value.substring(end);
          newCursorPos = start + 2;
        }
        break;
      case "italic":
        if (selectedText) {
          newText = value.substring(0, start) + `*${selectedText}*` + value.substring(end);
          newCursorPos = end + 2;
        } else {
          newText = value.substring(0, start) + "*text*" + value.substring(end);
          newCursorPos = start + 1;
        }
        break;
      case "bullet":
        const bulletPrefix = start === 0 || value[start - 1] === '\n' ? "- " : "\n- ";
        newText = value.substring(0, start) + bulletPrefix + value.substring(end);
        newCursorPos = start + bulletPrefix.length;
        break;
      case "numbered":
        const numPrefix = start === 0 || value[start - 1] === '\n' ? "1. " : "\n1. ";
        newText = value.substring(0, start) + numPrefix + value.substring(end);
        newCursorPos = start + numPrefix.length;
        break;
      case "arrow":
        newText = value.substring(0, start) + "→ " + value.substring(end);
        newCursorPos = start + 2;
        break;
    }

    onChange(newText);
    
    // Restore focus and cursor position
    setTimeout(() => {
      textarea.focus();
      if (type === "bold" && !selectedText) {
        textarea.setSelectionRange(start + 2, start + 6);
      } else if (type === "italic" && !selectedText) {
        textarea.setSelectionRange(start + 1, start + 5);
      } else {
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-0.5 p-1 pl-2 bg-muted/50 rounded-t-md border border-b-0 border-border">
        {formatActions.map(({ type, icon: Icon, label, shortcut }) => (
          <Tooltip key={type}>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => applyFormat(type)}
              >
                <Icon className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              <p>{label}</p>
              <p className="text-muted-foreground">{shortcut}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};
