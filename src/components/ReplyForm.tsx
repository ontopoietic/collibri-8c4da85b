import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RichTextarea } from "@/components/RichTextarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ReplyCategory, Reply, ReplyReference, SolutionLevel } from "@/types/concern";
import { CategoryBadge } from "./CategoryBadge";
import { Check, ChevronsUpDown, AlertCircle, Lightbulb, ThumbsUp, GitBranch, Flag } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReplyFormProps {
  onSubmit: (
    category: ReplyCategory,
    text: string,
    referencedReplies?: ReplyReference[],
    counterProposal?: { text: string; postedAsConcern?: boolean; solutionLevel?: SolutionLevel },
    variantSolutionLevel?: SolutionLevel
  ) => void;
  onCancel: () => void;
  replyType: 'endorse' | 'object' | 'question';
  originalText?: string;
  availableReplies?: Reply[];
  parentConcernType?: "problem" | "proposal" | "counter-proposal";
}

const categoryConfig = {
  objection: {
    label: "Objection",
    icon: AlertCircle,
    description: "Point out issues or concerns",
  },
  proposal: {
    label: "Proposal",
    icon: Lightbulb,
    description: "Suggest a new solution",
  },
  "pro-argument": {
    label: "Pro-Argument",
    icon: Flag,
    description: "Support with reasoning",
  },
  variant: {
    label: "Variant",
    icon: GitBranch,
    description: "Suggest a modification",
  },
};

const endorseCategories: ReplyCategory[] = ["pro-argument", "variant", "proposal"];
const objectCategories: ReplyCategory[] = ["objection"];

