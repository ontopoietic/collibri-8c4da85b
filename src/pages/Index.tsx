import { useState } from "react";
import { ConcernCard } from "@/components/ConcernCard";
import { NewConcernDialog } from "@/components/NewConcernDialog";
import { Concern, ConcernType } from "@/types/concern";
import { mockConcerns } from "@/data/mockData";
import { Users } from "lucide-react";

const Index = () => {
  const [concerns, setConcerns] = useState<Concern[]>(mockConcerns);

  const handleNewConcern = (type: ConcernType, title: string, description: string) => {
    const newConcern: Concern = {
      id: Date.now().toString(),
      type,
      title,
      description,
      votes: 0,
      replies: [],
      timestamp: new Date(),
    };
    setConcerns([newConcern, ...concerns]);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Users className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Civic Voice</h1>
                <p className="text-sm text-muted-foreground">Democratic Participation Platform</p>
              </div>
            </div>
            <NewConcernDialog onSubmit={handleNewConcern} />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Community Concerns</h2>
          <p className="text-muted-foreground">
            Share problems, propose solutions, and engage in structured democratic discourse.
          </p>
        </div>

        <div className="space-y-4">
          {concerns.map((concern) => (
            <ConcernCard key={concern.id} concern={concern} />
          ))}
        </div>

        {concerns.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-4">No concerns yet.</p>
            <p className="text-muted-foreground">Be the first to share a concern!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
