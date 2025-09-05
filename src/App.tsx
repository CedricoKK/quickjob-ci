import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Jobs from "./pages/Jobs";
import AssistantIA from "./pages/AssistantIA";
import Auth from "./pages/Auth";
import Chatbot from "./pages/Chatbot";
import Paystack from "./pages/Paystack";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Inscription from "./pages/Inscription";
import Connexion from "./pages/Connexion";
import TrouverUnJob from "./pages/TrouverUnJob";
import PosterUnJob from "./pages/PosterUnJob";
import Abonnement from "./pages/Abonnement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/trouver-un-job" element={<TrouverUnJob />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/poster-un-job" element={<PosterUnJob />} />
          <Route path="/abonnement" element={<Abonnement />} />
          <Route path="/assistant-ia" element={<AssistantIA />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/paystack" element={<Paystack />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
