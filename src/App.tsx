import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import AppHeader from "@/components/AppHeader";
import Index from "./pages/Index";
import TeamWorkflows from "./pages/TeamWorkflows";
import RevenueCreditWorkflow from "./pages/RevenueCreditWorkflow";
import Requests from "./pages/Requests";
import NotFound from "./pages/NotFound";
import FutureLogo from "@/components/FutureLogo";
import ProcessAssistant from "@/components/ProcessAssistant";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex min-h-screen">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <AppHeader />
            <main className="flex-1 p-4 md:p-6 lg:p-8 relative">
              <div className="max-w-screen-2xl mx-auto pb-12">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/team/:teamId" element={<TeamWorkflows />} />
                  <Route path="/team/client-success/revenue-credit" element={<RevenueCreditWorkflow />} />
                  <Route path="/requests" element={<Requests />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              <div className="fixed bottom-4 left-4 z-10">
                <FutureLogo className="h-5 text-neutral-grey" />
              </div>
              <ProcessAssistant />
            </main>
          </div>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
