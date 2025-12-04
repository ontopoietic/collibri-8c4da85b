import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as d3 from "d3";
import { mockConcerns } from "@/data/mockData";
import { Concern, Reply } from "@/types/concern";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import collibriLogo from "@/assets/collibri-logo.png";

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  type: "concern" | "reply";
  concernType?: "problem" | "proposal" | "counter-proposal";
  replyCategory?: string;
  color: string;
  radius: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
}

const Graph = () => {
  const navigate = useNavigate();
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; label: string } | null>(null);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight - 88 });
  const [legendOpen, setLegendOpen] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight - 88 });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

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
          replyCategory: reply.category,
          color,
          radius: 8,
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
        color,
        radius: 16,
      });

      // Process replies
      if (concern.replies && concern.replies.length > 0) {
        processReplies(concern.replies, concernNodeId);
      }
    });

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)
      .attr("viewBox", [0, 0, dimensions.width, dimensions.height]);

    // Add zoom behavior
    const g = svg.append("g");
    
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Create simulation
    const simulation = d3.forceSimulation<GraphNode>(nodes)
      .force("link", d3.forceLink<GraphNode, GraphLink>(links).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(dimensions.width / 2, dimensions.height / 2))
      .force("collision", d3.forceCollide<GraphNode>().radius(d => d.radius + 10));

    // Create links
    const link = g.append("g")
      .attr("stroke", "#666")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 2);

    // Create nodes
    const node = g.append("g")
      .selectAll<SVGCircleElement, GraphNode>("circle")
      .data(nodes)
      .join("circle")
      .attr("r", d => d.radius)
      .attr("fill", d => d.color)
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this)
          .attr("stroke-width", 4)
          .attr("r", d.radius * 1.2);
        
        setTooltip({
          x: event.pageX,
          y: event.pageY,
          label: d.label
        });
      })
      .on("mouseout", function(event, d) {
        d3.select(this)
          .attr("stroke-width", 2)
          .attr("r", d.radius);
        
        setTooltip(null);
      })
      .on("click", (event, d) => {
        if (d.type === "concern") {
          const concernId = d.id.replace("concern-", "");
          navigate(`/concern/${concernId}`);
        } else if (d.type === "reply") {
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

          const concernId = findConcernForReply(d.id);
          if (concernId) {
            navigate(`/concern/${concernId}`);
          }
        }
      })
      .call(d3.drag<SVGCircleElement, GraphNode>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
      );

    // Add labels for concern nodes
    const labels = g.append("g")
      .selectAll("text")
      .data(nodes.filter(d => d.type === "concern"))
      .join("text")
      .text(d => d.label)
      .attr("font-size", 12)
      .attr("fill", "#fff")
      .attr("text-anchor", "middle")
      .attr("dy", d => d.radius + 15)
      .style("pointer-events", "none");

    // Update positions on each tick
    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as GraphNode).x!)
        .attr("y1", d => (d.source as GraphNode).y!)
        .attr("x2", d => (d.target as GraphNode).x!)
        .attr("y2", d => (d.target as GraphNode).y!);

      node
        .attr("cx", d => d.x!)
        .attr("cy", d => d.y!);

      labels
        .attr("x", d => d.x!)
        .attr("y", d => d.y!);
    });

    return () => {
      simulation.stop();
    };
  }, [dimensions, navigate]);

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
        <Collapsible open={legendOpen} onOpenChange={setLegendOpen} className="absolute top-4 left-4 bg-card border border-border rounded-lg z-10 shadow-lg">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full flex items-center justify-between p-4 hover:bg-transparent">
              <span className="font-semibold text-foreground">Legend</span>
              {legendOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-4">
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
            <p className="text-xs text-muted-foreground mt-4">
              Drag nodes to rearrange. Scroll to zoom. Click to view concern.
            </p>
          </CollapsibleContent>
        </Collapsible>

        <svg
          ref={svgRef}
          className="w-full h-full"
          style={{ background: "hsl(var(--background))" }}
        />

        {tooltip && (
          <div
            className="fixed z-20 bg-card border border-border rounded-lg p-3 shadow-xl max-w-xs pointer-events-none"
            style={{
              left: tooltip.x + 10,
              top: tooltip.y + 10,
            }}
          >
            <p className="text-sm text-foreground">{tooltip.label}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Graph;
