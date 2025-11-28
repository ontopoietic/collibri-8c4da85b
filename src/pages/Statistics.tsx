import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MessageSquare, ThumbsUp, FileText } from "lucide-react";
import { mockConcerns } from "@/data/mockData";
import { Phase } from "@/types/concern";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

const Statistics = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"interval" | "phase">("interval");
  const [selectedPhase, setSelectedPhase] = useState<Phase>("school");
  
  const handlePhaseClick = (phase: Phase) => {
    setSelectedPhase(phase);
  };

  // Filter data based on view mode
  const displayConcerns = viewMode === "interval" 
    ? mockConcerns 
    : mockConcerns.filter(c => c.phase === selectedPhase);

  // Calculate statistics
  const totalConcerns = displayConcerns.length;
  const totalVotes = displayConcerns.reduce((sum, c) => sum + c.votes, 0);
  
  const getAllReplies = (replies: any[]): any[] => {
    let allReplies: any[] = [];
    replies.forEach((reply) => {
      allReplies.push(reply);
      if (reply.replies.length > 0) {
        allReplies = allReplies.concat(getAllReplies(reply.replies));
      }
    });
    return allReplies;
  };

  const allReplies = displayConcerns.flatMap((c) => getAllReplies(c.replies));
  const totalReplies = allReplies.length;
  const totalReplyVotes = allReplies.reduce((sum, r) => sum + r.votes, 0);

  // Concern type distribution
  const concernTypeData = [
    {
      name: "Problems",
      count: displayConcerns.filter((c) => c.type === "problem").length,
    },
    {
      name: "Proposals",
      count: displayConcerns.filter((c) => c.type === "proposal").length,
    },
    {
      name: "Counter-Proposals",
      count: displayConcerns.filter((c) => c.type === "counter-proposal").length,
    },
  ];

  // Phase distribution (only for interval view)
  const phaseData = viewMode === "interval" ? [
    {
      name: "Class Phase",
      count: mockConcerns.filter((c) => c.phase === "class").length,
    },
    {
      name: "Grade Phase",
      count: mockConcerns.filter((c) => c.phase === "grade").length,
    },
    {
      name: "School Phase",
      count: mockConcerns.filter((c) => c.phase === "school").length,
    },
  ] : [];

  // Reply category distribution
  const replyCategoryData = [
    {
      name: "Objections",
      count: allReplies.filter((r) => r.category === "objection").length,
    },
    {
      name: "Proposals",
      count: allReplies.filter((r) => r.category === "proposal").length,
    },
    {
      name: "Pro-Arguments",
      count: allReplies.filter((r) => r.category === "pro-argument").length,
    },
    {
      name: "Variants",
      count: allReplies.filter((r) => r.category === "variant").length,
    },
  ];

  // Activity by grade (mock data for 12 grades)
  const gradeActivity = [
    { grade: "Grade 1", posts: 12, votes: 34 },
    { grade: "Grade 2", posts: 15, votes: 42 },
    { grade: "Grade 3", posts: 18, votes: 51 },
    { grade: "Grade 4", posts: 23, votes: 67 },
    { grade: "Grade 5", posts: 28, votes: 79 },
    { grade: "Grade 6", posts: 31, votes: 88 },
    { grade: "Grade 7", posts: 35, votes: 102 },
    { grade: "Grade 8", posts: 41, votes: 118 },
    { grade: "Grade 9", posts: 38, votes: 110 },
    { grade: "Grade 10", posts: 44, votes: 125 },
    { grade: "Grade 11", posts: 47, votes: 134 },
    { grade: "Grade 12", posts: 52, votes: 148 },
  ];

  // Active users timeline (mock data)
  const activeUsersTimeline = [
    { date: "Week 1", users: 45 },
    { date: "Week 2", users: 67 },
    { date: "Week 3", users: 89 },
    { date: "Week 4", users: 103 },
    { date: "Week 5", users: 98 },
    { date: "Week 6", users: 112 },
    { date: "Week 7", users: 128 },
    { date: "Week 8", users: 134 },
  ];

  // Engagement over time with reply categories
  const engagementByDate = new Map<string, { 
    concerns: number; 
    objections: number;
    proposals: number;
    proArguments: number;
    variants: number;
  }>();
  
  displayConcerns.forEach((c) => {
    const date = new Date(c.timestamp).toLocaleDateString();
    if (!engagementByDate.has(date)) {
      engagementByDate.set(date, { concerns: 0, objections: 0, proposals: 0, proArguments: 0, variants: 0 });
    }
    const entry = engagementByDate.get(date)!;
    entry.concerns++;
    
    const concernReplies = getAllReplies(c.replies);
    concernReplies.forEach((reply) => {
      if (reply.category === "objection") entry.objections++;
      else if (reply.category === "proposal") entry.proposals++;
      else if (reply.category === "pro-argument") entry.proArguments++;
      else if (reply.category === "variant") entry.variants++;
    });
  });

  const engagementData = Array.from(engagementByDate.entries())
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Vote distribution by reply category
  const votesByCategoryData = [
    {
      name: "Objections",
      votes: allReplies.filter((r) => r.category === "objection").reduce((sum, r) => sum + r.votes, 0),
    },
    {
      name: "Proposals",
      votes: allReplies.filter((r) => r.category === "proposal").reduce((sum, r) => sum + r.votes, 0),
    },
    {
      name: "Pro-Arguments",
      votes: allReplies.filter((r) => r.category === "pro-argument").reduce((sum, r) => sum + r.votes, 0),
    },
    {
      name: "Variants",
      votes: allReplies.filter((r) => r.category === "variant").reduce((sum, r) => sum + r.votes, 0),
    },
  ].filter(item => item.votes > 0);

  // Reply type ratios
  const objectionCount = allReplies.filter((r) => r.category === "objection").length;
  const proArgumentCount = allReplies.filter((r) => r.category === "pro-argument").length;
  const proposalCount = allReplies.filter((r) => r.category === "proposal").length;
  const variantCount = allReplies.filter((r) => r.category === "variant").length;

  const replyRatios = [
    {
      name: "Pro-Arguments per Objection",
      ratio: objectionCount > 0 ? (proArgumentCount / objectionCount).toFixed(2) : "N/A",
    },
    {
      name: "Proposals per Objection",
      ratio: objectionCount > 0 ? (proposalCount / objectionCount).toFixed(2) : "N/A",
    },
    {
      name: "Objections per Proposal",
      ratio: proposalCount > 0 ? (objectionCount / proposalCount).toFixed(2) : "N/A",
    },
    {
      name: "Variants per Concern",
      ratio: totalConcerns > 0 ? (variantCount / totalConcerns).toFixed(2) : "N/A",
    },
  ];

  const COLORS = ["hsl(var(--objection))", "hsl(var(--proposal))", "hsl(var(--primary))", "hsl(var(--pro-argument))"];
  
  const CONCERN_TYPE_COLORS: { [key: string]: string } = {
    "Problems": "hsl(var(--objection))",
    "Proposals": "hsl(var(--proposal))",
    "Counter-Proposals": "hsl(var(--variant))",
  };
  
  const CATEGORY_COLORS: { [key: string]: string } = {
    "Objections": "hsl(var(--objection))",
    "Proposals": "hsl(var(--proposal))",
    "Pro-Arguments": "hsl(var(--pro-argument))",
    "Variants": "hsl(var(--variant))",
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Feed
        </Button>

        <h1 className="text-4xl font-bold mb-4 text-foreground">Platform Statistics</h1>
        
        <div className="flex gap-2 mb-8">
          <Button
            variant={viewMode === "interval" ? "default" : "outline"}
            onClick={() => setViewMode("interval")}
          >
            Full Interval
          </Button>
          <Button
            variant={viewMode === "phase" ? "default" : "outline"}
            onClick={() => setViewMode("phase")}
          >
            Phase View
          </Button>
          {viewMode === "phase" && (
            <>
              <Button
                variant={selectedPhase === "class" ? "default" : "outline"}
                onClick={() => handlePhaseClick("class")}
              >
                Class Phase
              </Button>
              <Button
                variant={selectedPhase === "grade" ? "default" : "outline"}
                onClick={() => handlePhaseClick("grade")}
              >
                Grade Phase
              </Button>
              <Button
                variant={selectedPhase === "school" ? "default" : "outline"}
                onClick={() => handlePhaseClick("school")}
              >
                School Phase
              </Button>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Total Concerns</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalConcerns}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Total Replies</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalReplies}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Concern Votes</CardTitle>
              <ThumbsUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalVotes}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Reply Votes</CardTitle>
              <ThumbsUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalReplyVotes}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Participation Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="concerns" stroke="hsl(var(--primary))" strokeWidth={3} name="Concerns" />
                  <Line type="monotone" dataKey="objections" stroke="hsl(var(--destructive))" strokeWidth={3} name="Objections" />
                  <Line type="monotone" dataKey="proposals" stroke="hsl(var(--proposal))" strokeWidth={3} name="Proposals" />
                  <Line type="monotone" dataKey="proArguments" stroke="hsl(var(--pro-argument))" strokeWidth={3} name="Pro-Arguments" />
                  <Line type="monotone" dataKey="variants" stroke="hsl(var(--variant))" strokeWidth={3} name="Variants" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Concern Types Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={concernTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => entry.name}
                    outerRadius={80}
                    fill="hsl(var(--primary))"
                    dataKey="count"
                    stroke="none"
                  >
                    {concernTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CONCERN_TYPE_COLORS[entry.name] || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Reply Categories Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={replyCategoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {replyCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Vote Distribution by Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={votesByCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.votes}`}
                    outerRadius={80}
                    fill="hsl(var(--primary))"
                    dataKey="votes"
                    stroke="none"
                  >
                    {votesByCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Reply Type Ratios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {replyRatios.map((ratio, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium text-foreground">{ratio.name}</span>
                    <span className="text-lg font-bold text-foreground">{ratio.ratio}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Activity by Grade</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={gradeActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="grade" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="posts" stackId="a" fill="hsl(var(--primary))" name="Posts" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="votes" stackId="a" fill="hsl(var(--proposal))" name="Votes" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Active Users Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={activeUsersTimeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Active Users"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default Statistics;
