import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/IndexWithSimulation";
import NotFound from "./pages/NotFound";
import { AdminProvider } from "./contexts/AdminContext";
import { lazy, Suspense } from "react";

// Lazy load other pages to avoid breaking the app if they have issues
const ConcernDetail = lazy(() => import("./pages/ConcernDetail"));
const Statistics = lazy(() => import("./pages/Statistics"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Graph = lazy(() => import("./pages/Graph"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AdminProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-foreground">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/concern/:id" element={<ConcernDetail />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/leaderboard/:phase" element={<Leaderboard />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/graph" element={<Graph />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AdminProvider>
  </QueryClientProvider>
);

export default App;
