import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReplyFormProps {
  onSubmit: (
    category: ReplyCategory,
    text: string,
    referencedReplies?: ReplyReference[],
    counterProposal?: { text: string; postedAsConcern?: boolean; solutionLevel?: SolutionLevel }
  ) => void;
  onCancel: () => void;
  allowedCategories?: ReplyCategory[];
  originalText?: string;
  availableReplies?: Reply[];
}

const allCategories: ReplyCategory[] = ["objection", "proposal", "pro-argument", "variant"];

export const ReplyForm = ({
  onSubmit,
  onCancel,
  allowedCategories = allCategories,
  originalText = "",
  availableReplies = [],
}: ReplyFormProps) => {
  const [category, setCategory] = useState<ReplyCategory | "">("");
  const [text, setText] = useState("");
  const [selectedReplies, setSelectedReplies] = useState<ReplyReference[]>([]);
  const [openReplySelect, setOpenReplySelect] = useState(false);
  const [hasCounterProposal, setHasCounterProposal] = useState(false);
  const [counterProposalText, setCounterProposalText] = useState("");
  const [postCounterAsConcern, setPostCounterAsConcern] = useState(false);
  const [counterProposalSolutionLevel, setCounterProposalSolutionLevel] = useState<SolutionLevel | "">("");

  useEffect(() => {
    if (category === "variant" && originalText) {
      setText(originalText);
    }
  }, [category, originalText]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (category && text.trim()) {
      const counterProposal = hasCounterProposal && counterProposalText.trim()
        ? { 
            text: counterProposalText, 
            postedAsConcern: postCounterAsConcern,
            solutionLevel: counterProposalSolutionLevel ? counterProposalSolutionLevel as SolutionLevel : undefined
          }
        : undefined;
      
      onSubmit(
        category as ReplyCategory,
        text,
        selectedReplies.length > 0 ? selectedReplies : undefined,
        counterProposal
      );
      setCategory("");
      setText("");
      setSelectedReplies([]);
      setHasCounterProposal(false);
      setCounterProposalText("");
      setPostCounterAsConcern(false);
      setCounterProposalSolutionLevel("");
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
    <form onSubmit={handleSubmit} className="space-y-4 bg-card p-4 rounded-lg border border-border">
      <div className="space-y-2">
        <label className="text-sm font-medium">Response Category</label>
        <Select value={category} onValueChange={(value) => setCategory(value as ReplyCategory)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {allowedCategories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                <div className="flex items-center gap-2">
                  <CategoryBadge category={cat} />
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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

      <div className="space-y-2">
        <label className="text-sm font-medium">Your Response</label>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your thoughts..."
          className="min-h-[120px]"
        />
      </div>

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
                <Textarea
                  id="counterProposalText"
                  value={counterProposalText}
                  onChange={(e) => setCounterProposalText(e.target.value)}
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
        <Button type="submit" disabled={!category || !text.trim()}>
          Submit Response
        </Button>
      </div>
    </form>
  );
};
