import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReplyCategory } from "@/types/concern";
import { CategoryBadge } from "./CategoryBadge";

interface ReplyFormProps {
  onSubmit: (category: ReplyCategory, text: string) => void;
  onCancel: () => void;
  allowedCategories?: ReplyCategory[];
}

const allCategories: ReplyCategory[] = ["objection", "proposal", "pro-argument", "variant"];

export const ReplyForm = ({
  onSubmit,
  onCancel,
  allowedCategories = allCategories,
}: ReplyFormProps) => {
  const [category, setCategory] = useState<ReplyCategory | "">("");
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (category && text.trim()) {
      onSubmit(category as ReplyCategory, text);
      setCategory("");
      setText("");
    }
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

      <div className="space-y-2">
        <label className="text-sm font-medium">Your Response</label>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your thoughts..."
          className="min-h-[120px]"
        />
      </div>

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
