import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { ChatWidget } from "@/components/chatbot/ChatWidget";
import Index from "./pages/Index.tsx";
import Informations from "./pages/Informations.tsx";
import ServiceDetail from "./pages/ServiceDetail.tsx";
import Documentation from "./pages/Documentation.tsx";
import NotFound from "./pages/NotFound.tsx";

import { AdminRoute } from "./components/admin/AdminRoute.tsx";
import AdminLogin from "./pages/admin/AdminLogin.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import SuiviDocuments from "./pages/suivi-documents.tsx";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/informations" element={<Informations />} />
            <Route path="/informations/:slug" element={<ServiceDetail />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/suivi-documents" element={<SuiviDocuments />} />

            {/* CMS Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatWidget />
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
