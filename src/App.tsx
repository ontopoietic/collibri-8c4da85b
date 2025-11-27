import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/IndexWithSimulation";
import ConcernDetail from "./pages/ConcernDetail";
import Statistics from "./pages/Statistics";
import Leaderboard from "./pages/Leaderboard";
import Notifications from "./pages/Notifications";
import Graph from "./pages/Graph";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/concern/:id" element={<ConcernDetail />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/leaderboard/:phase" element={<Leaderboard />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/graph" element={<Graph />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
