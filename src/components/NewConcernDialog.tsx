import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { ConcernType } from "@/types/concern";

interface NewConcernDialogProps {
  onSubmit: (type: ConcernType, title: string, description: string) => void;
}

export const NewConcernDialog = ({ onSubmit }: NewConcernDialogProps) => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<ConcernType | "">("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type && title.trim() && description.trim()) {
      onSubmit(type as ConcernType, title, description);
      setType("");
      setTitle("");
      setDescription("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
          New Concern
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Share a New Concern</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Type</label>
            <Select value={type} onValueChange={(value) => setType(value as ConcernType)}>
              <SelectTrigger>
                <SelectValue placeholder="Select concern type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="problem">Problem</SelectItem>
                <SelectItem value="proposal">Proposal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief summary of your concern..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide details about your concern..."
              className="min-h-[150px]"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!type || !title.trim() || !description.trim()}>
              Submit Concern
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
