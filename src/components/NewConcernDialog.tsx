import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, AlertTriangle, Lightbulb } from "lucide-react";
import { ConcernType, SolutionLevel } from "@/types/concern";
import { cn } from "@/lib/utils";

interface NewConcernDialogProps {
  onSubmit: (type: ConcernType, title: string, description: string, solutionLevel?: SolutionLevel) => void;
}

export const NewConcernDialog = ({ onSubmit }: NewConcernDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isProblem, setIsProblem] = useState(false);
  const [isSolution, setIsSolution] = useState(false);
  const [problemTitle, setProblemTitle] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [solutionTitle, setSolutionTitle] = useState("");
  const [solutionDescription, setSolutionDescription] = useState("");
  const [solutionLevel, setSolutionLevel] = useState<SolutionLevel | "">("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Submit problem if selected
    if (isProblem && problemTitle.trim() && problemDescription.trim()) {
      onSubmit("problem", problemTitle, problemDescription);
    }
    
    // Submit solution if selected
    if (isSolution && solutionTitle.trim() && solutionDescription.trim()) {
      const solution = solutionLevel ? solutionLevel as SolutionLevel : undefined;
      onSubmit("proposal", solutionTitle, solutionDescription, solution);
    }
    
    // Reset form
    setIsProblem(false);
    setIsSolution(false);
    setProblemTitle("");
    setProblemDescription("");
    setSolutionTitle("");
    setSolutionDescription("");
    setSolutionLevel("");
    setOpen(false);
  };

  const canSubmit = (isProblem && problemTitle.trim() && problemDescription.trim()) || 
                    (isSolution && solutionTitle.trim() && solutionDescription.trim());

  return (
    <>
      <Button 
        size="lg" 
        className="gap-2 bg-new-concern text-new-concern-foreground hover:bg-new-concern"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-5 w-5" />
        New Concern
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Share a New Concern</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-medium">What would you like to share?</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setIsProblem(!isProblem)}
              className={cn(
                "flex flex-col items-start gap-2 p-4 rounded-lg border-2 transition-all",
                isProblem
                  ? "border-destructive bg-destructive/5"
                  : "border-border bg-card hover:bg-muted/50"
              )}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <span className="font-medium">Problem</span>
              </div>
              <span className="text-xs text-muted-foreground text-left">
                Share an issue that needs attention
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsSolution(!isSolution)}
              className={cn(
                "flex flex-col items-start gap-2 p-4 rounded-lg border-2 transition-all",
                isSolution
                  ? "border-proposal bg-proposal/5"
                  : "border-border bg-card hover:bg-muted/50"
              )}
            >
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-proposal" />
                <span className="font-medium">Solution</span>
              </div>
              <span className="text-xs text-muted-foreground text-left">
                Propose a solution or improvement
              </span>
            </button>
          </div>
        </div>

        {isProblem && (
          <div className="space-y-4 p-4 rounded-lg border border-destructive/20 bg-destructive/5">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <h3 className="font-medium">Problem</h3>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={problemTitle}
                onChange={(e) => setProblemTitle(e.target.value)}
                placeholder="Brief summary of the problem..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                placeholder="Provide details about the problem..."
                className="min-h-[120px]"
              />
            </div>
          </div>
        )}

        {isSolution && (
          <div className="space-y-4 p-4 rounded-lg border border-proposal/20 bg-proposal/5">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-proposal" />
              <h3 className="font-medium">Solution</h3>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={solutionTitle}
                onChange={(e) => setSolutionTitle(e.target.value)}
                placeholder="Brief summary of your solution..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={solutionDescription}
                onChange={(e) => setSolutionDescription(e.target.value)}
                placeholder="Provide details about your solution..."
                className="min-h-[120px]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Where can this be solved?</label>
              <Select value={solutionLevel} onValueChange={(value) => setSolutionLevel(value as SolutionLevel)}>
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
        )}

        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={!canSubmit}>
            Submit Concern{(isProblem && isSolution) ? 's' : ''}
          </Button>
        </div>
      </form>
        </DialogContent>
      </Dialog>
    </>
  );
};