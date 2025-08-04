import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { MultiTenantProvider } from "@/contexts/MultiTenantContext";
import { PermissionsProvider } from "@/contexts/PermissionsContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Index from "./pages/Index";
import Layout from "./components/Layout";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import TerapeutaDashboard from "./pages/dashboards/TerapeutaDashboard";
import RecepcaoDashboard from "./pages/dashboards/RecepcaoDashboard";
import ResponsavelDashboard from "./pages/dashboards/ResponsavelDashboard";
import Agenda from "./pages/Agenda";
import Usuarios from "./pages/usuarios/Usuarios";
import Pacientes from "./pages/pacientes/Pacientes";
import PatientProfile from "./pages/pacientes/PatientProfile";
import Prontuarios from "./pages/prontuarios/Prontuarios";
import Relatorios from "./pages/relatorios/Relatorios";
import Settings from "./pages/Settings";
import Evolucoes from "./pages/evolucoes/Evolucoes";
import ABAProtocols from "./pages/protocolos/ABAProtocols"; // Existing protocol page
import RealtimeDataCollection from "./pages/coleta/RealtimeDataCollection";
import NotFound from "./pages/NotFound";
import BackendStatus from "./pages/BackendStatus";
import QualityDashboardPage from "./pages/dashboards/QualityDashboardPage"; // New dashboard
import BancoRecursos from "./components/BancoRecursos"; // New component for a route
import GestaoMultidisciplinar from "./components/GestaoMultidisciplinar"; // New component for a route
import RelatoriosExpandidos from "./pages/relatorios/RelatoriosExpandidos"; // New expanded reports page
import ProtocolosAvaliacao from "./pages/protocolos/ProtocolosAvaliacao"; // New evaluation protocols page
import { Routes, Route } from "react-router-dom";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <MultiTenantProvider>
          <PermissionsProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public Routes */}
              <Route path="/backend-status" element={<BackendStatus />} />
              <Route path="/landing" element={<Landing />} />
              <Route 
                path="/login" 
                element={
                  <ProtectedRoute requireAuth={false}>
                    <Login />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/login/:type" 
                element={
                  <ProtectedRoute requireAuth={false}>
                    <Login />
                  </ProtectedRoute>
                } 
              />
              {/* Redirecionar root para landing se não autenticado */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute requireAuth={false}>
                    <Landing />
                  </ProtectedRoute>
                } 
              />
              {/* Protected Routes with Layout */}
              <Route 
                path="/app" 
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Index />} />
                <Route path="dashboard/admin" element={<AdminDashboard />} />
                <Route path="dashboard/terapeuta" element={<TerapeutaDashboard />} />
                <Route path="dashboard/recepcao" element={<RecepcaoDashboard />} />
                <Route path="dashboard/responsavel" element={<ResponsavelDashboard />} />
                <Route path="dashboard/quality" element={<QualityDashboardPage />} /> {/* NEW */}
                <Route path="agenda" element={<Agenda />} />
                <Route path="usuarios" element={<Usuarios />} />
                <Route path="pacientes" element={<Pacientes />} />
                <Route path="pacientes/:id" element={<PatientProfile />} />
                <Route path="prontuarios" element={<Prontuarios />} />
                <Route path="evolucoes" element={<Evolucoes />} />
                <Route path="protocolos" element={<ABAProtocols />} /> {/* Existing */}
                <Route path="protocolos-avaliacao" element={<ProtocolosAvaliacao />} /> {/* NEW */}
                <Route path="coleta-dados" element={<RealtimeDataCollection />} />
                <Route path="relatorios" element={<Relatorios />} />
                <Route path="relatorios-expandidos" element={<RelatoriosExpandidos />} /> {/* NEW */}
                <Route path="configuracoes" element={<Settings />} />
                <Route path="banco-recursos" element={<BancoRecursos />} /> {/* NEW */}
                <Route path="gestao-multidisciplinar" element={<GestaoMultidisciplinar />} /> {/* NEW */}
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PermissionsProvider>
        </MultiTenantProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;