import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ForceGraph2D from "react-force-graph-2d";
import { mockConcerns } from "@/data/mockData";
import { Concern, Reply } from "@/types/concern";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import collibriLogo from "@/assets/collibri-logo.png";

interface GraphNode {
  id: string;
  label: string;
  type: "concern" | "reply";
  concernType?: "problem" | "proposal" | "counter-proposal";
  val: number;
  color: string;
}

interface GraphLink {
  source: string;
  target: string;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

const Graph = () => {
  const navigate = useNavigate();
  const graphRef = useRef<any>();
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];

    // Helper function to process replies recursively
    const processReplies = (replies: Reply[], parentId: string) => {
      replies.forEach((reply) => {
        const replyNodeId = `reply-${reply.id}`;
        
        // Determine color based on reply category
        let color = "#94a3b8"; // default gray
        if (reply.category === "objection") color = "#ef4444";
        else if (reply.category === "proposal") color = "#f59e0b";
        else if (reply.category === "pro-argument") color = "#22c55e";
        else if (reply.category === "variant") color = "#8b5cf6";
        else if (reply.category === "question") color = "#3b82f6";

        nodes.push({
          id: replyNodeId,
          label: reply.text.substring(0, 50) + (reply.text.length > 50 ? "..." : ""),
          type: "reply",
          val: 3,
          color,
        });

        links.push({
          source: parentId,
          target: replyNodeId,
        });

        // Recursively process nested replies
        if (reply.replies && reply.replies.length > 0) {
          processReplies(reply.replies, replyNodeId);
        }
      });
    };

    // Process all concerns
    mockConcerns.forEach((concern: Concern) => {
      const concernNodeId = `concern-${concern.id}`;
      
      // Determine color based on concern type
      let color = "#3b82f6"; // default blue
      if (concern.type === "problem") color = "#dc2626";
      else if (concern.type === "proposal") color = "#f59e0b";
      else if (concern.type === "counter-proposal") color = "#8b5cf6";

      nodes.push({
        id: concernNodeId,
        label: concern.title,
        type: "concern",
        concernType: concern.type,
        val: 10, // Concerns are larger
        color,
      });

      // Process replies
      if (concern.replies && concern.replies.length > 0) {
        processReplies(concern.replies, concernNodeId);
      }
    });

    setGraphData({ nodes, links });
  }, []);

  const handleNodeClick = (node: any) => {
    if (node.type === "concern") {
      const concernId = node.id.replace("concern-", "");
      navigate(`/concern/${concernId}`);
    } else if (node.type === "reply") {
      // Find the concern that contains this reply
      const findConcernForReply = (replyId: string): string | null => {
        for (const concern of mockConcerns) {
          const searchReplies = (replies: Reply[]): boolean => {
            for (const reply of replies) {
              if (`reply-${reply.id}` === replyId) return true;
              if (reply.replies && searchReplies(reply.replies)) return true;
            }
            return false;
          };
          if (searchReplies(concern.replies)) {
            return concern.id;
          }
        }
        return null;
      };

      const concernId = findConcernForReply(node.id);
      if (concernId) {
        navigate(`/concern/${concernId}`);
      }
    }
  };

  const handleNodeHover = (node: any, event: MouseEvent) => {
    if (node) {
      setHoveredNode(node);
      setTooltipPos({ x: event.clientX, y: event.clientY });
    } else {
      setHoveredNode(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={collibriLogo} alt="Collibri" className="h-10 w-10" />
              <h1 className="text-3xl font-bold text-foreground">Concern Network</h1>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Forum
            </Button>
          </div>
        </div>
      </header>

      <main className="relative w-full" style={{ height: "calc(100vh - 88px)" }}>
        <div className="absolute top-4 left-4 bg-card border border-border rounded-lg p-4 z-10 shadow-lg">
          <h3 className="font-semibold mb-2 text-foreground">Legend</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#dc2626]"></div>
              <span>Problems</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#f59e0b]"></div>
              <span>Proposals</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#8b5cf6]"></div>
              <span>Counter-Proposals / Variants</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#ef4444]"></div>
              <span>Objections</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#22c55e]"></div>
              <span>Pro-Arguments</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#3b82f6]"></div>
              <span>Questions</span>
            </div>
          </div>
        </div>

        <ForceGraph2D
          ref={graphRef}
          graphData={graphData}
          nodeLabel=""
          nodeAutoColorBy="type"
          linkDirectionalParticles={2}
          linkDirectionalParticleSpeed={0.005}
          onNodeClick={handleNodeClick}
          onNodeHover={handleNodeHover}
          nodeCanvasObject={(node: any, ctx, globalScale) => {
            const label = node.label;
            const fontSize = node.type === "concern" ? 14 / globalScale : 10 / globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            
            // Draw node
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.val, 0, 2 * Math.PI);
            ctx.fillStyle = node.color;
            ctx.fill();
            
            // Draw stroke
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 2 / globalScale;
            ctx.stroke();

            // Draw label for concerns
            if (node.type === "concern") {
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillStyle = "#fff";
              ctx.fillText(label, node.x, node.y + node.val + 10 / globalScale);
            }
          }}
          backgroundColor="#0a0a0a"
          width={window.innerWidth}
          height={window.innerHeight - 88}
        />

        {hoveredNode && (
          <div
            className="fixed z-20 bg-card border border-border rounded-lg p-3 shadow-xl max-w-xs pointer-events-none"
            style={{
              left: tooltipPos.x + 10,
              top: tooltipPos.y + 10,
            }}
          >
            <p className="font-semibold text-foreground mb-1">
              {hoveredNode.type === "concern" ? "Concern" : "Reply"}
            </p>
            <p className="text-sm text-muted-foreground">{hoveredNode.label}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Graph;
