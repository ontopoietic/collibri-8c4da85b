import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, ThumbsUp, FileText } from "lucide-react";
import { mockConcerns } from "@/data/mockData";
import { Phase } from "@/types/concern";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { NavigationHeader } from "@/components/NavigationHeader";
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
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState<"interval" | "phase">("interval");
  const [selectedPhase, setSelectedPhase] = useState<Phase>("school");
  const [hoveredLine, setHoveredLine] = useState<string | null>(null);
  
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

  // Activity by grade (mock data for grades 6-12)
  const gradeActivity = [
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

  // Phase date ranges (days ago)
  const phaseDateRanges: Record<Phase, { start: number; end: number }> = {
    class: { start: 95, end: 65 },
    grade: { start: 65, end: 30 },
    school: { start: 30, end: 0 },
  };

  // Helper to get a date X days ago
  const daysAgo = (days: number): Date => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  // Generate complete date range for even distribution
  const getDateRange = (startDate: Date, endDate: Date): string[] => {
    const dates: string[] = [];
    const current = new Date(startDate);
    current.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);
    while (current <= end) {
      dates.push(current.toLocaleDateString());
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  // Determine date range based on view mode
  const getTimelineRange = () => {
    if (viewMode === "phase") {
      const phaseRange = phaseDateRanges[selectedPhase];
      return {
        start: daysAgo(phaseRange.start),
        end: daysAgo(phaseRange.end)
      };
    } else {
      // For interval view, use fixed 95-day range (14 weeks)
      return { start: daysAgo(95), end: daysAgo(1) };
    }
  };

  const timelineRange = getTimelineRange();
  const fullDateRange = getDateRange(timelineRange.start, timelineRange.end);

  // Create engagementByDate map with all dates initialized to 0
  const engagementByDate = new Map<string, { 
    concerns: number; 
    objections: number;
    proposals: number;
    proArguments: number;
    variants: number;
  }>();
  
  // Initialize all dates with zeros
  fullDateRange.forEach(date => {
    engagementByDate.set(date, { concerns: 0, objections: 0, proposals: 0, proArguments: 0, variants: 0 });
  });
  
  // Populate with actual data - concerns on their own date
  displayConcerns.forEach((c) => {
    const date = new Date(c.timestamp).toLocaleDateString();
    if (engagementByDate.has(date)) {
      engagementByDate.get(date)!.concerns++;
    }
  });

  // Replies counted on their OWN timestamp, not the concern's date
  displayConcerns.forEach((c) => {
    const concernReplies = getAllReplies(c.replies);
    concernReplies.forEach((reply) => {
      const replyDate = new Date(reply.timestamp).toLocaleDateString();
      if (engagementByDate.has(replyDate)) {
        const entry = engagementByDate.get(replyDate)!;
        if (reply.category === "objection") entry.objections++;
        else if (reply.category === "proposal") entry.proposals++;
        else if (reply.category === "pro-argument") entry.proArguments++;
        else if (reply.category === "variant") entry.variants++;
      }
    });
  });

  const sortedEngagementEntries = Array.from(engagementByDate.entries())
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());

  // Daily data for phase view (with day numbers, date kept for tooltip)
  const dailyEngagementData = sortedEngagementEntries
    .map(([date, data], index) => ({ date, dayLabel: `${index + 1}`, ...data }));

  // Weekly aggregated data for full interval view
  const getWeeklyAggregatedData = () => {
    // Use the actual timeline range directly
    const startDate = new Date(timelineRange.start);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(timelineRange.end);
    endDate.setHours(0, 0, 0, 0);
    
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)) + 1;
    const totalWeeks = Math.ceil(totalDays / 7);
    
    // Initialize weekly buckets
    const weeklyData: Array<{
      weekLabel: string;
      concerns: number;
      objections: number;
      proposals: number;
      proArguments: number;
      variants: number;
    }> = [];
    
    for (let w = 1; w <= totalWeeks; w++) {
      weeklyData.push({
        weekLabel: `${w}`,
        concerns: 0,
        objections: 0,
        proposals: 0,
        proArguments: 0,
        variants: 0
      });
    }
    
    // Aggregate daily data into weeks using fullDateRange for consistent parsing
    fullDateRange.forEach((dateStr, index) => {
      const data = engagementByDate.get(dateStr);
      if (data) {
        const weekIndex = Math.floor(index / 7);
        if (weekIndex >= 0 && weekIndex < weeklyData.length) {
          weeklyData[weekIndex].concerns += data.concerns;
          weeklyData[weekIndex].objections += data.objections;
          weeklyData[weekIndex].proposals += data.proposals;
          weeklyData[weekIndex].proArguments += data.proArguments;
          weeklyData[weekIndex].variants += data.variants;
        }
      }
    });
    
    return weeklyData;
  };

  const weeklyEngagementData = getWeeklyAggregatedData();
  
  // Choose data based on view mode
  const engagementData = viewMode === "interval" ? weeklyEngagementData : dailyEngagementData;

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
      <NavigationHeader />
      
      <div className="max-w-7xl mx-auto px-4 py-8">

        <h1 className="text-4xl font-bold mb-4 text-foreground">Platform Statistics</h1>
        
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            variant={viewMode === "interval" ? "default" : "outline"}
            onClick={() => setViewMode("interval")}
            className={viewMode === "interval" ? "" : "hover:bg-[#CC0A71] hover:text-white hover:border-[#CC0A71]"}
            style={viewMode === "interval" ? { backgroundColor: '#CC0A71', borderColor: '#CC0A71', color: 'white' } : undefined}
          >
            Interval
          </Button>
          <Button
            variant={viewMode === "phase" && selectedPhase === "class" ? "default" : "outline"}
            onClick={() => {
              setViewMode("phase");
              setSelectedPhase("class");
            }}
            className={viewMode === "phase" && selectedPhase === "class" ? "" : "hover:bg-[#CC0A71] hover:text-white hover:border-[#CC0A71]"}
            style={viewMode === "phase" && selectedPhase === "class" ? { backgroundColor: '#CC0A71', borderColor: '#CC0A71', color: 'white' } : undefined}
          >
            Class
          </Button>
          <Button
            variant={viewMode === "phase" && selectedPhase === "grade" ? "default" : "outline"}
            onClick={() => {
              setViewMode("phase");
              setSelectedPhase("grade");
            }}
            className={viewMode === "phase" && selectedPhase === "grade" ? "" : "hover:bg-[#CC0A71] hover:text-white hover:border-[#CC0A71]"}
            style={viewMode === "phase" && selectedPhase === "grade" ? { backgroundColor: '#CC0A71', borderColor: '#CC0A71', color: 'white' } : undefined}
          >
            Grade
          </Button>
          <Button
            variant={viewMode === "phase" && selectedPhase === "school" ? "default" : "outline"}
            onClick={() => {
              setViewMode("phase");
              setSelectedPhase("school");
            }}
            className={viewMode === "phase" && selectedPhase === "school" ? "" : "hover:bg-[#CC0A71] hover:text-white hover:border-[#CC0A71]"}
            style={viewMode === "phase" && selectedPhase === "school" ? { backgroundColor: '#CC0A71', borderColor: '#CC0A71', color: 'white' } : undefined}
          >
            School
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
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
              <CardTitle className="text-foreground">
                {viewMode === "interval" ? "Weekly Participation" : "Daily Participation"}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
              <div className="w-full h-[250px] sm:h-[300px] lg:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={engagementData} margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={viewMode === "interval" ? "weekLabel" : "dayLabel"} tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                    <YAxis width={35} tick={{ fontSize: 11 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Legend 
                      wrapperStyle={{ fontSize: 12 }} 
                      onMouseEnter={(e) => {
                        const nameToDataKey: Record<string, string> = {
                          "Concerns": "concerns",
                          "Objections": "objections",
                          "Proposals": "proposals",
                          "Pro-Arguments": "proArguments",
                          "Variants": "variants"
                        };
                        if (e && e.value) {
                          setHoveredLine(nameToDataKey[e.value as string] || null);
                        }
                      }}
                      onMouseLeave={() => setHoveredLine(null)}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="concerns" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={hoveredLine === "concerns" ? 4 : 2} 
                      strokeOpacity={hoveredLine && hoveredLine !== "concerns" ? 0.2 : 1}
                      name="Concerns"
                      dot={false}
                      activeDot={{ r: 6, strokeWidth: 2 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="objections" 
                      stroke="hsl(var(--destructive))" 
                      strokeWidth={hoveredLine === "objections" ? 4 : 2}
                      strokeOpacity={hoveredLine && hoveredLine !== "objections" ? 0.2 : 1}
                      name="Objections"
                      dot={false}
                      activeDot={{ r: 6, strokeWidth: 2 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="proposals" 
                      stroke="hsl(var(--proposal))" 
                      strokeWidth={hoveredLine === "proposals" ? 4 : 2}
                      strokeOpacity={hoveredLine && hoveredLine !== "proposals" ? 0.2 : 1}
                      name="Proposals"
                      dot={false}
                      activeDot={{ r: 6, strokeWidth: 2 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="proArguments" 
                      stroke="hsl(var(--pro-argument))" 
                      strokeWidth={hoveredLine === "proArguments" ? 4 : 2}
                      strokeOpacity={hoveredLine && hoveredLine !== "proArguments" ? 0.2 : 1}
                      name="Pro-Arguments"
                      dot={false}
                      activeDot={{ r: 6, strokeWidth: 2 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="variants" 
                      stroke="hsl(var(--variant))" 
                      strokeWidth={hoveredLine === "variants" ? 4 : 2}
                      strokeOpacity={hoveredLine && hoveredLine !== "variants" ? 0.2 : 1}
                      name="Variants"
                      dot={false}
                      activeDot={{ r: 6, strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Concern Types Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={isMobile ? 280 : 300}>
                <PieChart>
                  <Pie
                    data={concernTypeData}
                    cx="50%"
                    cy="45%"
                    labelLine={false}
                    label={false}
                    outerRadius={isMobile ? 80 : 100}
                    fill="hsl(var(--primary))"
                    dataKey="count"
                    stroke="none"
                    activeShape={undefined}
                  >
                    {concernTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CONCERN_TYPE_COLORS[entry.name] || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    wrapperStyle={{ fontSize: 11, paddingTop: 5 }}
                    formatter={(value) => {
                      const item = concernTypeData.find(d => d.name === value);
                      return `${value}: ${item?.count || 0}`;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Reply Categories Distribution</CardTitle>
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={replyCategoryData} barSize={30} margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis width={35} tick={{ fontSize: 11 }} />
                  <Tooltip cursor={false} />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]} activeBar={false}>
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
              <ResponsiveContainer width="100%" height={isMobile ? 280 : 300}>
                <PieChart>
                  <Pie
                    data={votesByCategoryData}
                    cx="50%"
                    cy="45%"
                    labelLine={false}
                    label={false}
                    outerRadius={isMobile ? 80 : 100}
                    fill="hsl(var(--primary))"
                    dataKey="votes"
                    stroke="none"
                    activeShape={undefined}
                  >
                    {votesByCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    wrapperStyle={{ fontSize: 11, paddingTop: 5 }}
                    formatter={(value) => {
                      const item = votesByCategoryData.find(d => d.name === value);
                      return `${value}: ${item?.votes || 0}`;
                    }}
                  />
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
            <CardContent className="px-2 sm:px-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={gradeActivity} barSize={25} margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="grade" tick={{ fontSize: 11 }} />
                  <YAxis width={35} tick={{ fontSize: 11 }} />
                  <Tooltip cursor={false} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="posts" stackId="a" fill="hsl(var(--primary))" name="Posts" radius={[0, 0, 0, 0]} activeBar={false} />
                  <Bar dataKey="votes" stackId="a" fill="hsl(var(--proposal))" name="Votes" radius={[8, 8, 0, 0]} activeBar={false} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Active Users Timeline</CardTitle>
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={activeUsersTimeline} margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis width={35} tick={{ fontSize: 11 }} />
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
      <MobileBottomNav 
        currentPhase="school"
        onViewLeaderboard={() => navigate('/leaderboard/school')}
      />
    </div>
  );
};

export default Statistics;
