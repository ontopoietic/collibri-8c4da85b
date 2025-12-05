import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, AlertTriangle, Lightbulb, Scale } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { mockConcerns } from "@/data/mockData";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { GlassOverlay } from "@/components/GlassOverlay";

const typeConfig = {
  problem: {
    label: "Problem",
    icon: AlertTriangle,
    className: "bg-transparent text-problem-aspect border-problem-aspect",
  },
  proposal: {
    label: "Proposal",
    icon: Lightbulb,
    className: "bg-proposal/10 text-proposal border-proposal/20",
  },
  "counter-proposal": {
    label: "Counter-Proposal",
    icon: Scale,
    className: "bg-primary/10 text-primary border-primary/20",
  },
};

const ConcernDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const concern = mockConcerns.find((c) => c.id === id);

  if (!concern) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2 text-foreground">Concern not found</h2>
          <Button onClick={() => navigate("/")}>Return to Feed</Button>
        </div>
      </div>
    );
  }

  const config = typeConfig[concern.type];
  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <div className="sticky top-0 z-10">
        <GlassOverlay direction="down" />
        <div className="relative max-w-4xl mx-auto px-2 sm:px-4 py-3">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Forum</span>
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-8">
        <div className="bg-card rounded-lg p-4 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-start justify-between gap-4">
            <Badge variant="outline" className={config.className}>
              <Icon className="mr-1 h-3 w-3" />
              {config.label}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(concern.timestamp, { addSuffix: true })}
            </span>
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-4 text-foreground">{concern.title}</h1>
            <p className="text-foreground leading-relaxed text-lg">{concern.description}</p>
          </div>

          <div className="text-muted-foreground">
            <p>{concern.replies.length} replies • {concern.votes} votes</p>
          </div>
        </div>
      </div>

      <MobileBottomNav
        concernDetailMode={true}
        onEndorse={() => {}}
        onObject={() => {}}
        onAskQuestion={() => {}}
      />
    </div>
  );
};

export default ConcernDetail;
