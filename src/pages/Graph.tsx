import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as d3 from "d3";
import { mockConcerns } from "@/data/mockData";
import { Concern, Reply } from "@/types/concern";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { NavigationHeader } from "@/components/NavigationHeader";

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
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight - 120 });
  const [legendOpen, setLegendOpen] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight - 120 });
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
        
        // Determine color based on reply category (skip questions)
        if (reply.category === "question") return;
        
        let color = "#94a3b8"; // default gray
        if (reply.category === "objection") color = "#FF755D";
        else if (reply.category === "proposal") color = "#3D5EF4";
        else if (reply.category === "pro-argument") color = "#74E09B";
        else if (reply.category === "variant") color = "#9B49FD";
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
      let color = "#3D5EF4"; // default blue
      if (concern.type === "problem") color = "#EFC90E";
      else if (concern.type === "proposal") color = "#3D5EF4";
      else if (concern.type === "counter-proposal") color = "#8097FF";

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

    // Apply initial zoom-out immediately (before simulation starts)
    const initialScale = 0.6;
    const initialTransform = d3.zoomIdentity
      .translate(dimensions.width / 2 * (1 - initialScale), dimensions.height / 2 * (1 - initialScale))
      .scale(initialScale);
    svg.call(zoom.transform, initialTransform);

    // Create simulation
    const simulation = d3.forceSimulation<GraphNode>(nodes)
      .force("link", d3.forceLink<GraphNode, GraphLink>(links).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(dimensions.width / 2, dimensions.height / 2))
      .force("collision", d3.forceCollide<GraphNode>().radius(d => d.radius + 10));

    // Zoom to fit all nodes after simulation stabilizes
    simulation.on("end", () => {
      if (nodes.length === 0) return;
      
      // Calculate bounds of all nodes
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      nodes.forEach(node => {
        if (node.x !== undefined && node.y !== undefined) {
          minX = Math.min(minX, node.x - node.radius);
          maxX = Math.max(maxX, node.x + node.radius);
          minY = Math.min(minY, node.y - node.radius);
          maxY = Math.max(maxY, node.y + node.radius);
        }
      });
      
      const padding = 80;
      const graphWidth = maxX - minX + padding * 2;
      const graphHeight = maxY - minY + padding * 2;
      
      // Calculate base scale to fit
      const baseScale = Math.min(
        dimensions.width / graphWidth,
        dimensions.height / graphHeight,
        0.8
      );
      
      // Make it 50% closer to 1.0 (less zoomed out)
      const scale = baseScale + (1 - baseScale) * 0.5;
      
      // Calculate center offset
      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;
      
      const translateX = dimensions.width / 2 - centerX * scale;
      const translateY = dimensions.height / 2 - centerY * scale;
      
      // Apply zoom transform with smooth transition
      const finalTransform = d3.zoomIdentity
        .translate(translateX, translateY)
        .scale(scale);
      
      svg.transition()
        .duration(300)
        .call(zoom.transform, finalTransform);
    });

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
      <NavigationHeader />

      <main className="relative w-full" style={{ height: "calc(100vh - 120px)" }}>
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
                <div className="w-4 h-4 rounded-full bg-[#EFC90E]"></div>
                <span>Problems</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#3D5EF4]"></div>
                <span>Proposals</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#8097FF]"></div>
                <span>Counter-Proposals</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#9B49FD]"></div>
                <span>Variants</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#FF755D]"></div>
                <span>Objections</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#74E09B]"></div>
                <span>Pro-Arguments</span>
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
