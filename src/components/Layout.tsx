import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import UnitSelector from "./UnitSelector";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/useAuth";
import { usePermissions } from "@/contexts/usePermissions";
import { useMultiTenant } from "@/contexts/useMultiTenant";
import UnitDataIndicator from "./UnitDataIndicator";
import { NotificationCenter } from "./NotificationCenter";
import { 
  Stethoscope, 
  Calendar, 
  Users, 
  FileText, 
  Settings, 
  Bell,
  Menu,
  LogOut,
  Home,
  UserCheck,
  ClipboardList,
  BarChart3,
  MessageSquare,
  Eye,
  ClipboardCheck,
  Activity,
  Brain, // For Smart Scheduler / Protocols
  Book, // For Resource Bank
  Heart, // For Multidisciplinary Management
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Enums } from "@/integrations/supabase/types";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, user } = useAuth();
  const { getUserRole, isAdmin, isCoordinator, isTerapeuta, isRecepcao } = usePermissions();
  const { currentUnit } = useMultiTenant();
  
  const userRole = getUserRole();
  
  const navigationItems = {
    admin: [
      { icon: Home, label: "Dashboard Admin", path: "/app/dashboard/admin" },
      { icon: BarChart3, label: "Dashboard Qualidade", path: "/app/dashboard/quality" }, // NEW
      { icon: Calendar, label: "Agenda Global", path: "/app/agenda" },
      { icon: Users, label: "Pacientes", path: "/app/pacientes" },
      { icon: FileText, label: "Evoluções", path: "/app/evolucoes" },
      { icon: ClipboardCheck, label: "Protocolos ABA", path: "/app/protocolos" }, // Existing
      { icon: Brain, label: "Protocolos Avaliação", path: "/app/protocolos-avaliacao" }, // NEW
      { icon: Activity, label: "Coleta de Dados", path: "/app/coleta-dados" },
      { icon: Heart, label: "Gestão Multidisciplinar", path: "/app/gestao-multidisciplinar" }, // NEW
      { icon: Book, label: "Banco de Recursos", path: "/app/banco-recursos" }, // NEW
      { icon: UserCheck, label: "Usuários", path: "/app/usuarios" },
      { icon: BarChart3, label: "Relatórios", path: "/app/relatorios" },
      { icon: BarChart3, label: "Relatórios Expandidos", path: "/app/relatorios-expandidos" }, // NEW
      { icon: Settings, label: "Configurações", path: "/app/configuracoes" },
      { separator: true, label: "Outras Visões" },
      { icon: Eye, label: "Visão Terapeuta", path: "/app/dashboard/terapeuta" },
      { icon: Eye, label: "Visão Recepção", path: "/app/dashboard/recepcao" },
    ],
    coordenador: [
      { icon: Home, label: "Dashboard Coordenador", path: "/app/dashboard/admin" }, // Coordenador uses Admin dashboard for now
      { icon: BarChart3, label: "Dashboard Qualidade", path: "/app/dashboard/quality" }, // NEW
      { icon: Calendar, label: "Agenda Unidade", path: "/app/agenda" },
      { icon: Users, label: "Pacientes", path: "/app/pacientes" },
      { icon: FileText, label: "Prontuários", path: "/app/prontuarios" },
      { icon: FileText, label: "Evoluções", path: "/app/evolucoes" },
      { icon: ClipboardCheck, label: "Protocolos ABA", path: "/app/protocolos" }, // Existing
      { icon: Brain, label: "Protocolos Avaliação", path: "/app/protocolos-avaliacao" }, // NEW
      { icon: Heart, label: "Gestão Multidisciplinar", path: "/app/gestao-multidisciplinar" }, // NEW
      { icon: Book, label: "Banco de Recursos", path: "/app/banco-recursos" }, // NEW
      { icon: MessageSquare, label: "Supervisão", path: "/app/evolucoes" }, // Evoluções page handles supervision tab
      { icon: BarChart3, label: "Relatórios", path: "/app/relatorios" },
      { icon: BarChart3, label: "Relatórios Expandidos", path: "/app/relatorios-expandidos" }, // NEW
    ],
    terapeuta: [
      { icon: Home, label: "Dashboard Terapeuta", path: "/app/dashboard/terapeuta" },
      { icon: Calendar, label: "Minha Agenda", path: "/app/agenda" },
      { icon: Users, label: "Meus Pacientes", path: "/app/pacientes" },
      { icon: FileText, label: "Prontuários", path: "/app/prontuarios" },
      { icon: FileText, label: "Evoluções", path: "/app/evolucoes" },
      { icon: ClipboardCheck, label: "Protocolos ABA", path: "/app/protocolos" }, // Existing
      { icon: Brain, label: "Protocolos Avaliação", path: "/app/protocolos-avaliacao" }, // NEW
      { icon: Activity, label: "Coleta de Dados", path: "/app/coleta-dados" },
      { icon: Book, label: "Banco de Recursos", path: "/app/banco-recursos" }, // NEW
    ],
    estagiario: [
      { icon: Home, label: "Dashboard Estagiário", path: "/app/dashboard/terapeuta" }, // Estagiário uses Terapeuta dashboard
      { icon: Calendar, label: "Minha Agenda", path: "/app/agenda" },
      { icon: Users, label: "Meus Pacientes", path: "/app/pacientes" },
      { icon: FileText, label: "Prontuários", path: "/app/prontuarios" },
      { icon: FileText, label: "Evoluções", path: "/app/evolucoes" },
      { icon: ClipboardCheck, label: "Protocolos ABA", path: "/app/protocolos" }, // Existing
      { icon: Brain, label: "Protocolos Avaliação", path: "/app/protocolos-avaliacao" }, // NEW
      { icon: Activity, label: "Coleta de Dados", path: "/app/coleta-dados" },
      { icon: Book, label: "Banco de Recursos", path: "/app/banco-recursos" }, // NEW
    ],
    recepcao: [
      { icon: Home, label: "Dashboard Recepção", path: "/app/dashboard/recepcao" },
      { icon: Calendar, label: "Agenda", path: "/app/agenda" },
      { icon: Users, label: "Pacientes", path: "/app/pacientes" },
    ],
    responsavel: [
      { icon: Home, label: "Dashboard Família", path: "/app/dashboard/responsavel" },
      { icon: Calendar, label: "Agendamentos", path: "/app/agenda" },
      { icon: FileText, label: "Documentos", path: "/app/documentos" },
      { icon: MessageSquare, label: "Contato", path: "/app/contato" },
    ]
  };

  const currentNavItems = navigationItems[userRole as keyof typeof navigationItems] || [];
  
  const roleDisplayNames: Record<Enums<'app_role'> | 'responsavel', string> = {
    admin: "Administrador",
    coordenador: "Coordenador Clínico", 
    terapeuta: "Terapeuta",
    estagiario: "Estagiário",
    recepcao: "Recepção",
    responsavel: "Portal das Famílias"
  };

  const roleColors: Record<Enums<'app_role'> | 'responsavel', string> = {
    admin: 'bg-primary/10 text-primary border-primary/20',
    coordenador: 'bg-secondary/10 text-secondary border-secondary/20',
    terapeuta: 'bg-success/10 text-success border-success/20',
    estagiario: 'bg-warning/10 text-warning border-warning/20',
    recepcao: 'bg-accent/10 text-accent border-accent/20',
    responsavel: 'bg-muted text-muted-foreground border-border',
  };

  const handleLogout = () => {
    signOut();
  };

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-medical-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg">
            <Stethoscope className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-primary">Equidade+</h2>
            <div className={`inline-flex items-center gap-2 mt-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${roleColors[userRole] || 'bg-muted text-muted-foreground border-border'}`}
              aria-label={`Nível de acesso: ${roleDisplayNames[userRole]}`}
              role="status"
            >
              {roleDisplayNames[userRole]}
            </div>
          </div>
        </div>
        
        {/* Mostrar unidade atual para admins e coordenadores */}
        {(isAdmin() || isCoordinator()) && currentUnit && (
          <div className="mt-3 p-2 bg-primary-light rounded-lg">
            <p className="text-xs text-primary font-medium">Unidade Atual:</p>
            <p className="text-sm font-semibold text-primary">{currentUnit.name}</p>
          </div>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {currentNavItems.map((item, index) => {
          if (item.separator) {
            return (
              <div key={index} className="py-2">
                <div className="text-xs font-medium text-muted-foreground px-2 pb-2 border-b border-medical-border">
                  {item.label}
                </div>
              </div>
            );
          }
          
          return (
            <Button
              key={item.path}
              variant={location.pathname === item.path ? "default" : "ghost"}
              className="w-full justify-start gap-3 h-12"
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-medical-border">
        <Button 
          variant="outline" 
          className="w-full gap-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col bg-card border-r border-medical-border">
        <NavContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden fixed top-4 left-4 z-50"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <NavContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 bg-card border-b border-medical-border flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            {/* Unit Selector - mais importante para admin e coordenador */}
            {(isAdmin() || isCoordinator()) && <UnitSelector />}
            
            {/* Indicador de dados filtrados */}
            <UnitDataIndicator />
          </div>
          
          <div className="flex items-center gap-4">
            <NotificationCenter />
            
            <div className="text-right">
              <p className="text-sm font-medium">{user?.email || "Usuário"}</p>
              <p className="text-xs text-muted-foreground">
                {roleDisplayNames[userRole]}
              </p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 bg-medical-gray">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;