export const ReplyForm = ({
  onSubmit,
  onCancel,
  replyType,
  originalText = "",
  availableReplies = [],
  parentConcernType,
}: ReplyFormProps) => {
  const [category, setCategory] = useState<ReplyCategory | "">("");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [selectedReplies, setSelectedReplies] = useState<ReplyReference[]>([]);
  const [openReplySelect, setOpenReplySelect] = useState(false);
  const [hasCounterProposal, setHasCounterProposal] = useState(false);
  const [counterProposalText, setCounterProposalText] = useState("");
  const [postCounterAsConcern, setPostCounterAsConcern] = useState(false);
  const [counterProposalSolutionLevel, setCounterProposalSolutionLevel] = useState<SolutionLevel | "">("");
  const [variantSolutionLevel, setVariantSolutionLevel] = useState<SolutionLevel | "">("");
  const [proposalSolutionLevel, setProposalSolutionLevel] = useState<SolutionLevel | "">("");

  const isProposalType = parentConcernType === "proposal" || parentConcernType === "counter-proposal";

  const allowedCategories = replyType === 'question' 
    ? ['question' as ReplyCategory]
    : replyType === 'endorse' 
    ? endorseCategories 
    : objectCategories;

  useEffect(() => {
    // Auto-select if only one category available
    if (allowedCategories.length === 1) {
      setCategory(allowedCategories[0]);
    } else {
      setCategory("");
    }
  }, [replyType]);

  useEffect(() => {
    if (category === "variant" && originalText) {
      setText(originalText);
    } else if (category && category !== "variant") {
      setText("");
    }
  }, [category, originalText]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Check if title is required (for proposals) and if it's filled
    if (category === 'proposal' && !title.trim()) {
      return; // Don't submit if title is missing for proposals
    }
    
    if (category && text.trim()) {
      const counterProposal = hasCounterProposal && counterProposalText.trim()
        ? { 
            text: counterProposalText, 
            postedAsConcern: postCounterAsConcern,
            solutionLevel: counterProposalSolutionLevel ? counterProposalSolutionLevel as SolutionLevel : undefined
          }
        : undefined;
      
      // Determine solution level to pass based on category
      const solutionLevelToPass = category === "variant" && variantSolutionLevel 
        ? variantSolutionLevel as SolutionLevel 
        : category === "proposal" && proposalSolutionLevel 
          ? proposalSolutionLevel as SolutionLevel 
          : undefined;

      onSubmit(
        category as ReplyCategory,
        text,
        selectedReplies.length > 0 ? selectedReplies : undefined,
        counterProposal,
        solutionLevelToPass
      );
      setCategory("");
      setTitle("");
      setText("");
      setSelectedReplies([]);
      setHasCounterProposal(false);
      setCounterProposalText("");
      setPostCounterAsConcern(false);
      setCounterProposalSolutionLevel("");
      setVariantSolutionLevel("");
      setProposalSolutionLevel("");
    }
  };

  const toggleReplySelection = (reply: Reply) => {
    setSelectedReplies((prev) => {
      const exists = prev.find((r) => r.id === reply.id);
      if (exists) {
        return prev.filter((r) => r.id !== reply.id);
      }
      return [...prev, { id: reply.id, text: reply.text, category: reply.category }];
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full overflow-hidden space-y-4 bg-card p-4 sm:p-6 rounded-lg border border-border" data-tour="reply-form">
      {replyType !== 'question' && allowedCategories.length > 1 && (
        <div className="space-y-3">
          <label className="text-sm font-medium">Response Type</label>
          <div className="grid grid-cols-2 gap-3">
            {allowedCategories.map((cat) => {
              const config = categoryConfig[cat as keyof typeof categoryConfig];
              if (!config) return null;
              const Icon = config.icon;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  data-tour={`reply-type-${cat}`}
                  className={cn(
                    "flex flex-col items-start gap-2 p-4 rounded-lg border-2 transition-all",
                    category === cat
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{config.label}</span>
                  </div>
                  <span className="text-xs text-muted-foreground text-left">
                    {config.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {category === "variant" && availableReplies.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Reference Other Replies</label>
          <Popover open={openReplySelect} onOpenChange={setOpenReplySelect}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openReplySelect}
                className="w-full justify-between"
              >
                {selectedReplies.length > 0
                  ? `${selectedReplies.length} selected`
                  : "Search replies..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search replies..." />
                <CommandEmpty>No replies found.</CommandEmpty>
                <CommandGroup className="max-h-64 overflow-auto">
                  {availableReplies.map((reply) => (
                    <CommandItem
                      key={reply.id}
                      onSelect={() => toggleReplySelection(reply)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedReplies.find((r) => r.id === reply.id)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      <div className="flex flex-col gap-1">
                        <CategoryBadge category={reply.category} />
                        <span className="text-xs text-muted-foreground line-clamp-1">
                          {reply.text}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          {selectedReplies.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedReplies.map((ref) => (
                <div
                  key={ref.id}
                  className="text-xs bg-muted px-2 py-1 rounded-md flex items-center gap-1"
                >
                  <CategoryBadge category={ref.category} />
                  <span className="max-w-[200px] truncate">{ref.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {category && replyType !== 'question' && (
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Title {category === 'proposal' ? '' : '(optional)'}
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Brief title..."
            required={category === 'proposal'}
          />
        </div>
      )}

      {(category || replyType === 'question') && (
        <div className="space-y-2">
          <label className="text-sm font-medium">
            {replyType === 'question' ? 'Your Question' : 'Your Response'}
          </label>
          <RichTextarea
            value={text}
            onChange={setText}
            placeholder={replyType === 'question' ? 'What would you like to know?' : 'Share your thoughts...'}
            className="min-h-[120px]"
          />
        </div>
      )}

      {category === "variant" && isProposalType && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Solution Level (optional)</Label>
          <p className="text-xs text-muted-foreground">
            Leave empty to keep the same level as the original, or select a different level
          </p>
          <Select 
            value={variantSolutionLevel} 
            onValueChange={(value) => setVariantSolutionLevel(value as SolutionLevel)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Same as original" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="class">Class</SelectItem>
              <SelectItem value="school">School</SelectItem>
              <SelectItem value="ministries">Ministries</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {category === "proposal" && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Where can this be solved?</Label>
          <Select 
            value={proposalSolutionLevel} 
            onValueChange={(value) => setProposalSolutionLevel(value as SolutionLevel)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select solution level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="class">Class</SelectItem>
              <SelectItem value="school">School</SelectItem>
              <SelectItem value="ministries">Ministries</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {category === "objection" && (
        <div className="space-y-4 border-t border-border pt-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="counterProposal"
              checked={hasCounterProposal}
              onCheckedChange={(checked) => setHasCounterProposal(checked as boolean)}
            />
            <Label htmlFor="counterProposal" className="text-sm font-medium cursor-pointer">
              Add a counter-proposal
            </Label>
          </div>

          {hasCounterProposal && (
            <div className="space-y-4 pl-6">
              <div className="space-y-2">
                <Label htmlFor="counterProposalText" className="text-sm font-medium">
                  Counter-Proposal
                </Label>
                <RichTextarea
                  id="counterProposalText"
                  value={counterProposalText}
                  onChange={setCounterProposalText}
                  placeholder="Describe your alternative proposal..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="postAsConcern"
                    checked={postCounterAsConcern}
                    onCheckedChange={(checked) => setPostCounterAsConcern(checked as boolean)}
                  />
                  <Label htmlFor="postAsConcern" className="text-sm cursor-pointer">
                    Post as a counter-proposal concern on the forum
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Where can this be solved?</Label>
                  <Select 
                    value={counterProposalSolutionLevel} 
                    onValueChange={(value) => setCounterProposalSolutionLevel(value as SolutionLevel)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select solution level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="class">Class</SelectItem>
                      <SelectItem value="school">School</SelectItem>
                      <SelectItem value="ministries">Ministries</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={!category || !text.trim() || (category === 'proposal' && !title.trim())}
        >
          Submit {replyType === 'question' ? 'Question' : 'Response'}
        </Button>
      </div>
    </form>
  );
};